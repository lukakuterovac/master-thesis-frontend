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

const questionTypes = [
  { value: "short-text", label: "Short text" },
  { value: "long-text", label: "Long text" },
  { value: "single-choice", label: "Single choice" },
  { value: "multi-choice", label: "Multiple choice" },
];

export const QuestionCard = ({
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
    const typesWithOptions = ["single-choice", "multi-choice"];
    onChange({
      ...question,
      type: type.value,
      options: typesWithOptions.includes(type.value)
        ? question.options || []
        : null,
    });
  };

  const handleTitleChange = (e) => {
    onChange({ ...question, questionText: e.target.value });
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
            <Label>Options</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                onChange({
                  ...question,
                  options: [...(question.options || []), ""],
                })
              }
            >
              <Plus className="h-4 w-4 mr-1" /> Add Option
            </Button>
          </div>

          {(question.options || []).map((option, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                value={option}
                onChange={(e) => {
                  const updatedOptions = [...(question.options || [])];
                  updatedOptions[index] = e.target.value;
                  onChange({ ...question, options: updatedOptions });
                }}
                placeholder={`Option ${index + 1}`}
                className="flex-1"
              />

              {/* Move Up */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (index === 0) return;
                  const updatedOptions = [...(question.options || [])];
                  [updatedOptions[index - 1], updatedOptions[index]] = [
                    updatedOptions[index],
                    updatedOptions[index - 1],
                  ];
                  onChange({ ...question, options: updatedOptions });
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
                  if (index === question.options.length - 1) return;
                  const updatedOptions = [...(question.options || [])];
                  [updatedOptions[index + 1], updatedOptions[index]] = [
                    updatedOptions[index],
                    updatedOptions[index + 1],
                  ];
                  onChange({ ...question, options: updatedOptions });
                }}
                disabled={index === question.options.length - 1}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>

              {/* Delete */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const updatedOptions = (question.options || []).filter(
                    (_, i) => i !== index
                  );
                  onChange({ ...question, options: updatedOptions });
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
          className="flex-1"
        />
      </div>

      {renderAdditionalContent()}
    </Card>
  );
};
