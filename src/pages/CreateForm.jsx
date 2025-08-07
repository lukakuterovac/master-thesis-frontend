import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Check, Settings2, Save, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/Sidebar";

const formTypes = [
  { value: "form", label: "Form" },
  { value: "quiz", label: "Quiz" },
  { value: "survey", label: "Survey" },
];

const CreateForm = () => {
  const [formType, setFormType] = useState(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const [formTypePopoverOpen, setFormTypePopoverOpen] = useState(false);
  const [settingsSidebarOpen, setSettingsSidebarOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // toast.success("Form saved (mock)!");
    // Logic to persist the form goes here
  };

  const formTypeButton = () => {
    return (
      <>
        <Popover
          open={formTypePopoverOpen}
          onOpenChange={setFormTypePopoverOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              role="combobox"
              aria-expanded={open}
              className="max-w-fit justify-between"
            >
              <span
                className={cn(
                  formType ? "font-semibold" : "text-muted-foreground italic"
                )}
              >
                {formType ? formType.label : "Select form type"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="max-w-fit p-0">
            <Command>
              <CommandList>
                <CommandGroup>
                  {formTypes.map((item) => (
                    <CommandItem
                      key={item.value}
                      onSelect={() => {
                        setFormType(item);
                      }}
                    >
                      {item.label}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          formType === item ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </>
    );
  };

  const formSettingsButton = () => {
    return (
      <Button variant="ghost" onClick={() => setSettingsSidebarOpen(true)}>
        <Settings2 />
      </Button>
    );
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Controls */}
        <Card className="p-2 flex flex-row justify-between">
          {formTypeButton()}
          {formSettingsButton()}
        </Card>

        {/* Form Card */}
        <div className={cn(formType ? "" : "blur-xs", "transition-all")}>
          <Card>
            <CardContent>
              <form id="form-id" onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Enter a title for your form"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Brief description"
                  />
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Buttons Row - Outside the Card but inside the layout */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            type="submit"
            variant="default"
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Form
          </Button>

          <Button
            type="button"
            variant="destructive"
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Discard Form
          </Button>
        </div>
      </div>

      <Sidebar
        isOpen={settingsSidebarOpen}
        onClose={() => setSettingsSidebarOpen(false)}
        title="Settings"
      >
        <div>Settings...</div>
      </Sidebar>
    </>
  );
};

export default CreateForm;
