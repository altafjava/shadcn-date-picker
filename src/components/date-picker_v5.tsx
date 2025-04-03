// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { addMonths, format, getDaysInMonth, isValid, parse, subMonths } from "date-fns";
// import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import { z } from "zod";
// import { cn } from "../lib/utils";
// import { Button } from "./ui/button";
// import { Calendar } from "./ui/calendar";
// import { Form, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
// import { Input } from "./ui/input";
// import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

// const FormSchema = z.object({
//   datetime: z.date({
//     required_error: "Date & time is required!.",
//   }),
// });

// export function DatePicker() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [date, setDate] = useState<Date | null>(null);
//   const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
//   const [inputValue, setInputValue] = useState("DD/MM/YYYY");
//   const [isInputActive, setIsInputActive] = useState(false);
//   // Track active input section (1 = day, 2 = month, 3 = year)
//   const [activeSection, setActiveSection] = useState(0);
//   // Store the sections separately for controlled input handling
//   const [sections, setSections] = useState({ day: "DD", month: "MM", year: "YYYY" });
//   // Ref for input
//   const inputRef = useRef<HTMLInputElement>(null);
//   const form = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//   });

//   // Effect to update currentMonth when selected date changes
//   useEffect(() => {
//     if (date) {
//       setCurrentMonth(date);
//       // Update input value and sections when date is selected from calendar
//       const formattedDate = format(date, "dd/MM/yyyy");
//       setInputValue(formattedDate);
//       setSections({
//         day: formattedDate.substring(0, 2),
//         month: formattedDate.substring(3, 5),
//         year: formattedDate.substring(6, 10),
//       });
//     }
//   }, [date]);

//   // Also update currentMonth when the form value changes
//   useEffect(() => {
//     const value = form.getValues("datetime");
//     if (value) {
//       setCurrentMonth(value);
//       const formattedDate = format(value, "dd/MM/yyyy");
//       setInputValue(formattedDate);
//       setSections({
//         day: formattedDate.substring(0, 2),
//         month: formattedDate.substring(3, 5),
//         year: formattedDate.substring(6, 10),
//       });
//     }
//   }, [form.getValues]);

//   async function onSubmit(data: z.infer<typeof FormSchema>) {
//     toast.success(`Meeting at: ${format(data.datetime, "d MMMM, yyyy")}`);
//   }

//   const handlePreviousMonth = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setCurrentMonth((prevMonth) => subMonths(prevMonth, 1));
//   };

//   const handleNextMonth = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setCurrentMonth((prevMonth) => addMonths(prevMonth, 1));
//   };

//   // Handle input focus
//   const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
//     setIsInputActive(true);
//     // Default to day section if no specific selection
//     if (activeSection === 0) {
//       // setActiveSection(1);
//       // Select day part
//       // selectSection(1);
//     }
//     // If it's the placeholder, initialize sections
//     if (inputValue === "DD/MM/YYYY") {
//       setSections({ day: "DD", month: "MM", year: "YYYY" });
//     }
//   };

//   // Handle input click to determine which section to edit
//   const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
//     if (!inputRef.current) return;
//     // We'll calculate the actual text width of each section and separators
//     const computedStyle = window.getComputedStyle(inputRef.current);
//     const font = computedStyle.font;
//     // Create a canvas to measure text width accurately
//     const canvas = document.createElement("canvas");
//     const context = canvas.getContext("2d");
//     if (!context) return;
//     // Set the font to match the input
//     context.font = font;
//     // Get the sections and their measurements
//     const day = sections.day;
//     const month = sections.month;
//     const year = sections.year;
//     const slash = "/";
//     // Measure the width of each component
//     const dayWidth = context.measureText(day).width;
//     const firstSlashWidth = context.measureText(slash).width;
//     const monthWidth = context.measureText(month).width;
//     const secondSlashWidth = context.measureText(slash).width;
//     const yearWidth = context.measureText(year).width;
//     // Calculate cumulative positions
//     const dayEndPos = dayWidth;
//     const monthStartPos = dayEndPos + firstSlashWidth;
//     const monthEndPos = monthStartPos + monthWidth;
//     const yearStartPos = monthEndPos + secondSlashWidth;
//     const yearEndPos = yearStartPos + yearWidth;
//     // Get click position relative to input start
//     const inputRect = inputRef.current.getBoundingClientRect();
//     const clickPosition = e.clientX - inputRect.left;
//     // Adjust for padding if necessary
//     const paddingLeft = parseFloat(computedStyle.paddingLeft);
//     const adjustedClickPosition = clickPosition - paddingLeft;
//     // Determine which section was clicked
//     if (adjustedClickPosition <= dayEndPos) {
//       setActiveSection(1);
//       selectSection(1);
//     } else if (adjustedClickPosition <= monthEndPos) {
//       setActiveSection(2);
//       selectSection(2);
//     } else if (adjustedClickPosition <= yearEndPos) {
//       setActiveSection(3);
//       selectSection(3);
//     } else {
//       setActiveSection(1);
//       selectSection(1);
//     }
//   };

//   // Select the text for the active section
//   const selectSection = (section: number) => {
//     if (!inputRef.current) return;
//     // Calculate selection ranges based on section
//     let start = 0;
//     let end = 0;
//     if (section === 1) {
//       // Day
//       start = 0;
//       end = 2;
//     } else if (section === 2) {
//       // Month
//       start = 3;
//       end = 5;
//     } else if (section === 3) {
//       // Year
//       start = 6;
//       end = 10;
//     }
//     // Select the text range
//     inputRef.current.setSelectionRange(start, end);
//   };

//   // Handle input blur
//   const handleInputBlur = () => {
//     setIsInputActive(false);
//     setActiveSection(0);
//     // Validate the full date when leaving the field
//     const fullDate = `${sections.day}/${sections.month}/${sections.year}`;
//     // If we have an actual date (not placeholders), try to validate it
//     if (fullDate !== "DD/MM/YYYY") {
//       try {
//         const parsedDate = parse(fullDate, "dd/MM/yyyy", new Date());
//         if (isValid(parsedDate)) {
//           setDate(parsedDate);
//           form.setValue("datetime", parsedDate);
//           setInputValue(fullDate);
//         } else {
//           // Reset to placeholder on invalid date
//           resetToPlaceholder();
//         }
//       } catch (error) {
//         // Reset to placeholder on parsing error
//         resetToPlaceholder();
//       }
//     } else {
//       // It's still a placeholder, keep it as is
//       setInputValue("DD/MM/YYYY");
//     }
//   };

//   // Reset to placeholder
//   const resetToPlaceholder = () => {
//     setInputValue("DD/MM/YYYY");
//     setSections({ day: "DD", month: "MM", year: "YYYY" });
//   };

//   // Helper function to get max days for a given month and year
//   const getMaxDaysInMonth = (month: number, year: number) => {
//     // Default to current year if year is not a valid number
//     const validYear = !isNaN(year) && year >= 1900 ? year : new Date().getFullYear();
//     // Default to January (0-based index in date-fns) if month is not valid
//     const validMonth = !isNaN(month) && month >= 1 && month <= 12 ? month - 1 : 0;
//     return getDaysInMonth(new Date(validYear, validMonth));
//   };

//   // Handle keyboard navigation between sections
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     // Tab key moves between sections
//     if (e.key === "Tab") {
//       if (e.shiftKey) {
//         // Shift+Tab moves backward
//         if (activeSection > 1) {
//           e.preventDefault();
//           setActiveSection(activeSection - 1);
//           selectSection(activeSection - 1);
//         }
//       } else {
//         // Tab moves forward
//         if (activeSection < 3) {
//           e.preventDefault();
//           setActiveSection(activeSection + 1);
//           selectSection(activeSection + 1);
//         }
//       }
//     }

//     // Arrow keys for navigation
//     if (e.key === "ArrowLeft") {
//       if (activeSection > 1) {
//         e.preventDefault();
//         setActiveSection(activeSection - 1);
//         selectSection(activeSection - 1);
//       }
//     }
//     if (e.key === "ArrowRight") {
//       if (activeSection < 3) {
//         e.preventDefault();
//         setActiveSection(activeSection + 1);
//         selectSection(activeSection + 1);
//       }
//     }
//     // Handle deleting or backspacing
//     if (e.key === "Delete" || e.key === "Backspace") {
//       e.preventDefault();
//       // Reset the active section
//       const newSections = { ...sections };
//       if (activeSection === 1) newSections.day = "DD";
//       else if (activeSection === 2) newSections.month = "MM";
//       else if (activeSection === 3) newSections.year = "YYYY";
//       setSections(newSections);
//       // Update input value
//       setInputValue(`${newSections.day}/${newSections.month}/${newSections.year}`);
//       // Reselect the section
//       setTimeout(() => selectSection(activeSection), 10);
//     }
//   };

//   // Handle input change based on which section is active
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     e.preventDefault();
//     const value = e.target.value;
//     // Get the typed character (assuming single character input most of the time)
//     // This is needed because the input value will include all text plus the new character
//     let char = null;
//     // Only proceed if a section is active
//     if (activeSection === 0) return;
//     if (e.target.value.length > 0) {
//       // Try to extract the character typed
//       if (value !== inputValue) {
//         // This is a simplification - in real scenario, you'd need to compare
//         // the input value with previous value to get the exact change
//         const typedText = value.replace(/[^\d]/g, "");
//         char = typedText.charAt(typedText.length - 1);
//       }
//     }
//     // Only proceed if we have a numeric character
//     if (!/^\d$/.test(char || "")) return;
//     const digit = parseInt(char || "0", 10);
//     const newSections = { ...sections };
//     // Day section (1)
//     if (activeSection === 1) {
//       const currentDay = sections.day === "DD" ? "" : sections.day;
//       // If day is empty or placeholder
//       if (!currentDay) {
//         // If digit is 0, set to "01"
//         if (digit === 0) {
//           newSections.day = "01";
//           // Move to month section
//           setTimeout(() => {
//             setActiveSection(2);
//             selectSection(2);
//           }, 10);
//         }
//         // If digit > 3, prefix with 0 and move to month
//         else if (digit > 3) {
//           newSections.day = `0${digit}`;
//           // Move to month section
//           setTimeout(() => {
//             setActiveSection(2);
//             selectSection(2);
//           }, 10);
//         }
//         // Digit 1-3 waits for second digit
//         else {
//           newSections.day = `${digit}`;
//           // Don't move yet, but update section
//           setTimeout(() => selectSection(1), 10);
//         }
//       }
//       // Day already has first digit
//       else if (currentDay.length === 1) {
//         const firstDigit = parseInt(currentDay, 10);
//         let dayValue = parseInt(`${firstDigit}${digit}`, 10);
//         // Calculate max days based on month/year if available
//         let maxDays = 31; // Default
//         if (sections.month !== "MM" && sections.year !== "YYYY") {
//           const month = parseInt(sections.month, 10);
//           const year = parseInt(sections.year, 10);
//           maxDays = getMaxDaysInMonth(month, year);
//         }
//         // Validate day value
//         if (dayValue < 1) dayValue = 1;
//         if (dayValue > maxDays) dayValue = maxDays;
//         // Format with leading zero if needed
//         newSections.day = dayValue < 10 ? `0${dayValue}` : `${dayValue}`;
//         // Move to month section
//         setTimeout(() => {
//           setActiveSection(2);
//           selectSection(2);
//         }, 10);
//       }
//     }
//     // Month section (2)
//     else if (activeSection === 2) {
//       const currentMonth = sections.month === "MM" ? "" : sections.month;
//       // If month is empty or placeholder
//       if (!currentMonth) {
//         // If digit is 0, set to "01"
//         if (digit === 0) {
//           newSections.month = "01";
//           // Move to year section
//           setTimeout(() => {
//             setActiveSection(3);
//             selectSection(3);
//           }, 10);
//         }
//         // If digit > 1, prefix with 0 and move to year
//         else if (digit > 1) {
//           newSections.month = `0${digit}`;
//           // Move to year section
//           setTimeout(() => {
//             setActiveSection(3);
//             selectSection(3);
//           }, 10);
//         }
//         // Digit 1 waits for second digit
//         else {
//           newSections.month = `${digit}`;
//           // Don't move yet, but update section
//           setTimeout(() => selectSection(2), 10);
//         }
//       }
//       // Month already has first digit
//       else if (currentMonth.length === 1) {
//         const firstDigit = parseInt(currentMonth, 10);
//         let monthValue = parseInt(`${firstDigit}${digit}`, 10);
//         // Validate month value
//         if (monthValue < 1) monthValue = 1;
//         if (monthValue > 12) monthValue = 12;
//         // Format with leading zero if needed
//         newSections.month = monthValue < 10 ? `0${monthValue}` : `${monthValue}`;
//         // After setting valid month, check if day needs adjustment
//         if (newSections.day !== "DD" && newSections.year !== "YYYY") {
//           const day = parseInt(newSections.day, 10);
//           const month = monthValue;
//           const year = parseInt(newSections.year, 10);
//           const maxDays = getMaxDaysInMonth(month, year);
//           if (day > maxDays) {
//             newSections.day = maxDays < 10 ? `0${maxDays}` : `${maxDays}`;
//           }
//         }
//         // Move to year section
//         setTimeout(() => {
//           setActiveSection(3);
//           selectSection(3);
//         }, 10);
//       }
//     }
//     // Year section (3)
//     else if (activeSection === 3) {
//       const currentYear = sections.year === "YYYY" ? "" : sections.year;
//       const currentDate = new Date();
//       const currentFullYear = currentDate.getFullYear();
//       const maxYear = currentFullYear; // Limit to current year as per your disabled condition
//       // Progressive building of year
//       if (currentYear.length < 4) {
//         let newYear = currentYear + digit;
//         // When we have all 4 digits, validate the year
//         if (newYear.length === 4) {
//           const yearValue = parseInt(newYear, 10);
//           // Validate year (between 1900 and current year)
//           if (yearValue < 1900) newYear = "1900";
//           else if (yearValue > maxYear) newYear = `${maxYear}`;
//           // After setting valid year, check if day needs adjustment
//           if (newSections.day !== "DD" && newSections.month !== "MM") {
//             const day = parseInt(newSections.day, 10);
//             const month = parseInt(newSections.month, 10);
//             const year = parseInt(newYear, 10);
//             const maxDays = getMaxDaysInMonth(month, year);
//             if (day > maxDays) {
//               newSections.day = maxDays < 10 ? `0${maxDays}` : `${maxDays}`;
//             }
//           }
//         }
//         newSections.year = newYear;
//         // When done with year, try to create the date
//         if (newYear.length === 4) {
//           const dateString = `${newSections.day}/${newSections.month}/${newSections.year}`;
//           try {
//             const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());
//             if (isValid(parsedDate)) {
//               setDate(parsedDate);
//               form.setValue("datetime", parsedDate);
//             }
//           } catch (error) {
//             // Invalid date - no action needed here
//           }
//         }
//         setTimeout(() => selectSection(3), 10);
//       }
//     }
//     // Update sections
//     setSections(newSections);
//     // Update input value
//     setInputValue(`${newSections.day}/${newSections.month}/${newSections.year}`);
//   };

//   // Custom component to render the calendar navigation
//   const CalendarNavigation = () => (
//     <div className="flex items-center justify-between mb-1 px-1">
//       <Button variant="outline" size="icon" className="h-7 w-7 rounded-md p-0" onClick={handlePreviousMonth} type="button">
//         <ChevronLeft className="h-4 w-4" />
//         <span className="sr-only">Previous month</span>
//       </Button>
//       <div className="text-sm font-medium">{format(currentMonth, "MMMM yyyy")}</div>
//       <Button variant="outline" size="icon" className="h-7 w-7 rounded-md p-0" onClick={handleNextMonth} type="button">
//         <ChevronRight className="h-4 w-4" />
//         <span className="sr-only">Next month</span>
//       </Button>
//     </div>
//   );

//   return (
//     <>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//           <div className="flex w-full gap-4">
//             <FormField
//               control={form.control}
//               name="datetime"
//               render={({ field }) => (
//                 <FormItem className="flex flex-col w-full">
//                   <FormLabel>Date</FormLabel>
//                   <div className="relative">
//                     <Input
//                       ref={inputRef}
//                       type="text"
//                       className={cn("pr-10", isInputActive || inputValue !== "DD/MM/YYYY" ? "" : "text-muted-foreground")}
//                       value={inputValue}
//                       onClick={handleInputClick}
//                       onChange={handleInputChange}
//                       onFocus={handleInputFocus}
//                       onBlur={handleInputBlur}
//                       onKeyDown={handleKeyDown}
//                     />
//                     <Popover open={isOpen} onOpenChange={setIsOpen}>
//                       <PopoverTrigger asChild>
//                         <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
//                           <CalendarIcon className="h-4 w-4 opacity-50" />
//                         </Button>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-auto p-0" align="end">
//                         <div className="p-3">
//                           <CalendarNavigation />
//                           <Calendar
//                             mode="single"
//                             captionLayout="dropdown"
//                             selected={date || field.value}
//                             onSelect={(selectedDate) => {
//                               if (selectedDate) {
//                                 setDate(selectedDate);
//                                 field.onChange(selectedDate);
//                                 setCurrentMonth(selectedDate);
//                                 const formattedDate = format(selectedDate, "dd/MM/yyyy");
//                                 setInputValue(formattedDate);
//                                 setSections({
//                                   day: formattedDate.substring(0, 2),
//                                   month: formattedDate.substring(3, 5),
//                                   year: formattedDate.substring(6, 10),
//                                 });
//                               }
//                             }}
//                             onDayClick={() => setIsOpen(false)}
//                             fromYear={1900}
//                             toYear={new Date().getFullYear()}
//                             disabled={(date) => Number(date) > Date.now()}
//                             month={currentMonth}
//                             onMonthChange={setCurrentMonth}
//                             components={{
//                               CaptionLabel: () => <span />,
//                             }}
//                           />
//                         </div>
//                       </PopoverContent>
//                     </Popover>
//                   </div>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           <Button type="submit">Submit</Button>
//         </form>
//       </Form>
//     </>
//   );
// }
