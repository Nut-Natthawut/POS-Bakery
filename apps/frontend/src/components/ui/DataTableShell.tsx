import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type DataTableShellProps = {
  title: string
  description?: string
  children: React.ReactNode
}

export const DataTableShell = ({
  title,
  description,
  children,
}: DataTableShellProps) => {
  return (
    <Card className="border-border/80 bg-card/90 py-0 shadow-[0_18px_40px_rgba(91,58,35,0.07)] backdrop-blur-xl">
      <CardHeader className="gap-1 px-5 pt-5">
        <CardTitle className="text-lg font-semibold tracking-normal text-foreground">
          {title}
        </CardTitle>
        {description ? (
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        ) : null}
      </CardHeader>

      <CardContent className="px-5 pb-5">{children}</CardContent>
    </Card>
  )
}
