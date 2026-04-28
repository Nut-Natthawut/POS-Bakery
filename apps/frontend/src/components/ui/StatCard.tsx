import { Card, CardContent } from "@/components/ui/card"

type StatCardProps = {
  label: string
  value: string
  helperText?: string
}

export const StatCard = ({
  label,
  value,
  helperText,
}: StatCardProps) => {
  return (
    <Card className="rounded-lg border border-black/8 bg-white/88 py-0 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      <CardContent className="space-y-3 px-5 py-5">
        <p className="text-sm font-medium text-black/50">{label}</p>
        <h2 className="text-3xl font-semibold tracking-normal text-[#1d1d1f]">
          {value}
        </h2>

        {helperText ? (
          <p className="text-sm leading-6 text-black/55">{helperText}</p>
        ) : null}
      </CardContent>
    </Card>
  )
}
