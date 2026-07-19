// Fotos de usuarios reales del Figma (images-figma/Fotos de usuarios),
// procesadas como PNG circulares. Mapa nombre → asset empaquetado.
import susana from '../assets/img/avatar-susana.png'
import oscar from '../assets/img/avatar-oscar.png'
import sergio from '../assets/img/avatar-sergio.png'
import roberto from '../assets/img/avatar-roberto.png'
import norma from '../assets/img/avatar-norma.png'
import haydee from '../assets/img/avatar-haydee.png'
import marta from '../assets/img/avatar-marta.png'
import elena from '../assets/img/avatar-elena.png'

const AVATARES: Record<string, string> = {
  Susana: susana,
  Oscar: oscar,
  Sergio: sergio,
  Roberto: roberto,
  Norma: norma,
  Haydee: haydee,
  Marta: marta,
  Elena: elena,
}

/** Devuelve la foto del Figma para un nombre conocido ("Susana Martinez" matchea "Susana"). */
export function avatarDe(nombre?: string | null): string | undefined {
  if (!nombre) return undefined
  return AVATARES[nombre] ?? AVATARES[nombre.trim().split(/\s+/)[0]]
}
