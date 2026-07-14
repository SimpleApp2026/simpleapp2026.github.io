import type { ReactNode } from 'react'
import { PhoneFrame } from '../layout/PhoneFrame'

export function OnboardingScreen(
  { children, footer, className = '' }:
  { children: ReactNode; footer?: ReactNode; className?: string },
) {
  return (
    <PhoneFrame>
      <div className={`flex-1 overflow-y-auto ${className}`}>{children}</div>
      {footer && (
        <div className="bg-navy-900 text-white text-center px-6 pt-8 pb-6 rounded-t-[3rem] text-lg font-medium">
          {footer}
        </div>
      )}
    </PhoneFrame>
  )
}
