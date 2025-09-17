import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DatePicker = ({ htmlForId, form, updateDate, disabledDates }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={htmlForId}
          variant="outline"
          data-empty={!form.expiresAt}
          className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal w-full hover:border-purple-500  dark:hover:border-purple-500"
        >
          <CalendarIcon />
          {form.expiresAt ? (
            format(new Date(form.expiresAt), "PPP")
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={form.expiresAt ? new Date(form.expiresAt) : undefined}
          onSelect={updateDate}
          disabled={disabledDates}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
