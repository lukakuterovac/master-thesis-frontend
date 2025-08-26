import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "@/lib/axios";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import {
  FormResponses,
  SurveyAnalytics,
} from "@/components/ResponseComponents";
import QuizResults from "@/components/QuizResults";

const ResponsesPage = () => {
  const { id } = useParams();
  const location = useLocation();

  const [form, setForm] = useState(location.state?.form || null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      if (!form) {
        try {
          const { data } = await axios.get(`/form/${id}`);
          setForm(data);
        } catch (err) {
          console.error("Error fetching form:", err);
        }
      }
    };
    fetchForm();
  }, [id, form]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const { data } = await axios.get(`/form/${id}/responses`);
        setResponses(data);
      } catch (err) {
        console.error("Error fetching responses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResponses();
  }, [id]);

  if (loading)
    return (
      <div className="h-screen flex flex-col justify-center items-center px-4">
        <Loader2 className="animate-spin" size={32} />
        <div className="text-center">Loading...</div>
      </div>
    );

  if (!form) {
    return <div className="text-center text-gray-500">Form not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col space-y-2 mb-4">
        <div className="text-2xl font-bold">{form.title}</div>
        <p className="text-gray-600 dark:text-gray-400 ">
          {responses.length} responses collected
        </p>
      </div>

      {/* Render based on form type */}
      {form.type === "form" && (
        <FormResponses form={form} responses={responses} />
      )}
      {form.type === "survey" && (
        <SurveyAnalytics form={form} responses={responses} />
      )}
      {form.type === "quiz" && (
        <QuizResults form={form} responses={responses} />
      )}
    </div>
  );
};

export default ResponsesPage;
