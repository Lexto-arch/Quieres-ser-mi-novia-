/**
 * Base de datos de los 1000 Motivos por los que Te Amo y Palabras de Amor
 * Organizado en constelaciones mágicas con textos poéticos, sinceros y profundos.
 */

const CONSTELLATIONS = [
  { id: 'mirada', name: 'Constelación de Tu Mirada', icon: '✨', color: '#10b981' },
  { id: 'sonrisa', name: 'Constelación de Tu Sonrisa', icon: '🌸', color: '#f472b6' },
  { id: 'fe', name: 'Constelación de Nuestra Fe en Dios', icon: '✝️', color: '#fbcfe8' },
  { id: 'alma', name: 'Constelación de Tu Hermosa Alma', icon: '💜', color: '#a855f7' },
  { id: 'memorias', name: 'Constelación de Nuestras Memorias', icon: '🍃', color: '#34d399' },
  { id: 'detalles', name: 'Constelación de los Pequeños Detalles', icon: '🌷', color: '#fb7185' },
  { id: 'futuro', name: 'Constelación de Nuestro Futuro', icon: '🌌', color: '#c084fc' },
  { id: 'destino', name: 'Constelación del Destino', icon: '💫', color: '#6ee7b7' }
];

// Semillas poéticas para generar y enriquecer los 1000 motivos de amor
const CURATED_REASONS = [
  {
    num: 1,
    title: "El regalo de Dios para mi vida",
    text: "«Doy gracias a mi Dios cada vez que me acuerdo de ti» (Filipenses 1:3). Porque le pedí a Dios a alguien especial y me bendijo contigo, superando todo lo que alguna vez soñé.",
    constellation: "fe",
    word: "Bendición"
  },
  {
    num: 2,
    title: "Tu risa que lo cura todo",
    text: "Por esa risa espontánea y contagiosa que tiene el poder de disipar hasta el día más nublado y gris de mi mente.",
    constellation: "sonrisa",
    word: "Alegría"
  },
  {
    num: 3,
    title: "Cordón de tres dobleces",
    text: "«Cordón de tres dobleces no se rompe pronto» (Eclesiastés 4:12). Porque nuestro amor tiene a Dios en el centro, y sé que tomados de Su mano nada nos podrá separar.",
    constellation: "fe",
    word: "Promesa"
  },
  {
    num: 4,
    title: "Tus ojos café con luz propia",
    text: "Porque cuando me miras con ternura, encuentro en tus pupilas un hogar donde no necesito fingir nada, solo ser yo.",
    constellation: "mirada",
    word: "Refugio"
  },
  {
    num: 5,
    title: "El amor que nunca deja de ser",
    text: "«El amor es sufrido, es benigno; el amor no tiene envidia, el amor no es jactancioso... el amor nunca deja de ser» (1 Corintios 13:4-8). Por enseñarme la forma más pura y sincera de amar.",
    constellation: "fe",
    word: "Eternidad"
  },
  {
    num: 6,
    title: "Orar juntos e ir a la iglesia",
    text: "Por la paz tan hermosa que siento cada vez que vamos juntos a la iglesia, cerramos los ojos y oramos el uno por el otro con devoción.",
    constellation: "fe",
    word: "Comunión"
  },
  {
    num: 7,
    title: "Toda tú eres hermosa",
    text: "«Toda tú eres hermosa, amiga mía, y en ti no hay mancha» (Cantares 4:7). Por tu belleza exterior pero sobre todo por la pureza y bondad infinita de tu corazón.",
    constellation: "fe",
    word: "Gracia"
  },
  {
    num: 8,
    title: "Tu corazón bondadoso",
    text: "Por la compasión infinita y la dulzura con la que tratas a quienes te rodean. Tienes una luz que abriga a todos.",
    constellation: "alma",
    word: "Bondad"
  },
  {
    num: 9,
    title: "Amor más fuerte que las aguas",
    text: "«Las muchas aguas no podrán apagar el amor, ni lo ahogarán los ríos» (Cantares 8:7). Porque este sentimiento que Dios plantó entre nosotros es inquebrantable.",
    constellation: "fe",
    word: "Fidelidad"
  },
  {
    num: 10,
    title: "Sobrepasas a todas",
    text: "«Muchas mujeres hicieron el bien; mas tú sobrepasas a todas» (Proverbios 31:29). Por ser una mujer sabia, noble, virtuosa y el tesoro más grande que tengo.",
    constellation: "fe",
    word: "Virtud"
  },
  {
    num: 11,
    title: "Nuestras pláticas eternas",
    text: "Por esas noches donde el tiempo pierde sentido hablando de todo y de nada, riéndonos hasta que nos duele el estómago.",
    constellation: "memorias",
    word: "Complicidad"
  },
  {
    num: 12,
    title: "Cómo me tomas de la mano",
    text: "Por la calidez de tus dedos entrelazados con los míos mientras caminamos; es la certeza más bonita de que no camino solo.",
    constellation: "detalles",
    word: "Paz"
  },
  {
    num: 13,
    title: "Soñar a tu lado",
    text: "Porque cualquier plan a futuro, por simple que sea, se vuelve mágico si estás tú en él.",
    constellation: "futuro",
    word: "Esperanza"
  },
  {
    num: 14,
    title: "Tu voz al despertar",
    text: "Por ese tono suave y adormilado que tienes por las mañanas, el sonido más dulce que mis oídos podrían desear.",
    constellation: "detalles",
    word: "Ternura"
  },
  {
    num: 15,
    title: "Tu fuerza y valentía",
    text: "Porque admiro profundamente tu determinación para salir adelante ante cualquier desafío. Eres mi mayor orgullo.",
    constellation: "alma",
    word: "Admiración"
  },
  {
    num: 16,
    title: "Tus abrazos que reconstruyen",
    text: "Porque cuando me abrazas con fuerza, todas mis piezas rotas encajan de nuevo en su lugar. No hay lugar más seguro.",
    constellation: "detalles",
    word: "Abrazo"
  },
  {
    num: 17,
    title: "Tu manera única de ver la vida",
    text: "Por tus ocurrencias, tu inteligencia y esa perspectiva tan hermosa y auténtica que tienes sobre las cosas.",
    constellation: "alma",
    word: "Autenticidad"
  },
  {
    num: 18,
    title: "El brillo de tu felicidad",
    text: "Porque ver tus ojos iluminarse cuando algo te emociona o te gusta es una de mis mayores dichas en este universo.",
    constellation: "mirada",
    word: "Felicidad"
  },
  {
    num: 19,
    title: "Los silencios cómodos",
    text: "Porque contigo el silencio nunca es incómodo; estar juntos en calma es suficiente para sentirnos completos.",
    constellation: "memorias",
    word: "Serenidad"
  },
  {
    num: 20,
    title: "Tu apoyo incondicional",
    text: "Porque crees en mí incluso cuando yo mismo dudo. Tu fe en mis sueños me da alas para volar.",
    constellation: "alma",
    word: "Apoyo"
  },
  {
    num: 21,
    title: "Bailar sin música",
    text: "Por esos momentos improvisados donde la única melodía es el latido de nuestros corazones sincronizados.",
    constellation: "memorias",
    word: "Magia"
  },
  {
    num: 22,
    title: "Tu aroma inolvidable",
    text: "Por ese perfume tan tuyo que se queda en mi ropa y en mi memoria, recordándome la suerte que tengo de tenerte.",
    constellation: "detalles",
    word: "Esencia"
  },
  {
    num: 23,
    title: "Cómo me haces reír",
    text: "Por tus caras graciosas, tus bromas secretas y ese sentido del humor que solo tú y yo comprendemos a la perfección.",
    constellation: "sonrisa",
    word: "Risa"
  },
  {
    num: 24,
    title: "Tus besos con calma",
    text: "Porque cada beso tuyo tiene el sabor a hogar y la suavidad de un suspiro que renueva mi alma.",
    constellation: "detalles",
    word: "Dulzura"
  },
  {
    num: 25,
    title: "La paz que me transmites",
    text: "Porque en medio del ruido y el caos del mundo, tú eres mi remanso de quietud y armonía.",
    constellation: "alma",
    word: "Calma"
  },
  {
    num: 26,
    title: "Caminar hacia el mismo horizonte",
    text: "Porque quiero envejecer a tu lado, coleccionar arrugas de tanto sonreír y seguir mirándote con el mismo amor de siempre.",
    constellation: "futuro",
    word: "Eternidad"
  }
];

// Generador poético enriquecido para completar los 1,000 motivos de manera única y profunda
const ADJETIVOS_AMOR = [
  "incondicional", "luminosa", "mágica", "infinita", "eterna", "profunda", "dulce", "cálida",
  "auténtica", "apasionada", "serena", "vibrante", "extraordinaria", "incomparable", "resplandeciente"
];

const ACCIONES_Y_DETALLES = [
  { action: "dar gracias a Dios cada noche por ponerte en mi camino", word: "Bendición", const: "fe" },
  { action: "la dulzura con la que me dices te amo", word: "Te Amo", const: "detalles" },
  { action: "orar juntos y sentir la presencia de Dios en nuestras vidas", word: "Oración", const: "fe" },
  { action: "la forma en que arrugas tu nariz al sonreír", word: "Ternura", const: "sonrisa" },
  { action: "cómo iluminas cualquier habitación en la que entras", word: "Luz", const: "mirada" },
  { action: "saber que nuestro amor es un cordón de tres dobleces con Dios", word: "Fe", const: "fe" },
  { action: "la paciencia y el cariño que siempre pones en nosotros", word: "Paciencia", const: "alma" },
  { action: "recordar cada anécdota y detalle de nuestros paseos", word: "Nostalgia", const: "memorias" },
  { action: "ir a la iglesia a tu lado y alabar a Dios tomados de la mano", word: "Comunión", const: "fe" },
  { action: "la forma en que arrugas tu nariz al sonreír", word: "Ternura", const: "sonrisa" },
  { action: "cómo iluminas cualquier habitación en la que entras", word: "Luz", const: "mirada" },
  { action: "la paciencia y el cariño que siempre pones en nosotros", word: "Paciencia", const: "alma" },
  { action: "recordar cada anécdota y detalle de nuestros paseos", word: "Nostalgia", const: "memorias" },
  { action: "imaginar una casa llena de plantas y risas contigo", word: "Hogar", const: "futuro" },
  { action: "saber que las estrellas conspiraron para cruzarnos", word: "Destino", const: "destino" },
  { action: "la ternura que transmites cuando acaricias mi cabello", word: "Caricia", const: "detalles" },
  { action: "cómo defiendes con pasión tus ideas y convicciones", word: "Firmeza", const: "alma" },
  { action: "la complicidad con la que nos entendemos solo con mirarnos", word: "Miradas", const: "mirada" },
  { action: "tus mensajes sorpresa que me alegran el mediodía", word: "Sorpresa", const: "detalles" },
  { action: "cómo me enseñas a ser mejor persona cada día", word: "Crecimiento", const: "alma" },
  { action: "los viajes que aún nos faltan por descubrir juntos", word: "Aventura", const: "futuro" },
  { action: "el brillo travieso que aparece en tus ojos al jugar", word: "Destello", const: "mirada" },
  { action: "nuestras canciones que son banda sonora de este amor", word: "Melodía", const: "memorias" },
  { action: "cómo me cuidas cuando me siento vulnerable o cansado", word: "Cuidado", const: "alma" },
  { action: "la sinceridad transparente que hay en cada una de tus palabras", word: "Verdad", const: "alma" },
  { action: "el calor de tu pecho cuando nos recostamos a descansar", word: "Abrigo", const: "detalles" },
  { action: "la emoción de planear nuestro próximo reencuentro", word: "Ilusión", const: "futuro" },
  { action: "que contigo el amor no pesa, sino que da alas", word: "Libertad", const: "destino" },
  { action: "tu capacidad inagotable de soñar en grande", word: "Sueños", const: "futuro" },
  { action: "las bromas que solo nosotros dos entendemos", word: "Secretos", const: "memorias" },
  { action: "la suavidad de tu piel bajo la luz de la luna", word: "Suavidad", const: "detalles" },
  { action: "la confianza absoluta que hemos construido paso a paso", word: "Confianza", const: "alma" },
  { action: "tu hermosa costumbre de encontrar belleza en lo simple", word: "Gratitud", const: "alma" }
];

const COMPLEMENTOS_POETICOS = [
  "y saber que en tus brazos he encontrado mi rincón favorito del universo.",
  "porque cada día a tu lado es un regalo que agradezco a la vida.",
  "recordándome que el amor verdadero es suave, paciente y sincero.",
  "haciendo que los momentos más sencillos se vuelvan inolvidables.",
  "demostrándome que elegirse todos los días es la decisión más hermosa.",
  "porque no imagino un futuro donde tus manos no sostengan las mías.",
  "y esa manera tan tuya de llenarme el alma de serenidad y alegría.",
  "haciendo que mi corazón lata más fuerte cada vez que pronuncio tu nombre.",
  "porque tú le das sentido a palabras como para siempre y eternidad.",
  "convirtiendo cada recuerdo a tu lado en un tesoro invaluable."
];

// Generar la lista completa de 1000 motivos
function generateAllReasons() {
  const reasons = [];

  // Agregar los primeros curados
  for (let i = 0; i < CURATED_REASONS.length; i++) {
    reasons.push(CURATED_REASONS[i]);
  }

  // Generar hasta 1000 motivos ricos, variados y poéticos
  for (let i = CURATED_REASONS.length + 1; i <= 1000; i++) {
    const item = ACCIONES_Y_DETALLES[(i - 1) % ACCIONES_Y_DETALLES.length];
    const comp = COMPLEMENTOS_POETICOS[(i * 3 + 7) % COMPLEMENTOS_POETICOS.length];
    const adj = ADJETIVOS_AMOR[(i * 5 + 2) % ADJETIVOS_AMOR.length];
    
    // Variaciones temáticas para que cada motivo suene fresco y romántico
    let text = "";
    const mod = i % 4;
    if (mod === 0) {
      text = `Por ${item.action}, ${comp}`;
    } else if (mod === 1) {
      text = `Por tu forma ${adj} de amar, manifestada en ${item.action}. Eres mi mayor bendición.`;
    } else if (mod === 2) {
      text = `Porque amo ${item.action}; es una de esas razones infinitas por las que te elijo hoy y siempre.`;
    } else {
      text = `Por el recuerdo de ${item.action}, ${comp}`;
    }

    reasons.push({
      num: i,
      title: `Motivo #${i}: ${item.word}`,
      text: text,
      constellation: item.const,
      word: item.word
    });
  }

  return reasons;
}

const ALL_REASONS = generateAllReasons();

// Exportar globalmente para su uso directo en scripts
window.CONSTELLATIONS = CONSTELLATIONS;
window.ALL_REASONS = ALL_REASONS;
