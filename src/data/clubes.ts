export interface Post { id: string; autor: string; texto: string }
export interface Club { id: string; titulo: string; emoji: string; descripcion: string; posts: Post[] }

// Boards de clubes: 3 mensajes por club. Los de Lectura y Mascotas son los
// textos literales de los frames 60 del Figma; todos los autores tienen foto
// real (registro avatarDe) para que cada publicación muestre su avatar.
export const CLUBES: Club[] = [
  { id: 'lectura', titulo: 'Club de Lectura', emoji: '📚', descripcion: 'Historias para compartir.', posts: [
    { id: 'p1', autor: 'Marta', texto: 'Ayer volví a releer uno de mis libros favoritos, Casa tomada de Julio Cortázar, un libro lleno de historia de nuestro amado país.' },
    { id: 'p2', autor: 'Susana', texto: 'La lectura es algo que a mi edad se vuelve necesario. Nada como un domingo a la tarde con unos mates y un buen libro. Mi compañero de hoy fue: En Agosto nos vemos, de Márquez.' },
    { id: 'p3', autor: 'Oscar', texto: 'Hoy me compré un nuevo libro de poesía que no tenía y andaba buscando, Los versos del capitán.' },
  ] },
  { id: 'chisme', titulo: 'Club de chisme', emoji: '☕', descripcion: 'Charlas de todos los días.', posts: [
    { id: 'p1', autor: 'Norma', texto: '¿Vieron que abrieron una confitería nueva en la esquina de la plaza? Dicen que las medialunas son riquísimas.' },
    { id: 'p2', autor: 'Haydee', texto: 'Me contaron que la hija de la florista se casa en diciembre. ¡Dicen que la fiesta va a ser en el club del barrio!' },
    { id: 'p3', autor: 'Sergio', texto: 'El quiosquero de la esquina se jubila a fin de mes. Estaría lindo juntarnos a despedirlo, ¿no?' },
  ] },
  { id: 'musica', titulo: 'Club de música', emoji: '🎶', descripcion: 'Canciones y recuerdos.', posts: [
    { id: 'p1', autor: 'Roberto', texto: 'Hoy escuché un disco de Gardel que me hizo acordar a mi juventud. ¿Qué canción los lleva a otra época?' },
    { id: 'p2', autor: 'Haydee', texto: 'Yo sigo guardando mis vinilos de Mercedes Sosa. Cada vez que suena Gracias a la vida se me llenan los ojos.' },
    { id: 'p3', autor: 'Sergio', texto: '¿Alguien se anima a armar una tarde de tango? Yo llevo el bandoneón, aunque esté un poco desafinado.' },
  ] },
  { id: 'manualidades', titulo: 'Club de manualidades', emoji: '🎨', descripcion: 'Ideas, tips y proyectos hechos a mano.', posts: [
    { id: 'p1', autor: 'Elena', texto: 'Quería recomendar la tienda del barrio para comprar lanas a buen precio.' },
    { id: 'p2', autor: 'Marta', texto: 'Terminé el mantel bordado que empecé en el invierno. ¡Tres meses de trabajo pero quedó precioso!' },
    { id: 'p3', autor: 'Norma', texto: '¿Alguien tiene el patrón de la bufanda a dos agujas que mostraron en el taller? Quiero hacerla para mi nieto.' },
  ] },
  { id: 'cocina', titulo: 'Club de cocina', emoji: '🍳', descripcion: 'Recetas caseras y encuentros gastronómicos.', posts: [
    { id: 'p1', autor: 'Susana', texto: 'Hoy preparé una tarta de manzana, ¡quedó riquísima! ¿Quieren la receta?' },
    { id: 'p2', autor: 'Haydee', texto: 'Mi secreto para las empanadas jugosas: cortar la carne a cuchillo, como me enseñó mi mamá.' },
    { id: 'p3', autor: 'Roberto', texto: 'El domingo hago locro para toda la familia. Si alguien quiere la receta de mi abuela, la comparto con gusto.' },
  ] },
  { id: 'bienestar', titulo: 'Club de Bienestar', emoji: '🧘', descripcion: 'Movimiento, salud y buenos hábitos.', posts: [
    { id: 'p1', autor: 'Oscar', texto: 'Pequeño logro del día: caminé 30 minutos por la plaza. ¡De a poco se puede!' },
    { id: 'p2', autor: 'Elena', texto: 'Empecé las clases de stretching en Plaza Francia. La profesora Laura tiene una paciencia hermosa.' },
    { id: 'p3', autor: 'Norma', texto: 'Les comparto mi rutina: levantarme temprano, un buen desayuno y diez minutos de estiramiento. ¡Cambia el día entero!' },
  ] },
  { id: 'mascotas', titulo: 'Club de mascotas', emoji: '🐾', descripcion: 'Historias y consejos sobre nuestros compañeros.', posts: [
    { id: 'p1', autor: 'Norma', texto: '¿Alguien más tiene un perro que se cree dueño de la casa? ¡El mío ocupa todo el sillón y yo termino en la punta!' },
    { id: 'p2', autor: 'Roberto', texto: 'Les presento a Misha. Hace 12 años que me acompaña y sigue despertándome a las 6 am para salir a pasear. ¿Ustedes también tienen un compañero tan fiel?' },
    { id: 'p3', autor: 'Elena', texto: '¿Qué parques recomiendan para pasear tranquilos por Palermo? Estoy diagramando un buen recorrido para Pipa.' },
  ] },
]

export function getClub(id: string): Club | undefined {
  return CLUBES.find((c) => c.id === id)
}
