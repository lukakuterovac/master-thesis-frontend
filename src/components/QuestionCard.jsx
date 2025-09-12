import { useState, useMemo, useRef } from "react";

import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Check,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  ChevronRight,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { questionTypes } from "@/models";

export const QuestionCard = ({
  formType,
  question,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const selectedType = useMemo(
    () => questionTypes.find((type) => type.value === question.type),
    [question.type]
  );

  const handleTypeChange = (type) => {
    const typesWithChoices = ["single-choice", "multi-choice"];
    onChange({
      ...question,
      type: type.value,
      choices: typesWithChoices.includes(type.value)
        ? question.choices || []
        : null,
    });
  };

  const handleTitleChange = (e) => {
    onChange({ ...question, questionText: e.target.value });
  };

  const handleRequiredChange = (checked) => {
    onChange({ ...question, required: checked });
  };

  const renderControls = () => (
    <div className="flex gap-1">
      <Button variant="ghost" size="icon" onClick={onMoveUp}>
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onMoveDown}>
        <ArrowDown className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="text-red-500 hover:text-red-900"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  const renderAdditionalContent = () => {
    if (!selectedType) return null;
    if (["short-text", "long-text"].includes(selectedType.value)) return null;

    if (["single-choice", "multi-choice"].includes(selectedType.value)) {
      return (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Choices</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                onChange({
                  ...question,
                  choices: [...(question.choices || []), ""],
                })
              }
            >
              <Plus className="h-4 w-4 mr-1" /> Add choice
            </Button>
          </div>

          {(question.choices || []).map((choice, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                value={choice}
                onChange={(e) => {
                  const updatedChoices = [...(question.choices || [])];
                  updatedChoices[index] = e.target.value;
                  onChange({ ...question, choices: updatedChoices });
                }}
                placeholder={`Choice ${index + 1}`}
                className="flex-1 focus-visible:border-purple-500 dark:focus-visible:border-purple-500"
              />

              {/* Move Up */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (index === 0) return;
                  const updatedChoices = [...(question.choices || [])];
                  [updatedChoices[index - 1], updatedChoices[index]] = [
                    updatedChoices[index],
                    updatedChoices[index - 1],
                  ];
                  onChange({ ...question, choices: updatedChoices });
                }}
                disabled={index === 0}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>

              {/* Move Down */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (index === question.choices.length - 1) return;
                  const updatedChoices = [...(question.choices || [])];
                  [updatedChoices[index + 1], updatedChoices[index]] = [
                    updatedChoices[index],
                    updatedChoices[index + 1],
                  ];
                  onChange({ ...question, choices: updatedChoices });
                }}
                disabled={index === question.choices.length - 1}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>

              {/* Delete */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const updatedChoices = (question.choices || []).filter(
                    (_, i) => i !== index
                  );
                  onChange({ ...question, choices: updatedChoices });
                }}
                className="text-red-500 hover:text-red-900"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const selectedTypeObj = useMemo(
    () => questionTypes.find((type) => type.value === question.type),
    [question.type]
  );

  return (
    <Card className="p-4">
      {!question.isLogicQuestion && (
        <div className="flex justify-between items-center">
          <QuestionTypeDropdown
            selectedType={selectedTypeObj}
            handleTypeChange={handleTypeChange}
          />
          {renderControls()}
        </div>
      )}

      <div className="flex gap-4">
        <Label htmlFor={`title-${question._id || question.tempId}`}>
          Question title
        </Label>
        <Input
          id={`title-${question._id || question.tempId}`}
          placeholder="Enter your question"
          value={question.questionText || ""}
          onChange={handleTitleChange}
          className="flex-1 focus-visible:border-purple-500 dark:focus-visible:border-purple-500"
        />
      </div>

      {renderAdditionalContent()}

      {formType === "form" && (
        <Label
          htmlFor={`required-${question._id || question.tempId}`}
          className="ml-auto text-sm w-max font-medium cursor-pointer border rounded-md px-4 py-2"
        >
          <Checkbox
            id={`required-${question._id || question.tempId}`}
            checked={question.required}
            onCheckedChange={handleRequiredChange}
          />
          Required
        </Label>
      )}

      {question.isLogicQuestion && (
        <p className="text-sm">
          This is a logic question with two options: <strong>Yes</strong> and{" "}
          <strong>No</strong>.
          <ul className="list-disc list-inside mt-1">
            <li>
              Selecting <strong>Yes</strong> will reveal the remaining
              questions.
            </li>
            <li>
              Selecting <strong>No</strong> will submit the form immediately.
            </li>
          </ul>
        </p>
      )}

      {formType === "quiz" && (
        <div className="space-y-2 mt-4 p-2">
          <Label htmlFor={`answer-${question._id || question.tempId}`}>
            Question answer
          </Label>

          {/* Short & Long text */}
          {["short-text", "long-text"].includes(question.type) && (
            <Input
              id={`answer-${question._id || question.tempId}`}
              placeholder="Enter answer"
              value={question.correctAnswer?.[0] || ""}
              onChange={(e) =>
                onChange({ ...question, correctAnswer: [e.target.value] })
              }
              className="flex-1 focus-visible:border-purple-500 dark:focus-visible:border-purple-500"
            />
          )}

          {/* Single choice */}
          {["single-choice"].includes(question.type) && (
            <div className="flex flex-col gap-2">
              {(question.choices || []).map((choice, index) => (
                <Label
                  key={index}
                  htmlFor={`answer-${
                    question._id || question.tempId
                  }-choice-${index}`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    id={`answer-${
                      question._id || question.tempId
                    }-choice-${index}`}
                    name={`answer-${question._id || question.tempId}`}
                    value={choice}
                    checked={question.correctAnswer?.[0] === choice}
                    onChange={(e) =>
                      onChange({
                        ...question,
                        correctAnswer: [e.target.value],
                      })
                    }
                    className="accent-purple-500"
                  />
                  {choice || `Choice ${index + 1}`}
                </Label>
              ))}
            </div>
          )}

          {/* Multi choice */}
          {["multi-choice"].includes(question.type) && (
            <div className="flex flex-col gap-2">
              {(question.choices || []).map((choice, index) => (
                <Label
                  key={index}
                  htmlFor={`answer-${
                    question._id || question.tempId
                  }-choice-${index}`}
                  className="flex items-center gap-2 cursor-pointer "
                >
                  <input
                    type="checkbox"
                    id={`answer-${
                      question._id || question.tempId
                    }-choice-${index}`}
                    value={choice}
                    checked={question.correctAnswer?.includes(choice) || false}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const prevAnswers = question.correctAnswer || [];
                      const updatedAnswers = checked
                        ? [...prevAnswers, choice]
                        : prevAnswers.filter((a) => a !== choice);
                      onChange({
                        ...question,
                        correctAnswer: updatedAnswers,
                      });
                    }}
                    className="accent-purple-500"
                  />
                  {choice || `Choice ${index + 1}`}
                </Label>
              ))}
            </div>
          )}

          {/* Points */}
          <div className="flex items-center gap-2 w-fit mt-2">
            <Label
              htmlFor={`points-${question._id || question.tempId}`}
              className="whitespace-nowrap"
            >
              Points
            </Label>
            <Input
              id={`points-${question._id || question.tempId}`}
              type="number"
              min={0}
              value={question.points ?? ""}
              onChange={(e) =>
                onChange({
                  ...question,
                  points: Number(e.target.value) || 0,
                })
              }
              className="w-24 focus-visible:border-purple-500 dark:focus-visible:border-purple-500 no-spinner"
            />
          </div>
        </div>
      )}
    </Card>
  );
};

const QuestionTypeDropdown = ({ selectedType, handleTypeChange }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "group max-w-fit justify-between items-center gap-1 hover:border-purple-500 dark:hover:border-purple-500",
            popoverOpen && "border-purple-500 dark:border-purple-500"
          )}
          onClick={() => setPopoverOpen((prev) => !prev)} // 👈 click/tap toggles
        >
          <span
            className={cn(
              selectedType ? "font-semibold" : "text-muted-foreground italic"
            )}
          >
            {selectedType ? selectedType.label : "Select type"}
          </span>
          <ChevronRight
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              popoverOpen && "rotate-90 scale-110 text-purple-500"
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="max-w-fit p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {questionTypes.map((item) => (
                <CommandItem
                  key={item.value}
                  onSelect={() => {
                    handleTypeChange(item);
                    setPopoverOpen(false); // 👈 closes after selection
                  }}
                  className="hover:text-purple-500 dark:hover:text-purple-500 transition-colors"
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4 text-purple-500 transition-opacity duration-200",
                      selectedType?.value === item.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
