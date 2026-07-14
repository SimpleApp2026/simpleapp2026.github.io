import { ScreenHeader } from '../layout/ScreenHeader'
export function Placeholder({ title }: { title: string }) {
  return (
    <>
      <ScreenHeader title={title} />
      <div className="p-6 text-lg text-ink/70">{title} — Próximamente</div>
    </>
  )
}
