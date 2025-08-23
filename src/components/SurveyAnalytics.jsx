"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { BarChart3, ChartPie } from "lucide-react";
import { cn } from "@/lib/utils";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
];

/** ---------- helpers ---------- */

function getAnswersForQuestion(responses, qid) {
  const vals = [];
  for (const res of responses) {
    const hit = res.answers.find((a) => String(a.questionId) === String(qid));
    if (
      hit &&
      hit.answer !== undefined &&
      hit.answer !== null &&
      hit.answer !== ""
    ) {
      vals.push(hit.answer);
    }
  }
  return vals;
}

function countByChoice(values, choices) {
  const counts = {};
  const flat = values.flatMap((v) => (Array.isArray(v) ? v : [v]));
  for (const v of flat) counts[v] = (counts[v] || 0) + 1;

  if (choices?.length) {
    for (const c of choices) if (!(c in counts)) counts[c] = 0;
  }

  const data = Object.entries(counts).map(([name, value]) => ({
    name,
    value,
  }));
  const total = flat.length || 1;
  return data
    .map((d) => ({ ...d, pct: (d.value / total) * 100 }))
    .sort((a, b) => b.value - a.value);
}

function ratingStats(values) {
  const nums = values
    .flatMap((v) => (Array.isArray(v) ? v : [v]))
    .map((n) => Number(n))
    .filter((n) => !Number.isNaN(n));
  if (!nums.length) return { avg: 0, median: 0, min: 0, max: 0, dist: [] };

  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  const counts = {};
  for (const n of nums) counts[String(n)] = (counts[String(n)] || 0) + 1;
  const dist = Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => Number(a.name) - Number(b.name));

  return { avg, median, min, max, dist };
}

function groupByDateDay(values) {
  const counts = {};
  for (const v of values) {
    const key = v.date.toISOString().slice(0, 10);
    counts[key] = (counts[key] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

/** ---------- question renderers ---------- */

function ChoiceQuestionCard({ q, responses }) {
  const values = useMemo(
    () => getAnswersForQuestion(responses, q._id),
    [responses, q._id]
  );
  const data = useMemo(
    () => countByChoice(values, q.choices),
    [values, q.choices]
  );

  const dataWithFill = data.map((d, i) => ({
    ...d,
    fill: `var(--chart-${(i % 8) + 1})`,
  }));

  const chartConfig = useMemo(() => {
    const cfg = { value: { label: "Responses" } };
    data.forEach((d, i) => {
      cfg[d.name] = { label: d.name, color: COLORS[i % COLORS.length] };
    });
    return cfg;
  }, [data]);

  const [chartType, setChartType] = useState("pie");

  function CustomChartTooltip({ active, payload }) {
    if (active && payload && payload.length) {
      const { name, value, fill } = payload[0].payload;
      return (
        <div className="rounded-md px-3 py-2 bg-background">
          <div className="flex gap-2 items-center justify-between">
            <span
              className="w-4 h-4 rounded-[25%]"
              style={{ backgroundColor: fill }}
            ></span>
            <span className="font-medium">{name}</span>
            <span>{value}</span>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle>{q.questionText}</CardTitle>
        <CardDescription>
          {q.type === "single-choice" ? "Single choice" : "Multiple choice"} •{" "}
          {values.length} responses
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Chart type switcher */}
        <div className="flex gap-2 mb-2">
          {[
            {
              type: "pie",
              label: "Pie",
              icon: <ChartPie />,
            },
            {
              type: "bar",
              label: "Bar",
              icon: <BarChart3 />,
            },
          ].map(({ type, label, icon }) => (
            <Button
              key={type}
              variant="outline"
              onClick={() => setChartType(type)}
              className={cn(
                "flex items-center gap-2",
                type === chartType
                  ? "border-purple-500 dark:border-purple-500"
                  : ""
              )}
            >
              {icon}
              {label}
            </Button>
          ))}
        </div>

        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[280px] w-full"
        >
          {chartType === "pie" && (
            <PieChart>
              <ChartTooltip cursor={false} content={<CustomChartTooltip />} />
              <Pie
                data={dataWithFill}
                dataKey="value"
                nameKey="name"
                animationBegin={0}
              >
                {dataWithFill.map((d, i) => (
                  <Cell key={i} fill={d.fill} />
                ))}
              </Pie>
            </PieChart>
          )}

          {chartType === "bar" && (
            <BarChart data={dataWithFill}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <ChartTooltip content={<CustomChartTooltip />} />
              <Bar dataKey="value" radius={6}>
                {dataWithFill.map((d, i) => (
                  <Cell key={i} fill={d.fill} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ChartContainer>

        {/* Legend / summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
          {dataWithFill.map((d, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border px-3 py-2"
            >
              <span
                className="w-4 h-4 rounded-[25%]"
                style={{ backgroundColor: d.fill }}
              ></span>
              <span className="truncate">{d.name}</span>
              <span className="tabular-nums">
                {d.value} ({d.pct.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RatingQuestionCard({ q, responses }) {
  const values = useMemo(
    () => getAnswersForQuestion(responses, q._id),
    [responses, q._id]
  );
  const stats = useMemo(() => ratingStats(values), [values]);

  const chartConfig = { value: { label: "Count" } };

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle>{q.questionText}</CardTitle>
        <CardDescription>Rating • {values.length} responses</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ChartContainer config={chartConfig} className="w-full h-[280px]">
          <BarChart data={stats.dist}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" radius={6} />
          </BarChart>
        </ChartContainer>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
          <div className="rounded-lg border p-3">
            <div className="text-muted-foreground">Average</div>
            <div className="text-lg font-semibold tabular-nums">
              {stats.avg.toFixed(2)}
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-muted-foreground">Median</div>
            <div className="text-lg font-semibold tabular-nums">
              {stats.median.toFixed(2)}
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-muted-foreground">Min</div>
            <div className="text-lg font-semibold tabular-nums">
              {stats.min}
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-muted-foreground">Max</div>
            <div className="text-lg font-semibold tabular-nums">
              {stats.max}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DateQuestionCard({ q, responses }) {
  const values = useMemo(
    () =>
      getAnswersForQuestion(responses, q._id)
        .flatMap((v) => (Array.isArray(v) ? v : [v]))
        .map((d) => ({ date: new Date(d) }))
        .filter((d) => !Number.isNaN(d.date.getTime())),
    [responses, q._id]
  );
  const series = useMemo(() => groupByDateDay(values), [values]);
  const chartConfig = { value: { label: "Submissions" } };

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle>{q.questionText}</CardTitle>
        <CardDescription>Date • {values.length} responses</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ChartContainer config={chartConfig} className="w-full h-[280px]">
          <LineChart data={series}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              minTickGap={24}
            />
            <YAxis allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--chart-1)"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ChartContainer>
        <div className="text-sm text-muted-foreground">
          Total submissions:{" "}
          <span className="font-medium">{values.length}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function TextQuestionCard({ q, responses }) {
  const allAnswers = useMemo(
    () =>
      getAnswersForQuestion(responses, q._id)
        .flatMap((v) => (Array.isArray(v) ? v : [v]))
        .map((s) => String(s)),
    [responses, q._id]
  );

  const stats = useMemo(() => {
    const count = allAnswers.length;
    const unique = new Set(allAnswers).size;
    const avgLen = count
      ? allAnswers.reduce((a, b) => a + b.length, 0) / count
      : 0;
    return { count, unique, avgLen };
  }, [allAnswers]);

  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const totalPages = Math.max(1, Math.ceil(allAnswers.length / perPage));
  const start = (page - 1) * perPage;
  const pageItems = allAnswers.slice(start, start + perPage);

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle>{q.questionText}</CardTitle>
        <CardDescription>
          {q.type === "short-text" ? "Short text" : "Long text"} • {stats.count}{" "}
          responses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
          <div className="rounded-lg border p-3">
            <div className="text-muted-foreground">Total</div>
            <div className="text-lg font-semibold tabular-nums">
              {stats.count}
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-muted-foreground">Unique</div>
            <div className="text-lg font-semibold tabular-nums">
              {stats.unique}
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-muted-foreground">Avg length</div>
            <div className="text-lg font-semibold tabular-nums">
              {stats.avgLen.toFixed(1)}
            </div>
          </div>
        </div>

        <Separator />

        <div className="rounded-lg border">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="text-sm text-muted-foreground">
              Showing {pageItems.length} of {allAnswers.length}
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>
              <div className="text-sm">
                Page {page} / {totalPages}
              </div>
              <Button
                size="sm"
                variant="ghost"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>

          <Separator />

          <ul className="max-h-80 overflow-y-auto divide-y">
            {pageItems.length === 0 ? (
              <li className="px-3 py-3 text-sm text-muted-foreground">
                No responses yet.
              </li>
            ) : (
              pageItems.map((a, i) => (
                <li key={i} className="px-3 py-3 text-sm">
                  {a}
                </li>
              ))
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

/** ---------- renderer map (easy to extend) ---------- */

const RENDERERS = {
  "single-choice": ({ q, responses }) => (
    <ChoiceQuestionCard q={q} responses={responses} />
  ),
  "multi-choice": ({ q, responses }) => (
    <ChoiceQuestionCard q={q} responses={responses} />
  ),
  rating: ({ q, responses }) => (
    <RatingQuestionCard q={q} responses={responses} />
  ),
  date: ({ q, responses }) => <DateQuestionCard q={q} responses={responses} />,
  "short-text": ({ q, responses }) => (
    <TextQuestionCard q={q} responses={responses} />
  ),
  "long-text": ({ q, responses }) => (
    <TextQuestionCard q={q} responses={responses} />
  ),
};

/** ---------- main component ---------- */

export default function SurveyAnalytics({ form, responses }) {
  if (!form?.questions?.length) {
    return (
      <div className="text-sm text-muted-foreground">
        No questions defined for this survey.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6">
        {form.questions.map((q) => {
          const renderer = RENDERERS[q.type];
          return (
            <div key={q._id}>
              {renderer ? (
                renderer({ q, responses })
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>{q.questionText}</CardTitle>
                    <CardDescription>Unsupported question type</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Add a renderer for <code>{q.type}</code> in the map.
                  </CardContent>
                </Card>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
