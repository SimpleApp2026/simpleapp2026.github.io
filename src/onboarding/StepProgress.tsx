export function StepProgress({ step, total }: { step: number; total: number }) {
  return (
    <div data-testid="step-progress" aria-label={`Paso ${step} de ${total}`}
      className="flex gap-2 px-6 pt-4">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`h-2 flex-1 rounded-full ${i < step ? 'bg-teal' : 'bg-chip/30'}`} />
      ))}
    </div>
  )
}
