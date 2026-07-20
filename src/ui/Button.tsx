import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'gray'
const styles: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  secondary: 'bg-navy-800 text-white hover:bg-navy-900',
  ghost: 'bg-transparent text-primary border-2 border-primary',
  gray: 'bg-chip text-white hover:bg-navy-800',
}
export function Button(
  { variant = 'primary', className = '', ...props }:
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant },
) {
  return (
    <button
      className={`w-full rounded-full py-3 px-6 text-lg font-semibold transition
        disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    />
  )
}
