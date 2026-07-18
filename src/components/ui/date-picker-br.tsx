import { CalendarDays } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerBrProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
}

function parseDate(value?: string) {
  if (!value) return undefined;
  const date = parseISO(value);
  return isValid(date) ? date : undefined;
}

export function DatePickerBr({ value, onChange, placeholder = "dd/mm/aaaa", id, className }: DatePickerBrProps) {
  const selected = parseDate(value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          className={cn(
            "h-10 w-full justify-between border-bvbp-ink/10 bg-bvbp-raised px-3 font-normal",
            !selected && "text-bvbp-muted-ink",
            className,
          )}
        >
          {selected ? format(selected, "dd/MM/yyyy") : placeholder}
          <CalendarDays className="h-4 w-4 text-bvbp-muted-ink" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          locale={ptBR}
          selected={selected}
          defaultMonth={selected || new Date()}
          onSelect={(date) => date && onChange(format(date, "yyyy-MM-dd"))}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
