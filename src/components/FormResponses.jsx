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

const FormResponses = ({ responses, form }) => {
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

  // helper to get question text by id
  const getQuestionText = (questionId) => {
    const question = form.questions.find((q) => q._id === questionId);
    return question ? question.questionText : "Deleted question";
  };

  const exportAsCsv = () => {
    if (!responses || responses.length === 0) return;

    // Build CSV header
    const headers = [
      "Response #",
      "Submitted At",
      ...form.questions.map((q) => q.questionText),
    ];

    // Build CSV rows
    const rows = responses.map((res, idx) => {
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
    });

    // Convert to CSV string
    const csvContent = [headers, ...rows]
      .map((e) => e.map((v) => `${v}`).join(","))
      .join("\n");

    // Trigger download
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
              <TableHead className="w-min border">#</TableHead>
              <TableHead className="w-min border">Date Submitted</TableHead>
              <TableHead className="border">Answers preview</TableHead>
              <TableHead className="w-fit text-center border">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPageResponses.map((res, idx) => (
              <TableRow key={res._id}>
                <TableCell className="whitespace-nowrap border">
                  {startIndex + idx + 1}
                </TableCell>
                <TableCell className="whitespace-nowrap border">
                  {fmtDate(res.submittedAt)}
                </TableCell>
                <TableCell className="max-w-2xl overflow-hidden text-ellipsis whitespace-nowrap border">
                  {res.answers && res.answers.length > 0
                    ? res.answers
                        .map((a) => {
                          const answerText = Array.isArray(a.answer)
                            ? a.answer.join(", ")
                            : a.answer || "-";
                          return `${answerText}`;
                        })
                        .join(", ")
                    : "-"}
                </TableCell>
                <TableCell className="whitespace-nowrap border">
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
            ))}
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
          <ChevronLeft /> Previous
        </Button>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages || 1}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
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
          Next <ChevronRight />
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
