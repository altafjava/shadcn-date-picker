// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { format } from "date-fns";
// import { CalendarIcon } from "lucide-react";
// import { useState } from "react";
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
//   const form = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//   });

//   async function onSubmit(data: z.infer<typeof FormSchema>) {
//     toast.success(`Meeting at: ${format(data.datetime, "PPP, p")}`);
//   }

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
//                           {field.value ? `${format(field.value, "PPP")}` : <span>Pick a date</span>}
//                           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <Calendar
//                         mode="single"
//                         captionLayout="dropdown"
//                         selected={date || field.value}
//                         onSelect={(selectedDate) => {
//                           setDate(selectedDate!);
//                           field.onChange(selectedDate);
//                         }}
//                         onDayClick={() => setIsOpen(false)}
//                         fromYear={2000}
//                         toYear={new Date().getFullYear()}
//                         disabled={(date) =>
//                           Number(date) > Date.now()
//                         }
//                         defaultMonth={field.value}
//                       />
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
