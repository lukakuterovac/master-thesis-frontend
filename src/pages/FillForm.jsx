import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { getFormByShareId, submitResponse } from "@/features/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toReadableLabel } from "@/lib/helpers";
import { Loader2, Sparkles, Trophy } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";

const FillForm = () => {
  const { shareId } = useParams();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState({});
  const [filled, setFilled] = useState(false);

  const fetchForm = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFormByShareId(shareId);
      setForm(data);
    } catch (error) {
      if (!error.isHandled) toast.error("Failed to get form");
    } finally {
      setLoading(false);
    }
  }, [shareId]);

  useEffect(() => {
    if (shareId) fetchForm();
  }, [fetchForm]);

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form) return;

    if (form.type === "quiz" && !form.isAnonymousQuiz && !name.trim()) {
      return toast.error("Please enter your name.");
    }

    const missingRequired = form.questions.filter((q) => {
      const val = answers[q._id];
      return (
        q.required &&
        (val === undefined ||
          val === "" ||
          (Array.isArray(val) && val.length === 0))
      );
    });

    if (missingRequired.length) {
      return toast.error(
        "Please answer all required questions before submitting."
      );
    }

    const formattedAnswers = form.questions.map((q) => ({
      questionId: q._id,
      answer: answers[q._id] ?? null,
    }));

    try {
      const response = await submitResponse(form._id, {
        name: name.trim() || null,
        answers: formattedAnswers,
      });

      localStorage.setItem(`quiz-${form._id}`, response.userToken);
      toast.success("Form submitted successfully!");
      setAnswers({});
      setFilled(true);
    } catch (error) {
      if (!error.isHandled) toast.error("Failed to submit form.");
    }
  };

  if (loading) return <LoadingScreen />;

  if (!form) return <FormStateMessage message="Form not found." />;
  if (form.state === "closed")
    return <FormStateMessage message="Form is closed." />;
  if (filled) return <FormFilledMessage form={form} />;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col gap-6">
        <Card className="p-6 gap-2">
          <div className="text-2xl font-bold flex justify-between">
            {form.title}{" "}
            <Badge variant="outline" className="capitalize text-xs max-h-max">
              {form.type}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {form.description}
          </div>
        </Card>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {form.type === "quiz" && !form.isAnonymousQuiz && (
            <Card className="w-full p-4 flex flex-col gap-0">
              <Label className="text-lg" htmlFor="name">
                Enter your name:
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="mt-2 mb-1.5 focus-visible:border-purple-500  dark:focus-visible:border-purple-500"
              />
              <p className="text-sm text-muted-foreground">
                Your name is used to show your score on the leaderboard.
              </p>
            </Card>
          )}

          {form.questions.map((q) => (
            <QuestionCard
              key={q._id}
              question={q}
              value={answers[q._id]}
              onChange={handleChange}
            />
          ))}

          <Button
            type="submit"
            className="w-full text-lg py-5 bg-purple-500 hover:bg-purple-700 text-white"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default FillForm;

const FormStateMessage = ({ message, loading }) => (
  <div className="h-screen flex flex-col justify-center items-center px-4">
    {loading && <Loader2 className="animate-spin" size={32} />}
    <div className="text-xl font-bold text-center">{message}</div>
  </div>
);

const FormFilledMessage = ({ form }) => {
  const message =
    form.type === "quiz"
      ? "Thank you for completing the quiz."
      : `Thank you for filling in the ${form.type}.`;

  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <div className="inline-flex flex-col text-center space-y-2">
        <div className="text-lg md:text-xl font-bold">{message}</div>
        <div className="text-sm italic"> - InForm</div>

        {form.type === "quiz" && form.showResults && (
          <Link to={`/quiz-results/${form._id}`} className="group">
            <Button
              variant="ghost"
              className="mt-8 font-normal hover:text-yellow-400"
            >
              <Trophy className="transition-transform group-hover:rotate-y-180 duration-500 ease-in-out" />
              View leaderboard
            </Button>
          </Link>
        )}

        <Link to="/explore" className="group">
          <Button
            variant="ghost"
            className="mt-1 font-normal hover:text-purple-500 group-hover:animate-pulse"
          >
            <Sparkles className="transition-transform group-hover:rotate-z-180 duration-500 ease-in-out" />
            Explore other forms, surveys and quizzes
          </Button>
        </Link>
      </div>
    </div>
  );
};

const QuestionCard = ({ question, value, onChange }) => {
  const renderers = {
    "short-text": () => (
      <Input
        value={value ?? ""}
        onChange={(e) => onChange(question._id, e.target.value)}
        placeholder="Your answer"
        className="focus-visible:border-purple-500  dark:focus-visible:border-purple-500"
      />
    ),
    "long-text": () => (
      <Textarea
        value={value ?? ""}
        onChange={(e) => onChange(question._id, e.target.value)}
        placeholder="Your answer"
        className="focus-visible:border-purple-500  dark:focus-visible:border-purple-500"
      />
    ),
    "single-choice": () => (
      <div className="space-y-2">
        {question.choices.map((choice) => {
          const id = `${question._id}-${choice}`;
          return (
            <div key={choice} className="flex items-center space-x-2">
              <Checkbox
                id={id}
                checked={value === choice}
                onCheckedChange={() =>
                  onChange(question._id, value === choice ? "" : choice)
                }
                className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 dark:data-[state=checked]:bg-purple-500 data-[state=checked]:text-white"
              />
              <Label htmlFor={id} className="cursor-pointer">
                {choice}
              </Label>
            </div>
          );
        })}
      </div>
    ),

    "multi-choice": () => (
      <div className="space-y-2">
        {question.choices.map((choice) => {
          const checked = Array.isArray(value) && value.includes(choice);
          return (
            <div key={choice} className="flex items-center space-x-2">
              <Checkbox
                id={`${question._id}-${choice}`}
                checked={checked}
                onCheckedChange={(isChecked) => {
                  const newValues = Array.isArray(value) ? [...value] : [];
                  if (isChecked) newValues.push(choice);
                  else newValues.splice(newValues.indexOf(choice), 1);
                  onChange(question._id, newValues);
                }}
                className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 dark:data-[state=checked]:bg-purple-500 data-[state=checked]:text-white"
              />
              <Label htmlFor={`${question._id}-${choice}`}>{choice}</Label>
            </div>
          );
        })}
      </div>
    ),
  };

  return (
    <Card className="w-full p-4">
      <div className="space-y-4">
        <div className="flex-col space-y-2">
          <div className="text-xs text-muted-foreground">
            {toReadableLabel(question.type)}
          </div>
          <div className="flex justify-between">
            <Label className="text-lg" htmlFor={question._id}>
              {question.questionText}
            </Label>
            {question.required && (
              <Badge className="ml-2 bg-red-500 text-white max-h-max">
                Required
              </Badge>
            )}
          </div>
        </div>
        {renderers[question.type]?.() || null}
      </div>
    </Card>
  );
};
