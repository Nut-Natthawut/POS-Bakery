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
    <section className="rounded-md border border-black/10 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[#1d1d1f]">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-black/55">{description}</p>
        ) : null}
      </div>

      <div className="overflow-x-auto">{children}</div>
    </section>
  )
}
