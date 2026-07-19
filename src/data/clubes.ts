export interface Post { id: string; autor: string; texto: string }
export interface Club { id: string; titulo: string; emoji: string; descripcion: string; posts: Post[] }

export const CLUBES: Club[] = [
  { id: 'lectura', titulo: 'Club de Lectura', emoji: '📚', descripcion: 'Historias para compartir.', posts: [
    { id: 'p1', autor: 'Marta', texto: 'Ayer volví a releer uno de mis libros favoritos. ¿Qué están leyendo ustedes?' },
    { id: 'p2', autor: 'Jorge', texto: 'Les recomiendo empezar con cuentos cortos, se disfrutan mucho.' },
  ] },
  { id: 'chisme', titulo: 'Club de chisme', emoji: '☕', descripcion: 'Charlas de todos los días.', posts: [
    { id: 'p1', autor: 'Norma', texto: '¿Vieron que abrieron una confitería nueva en la esquina de la plaza? Dicen que las medialunas son riquísimas.' },
  ] },
  { id: 'musica', titulo: 'Club de música', emoji: '🎶', descripcion: 'Canciones y recuerdos.', posts: [
    { id: 'p1', autor: 'Roberto', texto: 'Hoy escuché un disco de Gardel que me hizo acordar a mi juventud. ¿Qué canción los lleva a otra época?' },
  ] },
  { id: 'manualidades', titulo: 'Club de manualidades', emoji: '🎨', descripcion: 'Ideas, tips y proyectos hechos a mano.', posts: [
    { id: 'p1', autor: 'Elena', texto: 'Quería recomendar la tienda del barrio para comprar lanas a buen precio.' },
  ] },
  { id: 'cocina', titulo: 'Club de cocina', emoji: '🍳', descripcion: 'Recetas caseras y encuentros gastronómicos.', posts: [
    { id: 'p1', autor: 'Susana', texto: 'Hoy preparé una tarta de manzana, ¡quedó riquísima! ¿Quieren la receta?' },
  ] },
  { id: 'bienestar', titulo: 'Club de Bienestar', emoji: '🧘', descripcion: 'Movimiento, salud y buenos hábitos.', posts: [
    { id: 'p1', autor: 'Raúl', texto: 'Pequeño logro del día: caminé 30 minutos por la plaza. ¡De a poco se puede!' },
  ] },
  { id: 'mascotas', titulo: 'Club de mascotas', emoji: '🐾', descripcion: 'Historias y consejos sobre nuestros compañeros.', posts: [
    { id: 'p1', autor: 'Delia', texto: '¿Alguien más tiene un perro que ladra cuando suena el teléfono? 😄' },
  ] },
]

export function getClub(id: string): Club | undefined {
  return CLUBES.find((c) => c.id === id)
}
