import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getFormByShareId } from "@/features/form";

export default function FillForm() {
  const { shareId } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

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

  // Fetch form data from backend
  useEffect(() => {
    if (shareId) {
      fetchForm(shareId);
    }
  }, [fetchForm, shareId]);

  // Handle field change
  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Submit answers
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/forms/${form._id}/responses`, { answers });
      toast.success("Form submitted successfully!");
      setAnswers({});
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting form.");
    }
  };

  if (loading) {
    return (
      <p className="text-center py-10 text-muted-foreground">Loading form...</p>
    );
  }

  if (!form) {
    return (
      <p className="text-center py-10 text-muted-foreground">Form not found.</p>
    );
  }

  return (
    <main className="max-w-4xl mx-auto my-18">
      <div className="flex flex-col gap-6">
        <Card className="p-6">
          <div className="text-2xl font-bold">{form.title}</div>
          <div className="text-sm text-muted-foreground">
            {form.description}
          </div>
        </Card>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {form.questions.map((q) => (
            <Card className="w-full">
              <div key={q._id} className="space-y-2">
                <Label htmlFor={q._id}>{q.label}</Label>
                {q.type === "short-text" && (
                  <Input
                    id={q._id}
                    value={answers[q._id] || ""}
                    onChange={(e) => handleChange(q._id, e.target.value)}
                    placeholder="Your answer"
                  />
                )}
                {q.type === "long-text" && (
                  <Textarea
                    id={q._id}
                    value={answers[q._id] || ""}
                    onChange={(e) => handleChange(q._id, e.target.value)}
                    placeholder="Your detailed answer"
                  />
                )}
                {q.type === "single-choice" && (
                  <div className="space-y-1">
                    {q.options.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={q._id}
                          value={opt}
                          checked={answers[q._id] === opt}
                          onChange={(e) => handleChange(q._id, e.target.value)}
                          className="h-4 w-4"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
                {q.type === "multiple-choice" && (
                  <div className="space-y-1">
                    {q.options.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={q._id}
                          value={opt}
                          checked={answers[q._id] === opt}
                          onChange={(e) => handleChange(q._id, e.target.value)}
                          className="h-4 w-4"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
          <Button type="submit" color="purple" className="w-full">
            Submit
          </Button>
        </form>
      </div>
    </main>
  );
}
