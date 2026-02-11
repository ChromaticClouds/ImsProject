import { LeadTimeCalendarAction } from "./lead-time-calendar-action.jsx"
import { LeadTimeTypeAction } from "./lead-time-type-action.jsx"

export const LeadTimeAction = () => {
  return (
    <div className="flex gap-3">
      <LeadTimeCalendarAction />
      <LeadTimeTypeAction />
    </div>
  )
}