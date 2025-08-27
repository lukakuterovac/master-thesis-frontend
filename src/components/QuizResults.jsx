"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BarChart3, List, Trophy } from "lucide-react";
import SurveyAnalytics from "./SurveyAnalytics";
import FormResponses from "./FormResponses";
import { QuizLeaderboard } from "@/pages";
import { cn } from "@/lib/utils";

export default function QuizAnalytics({ form, responses, quizResults }) {
  const [mode, setMode] = useState("stats");

  const hasLeaderboard = form.type === "quiz";

  return (
    <div className="flex flex-col gap-6">
      {/* Mode switcher */}
      <div className="grid grid-cols-2 gap-2 w-full mx-auto">
        <Button
          variant="outline"
          onClick={() => setMode("stats")}
          className={cn(
            "w-full flex flex-col items-center justify-center sm:flex-row sm:py-2 py-4 h-full",
            mode === "stats" && "border-purple-500 dark:border-purple-500"
          )}
        >
          <BarChart3
            className={cn(
              "w-5 h-5 sm:mr-2 mb-1 sm:mb-0",
              mode === "stats" && "animate-spin-z"
            )}
          />
          <span className="text-sm text-center sm:text-left">Statistics</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => setMode("responses")}
          className={cn(
            "w-full flex flex-col items-center justify-center sm:flex-row sm:py-2 py-4 h-full",
            mode === "responses" && "border-purple-500 dark:border-purple-500"
          )}
        >
          <List
            className={cn(
              "w-5 h-5 sm:mr-2 mb-1 sm:mb-0",
              mode === "responses" && "animate-spin-z"
            )}
          />
          <span className="text-sm text-center sm:text-left">Responses</span>
        </Button>

        {/* {hasLeaderboard && (
          <Button
            variant="outline"
            onClick={() => setMode("leaderboard")}
            className={cn(
              "w-full flex flex-col items-center justify-center sm:flex-row sm:py-2 py-4 h-full",
              mode === "leaderboard" &&
                "border-purple-500 dark:border-purple-500"
            )}
          >
            <Trophy
              className={cn(
                "w-5 h-5 text-yellow-500 sm:mr-2 mb-1 sm:mb-0",
                mode === "leaderboard" && "animate-spin-z"
              )}
            />
            <span className="text-sm text-center sm:text-left">
              Leaderboard
            </span>
          </Button>
        )} */}
      </div>

      {/* Render current mode */}
      {mode === "stats" && (
        <SurveyAnalytics form={form} responses={responses} />
      )}
      {mode === "responses" && (
        <FormResponses
          form={form}
          responses={responses}
          quizResults={quizResults}
        />
      )}
      {/* {mode === "leaderboard" && hasLeaderboard && (
        <QuizLeaderboard form={form} responses={responses} />
      )} */}
    </div>
  );
}
