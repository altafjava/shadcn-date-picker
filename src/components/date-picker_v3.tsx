// "use client";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { addMonths, format, subMonths } from "date-fns";
// import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import { z } from "zod";
// import { cn } from "../lib/utils";
// import { Button } from "./ui/button";
// import { Calendar } from "./ui/calendar";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
// import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

// const FormSchema = z.object({
//   datetime: z.date({
//     required_error: "Date & time is required!.",
//   }),
// });

// export function DateTimePickerV2() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [date, setDate] = useState<Date | null>(null);
//   const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

//   const form = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//   });

//   // Effect to update currentMonth when selected date changes
//   useEffect(() => {
//     if (date) {
//       setCurrentMonth(date);
//     }
//   }, [date]);

//   // Also update currentMonth when the form value changes
//   useEffect(() => {
//     const value = form.getValues("datetime");
//     if (value) {
//       setCurrentMonth(value);
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

//   // Format the date to display as DD/MM/YYYY or full format
//   const formatDisplayDate = (date: Date) => {
//     // Option 1: DD/MM/YYYY format
//     return format(date, "dd/MM/yyyy");

//     // Option 2: 26 March, 2015 format
//     // return format(date, "d MMMM, yyyy");
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
//                   <Popover open={isOpen} onOpenChange={setIsOpen}>
//                     <PopoverTrigger asChild>
//                       <FormControl>
//                         <Button variant={"outline"} className={cn("w-full font-normal", !field.value && "text-muted-foreground")}>
//                           {field.value ? formatDisplayDate(field.value) : <span>Pick a date</span>}
//                           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <div className="p-3">
//                         <CalendarNavigation />
//                         <Calendar
//                           mode="single"
//                           captionLayout="dropdown"
//                           selected={date || field.value}
//                           onSelect={(selectedDate) => {
//                             if (selectedDate) {
//                               setDate(selectedDate);
//                               field.onChange(selectedDate);
//                               setCurrentMonth(selectedDate); // Update current month when date is selected
//                             }
//                           }}
//                           onDayClick={() => setIsOpen(false)}
//                           fromYear={2000}
//                           toYear={new Date().getFullYear()}
//                           disabled={(date) => Number(date) > Date.now()}
//                           month={currentMonth}
//                           onMonthChange={setCurrentMonth}
//                           components={{
//                             // Empty caption to prevent duplicate month/year display
//                             CaptionLabel: () => <span />,
//                           }}
//                         />
//                       </div>
//                     </PopoverContent>
//                   </Popover>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="datetime"
//               render={({ field }) => (
//                 <FormItem className="flex flex-col">
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
