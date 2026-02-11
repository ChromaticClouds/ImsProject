// @ts-check

import { AppDateRangePicker } from "@/components/common/app-date-range-picker.jsx";
import { useReceiveOrderFilterStore } from "../../stores/use-receive-order-filter-store.js";

export const SearchDateSection = () => {
  const { dateRange, setDateRange } = useReceiveOrderFilterStore();

  return (
    <div className='flex items-center gap-3 w-full xl:w-auto'>
      <AppDateRangePicker
        value={dateRange}
        onChange={setDateRange}
      />
    </div>
  );
};
