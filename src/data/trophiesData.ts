import { TrophyDefinition } from '../types';

export const TROPHIES_LIST: TrophyDefinition[] = [
  {
    id: 'first_steps',
    title: 'Trofeo Primeros Pasos',
    description: '¡Por ganar tus primeras 5 estrellas mágicas!',
    icon: '🌟',
    tier: 'bronze',
    category: 'stars',
    targetCount: 5,
    quote: '¡El inicio de una gran aventura del abecedario!'
  },
  {
    id: 'star_collector_15',
    title: 'Trofeo Coleccionista de Estrellas',
    description: '¡Por acumular 15 estrellas brillantes!',
    icon: '⭐',
    tier: 'silver',
    category: 'stars',
    targetCount: 15,
    quote: '¡Tu brillo ilumina todo el alfabeto!'
  },
  {
    id: 'star_master_30',
    title: 'Copa de Oro Súper Estrella',
    description: '¡Por recolectar 30 estrellas de oro!',
    icon: '🏆',
    tier: 'gold',
    category: 'stars',
    targetCount: 30,
    quote: '¡Un verdadero campeón de las estrellas!'
  },
  {
    id: 'explorer_all_letters',
    title: 'Gran Trofeo Explorador del ABC',
    description: '¡Por escuchar y explorar las 27 letras del abecedario!',
    icon: '🧭',
    tier: 'gold',
    category: 'explorer',
    targetCount: 27,
    quote: '¡Conoces todo el mapa de la A a la Z!'
  },
  {
    id: 'find_letter_hero',
    title: 'Trofeo Ojo de Águila (Buscador)',
    description: '¡Por acertar 10 letras en el juego "¿Dónde está la letra?"!',
    icon: '🔍',
    tier: 'silver',
    category: 'find',
    targetCount: 10,
    quote: '¡Ninguna letra puede esconderse de ti!'
  },
  {
    id: 'match_master',
    title: 'Trofeo Maestro de Parejas',
    description: '¡Por completar 5 rondas uniendo Mayúsculas y Minúsculas!',
    icon: '🧩',
    tier: 'diamond',
    category: 'match',
    targetCount: 5,
    quote: '¡Uniste a cada letra grande con su compañera pequeña!'
  },
  {
    id: 'word_wizard',
    title: 'Trofeo Mago de las Palabras',
    description: '¡Por acertar 10 palabras con su letra inicial!',
    icon: '🪄',
    tier: 'rainbow',
    category: 'words',
    targetCount: 10,
    quote: '¡Sabes con qué letra empieza cada objeto del mundo!'
  },
  {
    id: 'streak_fire',
    title: 'Trofeo Racha de Fuego',
    description: '¡Por lograr una racha de 5 aciertos seguidos sin fallar!',
    icon: '🔥',
    tier: 'gold',
    category: 'streak',
    targetCount: 5,
    quote: '¡Imparable y súper concentrado!'
  },
  {
    id: 'grand_champion_crown',
    title: 'Corona Suprema del Abecedario',
    description: '¡Por dominar todos los juegos y superar 50 puntos!',
    icon: '👑',
    tier: 'crown',
    category: 'master',
    targetCount: 50,
    quote: '¡El Rey / La Reina de las Letras y la Lectura!'
  },
  {
    id: 'special_effort_award',
    title: 'Medalla de Honor al Esfuerzo',
    description: 'Premio especial por dedicación, alegría y constancia',
    icon: '🎖️',
    tier: 'rainbow',
    category: 'special',
    targetCount: 1,
    quote: '¡El corazón más valiente del aula!'
  }
];
