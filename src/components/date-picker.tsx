"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { addMonths, format, getDaysInMonth, isValid, parse, subMonths } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const FormSchema = z.object({
  date: z.date({
    required_error: "Date is required!.",
  }),
});

export function DatePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [inputValue, setInputValue] = useState("DD/MM/YYYY");
  const [isInputActive, setIsInputActive] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [sections, setSections] = useState({ day: "DD", month: "MM", year: "YYYY" });
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    if (date) {
      setCurrentMonth(date);
      const formattedDate = format(date, "dd/MM/yyyy");
      setInputValue(formattedDate);
      setSections({
        day: formattedDate.substring(0, 2),
        month: formattedDate.substring(3, 5),
        year: formattedDate.substring(6, 10),
      });
    }
  }, [date]);

  useEffect(() => {
    const value = form.getValues("date");
    if (value) {
      setCurrentMonth(value);
      const formattedDate = format(value, "dd/MM/yyyy");
      setInputValue(formattedDate);
      setSections({
        day: formattedDate.substring(0, 2),
        month: formattedDate.substring(3, 5),
        year: formattedDate.substring(6, 10),
      });
    }
  }, [form, form.getValues]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.success(`Meeting at: ${format(data.date, "d MMMM, yyyy")}`);
  }

  const handlePreviousMonth = () => {
    setCurrentMonth((prevMonth) => subMonths(prevMonth, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMonth((prevMonth) => addMonths(prevMonth, 1));
  };

  const handleInputFocus = () => {
    setIsInputActive(true);
    if (activeSection === 0) {
    }
    if (inputValue === "DD/MM/YYYY") {
      setSections({ day: "DD", month: "MM", year: "YYYY" });
    }
  };

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    if (!inputRef.current) return;
    const computedStyle = window.getComputedStyle(inputRef.current);
    const font = computedStyle.font;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;
    context.font = font;
    const day = sections.day;
    const month = sections.month;
    const year = sections.year;
    const slash = "/";
    const dayWidth = context.measureText(day).width;
    const firstSlashWidth = context.measureText(slash).width;
    const monthWidth = context.measureText(month).width;
    const secondSlashWidth = context.measureText(slash).width;
    const yearWidth = context.measureText(year).width;
    const dayEndPos = dayWidth;
    const monthStartPos = dayEndPos + firstSlashWidth;
    const monthEndPos = monthStartPos + monthWidth;
    const yearStartPos = monthEndPos + secondSlashWidth;
    const yearEndPos = yearStartPos + yearWidth;
    const inputRect = inputRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - inputRect.left;
    const paddingLeft = parseFloat(computedStyle.paddingLeft);
    const adjustedClickPosition = clickPosition - paddingLeft;
    if (adjustedClickPosition <= dayEndPos) {
      setActiveSection(1);
      selectSection(1);
    } else if (adjustedClickPosition <= monthEndPos) {
      setActiveSection(2);
      selectSection(2);
    } else if (adjustedClickPosition <= yearEndPos) {
      setActiveSection(3);
      selectSection(3);
    } else {
      setActiveSection(1);
      selectSection(1);
    }
  };

  const selectSection = (section: number) => {
    if (!inputRef.current) return;
    let start = 0;
    let end = 0;
    if (section === 1) {
      start = 0;
      end = 2;
    } else if (section === 2) {
      start = 3;
      end = 5;
    } else if (section === 3) {
      start = 6;
      end = 10;
    }
    inputRef.current.setSelectionRange(start, end);
  };

  const handleInputBlur = () => {
    setIsInputActive(false);
    setActiveSection(0);
    const fullDate = `${sections.day}/${sections.month}/${sections.year}`;
    if (fullDate !== "DD/MM/YYYY") {
      try {
        const parsedDate = parse(fullDate, "dd/MM/yyyy", new Date());
        if (isValid(parsedDate)) {
          setDate(parsedDate);
          form.setValue("date", parsedDate);
          setInputValue(fullDate);
        } else {
          resetToPlaceholder();
        }
      } catch {
        resetToPlaceholder();
      }
    } else {
      setInputValue("DD/MM/YYYY");
    }
  };

  const resetToPlaceholder = () => {
    setInputValue("DD/MM/YYYY");
    setSections({ day: "DD", month: "MM", year: "YYYY" });
  };

  const getMaxDaysInMonth = (month: number, year: number) => {
    const validYear = !isNaN(year) && year >= 1900 ? year : new Date().getFullYear();
    const validMonth = !isNaN(month) && month >= 1 && month <= 12 ? month - 1 : 0;
    return getDaysInMonth(new Date(validYear, validMonth));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      if (e.shiftKey) {
        if (activeSection > 1) {
          e.preventDefault();
          setActiveSection(activeSection - 1);
          selectSection(activeSection - 1);
        }
      } else {
        if (activeSection < 3) {
          e.preventDefault();
          setActiveSection(activeSection + 1);
          selectSection(activeSection + 1);
        }
      }
    }

    if (e.key === "ArrowLeft") {
      if (activeSection > 1) {
        e.preventDefault();
        setActiveSection(activeSection - 1);
        selectSection(activeSection - 1);
      }
    }
    if (e.key === "ArrowRight") {
      if (activeSection < 3) {
        e.preventDefault();
        setActiveSection(activeSection + 1);
        selectSection(activeSection + 1);
      }
    }
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      const newSections = { ...sections };
      if (activeSection === 1) newSections.day = "DD";
      else if (activeSection === 2) newSections.month = "MM";
      else if (activeSection === 3) newSections.year = "YYYY";
      setSections(newSections);
      setInputValue(`${newSections.day}/${newSections.month}/${newSections.year}`);
      setTimeout(() => selectSection(activeSection), 10);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.target.value;
    let char = null;
    if (activeSection === 0) return;
    if (e.target.value.length > 0) {
      if (value !== inputValue) {
        const typedText = value.replace(/[^\d]/g, "");
        char = typedText.charAt(typedText.length - 1);
      }
    }
    if (!/^\d$/.test(char || "")) return;
    const digit = parseInt(char || "0", 10);
    const newSections = { ...sections };
    if (activeSection === 1) {
      const currentDay = sections.day === "DD" ? "" : sections.day;
      if (!currentDay) {
        if (digit === 0) {
          newSections.day = "01";
          setTimeout(() => {
            setActiveSection(2);
            selectSection(2);
          }, 10);
        } else if (digit > 3) {
          newSections.day = `0${digit}`;
          setTimeout(() => {
            setActiveSection(2);
            selectSection(2);
          }, 10);
        } else {
          newSections.day = `${digit}`;
          setTimeout(() => selectSection(1), 10);
        }
      } else if (currentDay.length === 1) {
        const firstDigit = parseInt(currentDay, 10);
        let dayValue = parseInt(`${firstDigit}${digit}`, 10);
        let maxDays = 31;
        if (sections.month !== "MM" && sections.year !== "YYYY") {
          const month = parseInt(sections.month, 10);
          const year = parseInt(sections.year, 10);
          maxDays = getMaxDaysInMonth(month, year);
        }
        if (dayValue < 1) dayValue = 1;
        if (dayValue > maxDays) dayValue = maxDays;
        newSections.day = dayValue < 10 ? `0${dayValue}` : `${dayValue}`;
        setTimeout(() => {
          setActiveSection(2);
          selectSection(2);
        }, 10);
      }
    } else if (activeSection === 2) {
      const currentMonth = sections.month === "MM" ? "" : sections.month;
      if (!currentMonth) {
        if (digit === 0) {
          newSections.month = "01";
          setTimeout(() => {
            setActiveSection(3);
            selectSection(3);
          }, 10);
        } else if (digit > 1) {
          newSections.month = `0${digit}`;
          setTimeout(() => {
            setActiveSection(3);
            selectSection(3);
          }, 10);
        } else {
          newSections.month = `${digit}`;
          setTimeout(() => selectSection(2), 10);
        }
      } else if (currentMonth.length === 1) {
        const firstDigit = parseInt(currentMonth, 10);
        let monthValue = parseInt(`${firstDigit}${digit}`, 10);
        if (monthValue < 1) monthValue = 1;
        if (monthValue > 12) monthValue = 12;
        newSections.month = monthValue < 10 ? `0${monthValue}` : `${monthValue}`;
        if (newSections.day !== "DD" && newSections.year !== "YYYY") {
          const day = parseInt(newSections.day, 10);
          const month = monthValue;
          const year = parseInt(newSections.year, 10);
          const maxDays = getMaxDaysInMonth(month, year);
          if (day > maxDays) {
            newSections.day = maxDays < 10 ? `0${maxDays}` : `${maxDays}`;
          }
        }
        setTimeout(() => {
          setActiveSection(3);
          selectSection(3);
        }, 10);
      }
    } else if (activeSection === 3) {
      const currentYear = sections.year === "YYYY" ? "" : sections.year;
      const currentDate = new Date();
      const currentFullYear = currentDate.getFullYear();
      const maxYear = currentFullYear;
      if (currentYear.length < 4) {
        let newYear = currentYear + digit;
        if (newYear.length === 4) {
          const yearValue = parseInt(newYear, 10);
          if (yearValue < 1900) newYear = "1900";
          else if (yearValue > maxYear) newYear = `${maxYear}`;
          if (newSections.day !== "DD" && newSections.month !== "MM") {
            const day = parseInt(newSections.day, 10);
            const month = parseInt(newSections.month, 10);
            const year = parseInt(newYear, 10);
            const maxDays = getMaxDaysInMonth(month, year);
            if (day > maxDays) {
              newSections.day = maxDays < 10 ? `0${maxDays}` : `${maxDays}`;
            }
          }
        }
        newSections.year = newYear;
        if (newYear.length === 4) {
          const dateString = `${newSections.day}/${newSections.month}/${newSections.year}`;
          try {
            const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());
            if (isValid(parsedDate)) {
              setDate(parsedDate);
              form.setValue("date", parsedDate);
            }
          } catch {
          }
        }
        setTimeout(() => selectSection(3), 10);
      }
    }
    setSections(newSections);
    setInputValue(`${newSections.day}/${newSections.month}/${newSections.year}`);
  };

  const CalendarNavigation = () => (
    <div className="flex items-center justify-between mb-1 px-1">
      <Button variant="outline" size="icon" className="h-7 w-7 rounded-md p-0" onClick={handlePreviousMonth} type="button">
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous month</span>
      </Button>
      <div className="text-sm font-medium">{format(currentMonth, "MMMM yyyy")}</div>
      <Button variant="outline" size="icon" className="h-7 w-7 rounded-md p-0" onClick={handleNextMonth} type="button">
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next month</span>
      </Button>
    </div>
  );

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex w-full gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Date</FormLabel>
                  <div className="relative">
                    <Input
                      ref={inputRef}
                      type="text"
                      className={cn("pr-10", isInputActive || inputValue !== "DD/MM/YYYY" ? "" : "text-muted-foreground")}
                      value={inputValue}
                      onClick={handleInputClick}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      onKeyDown={handleKeyDown}
                    />
                    <Popover open={isOpen} onOpenChange={setIsOpen}>
                      <PopoverTrigger asChild>
                        <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
                          <CalendarIcon className="h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <div className="p-3">
                          <CalendarNavigation />
                          <Calendar
                            mode="single"
                            captionLayout="dropdown"
                            selected={date || field.value}
                            onSelect={(selectedDate) => {
                              if (selectedDate) {
                                setDate(selectedDate);
                                field.onChange(selectedDate);
                                setCurrentMonth(selectedDate);
                                const formattedDate = format(selectedDate, "dd/MM/yyyy");
                                setInputValue(formattedDate);
                                setSections({
                                  day: formattedDate.substring(0, 2),
                                  month: formattedDate.substring(3, 5),
                                  year: formattedDate.substring(6, 10),
                                });
                              }
                            }}
                            onDayClick={() => setIsOpen(false)}
                            fromYear={1900}
                            toYear={new Date().getFullYear()}
                            disabled={(date) => Number(date) > Date.now()}
                            month={currentMonth}
                            onMonthChange={setCurrentMonth}
                            components={{
                              CaptionLabel: () => <span />,
                            }}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}
