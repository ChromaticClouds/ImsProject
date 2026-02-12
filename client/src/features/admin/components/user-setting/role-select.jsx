import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const ROLE_OPTIONS = [
  { value: "INBOUND", label: "입고 담당" },
  { value: "PLACE_ORDER", label: "발주 담당" },
  { value: "OUTBOUND", label: "출고 담당" },
  { value: "RECEIVE_ORDER", label: "수주 담당" },
];

/**
 * @param {{
 *  value: 'NONE' | 'INBOUND' | 'PLACE_ORDER' | 'OUTBOUND' | 'RECEIVE_ORDER' | 'ALL',
 *  onChange?: (role: string) => void
 * }} props
 */
export const RoleSelect = ({ value, onChange }) => {
  return (
    <Select
      defaultValue={value}
      onValueChange={(v) => onChange?.(v)}
    >
      <SelectTrigger className="h-9 w-full">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {ROLE_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
