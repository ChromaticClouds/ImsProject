import { Spinner } from "@/components/ui/spinner.js"

export const ChartLoading = () => {
  return (
    <div className="w-full h-full flex-1 flex justify-center items-center">
      <Spinner className="size-8" />
    </div>
  )
}