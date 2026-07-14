import type { ReactNode } from 'react'
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-neutral-200 flex justify-center">
      <div className="relative w-full max-w-[430px] min-h-screen bg-bg flex flex-col shadow-xl overflow-hidden">
        {children}
      </div>
    </div>
  )
}
