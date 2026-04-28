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
    <Card className="rounded-lg border border-black/8 bg-white/88 py-0 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      <CardHeader className="gap-1 px-5 pt-5">
        <CardTitle className="text-lg font-semibold tracking-normal text-[#1d1d1f]">
          {title}
        </CardTitle>
        {description ? (
          <p className="text-sm leading-6 text-black/55">{description}</p>
        ) : null}
      </CardHeader>

      <CardContent className="px-5 pb-5">{children}</CardContent>
    </Card>
  )
}
