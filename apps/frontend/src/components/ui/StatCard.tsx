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
    <article className="rounded-md border border-black/10 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-black/50">{label}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#1d1d1f]">
        {value}
      </h2>

      {helperText ? (
        <p className="mt-2 text-sm text-black/55">{helperText}</p>
      ) : null}
    </article>
  )
}
