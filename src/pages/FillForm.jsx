import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
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

export default function FillForm() {
  const { shareId } = useParams();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});

  const fetchForm = useCallback(async (shareId) => {
    setLoading(true);
    try {
      const data = await getFormByShareId(shareId);
      setForm(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to get form");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (shareId) fetchForm(shareId);
  }, [fetchForm, shareId]);

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form) return;

    const missingRequired = form.questions.filter(
      (q) =>
        q.required &&
        (answers[q._id] === undefined ||
          answers[q._id] === null ||
          answers[q._id] === "" ||
          (Array.isArray(answers[q._id]) && answers[q._id].length === 0))
    );

    if (missingRequired.length > 0) {
      toast.error("Please answer all required questions before submitting.");
      return;
    }

    const formattedAnswers = form.questions.map((q) => ({
      questionId: q._id,
      answer:
        answers[q._id] !== undefined && answers[q._id] !== ""
          ? answers[q._id]
          : null,
    }));

    try {
      await submitResponse(form._id, { answers: formattedAnswers });
      toast.success("Form submitted successfully!");
      setAnswers({});
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error submitting form.");
    }
  };

  if (loading)
    return (
      <p className="text-center py-10 text-muted-foreground">Loading form...</p>
    );
  if (!form)
    return (
      <p className="text-center py-10 text-muted-foreground">Form not found.</p>
    );

  return (
    <main className="max-w-4xl px-4 sm:px-8 mx-auto my-4 md:my-8 lg:my-12">
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
          {form.questions.map((q) => (
            <QuestionCard
              key={q._id}
              question={q}
              value={answers[q._id]}
              onChange={handleChange}
            />
          ))}

          <Button type="submit" color="purple" className="w-full text-lg py-6">
            Submit
          </Button>
        </form>
      </div>
    </main>
  );
}

const QuestionCard = ({ question, value, onChange }) => {
  const renderShortText = () => (
    <Input
      id={question._id}
      value={value || ""}
      onChange={(e) => onChange(question._id, e.target.value)}
      placeholder="Your answer"
    />
  );

  const renderLongText = () => (
    <Textarea
      id={question._id}
      value={value || ""}
      onChange={(e) => onChange(question._id, e.target.value)}
      placeholder="Your answer"
    />
  );

  const renderSingleChoice = () => (
    <div className="space-y-2">
      {question.options.map((opt) => {
        const id = `${question._id}-${opt}`;
        const isSelected = value === opt;

        return (
          <div key={opt} className="flex items-center space-x-2">
            <Checkbox
              id={id}
              checked={isSelected}
              onCheckedChange={() =>
                onChange(question._id, isSelected ? "" : opt)
              }
              className="rounded-md"
            />
            <Label htmlFor={id} className="cursor-pointer">
              {opt}
            </Label>
          </div>
        );
      })}
    </div>
  );

  const renderMultiChoice = () => (
    <div className="space-y-2">
      {question.options.map((opt) => {
        const checked = Array.isArray(value) && value.includes(opt);
        return (
          <div key={opt} className="flex items-center space-x-2">
            <Checkbox
              id={`${question._id}-${opt}`}
              checked={checked}
              onCheckedChange={(isChecked) => {
                const newValues = Array.isArray(value) ? [...value] : [];
                if (isChecked) newValues.push(opt);
                else {
                  const idx = newValues.indexOf(opt);
                  if (idx > -1) newValues.splice(idx, 1);
                }
                onChange(question._id, newValues);
              }}
            />
            <Label htmlFor={`${question._id}-${opt}`}>{opt}</Label>
          </div>
        );
      })}
    </div>
  );

  const renderContent = () => {
    switch (question.type) {
      case "short-text":
        return renderShortText();
      case "long-text":
        return renderLongText();
      case "single-choice":
        return renderSingleChoice();
      case "multi-choice":
        return renderMultiChoice();
      default:
        return null;
    }
  };

  return (
    <Card className="w-full p-4">
      <div className="space-y-4">
        <div className="flex-col items-center space-y-2">
          <div className="text-xs text-muted-foreground">
            {toReadableLabel(question.type)}
          </div>
          <div className="flex justify-between">
            <Label className="text-lg" htmlFor={question._id}>
              {question.questionText}
            </Label>
            {question.required && (
              <Badge className="bg-red-500 text-white max-h-max">
                Required
              </Badge>
            )}
          </div>
        </div>
        {renderContent()}
      </div>
    </Card>
  );
};
