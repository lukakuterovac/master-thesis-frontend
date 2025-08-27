import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "@/lib/axios";
import { Loader2 } from "lucide-react";
import {
  FormResponses,
  SurveyAnalytics,
} from "@/components/ResponseComponents";
import QuizResults from "@/components/QuizResults";
import { getFormById, getFormResponses, getQuizResults } from "@/features/form";
import LoadingScreen from "@/components/LoadingScreen";

const ResponsesPage = () => {
  const { id } = useParams();
  const location = useLocation();

  const [form, setForm] = useState(location.state?.form || null);
  const [responses, setResponses] = useState([]);
  const [quizResults, setQuizResults] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // avoid state updates if component unmounts

    const fetchData = async () => {
      setLoading(true);

      try {
        let formData = form;

        if (!formData) {
          formData = await getFormById(id);
          if (!isMounted) return;
          setForm(formData);
        }
        console.log("Form", formData);

        const responsesData = await getFormResponses(id);
        if (!isMounted) return;
        setResponses(responsesData);
        console.log("Responses", responsesData);

        if (formData.shareId) {
          const quizResultsData = await getQuizResults(formData.shareId);
          if (!isMounted) return;
          setQuizResults(quizResultsData);
          console.log("QuizResults", quizResultsData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <LoadingScreen />;

  if (!form) {
    return <div className="text-center text-gray-500">Form not found</div>;
  }

  return (
    <div className="w-full lg:w-7/10 mx-auto flex flex-col max-w-5xl">
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
        <QuizResults
          form={form}
          responses={responses}
          quizResults={quizResults}
        />
      )}
    </div>
  );
};

export default ResponsesPage;
