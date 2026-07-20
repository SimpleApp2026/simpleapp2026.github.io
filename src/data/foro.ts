export interface Comentario { id: string; autor: string; texto: string }
export interface CartaPublica { id: string; autor: string; fecha: string; texto: string; comentarios: Comentario[] }
export interface CartaPrivada { id: string; de: string; fecha: string; texto: string }
export interface Conversacion { id: string; amigo: string; ultimo: string }

export const CARTAS_PUBLICAS: CartaPublica[] = [
  {
    id: 'oscar',
    autor: 'Oscar',
    fecha: '03/06/2026',
    texto: 'Mi nombre es Oscar, soy jubilado y todavía tengo mucho para contar. Me gusta caminar por el barrio, leer el diario en el café y conocer gente nueva. Ojalá podamos encontrarnos alguna tarde a conversar.',
    comentarios: [
      { id: 'c1', autor: 'Norma', texto: 'Hola Oscar, un gusto.' },
      { id: 'c2', autor: 'Andres', texto: 'Buenas tardes desde Recoleta.' },
      { id: 'c3', autor: 'Haydee', texto: '¡Qué lindo mensaje! Yo también camino todas las mañanas.' },
    ],
  },
  {
    id: 'susana',
    autor: 'Susana Martinez',
    fecha: '01/06/2026',
    texto: 'Buenas tardes, mi nombre es Susana Martinez, soy de Recoleta, una vecina de toda la vida. Espero llegar a quienes tienen el deseo de generar vínculos amistosos para así poder crear planes en conjunto y pasar el momento.',
    comentarios: [
      { id: 'c1', autor: 'Roberto', texto: '¡Bienvenida al foro, Susana!' },
    ],
  },
]

export const CARTAS_PRIVADAS: CartaPrivada[] = [
  {
    id: 'sergio',
    de: 'Sergio',
    fecha: '21/07/2026',
    texto: 'Hola Amiga, ¿cómo estás? Me acordé de vos mientras preparaba el desayuno. Quería saber cómo te sentías después de la gripe que tuviste. Está bravo el clima, hay que cuidarse mucho... Espero que ya estés recuperada. ¡Te mando un beso grande!',
  },
  {
    id: 'norma',
    de: 'Norma',
    fecha: '20/07/2026',
    texto: 'Ine, ¿cómo te va? Estuve organizando todo para la juntada del sábado. Ya hablé con las chicas y se suman casi todas. Vos traé esas tortas que te salen tan ricas y yo me encargo del mate y los bizcochos. ¡Va a estar hermoso!',
  },
  {
    id: 'roberto',
    de: 'Roberto',
    fecha: '19/07/2026',
    texto: 'Inés, ¿vamos a tomar un café hoy? Encontré una confitería nueva cerca de la plaza y tienen unas medialunas que no te podés perder. Avisame si podés a la tarde y paso a buscarte. Un abrazo grande.',
  },
]

export const CONVERSACIONES: Conversacion[] = [
  { id: 'sergio', amigo: 'Sergio', ultimo: 'Mañana te espero en el parque a las 15hs.' },
  { id: 'norma', amigo: 'Norma', ultimo: 'Ine, ¿cómo te va? Estuve organizando todo.' },
  { id: 'roberto', amigo: 'Roberto', ultimo: 'Inés, ¿vamos a tomar un café hoy?' },
]

export function getCartaPublica(id: string): CartaPublica | undefined {
  return CARTAS_PUBLICAS.find((c) => c.id === id)
}
export function getCartaPrivada(id: string): CartaPrivada | undefined {
  return CARTAS_PRIVADAS.find((c) => c.id === id)
}
