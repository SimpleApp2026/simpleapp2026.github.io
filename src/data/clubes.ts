export interface ComentarioClub { id: string; autor: string; texto: string }
export interface Post { id: string; autor: string; texto: string; comentarios: ComentarioClub[] }
export interface Club { id: string; titulo: string; emoji: string; descripcion: string; posts: Post[] }

// Boards de clubes: 3 mensajes por club, cada uno con su hilo de comentarios
// (botón "comentarios" del frame 60 del Figma). Los posts de Lectura y
// Mascotas y el del Teatro Colón —con sus 2 comentarios— son textos literales
// del Figma. Todos los autores tienen foto real (registro avatarDe).
export const CLUBES: Club[] = [
  { id: 'lectura', titulo: 'Club de Lectura', emoji: '📚', descripcion: 'Historias para compartir.', posts: [
    { id: 'p1', autor: 'Marta', texto: 'Ayer volví a releer uno de mis libros favoritos, Casa tomada de Julio Cortázar, un libro lleno de historia de nuestro amado país.', comentarios: [
      { id: 'c1', autor: 'Norma', texto: '¡Qué buen cuento! Lo leí hace años y todavía me da escalofríos.' },
    ] },
    { id: 'p2', autor: 'Susana', texto: 'La lectura es algo que a mi edad se vuelve necesario. Nada como un domingo a la tarde con unos mates y un buen libro. Mi compañero de hoy fue: En Agosto nos vemos, de Márquez.', comentarios: [
      { id: 'c1', autor: 'Haydee', texto: 'El mate y un libro, no hay mejor plan para el domingo.' },
    ] },
    { id: 'p3', autor: 'Oscar', texto: 'Hoy me compré un nuevo libro de poesía que no tenía y andaba buscando, Los versos del capitán.', comentarios: [
      { id: 'c1', autor: 'Marta', texto: 'Neruda nunca falla. ¡Después contanos cuál te gustó más!' },
    ] },
  ] },
  { id: 'chisme', titulo: 'Club de chisme', emoji: '☕', descripcion: 'Charlas de todos los días.', posts: [
    { id: 'p1', autor: 'Norma', texto: '¿Vieron que abrieron una confitería nueva en la esquina de la plaza? Dicen que las medialunas son riquísimas.', comentarios: [
      { id: 'c1', autor: 'Susana', texto: '¡Fui ayer! Las de manteca están espectaculares.' },
      { id: 'c2', autor: 'Roberto', texto: 'Habrá que ir a comprobarlo personalmente…' },
    ] },
    { id: 'p2', autor: 'Haydee', texto: 'Me contaron que la hija de la florista se casa en diciembre. ¡Dicen que la fiesta va a ser en el club del barrio!', comentarios: [
      { id: 'c1', autor: 'Norma', texto: '¡Qué alegría! Esa chica se merece lo mejor.' },
    ] },
    { id: 'p3', autor: 'Sergio', texto: 'El quiosquero de la esquina se jubila a fin de mes. Estaría lindo juntarnos a despedirlo, ¿no?', comentarios: [
      { id: 'c1', autor: 'Elena', texto: 'Me sumo, don Carlos siempre fue muy amable con todos.' },
    ] },
  ] },
  { id: 'musica', titulo: 'Club de música', emoji: '🎶', descripcion: 'Canciones y recuerdos.', posts: [
    { id: 'p1', autor: 'Roberto', texto: 'Hoy escuché un disco de Gardel que me hizo acordar a mi juventud. ¿Qué canción los lleva a otra época?', comentarios: [
      { id: 'c1', autor: 'Haydee', texto: 'A mí "El día que me quieras" me devuelve a los bailes del club.' },
    ] },
    { id: 'p2', autor: 'Haydee', texto: 'Yo sigo guardando mis vinilos de Mercedes Sosa. Cada vez que suena Gracias a la vida se me llenan los ojos.', comentarios: [
      { id: 'c1', autor: 'Oscar', texto: 'Esa voz no se repite más. ¡Qué artista enorme!' },
    ] },
    // Post y comentarios literales del Figma (hilo de comentarios abierto)
    { id: 'p3', autor: 'Marta', texto: 'Conseguí entradas para este sábado en el Teatro Colón, el réquiem de Mozart, ¿quién de aquí va?', comentarios: [
      { id: 'c1', autor: 'Elena', texto: '¡Yo voy con mi hermana!' },
      { id: 'c2', autor: 'Sergio', texto: 'Yo iré con un viejo amigo que vino de visita' },
    ] },
  ] },
  { id: 'manualidades', titulo: 'Club de manualidades', emoji: '🎨', descripcion: 'Ideas, tips y proyectos hechos a mano.', posts: [
    { id: 'p1', autor: 'Elena', texto: 'Quería recomendar la tienda del barrio para comprar lanas a buen precio.', comentarios: [
      { id: 'c1', autor: 'Norma', texto: '¡Gracias por el dato! Justo necesitaba lana para la mantita.' },
    ] },
    { id: 'p2', autor: 'Marta', texto: 'Terminé el mantel bordado que empecé en el invierno. ¡Tres meses de trabajo pero quedó precioso!', comentarios: [
      { id: 'c1', autor: 'Haydee', texto: '¡Tenés que traerlo al taller para que lo veamos!' },
    ] },
    { id: 'p3', autor: 'Norma', texto: '¿Alguien tiene el patrón de la bufanda a dos agujas que mostraron en el taller? Quiero hacerla para mi nieto.', comentarios: [
      { id: 'c1', autor: 'Elena', texto: 'Yo lo tengo anotado, el jueves te lo llevo.' },
    ] },
  ] },
  { id: 'cocina', titulo: 'Club de cocina', emoji: '🍳', descripcion: 'Recetas caseras y encuentros gastronómicos.', posts: [
    { id: 'p1', autor: 'Susana', texto: 'Hoy preparé una tarta de manzana, ¡quedó riquísima! ¿Quieren la receta?', comentarios: [
      { id: 'c1', autor: 'Norma', texto: '¡Sí, por favor! La mía siempre queda seca.' },
      { id: 'c2', autor: 'Sergio', texto: 'Yo me anoto para probarla más que para cocinarla…' },
    ] },
    { id: 'p2', autor: 'Haydee', texto: 'Mi secreto para las empanadas jugosas: cortar la carne a cuchillo, como me enseñó mi mamá.', comentarios: [
      { id: 'c1', autor: 'Roberto', texto: 'Así las hacía mi vieja también. ¡No hay comparación!' },
    ] },
    { id: 'p3', autor: 'Roberto', texto: 'El domingo hago locro para toda la familia. Si alguien quiere la receta de mi abuela, la comparto con gusto.', comentarios: [
      { id: 'c1', autor: 'Susana', texto: '¡Me encantaría! El locro casero es otra cosa.' },
    ] },
  ] },
  { id: 'bienestar', titulo: 'Club de Bienestar', emoji: '🧘', descripcion: 'Movimiento, salud y buenos hábitos.', posts: [
    { id: 'p1', autor: 'Oscar', texto: 'Pequeño logro del día: caminé 30 minutos por la plaza. ¡De a poco se puede!', comentarios: [
      { id: 'c1', autor: 'Elena', texto: '¡Muy bien Oscar! Mañana te acompaño si querés.' },
    ] },
    { id: 'p2', autor: 'Elena', texto: 'Empecé las clases de stretching en Plaza Francia. La profesora Laura tiene una paciencia hermosa.', comentarios: [
      { id: 'c1', autor: 'Susana', texto: 'Yo voy los miércoles, ¡nos vemos ahí!' },
    ] },
    { id: 'p3', autor: 'Norma', texto: 'Les comparto mi rutina: levantarme temprano, un buen desayuno y diez minutos de estiramiento. ¡Cambia el día entero!', comentarios: [
      { id: 'c1', autor: 'Haydee', texto: 'Voy a probar lo del estiramiento, gracias Norma.' },
    ] },
  ] },
  { id: 'mascotas', titulo: 'Club de mascotas', emoji: '🐾', descripcion: 'Historias y consejos sobre nuestros compañeros.', posts: [
    { id: 'p1', autor: 'Norma', texto: '¿Alguien más tiene un perro que se cree dueño de la casa? ¡El mío ocupa todo el sillón y yo termino en la punta!', comentarios: [
      { id: 'c1', autor: 'Roberto', texto: '¡Igual que Misha! Al final el sillón es de ellos.' },
    ] },
    { id: 'p2', autor: 'Roberto', texto: 'Les presento a Misha. Hace 12 años que me acompaña y sigue despertándome a las 6 am para salir a pasear. ¿Ustedes también tienen un compañero tan fiel?', comentarios: [
      { id: 'c1', autor: 'Elena', texto: '¡Qué hermosa Misha! Doce años de amor puro.' },
      { id: 'c2', autor: 'Norma', texto: 'Los perros son los relojes más fieles que existen.' },
    ] },
    { id: 'p3', autor: 'Elena', texto: '¿Qué parques recomiendan para pasear tranquilos por Palermo? Estoy diagramando un buen recorrido para Pipa.', comentarios: [
      { id: 'c1', autor: 'Oscar', texto: 'El Rosedal temprano a la mañana es una maravilla.' },
    ] },
  ] },
]

export function getClub(id: string): Club | undefined {
  return CLUBES.find((c) => c.id === id)
}
