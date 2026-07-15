export interface LegalDocData { titulo: string; parrafos: string[] }

export const LEGAL: Record<'privacidad' | 'terminos' | 'objetivo', LegalDocData> = {
  privacidad: {
    titulo: 'Políticas de privacidad',
    parrafos: [
      'En +Simple queremos que disfrutes la app de manera segura, simple y acompañada. Al usar la plataforma aceptás nuestras condiciones de uso y privacidad.',
      'La información de tu perfil, mensajes y actividades se utiliza únicamente para mejorar tu experiencia dentro de la app y ayudarte a conectar con otras personas, descubrir actividades, oportunidades y beneficios cercanos.',
      'Tus conversaciones privadas no se comparten con otros usuarios ni con terceros. +Simple tampoco vende información personal.',
      'Podrás modificar o eliminar tu información personal cuando lo desees desde la configuración de tu cuenta. En +Simple queremos que disfrutes la app de manera segura, simple y acompañada.',
    ],
  },
  terminos: {
    titulo: 'Términos y condiciones',
    parrafos: [
      'Bienvenido/a a +Simple. Al utilizar la aplicación aceptás las condiciones de uso de la plataforma y el compromiso de mantener un espacio seguro, respetuoso y pensado para la comunidad.',
      '+Simple ofrece herramientas para conectar personas, participar en actividades, acceder a beneficios, explorar propuestas barriales y utilizar funciones de asistencia digital.',
      'Cada usuario es responsable de la información que comparte en su perfil, publicaciones, cartas y foros. No está permitido publicar contenido ofensivo, discriminatorio o engañoso.',
      'El uso de la plataforma implica la aceptación de estos términos y de nuestra política de privacidad.',
    ],
  },
  objetivo: {
    titulo: 'Objetivo de +Simple',
    parrafos: [
      'Creamos +Simple para que más personas puedan conectar, participar y sentirse parte de una manera simple, cercana y acompañada.',
      'Queremos que la tecnología se sienta amigable, útil y humana. Un espacio donde compartir intereses, descubrir actividades, encontrar oportunidades y generar nuevas conexiones sin sentirse solos ni perdidos.',
      'Nos encanta ver personas participando y ayudándose entre sí, conversaciones respetuosas y amables, nuevas amistades y encuentros, y ganas de aprender, compartir y descubrir.',
      'En +Simple creemos que las conexiones más importantes siguen siendo las humanas. ✨',
    ],
  },
}

export function getDoc(key: string): LegalDocData | undefined {
  return (LEGAL as Record<string, LegalDocData>)[key]
}
