import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { nanoid } from "nanoid";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  Settings2,
  Save,
  Trash2,
  Plus,
  Copy,
  Mail,
  QrCode,
  Unlock,
  Lock,
  Upload,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/Sidebar";
import { QuestionCard } from "@/components/QuestionCard";
import { toast } from "sonner";
import { createForm, updateForm, deleteForm } from "@/api/form";
import { Switch } from "@/components/ui/switch";
import { capitalize, toReadableLabel } from "@/lib/helpers";
import DatePicker from "@/components/DatePicker";
import axios from "@/lib/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QRCodeCanvas } from "qrcode.react";
import { sendEmail } from "@/api/email";
import LoadingScreen from "@/components/LoadingScreen";
import { fonts, formTypes } from "@/models";

function reorderArray(array, fromIndex, toIndex) {
  const result = [...array];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const CreateForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    type: null,
    title: "",
    description: "",
    questions: [],
    state: "draft",
    isPublic: false,
    isAnonymousQuiz: false,
    showResults: false,
  });
  const [loading, setLoading] = useState(true);

  const [settingsSidebarOpen, setSettingsSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingState, setIsChangingState] = useState(false);

  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const shareLink = `${window.location.origin}/fill/${form.shareId}`;

  useEffect(() => {
    if (id) {
      const fetchForm = async () => {
        try {
          const res = await axios.get(`/form/form/${id}`);
          setForm(res.data);
        } catch (err) {
          console.error("Failed to fetch form:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchForm();
    } else {
      setLoading(false);
    }
  }, [id]);

  // Handlers
  const setFormField = useCallback((field, value) => {
    setForm((prev) => {
      let updatedForm = { ...prev, [field]: value };

      if (field === "type") {
        if (value === "logic") {
          if (!updatedForm.questions.some((q) => q.isLogicQuestion)) {
            const logicQuestion = {
              tempId: nanoid(),
              type: "yes-no",
              questionText: "",
              isLogicQuestion: true,
            };
            updatedForm.questions = [logicQuestion, ...updatedForm.questions];
          }
        } else {
          updatedForm.questions = updatedForm.questions.filter(
            (q) => !q.isLogicQuestion
          );
        }
      }

      return updatedForm;
    });
  }, []);

  const addQuestion = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          tempId: nanoid(),
          type: null,
          questionText: "",
          choices: [],
          required: false,
          correctAnswer: "",
          points: 1,
        },
      ],
    }));
  }, []);

  const updateQuestion = useCallback((id, updatedFields) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q._id === id || q.tempId === id ? { ...q, ...updatedFields } : q
      ),
    }));
  }, []);

  const moveQuestionUp = useCallback((questionId) => {
    setForm((prev) => {
      const index = prev.questions.findIndex(
        (q) => q._id === questionId || q.tempId === questionId
      );
      if (index > 0) {
        return {
          ...prev,
          questions: reorderArray(prev.questions, index, index - 1),
        };
      }
      return prev;
    });
  }, []);

  const moveQuestionDown = useCallback((questionId) => {
    setForm((prev) => {
      const index = prev.questions.findIndex(
        (q) => q._id === questionId || q.tempId === questionId
      );
      if (index > -1 && index < prev.questions.length - 1) {
        return {
          ...prev,
          questions: reorderArray(prev.questions, index, index + 1),
        };
      }
      return prev;
    });
  }, []);

  const deleteQuestion = useCallback((questionId) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.filter(
        (q) =>
          q.tempId !== questionId && q._id !== questionId && !q.isLogicQuestion
      ),
    }));
  }, []);

  const validateForm = () => {
    const errors = [];

    if (!form.type) {
      errors.push("Type is required.");
    }
    if (!form.title || form.title.trim() === "") {
      errors.push("Title is required.");
    }
    if (!form.description || form.description.trim() === "") {
      errors.push("Description is required.");
    }

    if (!form.questions || form.questions.length === 0) {
      errors.push(`${toReadableLabel(form.type)} has no questions.`);
    }

    form.questions.forEach((q, index) => {
      if (!q.type) {
        errors.push(`Question ${index + 1} has no type.`);
      }

      if (!q.questionText || q.questionText.trim() === "") {
        errors.push(`Question ${index + 1} title is required.`);
      }

      if (q.type === "single-choice" || q.type === "multi-choice") {
        if (!Array.isArray(q.choices) || q.choices.length < 2) {
          errors.push(`Question ${index + 1} must have at least 2 choices.`);
        } else {
          const emptyChoiceIndex = q.choices.findIndex(
            (choice) => !choice || choice.trim() === ""
          );
          if (emptyChoiceIndex !== -1) {
            errors.push(
              `Question ${index + 1} has an empty choice at position ${
                emptyChoiceIndex + 1
              }.`
            );
          }
        }
      }

      if (form.type === "quiz") {
        if (q.type === "short-text" || q.type === "long-text") {
          if (!Array.isArray(q.correctAnswer) || q.correctAnswer.length === 0) {
            errors.push(
              `Question ${index + 1} (${
                q.type
              }) must have at least one correct answer.`
            );
          } else {
            const emptyAnswerIndex = q.correctAnswer.findIndex(
              (ans) => !ans || ans.trim() === ""
            );
            if (emptyAnswerIndex !== -1) {
              errors.push(
                `Question ${index + 1} (${
                  q.type
                }) has an empty correct answer at position ${
                  emptyAnswerIndex + 1
                }.`
              );
            }
          }
        }

        if (q.type === "single-choice") {
          if (!Array.isArray(q.correctAnswer) || q.correctAnswer.length !== 1) {
            errors.push(
              `Question ${
                index + 1
              } (single-choice) must have exactly one correct answer.`
            );
          } else if (!q.choices.includes(q.correctAnswer[0])) {
            errors.push(
              `Question ${
                index + 1
              } (single-choice) correct answer must be one of the choices.`
            );
          }
        }

        if (q.type === "multi-choice") {
          if (!Array.isArray(q.correctAnswer) || q.correctAnswer.length === 0) {
            errors.push(
              `Question ${
                index + 1
              } (multi-choice) must have at least one correct answer.`
            );
          } else {
            const invalidAnswers = q.correctAnswer.filter(
              (ans) => !q.choices.includes(ans)
            );
            if (invalidAnswers.length > 0) {
              errors.push(
                `Question ${
                  index + 1
                } (multi-choice) has correct answers that are not in the choices: ${invalidAnswers.join(
                  ", "
                )}.`
              );
            }
          }
        }
      }
    });

    // Logic form validation: check that there is at least one non-logic question
    if (form.type === "logic") {
      const logicQuestions = form.questions.filter((q) => q.isLogicQuestion);
      const nonLogicQuestions = form.questions.filter(
        (q) => !q.isLogicQuestion
      );
      if (logicQuestions.length === 0) {
        errors.push("Logic form must have a logic question.");
      }
      if (nonLogicQuestions.length === 0) {
        errors.push(
          "Logic form must have at least one other question besides the logic question."
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationResult = validateForm(form);

    if (!validationResult.isValid) {
      toast.error(
        <div>
          <div>
            <strong>{toReadableLabel(form.type)} is invalid:</strong>
          </div>
          <ul className="mt-1 list-disc list-inside">
            {validationResult.errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      );
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        ...form,
        questions: form.questions.map(({ tempId, ...rest }) => rest),
      };

      if (form._id) {
        const data = await updateForm(form._id, payload);

        console.log("Successfully updated form:", data);
        toast.success(`${toReadableLabel(form.type)} updated!`);
      } else {
        const data = await createForm(payload);
        console.log("Successfully created form:", data);
        toast.success(`${toReadableLabel(form.type)} created!`);
        navigate(`/edit/${data._id}`, { state: { form: data } });
      }
    } catch (error) {
      if (!error.isHandled) {
        toast.error(`Failed to save ${form.type}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const onDeleteForm = async () => {
    const isFormEmpty =
      form.type === null &&
      form.title === "" &&
      form.description === "" &&
      Array.isArray(form.questions) &&
      form.questions.length === 0;

    if (isFormEmpty) {
      toast.info(`${toReadableLabel(form.type)} is empty.`);
      return;
    }

    if (!form._id) {
      toast.info(`Discarded ${form.type}.`);
      setForm({
        type: null,
        title: "",
        description: "",
        questions: [],
        state: "draft",
      });
    } else {
      try {
        setIsSaving(true);
        await deleteForm(form._id);
        toast.success(`${toReadableLabel(form.type)} deleted successfully.`);
        navigate("/dashboard");
      } catch (error) {
        if (!error.isHandled) {
          toast.error(`Failed to delete ${form.type}.`);
        }
      } finally {
        setForm({
          type: null,
          title: "",
          description: "",
          questions: [],
          state: "draft",
        });
        setIsSaving(false);
      }
    }
  };

  const updateFormState = async () => {
    const validationResult = validateForm();
    if (!validationResult.isValid) {
      toast.error(
        <div>
          <div>
            <strong>Form is invalid:</strong>
          </div>
          <ul className="mt-1 list-disc list-inside">
            {validationResult.errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      );
      return;
    }

    setIsChangingState(true);

    try {
      let nextState;
      if (form.state === "draft") nextState = "live";
      else if (form.state === "live") nextState = "closed";
      else if (form.state === "closed") nextState = "live";

      console.log("next state", nextState);

      const payload = {
        ...form,
        state: nextState,
        questions: form.questions.map(({ tempId, ...rest }) => rest),
      };

      let updatedForm;
      if (form._id) {
        updatedForm = await updateForm(form._id, payload);
      } else {
        updatedForm = await createForm(payload);
      }

      setForm(updatedForm);

      console.log("Form after creation/publish:", updatedForm);

      const stateMessages = {
        draft: "saved as draft",
        live: "published",
        closed: "closed",
      };

      toast.success(
        `${toReadableLabel(updatedForm.type)} ${
          stateMessages[updatedForm.state]
        } successfully!`
      );
    } catch (error) {
      if (!error.isHandled) {
        toast.error("Failed to update form state.");
      }
    } finally {
      setIsChangingState(false);
    }
  };

  const toggleIsPublic = () => {
    setFormField("isPublic", !form.isPublic);
  };

  const setExpirationDate = (date) => {
    setFormField("expiresAt", date);
  };

  const toggleIsAnonymousQuiz = () => {
    setFormField("isAnonymousQuiz", !form.isAnonymousQuiz);
  };

  const toggleShowResults = () => {
    setFormField("showResults", !form.showResults);
  };

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleSendEmail = async () => {
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setSending(true);
      setSent(false);
      setError("");

      await sendEmail({
        email,
        formType: form.type,
        title: form.title,
        description: form.description,
        url: shareLink,
      });

      setSent(true);
      setTimeout(() => setSent(false), 2000);
    } catch (err) {
      console.error("Error while sending email:", err);
      setError("Failed to send email. Please try again.");
    } finally {
      setSending(false);
      setEmail("");
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <>
      <div
        className="w-full max-w-5xl mx-auto space-y-6"
        style={{
          fontFamily: form.appearance?.font
            ? fonts[form.appearance.font]?.css
            : undefined,
        }}
      >
        {/* Top Controls */}
        <Card className="p-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="flex items-center justify-between md:justify-start gap-2">
            <FormTypeButton formType={form.type} setFormField={setFormField} />
            <FormSettingsButton
              setSettingsSidebarOpen={setSettingsSidebarOpen}
              className="md:hidden"
            />
          </div>

          <div className="mt-2 md:mt-0 flex justify-center">
            <FormControlButtons
              form={form}
              isSaving={isSaving}
              isChangingState={isChangingState}
              addQuestion={addQuestion}
              saveForm={handleSubmit}
              updateFormState={updateFormState}
              deleteForm={onDeleteForm}
            />
          </div>

          <FormSettingsButton
            setSettingsSidebarOpen={setSettingsSidebarOpen}
            className={"hidden md:inline"}
          />
        </Card>

        {/* Form Card */}
        <div
          className={cn(form.type ? "" : "blur-xs", "transition-all space-y-4")}
        >
          <Card className="p-4">
            <form
              id="form-id"
              onSubmit={handleSubmit}
              className="space-y-4"
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setFormField("title", e.target.value)}
                  placeholder={`Enter a title for your ${form.type}`}
                  required
                  disabled={isSaving}
                  className="focus-visible:border-purple-500 dark:focus-visible:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={(e) => setFormField("description", e.target.value)}
                  placeholder="Brief description"
                  disabled={isSaving}
                  className="focus-visible:border-purple-500 dark:focus-visible:border-purple-500"
                />
              </div>
            </form>
          </Card>

          {/* Questions List */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">Questions</div>
              <Button
                variant="ghost"
                className="group flex items-center justify-center gap-2 hover:text-purple-500"
                disabled={!form.type || isSaving || isChangingState}
                onClick={addQuestion}
                aria-label="Add question"
              >
                <Plus className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                <span className="hidden sm:inline">Add question</span>
              </Button>
            </div>

            {form.questions.length > 0 &&
              form.questions.map((q) => (
                <QuestionCard
                  key={q._id || q.tempId}
                  formType={form.type}
                  question={q}
                  onChange={(updatedFields) =>
                    updateQuestion(q._id || q.tempId, updatedFields)
                  }
                  onMoveUp={() => moveQuestionUp(q._id || q.tempId)}
                  onMoveDown={() => moveQuestionDown(q._id || q.tempId)}
                  onDelete={() => deleteQuestion(q._id || q.tempId)}
                  disabled={isSaving}
                  formAppearance={form.appearance}
                />
              ))}
          </div>
        </div>
      </div>

      <Sidebar
        isOpen={settingsSidebarOpen}
        onClose={() => setSettingsSidebarOpen(false)}
        title={form.type ? `${capitalize(form.type)} settings` : "Settings"}
      >
        <div className="flex flex-col space-y-8">
          {/* Font Selector */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="font" className="text-sm">
              Font
            </Label>
            <Select
              value={form.appearance?.font}
              onValueChange={(value) =>
                setFormField("appearance", {
                  ...form.appearance,
                  font: value,
                })
              }
            >
              <SelectTrigger id="font" className="w-full">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(fonts).map(([key, { label, css }]) => (
                  <SelectItem key={key} value={key} style={{ fontFamily: css }}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* General Section */}
          <div className="space-y-3">
            <Label htmlFor="is-public" className="text-sm font-medium">
              Visibility
            </Label>
            <div className="flex items-center gap-3">
              <Label
                className={cn(
                  form.isPublic ? "text-primary/50" : "",
                  "text-sm"
                )}
                onClick={() => {
                  setFormField("isPublic", false);
                }}
              >
                Private
              </Label>
              <Switch
                id="is-public"
                checked={form.isPublic}
                onCheckedChange={toggleIsPublic}
              />
              <Label
                className={cn(
                  form.isPublic ? "" : "text-primary/50",
                  "text-sm"
                )}
                onClick={() => {
                  setFormField("isPublic", true);
                }}
              >
                Public
              </Label>
            </div>
          </div>

          {/* Expiration Date Section */}
          <div className="space-y-2">
            <Label
              htmlFor="expiration-date"
              className="text-sm font-medium w-fit"
            >
              Expiration
            </Label>
            <div className="w-full">
              <DatePicker
                htmlForId="expiration-date"
                form={form}
                updateDate={setExpirationDate}
                disabledDates={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date <= today || date < new Date("1900-01-01");
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Leave empty for no expiration.
            </p>
          </div>

          {/* Response Limit Section */}
          <div className="space-y-2">
            <Label
              htmlFor="response-limit"
              className="text-sm font-medium w-fit"
            >
              Response Limit
            </Label>
            <div className="w-full">
              <Input
                type="number"
                id="response-limit"
                min="1"
                value={form.responseLimit || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    responseLimit: e.target.value
                      ? parseInt(e.target.value, 10)
                      : "",
                  })
                }
                className="bg-white hover:bg-accent transition-colors no-spinner focus-visible:border-purple-500  dark:focus-visible:border-purple-500"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Leave empty for unlimited responses.
            </p>
          </div>

          {/* Quiz settings */}
          {form.type === "quiz" && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Quiz settings</div>

              <>
                <div className="flex items-center gap-3">
                  <Label
                    htmlFor="is-anonymous-quiz"
                    className="text-sm font-medium"
                  >
                    Anonymous quiz
                  </Label>
                  <Switch
                    id="is-anonymous-quiz"
                    checked={form.isAnonymousQuiz}
                    onCheckedChange={toggleIsAnonymousQuiz}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Anonymous quizzes do not take names of participants.
                </p>
              </>

              <>
                <div className="flex items-center gap-3">
                  <Label htmlFor="show-results" className="text-sm font-medium">
                    Show results
                  </Label>
                  <Switch
                    id="show-results"
                    checked={form.showResults}
                    onCheckedChange={toggleShowResults}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  If enabled, results will be shown at the end of the quiz.
                </p>
              </>
            </div>
          )}

          {/* Sharing */}
          {form.state === "live" && (
            <div className="space-y-3">
              <div className="text-sm font-medium">Share</div>
              {/* Copy Link Button */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleCopyShareLink}
                  className="relative w-full h-9 flex items-center justify-center gap-2 overflow-hidden"
                >
                  {/* Copy State */}
                  <span
                    className={cn(
                      "absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300",
                      copied
                        ? "opacity-0 translate-y-2"
                        : "opacity-100 translate-y-0"
                    )}
                  >
                    <Copy className="w-4 h-4" />
                    Copy share link
                  </span>

                  {/* Copied State */}
                  <span
                    className={cn(
                      "absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300",
                      copied
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2"
                    )}
                  >
                    <Check className="w-4 h-4 text-green-500" />
                    Copied!
                  </span>
                </Button>
              </div>

              <div>
                <Button
                  variant="outline"
                  className="w-full h-9"
                  onClick={() => setShowQR(true)}
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Show QR
                </Button>
              </div>

              {/* Email Invite */}
              <div className="flex flex-col w-full gap-2 sm:flex-row sm:items-center">
                <Input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full sm:max-w-[300px] h-9 focus-visible:border-purple-500 dark:focus-visible:border-purple-500"
                />

                <Button
                  variant="outline"
                  onClick={handleSendEmail}
                  disabled={sending || !email.trim()}
                  className="relative h-9 w-full sm:w-[140px] flex items-center justify-center gap-2 overflow-hidden"
                >
                  {/* Default State */}
                  <span
                    className={cn(
                      "absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300",
                      !sending && !sent
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2"
                    )}
                  >
                    <Mail className="w-4 h-4" />
                    Send Invite
                  </span>

                  {/* Sending State */}
                  <span
                    className={cn(
                      "absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300",
                      sending
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2"
                    )}
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </span>

                  {/* Sent State */}
                  <span
                    className={cn(
                      "absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300",
                      sent
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2"
                    )}
                  >
                    <Check className="w-4 h-4 text-green-500" />
                    Sent!
                  </span>
                </Button>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          )}
        </div>
      </Sidebar>

      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent
          className="flex flex-col items-center space-y-4"
          description="QR Code dialog"
        >
          <DialogHeader>
            <DialogTitle>Scan to open link</DialogTitle>
          </DialogHeader>
          <QRCodeCanvas value={shareLink} size={200} />
          <p className="text-xs text-muted-foreground">{shareLink}</p>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Component
const FormTypeButton = ({ formType, setFormField }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "group max-w-fit justify-between items-center gap-1 hover:border-purple-500 dark:hover:border-purple-500",
            open && "border-purple-500 dark:border-purple-500"
          )}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span
            className={cn(
              formType ? "font-semibold" : "text-muted-foreground italic"
            )}
          >
            {formType
              ? `Type: ${
                  formTypes.find((ft) => ft.value === formType)?.label || "Type"
                }`
              : "Select type"}
          </span>
          <ChevronRight
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              open && "rotate-90 scale-110 text-purple-500"
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="max-w-fit p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {formTypes.map((item) => (
                <CommandItem
                  key={item.value}
                  onSelect={() => {
                    setFormField("type", item.value);
                    setOpen(false);
                  }}
                  className="hover:text-purple-500 dark:hover:text-purple-500 transition-colors"
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4 text-purple-500 transition-opacity duration-200",
                      formType === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const FormControlButtons = ({
  form,
  isSaving,
  isChangingState,
  saveForm,
  updateFormState,
  deleteForm,
}) => {
  // Determine if buttons should be disabled
  const buttonsDisabled = !form.type || isSaving || isChangingState;

  // Determine the next action for state button
  let stateButtonLabel = "";
  let StateIcon = null;
  if (form.state === "draft") {
    stateButtonLabel = `Publish ${form.type ?? ""}`;
    StateIcon = Upload;
  } else if (form.state === "live") {
    stateButtonLabel = `Close ${form.type ?? ""}`;
    StateIcon = Lock;
  } else if (form.state === "closed") {
    stateButtonLabel = `Reopen ${form.type ?? ""}`;
    StateIcon = Unlock;
  }

  return (
    <div className="flex items-center gap-0 sm:gap-2">
      {/* Save Button */}
      <Button
        variant="ghost"
        className="flex items-center justify-center gap-2 hover:text-blue-500"
        disabled={buttonsDisabled}
        onClick={saveForm}
        type="submit"
        aria-label={`Save ${form.type ?? ""}`}
      >
        <Save className="w-4 h-4" />
        <span className="hidden xs:inline">
          {isSaving ? "Saving..." : `Save ${form.type ?? ""}`}
        </span>
        <span className="inline xs:hidden">{isSaving ? "Saving" : "Save"}</span>
      </Button>

      {/* Update State Button */}
      <Button
        variant="ghost"
        className={cn(
          "flex items-center justify-center gap-2",
          form.state === "draft"
            ? "hover:text-green-500"
            : form.state === "live"
            ? "hover:text-yellow-500"
            : "hover:text-green-500" // Reopen uses green hover
        )}
        disabled={buttonsDisabled}
        onClick={updateFormState}
        aria-label={stateButtonLabel}
      >
        <StateIcon className="w-4 h-4" />
        <span className="hidden xs:inline">{stateButtonLabel}</span>
        <span className="inline xs:hidden">
          {stateButtonLabel.split(" ")[0]}{" "}
          {/* Only show "Publish"/"Close"/"Reopen" */}
        </span>
      </Button>

      {/* Delete / Discard Button */}
      <Button
        variant="ghost"
        className="flex items-center justify-center gap-2 text-red-500 hover:bg-red-900 dark:hover:bg-red-900 hover:text-white transition-all duration-300"
        disabled={buttonsDisabled}
        onClick={deleteForm}
        aria-label={
          form._id ? `Delete ${form.type ?? ""}` : `Discard ${form.type ?? ""}`
        }
      >
        <Trash2 className="w-4 h-4" />
        <span className="hidden xs:inline">
          {form._id ? "Delete" : "Discard"} {form.type ?? ""}
        </span>
        <span className="inline xs:hidden">
          {form._id ? "Delete" : "Discard"}
        </span>
      </Button>
    </div>
  );
};

const FormSettingsButton = ({ setSettingsSidebarOpen, className }) => (
  <Button
    variant={"outline"}
    className={cn(
      "group hover:text-purple-500 hover:border-purple-500 dark:hover:border-purple-500 hover:scale-110",
      className
    )}
    onClick={() => setSettingsSidebarOpen(true)}
    aria-label="Open settings"
    title="Open settings"
  >
    <Settings2 className="group-hover:animate-spin-z" />
  </Button>
);

export default CreateForm;
