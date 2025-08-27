"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Sheet,
  Trash2,
} from "lucide-react";
import { fmtDate } from "@/lib/helpers";

const FormResponses = ({ responses, form, quizResults }) => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedResponseIdx, setSelectedResponseIdx] = useState(null);
  const [page, setPage] = useState(1);

  const perPage =
    itemsPerPage === "All" ? responses.length : Number(itemsPerPage);
  const startIndex = (page - 1) * perPage;
  const currentPageResponses =
    itemsPerPage === "All"
      ? responses
      : responses.slice(startIndex, startIndex + perPage);
  const totalPages =
    itemsPerPage === "All" ? 1 : Math.ceil(responses.length / perPage);
  const itemsPerPageOptions = [1, 5, 10, 25, 100, "All"];

  const isQuiz = form.type === "quiz" && quizResults?.leaderboard?.length > 0;

  // Map responseId to leaderboard entry for quick lookup
  const leaderboardMap = {};
  if (isQuiz) {
    quizResults.leaderboard.forEach((entry) => {
      if (entry.responseId) leaderboardMap[entry.responseId] = entry;
    });
    console.log(leaderboardMap);
  }

  const getQuestionText = (questionId) => {
    const question = form.questions.find((q) => q._id === questionId);
    return question ? question.questionText : "Deleted question";
  };

  const exportAsCsv = () => {
    if (!responses || responses.length === 0) return;

    const headers = [
      "Response #",
      "Submitted At",
      ...(isQuiz
        ? ["Name", "Total Score"]
        : form.questions.map((q) => q.questionText)),
    ];

    const rows = responses.map((res, idx) => {
      if (isQuiz) {
        const entry = leaderboardMap[res._id];
        return [
          idx + 1,
          new Date(res.submittedAt).toLocaleString(),
          entry?.name ?? "Anonymous",
          entry?.totalScore ?? "-",
        ];
      } else {
        const answersMap = {};
        res.answers.forEach((ans) => {
          const question = form.questions.find((q) => q._id === ans.questionId);
          if (question) answersMap[question.questionText] = ans.answer;
        });
        return [
          idx + 1,
          new Date(res.submittedAt).toLocaleString(),
          ...form.questions.map((q) => answersMap[q.questionText] ?? ""),
        ];
      }
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.map((v) => `${v}`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${form.title.replace(/\s+/g, "-")}-responses.csv`.toLowerCase()
    );
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div>Responses table</div>
        <Button variant="outline" onClick={exportAsCsv}>
          <Sheet /> Export as CSV
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table className="table-auto min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-min">#</TableHead>
              <TableHead className="w-min">Date Submitted</TableHead>
              {form.type === "quiz" ? (
                <>
                  <TableHead>Name</TableHead>
                  <TableHead>Total Score</TableHead>
                </>
              ) : (
                <TableHead>Answers preview</TableHead>
              )}
              <TableHead className="w-fit text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentPageResponses.map((res, idx) => {
              const entry =
                form.type === "quiz" ? leaderboardMap[res._id] : null;

              console.log(entry);

              return (
                <TableRow key={res._id}>
                  <TableCell>{startIndex + idx + 1}</TableCell>
                  <TableCell>{fmtDate(res.submittedAt)}</TableCell>

                  {form.type === "quiz" ? (
                    <>
                      <TableCell>{entry?.name ?? "Anonymous"}</TableCell>
                      <TableCell>
                        {entry?.totalScore ?? "-"}/{entry?.maxScore}
                      </TableCell>
                    </>
                  ) : (
                    <TableCell className="max-w-2xl overflow-hidden text-ellipsis whitespace-nowrap">
                      {res.answers && res.answers.length > 0
                        ? res.answers
                            .map((a) =>
                              Array.isArray(a.answer)
                                ? a.answer.join(", ")
                                : a.answer || "-"
                            )
                            .join(", ")
                        : "-"}
                    </TableCell>
                  )}

                  <TableCell className="flex justify-center whitespace-nowrap">
                    <Button
                      variant="ghost"
                      className="w-20"
                      onClick={() =>
                        setSelectedResponseIdx(
                          selectedResponseIdx === idx ? null : startIndex + idx
                        )
                      }
                    >
                      {selectedResponseIdx === idx ? <EyeOff /> : <Eye />}
                      {selectedResponseIdx === idx ? "Close" : "View"}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between my-2 border rounded-lg p-2 space-x-4">
        <Button
          size="sm"
          variant="ghost"
          disabled={page === 1 || itemsPerPage === "All"}
          onClick={() => setPage((p) => p - 1)}
        >
          <ChevronLeft />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center sm:space-x-2 space-y-2 sm:space-y-0 w-full">
          <span className="text-sm text-muted-foreground text-center sm:text-left">
            Page {page} of {totalPages || 1}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="w-full sm:w-auto">
                Per page:{" "}
                {itemsPerPage === "All" ? responses.length : itemsPerPage}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {itemsPerPageOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt}
                  onClick={() => {
                    setItemsPerPage(opt);
                    setPage(1);
                  }}
                >
                  {opt === "All" ? "All" : opt}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button
          size="sm"
          variant="ghost"
          disabled={
            page === totalPages || totalPages === 0 || itemsPerPage === "All"
          }
          onClick={() => setPage((p) => p + 1)}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight />
        </Button>
      </div>

      {/* Expanded response */}
      {selectedResponseIdx !== null && (
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Response #{selectedResponseIdx + 1}</CardTitle>
            <Button variant="ghost" className="text-red-500">
              <Trash2 /> Delete
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {responses[selectedResponseIdx].answers.map((ans, i) => (
              <div key={i} className="space-y-1">
                <p className="text-sm font-medium">
                  {getQuestionText(ans.questionId)}
                </p>
                <p className="text-base">
                  {Array.isArray(ans.answer)
                    ? ans.answer.join(", ")
                    : ans.answer || "-"}
                </p>
                {i !== responses[selectedResponseIdx].answers.length - 1 && (
                  <Separator />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FormResponses;
