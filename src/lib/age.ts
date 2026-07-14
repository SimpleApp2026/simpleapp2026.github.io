const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']

function parse(iso: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return isNaN(dt.getTime()) ? null : dt
}

export function ageFromIso(iso: string, today: Date = new Date()): number | null {
  const b = parse(iso)
  if (!b) return null
  let age = today.getFullYear() - b.getFullYear()
  const before = today.getMonth() < b.getMonth() || (today.getMonth() === b.getMonth() && today.getDate() < b.getDate())
  if (before) age -= 1
  return age
}

export function formatLongDate(iso: string): string {
  const d = parse(iso)
  if (!d) return ''
  return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`
}
