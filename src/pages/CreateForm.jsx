import { useState, useCallback, useEffect } from "react";
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
import { useLocation } from "react-router-dom";

import { Check, Settings2, Save, Trash2, Plus, Share } from "lucide-react";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/Sidebar";
import { QuestionCard } from "@/components/QuestionCard";
import { toast } from "sonner";
import { createForm, updateForm, deleteForm } from "@/features/form";
import { Switch } from "@/components/ui/switch";
import { capitalize, toReadableLabel } from "@/lib/helpers";

const formTypes = [
  { value: "form", label: "Form" },
  { value: "quiz", label: "Quiz" },
  { value: "survey", label: "Survey" },
];

function reorderArray(array, fromIndex, toIndex) {
  const result = [...array];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

const CreateForm = () => {
  const location = useLocation();

  const [form, setForm] = useState({
    type: null,
    title: "",
    description: "",
    questions: [],
    state: "draft",
    isPublic: false,
  });

  useEffect(() => {
    if (location.state?.form) {
      setForm(location.state.form);
    }
  }, [location.state]);

  const [settingsSidebarOpen, setSettingsSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Handlers
  const setFormField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
        (q) => q.tempId !== questionId && q._id !== questionId
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
      if (!q.questionText || q.questionText.trim() === "") {
        errors.push(`Question ${index + 1} title is required.`);
      }

      if (q.type === "single-choice" || q.type === "multiple-choice") {
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
    });

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
        questions: form.questions.map(({ tempId: _, ...rest }) => rest),
      };

      if (form._id) {
        const data = await updateForm(form._id, payload);

        console.log("Successfully updated form:", data);
        toast.success(`${toReadableLabel(form.type)} updated!`);
      } else {
        const data = await createForm(payload);
        console.log("Successfully created form:", data);
        toast.success(`${toReadableLabel(form.type)} created!`);
        setForm(data);
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

  const publishForm = async () => {
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

    setIsPublishing(true);

    try {
      const payload = {
        ...form,
        state: "live",
        questions: form.questions.map(({ tempId, ...rest }) => rest),
      };

      if (form._id) {
        await updateForm(form._id, payload);
      } else {
        await createForm(payload);
      }
      toast.success(`${toReadableLabel(form.type)} published successfully!`);
    } catch (error) {
      if (!error.isHandled) {
        toast.error("Failed to publish.");
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const toggleIsPublic = () => {
    setFormField("isPublic", !form.isPublic);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
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
              isPublishing={isPublishing}
              addQuestion={addQuestion}
              saveForm={handleSubmit}
              publishForm={publishForm}
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
                className="flex items-center justify-center gap-2 hover:text-primary/90"
                disabled={!form.type || isSaving || isPublishing}
                onClick={addQuestion}
                aria-label="Add question"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add question</span>
              </Button>
            </div>

            {form.questions.length > 0 &&
              form.questions.map((q) => (
                <QuestionCard
                  key={q._id || q.tempId}
                  question={q}
                  onChange={(updatedFields) =>
                    updateQuestion(q._id || q.tempId, updatedFields)
                  }
                  onMoveUp={() => moveQuestionUp(q._id || q.tempId)}
                  onMoveDown={() => moveQuestionDown(q._id || q.tempId)}
                  onDelete={() => deleteQuestion(q._id || q.tempId)}
                  disabled={isSaving}
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
        <div className="flex flex-col space-y-6">
          {/* General Section */}
          <div>
            <div className="mb-2 text-sm font-medium">Visibility</div>
            <div className="flex items-center gap-2">
              <Label
                htmlFor="is-public"
                className={cn(
                  form.isPublic ? "text-primary/50" : "",
                  "text-sm"
                )}
              >
                Private
              </Label>
              <Switch
                id="is-public"
                checked={form.isPublic}
                onCheckedChange={toggleIsPublic}
              />
              <Label
                htmlFor="is-public"
                className={cn(
                  form.isPublic ? "" : "text-primary/50",
                  "text-sm"
                )}
              >
                Public
              </Label>
            </div>
          </div>
          {/* Expiration Date Section */}
          <div>
            <div className="mb-2 text-sm font-medium">Expiration</div>
            <Input
              type="date"
              id="expires-at"
              value={form.expiresAt ? form.expiresAt.split("T")[0] : ""}
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              className="max-w-[200px]"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Leave empty for no expiration.
            </p>
          </div>

          {/* Response Limit Section */}
          <div>
            <div className="mb-2 text-sm font-medium">Response Limit</div>
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
              className="max-w-[120px]"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Leave empty for unlimited responses.
            </p>
          </div>
        </div>
      </Sidebar>
    </>
  );
};

// Components
const FormTypeButton = ({ formType, setFormField }) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="ghost"
        role="combobox"
        className="max-w-fit justify-evenly"
      >
        <span
          className={cn(
            formType ? "font-semibold" : "text-muted-foreground italic"
          )}
        >
          {formType
            ? formTypes.find((ft) => ft.value === formType)?.label || "Type"
            : "Type"}
        </span>
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
                }}
              >
                {item.label}
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
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

const FormControlButtons = ({
  form,
  isSaving,
  isPublishing,
  saveForm,
  publishForm,
  deleteForm,
}) => {
  const buttonsDisabled = !form.type || isSaving || isPublishing;

  const buttons = (
    <>
      <Button
        variant="ghost"
        className="flex items-center justify-center gap-2 hover:text-blue-500"
        disabled={buttonsDisabled}
        onClick={saveForm}
        type="submit"
        aria-label={`Save ${form.type ? form.type : ""}`}
      >
        <Save className="w-4 h-4" />
        <span className="hidden xs:inline">
          {isSaving ? "Saving..." : `Save ${form.type ? form.type : ""}`}
        </span>
        <span className="inline xs:hidden">{isSaving ? "Saving" : "Save"}</span>
      </Button>

      <Button
        variant="ghost"
        className="flex items-center justify-center gap-2 hover:text-green-500"
        disabled={buttonsDisabled}
        onClick={publishForm}
        aria-label={`Publish ${form.type ? form.type : ""}`}
      >
        <Share className="w-4 h-4" />
        <span className="hidden xs:inline">
          {isPublishing
            ? "Publishing..."
            : `Publish ${form.type ? form.type : ""}`}
        </span>
        <span className="inline xs:hidden">
          {isPublishing ? "Publishing" : "Publish"}
        </span>
      </Button>

      <Button
        variant="ghost"
        className="flex items-center justify-center gap-2 text-red-500 hover:text-red-900"
        disabled={buttonsDisabled}
        onClick={deleteForm}
        aria-label={
          form._id
            ? `Delete ${form.type ? form.type : ""}`
            : `Discard ${form.type ? form.type : ""}`
        }
      >
        <Trash2 className="w-4 h-4" />
        <span className="hidden xs:inline">
          {form._id ? "Delete" : "Discard"} {form.type ? form.type : ""}
        </span>
        <span className="inline xs:hidden">
          {form._id ? "Delete" : "Discard"}
        </span>
      </Button>
    </>
  );

  return <div className="flex items-center gap-0 sm:gap-2">{buttons}</div>;
};

const FormSettingsButton = ({ setSettingsSidebarOpen, className }) => (
  <Button
    variant="ghost"
    className={cn("hover:text-purple-900", className)}
    onClick={() => setSettingsSidebarOpen(true)}
    aria-label="Open settings"
    title="Open settings"
  >
    <Settings2 />
  </Button>
);

export default CreateForm;
