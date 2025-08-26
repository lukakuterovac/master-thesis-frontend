"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BarChart3, List, Trophy } from "lucide-react";
import SurveyAnalytics from "./SurveyAnalytics";
import FormResponses from "./FormResponses";
import { QuizLeaderboard } from "@/pages";
import { cn } from "@/lib/utils";

export default function QuizAnalytics({ form, responses }) {
  const [mode, setMode] = useState("stats"); // "stats" | "responses" | "leaderboard"

  const hasLeaderboard = form.type === "quiz";

  return (
    <div className="flex flex-col gap-6">
      {/* Mode switcher */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setMode("stats")}
          className={cn(
            mode === "stats" && "border-purple-500 dark:border-purple-500"
          )}
        >
          <BarChart3 className="w-4 h-4" />
          Statistics
        </Button>
        <Button
          variant="outline"
          onClick={() => setMode("responses")}
          className={cn(
            mode === "responses" && "border-purple-500 dark:border-purple-500"
          )}
        >
          <List className="w-4 h-4" />
          Responses
        </Button>
        {hasLeaderboard && (
          <Button
            variant="outline"
            onClick={() => setMode("leaderboard")}
            className={cn(
              mode === "leaderboard" &&
                "border-purple-500 dark:border-purple-500"
            )}
          >
            <Trophy className="w-4 h-4 text-yellow-500" />
            Leaderboard
          </Button>
        )}
      </div>

      {/* Render current mode */}
      {mode === "stats" && (
        <SurveyAnalytics form={form} responses={responses} />
      )}
      {mode === "responses" && (
        <FormResponses form={form} responses={responses} />
      )}
      {mode === "leaderboard" && hasLeaderboard && (
        <QuizLeaderboard form={form} responses={responses} />
      )}
    </div>
  );
}
