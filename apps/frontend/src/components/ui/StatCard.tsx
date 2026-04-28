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
    <Card className="border-border/80 bg-card/90 py-0 shadow-[0_18px_40px_rgba(91,58,35,0.07)] backdrop-blur-xl">
      <CardContent className="space-y-3 px-5 py-5">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <h2 className="text-3xl font-semibold tracking-normal text-foreground">
          {value}
        </h2>

        {helperText ? (
          <p className="text-sm leading-6 text-muted-foreground">{helperText}</p>
        ) : null}
      </CardContent>
    </Card>
  )
}
