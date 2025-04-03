import { DatePicker } from "@/components/date-picker";

const DateTimePickerComp = () => {
  return (
    <div className="flex-1 m-20 flex flex-col gap-10 w-[400px]">
      <h2 className="text-xl font-bold mt-10">Datetime Picker</h2>
      <DatePicker />
    </div>
  );
};

export default DateTimePickerComp;
