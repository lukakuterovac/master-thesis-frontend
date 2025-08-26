import { useState, useMemo } from "react";

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

import { Check, ArrowUp, ArrowDown, Trash2, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const questionTypes = [
  { value: "short-text", label: "Short text" },
  { value: "long-text", label: "Long text" },
  { value: "single-choice", label: "Single choice" },
  { value: "multi-choice", label: "Multiple choice" },
];

export const QuestionCard = ({
  isQuiz,
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

  const renderDropdown = () => (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          className="justify-between min-w-[150px]"
        >
          <span
            className={cn(
              selectedType ? "font-medium" : "text-muted-foreground italic"
            )}
          >
            {selectedType ? selectedType.label : "Select type"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {questionTypes.map((item) => (
                <CommandItem
                  key={item.value}
                  onSelect={() => handleTypeChange(item)}
                  className="cursor-pointer"
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
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

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center">
        {renderDropdown()}
        {renderControls()}
      </div>

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

      {!isQuiz && (
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

      {isQuiz && (
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
