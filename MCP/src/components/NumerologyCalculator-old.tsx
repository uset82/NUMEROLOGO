'use client'

import React, { useState } from 'react'
import { useClientOnly } from '@/utils/clientOnly'
import { carlosManager } from '@/agents/carlos-manager'
import { numerologyLogicAgent } from '@/agents/numerology-logic'

interface NumerologyReport {
  // Números principales basados en el análisis competitivo
  numeroPersonal: number          // MI ESENCIA (Life Path)
  numeroDelAlma: number          // MI MISIÓN (Soul Urge)
  numeroDestino: number          // Destiny Number  
  numeroPersonalidad: number     // Personality Number
  anoPersonal: number           // MI AÑO (Personal Year)
  numeroPinaculo: number        // MI PINÁCULO
  
  // Energías del día/semana/mes (MI ENERGÍA DE HOY)
  diaPersonal: number
  semanaPersonal: number
  mesPersonal: number
  
  // Interpretaciones completas
  interpretaciones: {
    numeroPersonal: string
    numeroDelAlma: string
    numeroDestino: string
    numeroPersonalidad: string
    anoPersonal: string
    numeroPinaculo: string
    diaPersonal: string
    semanaPersonal: string
    mesPersonal: string
  }
  
  // Información adicional
  numerosMaestros: number[]
  recomendaciones: string[]
  compatibilidad: string
}

export function NumerologyCalculator() {
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [result, setResult] = useState<NumerologyReport | null>(null)
  const [calculating, setCalculating] = useState(false)
  const [currentYear] = useState(new Date().getFullYear())
  const isClient = useClientOnly()

  const calculateLifePathNumber = (date: string): number => {
    const digits = date.replace(/\D/g, '').split('').map(Number)
    let sum = digits.reduce((acc, digit) => acc + digit, 0)
    
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').map(Number).reduce((acc, digit) => acc + digit, 0)
    }
    
    return sum
  }

  const calculateNameNumber = (name: string): number => {
    const values: { [key: string]: number } = {
      A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
      J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
      S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
    }
    
    let sum = 0
    for (const char of name.toUpperCase().replace(/[^A-Z]/g, '')) {
      sum += values[char] || 0
    }
    
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').map(Number).reduce((acc, digit) => acc + digit, 0)
    }
    
    return sum
  }

  const calculateSoulUrgeNumber = (name: string): number => {
    const vowels = 'AEIOU'
    const values: { [key: string]: number } = {
      A: 1, E: 5, I: 9, O: 6, U: 3
    }
    
    let sum = 0
    for (const char of name.toUpperCase().replace(/[^A-Z]/g, '')) {
      if (vowels.includes(char)) {
        sum += values[char] || 0
      }
    }
    
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').map(Number).reduce((acc, digit) => acc + digit, 0)
    }
    
    return sum
  }

  const calculatePersonalityNumber = (name: string): number => {
    const vowels = 'AEIOU'
    const values: { [key: string]: number } = {
      A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
      J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
      S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
    }
    
    let sum = 0
    for (const char of name.toUpperCase().replace(/[^A-Z]/g, '')) {
      if (!vowels.includes(char)) {
        sum += values[char] || 0
      }
    }
    
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').map(Number).reduce((acc, digit) => acc + digit, 0)
    }
    
    return sum
  }

  const calculatePersonalYear = (birthDate: string, year: number): number => {
    const [birthYear, birthMonth, birthDay] = birthDate.split('-')
    const dateString = `${year}${birthMonth}${birthDay}`
    return calculateLifePathNumber(dateString)
  }

  const calculatePersonalDay = (birthDate: string): number => {
    const today = new Date()
    const dateString = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`
    return calculateLifePathNumber(dateString + birthDate.replace(/\D/g, ''))
  }

  const calculatePinnacleNumber = (birthDate: string): number => {
    const [year, month, day] = birthDate.split('-')
    const monthNum = calculateLifePathNumber(month)
    const dayNum = calculateLifePathNumber(day)
    return calculateLifePathNumber((monthNum + dayNum).toString())
  }

  const getSpanishInterpretation = (number: number, type: string): string => {
    const interpretations: { [key: string]: { [key: number]: string } } = {
      numeroPersonal: {
        1: "Eres un líder natural con una fuerte individualidad. Tu camino de vida está marcado por la innovación, la iniciativa y la capacidad de abrir nuevos senderos. Tienes el potencial de ser pionero en tu campo y inspirar a otros con tu determinación.",
        2: "Tu esencia se basa en la cooperación y la diplomacia. Eres un mediador natural que busca la armonía y el equilibrio. Tu sensibilidad te permite conectar profundamente con otros y crear vínculos duraderos.",
        3: "Posees un don natural para la comunicación y la creatividad. Tu optimismo y carisma iluminan cualquier ambiente. Estás destinado a expresar tu individualidad a través del arte, la palabra o cualquier forma de expresión creativa.",
        4: "Eres el constructor, la persona en quien otros confían para crear bases sólidas. Tu trabajo duro, disciplina y atención al detalle te permiten materializar proyectos duraderos. La estabilidad y la seguridad son fundamentales en tu vida.",
        5: "La libertad y la aventura definen tu esencia. Eres curioso, versátil y necesitas variedad en tu vida. Tu capacidad de adaptación te permite prosperar en situaciones cambiantes y explorar nuevos horizontes constantemente.",
        6: "El amor, la familia y la responsabilidad son el centro de tu existencia. Tienes un instinto natural para cuidar y nutrir a otros. Tu hogar es tu santuario y encuentras propósito en crear armonía y belleza en tu entorno.",
        7: "Eres el buscador de la verdad, el místico que busca respuestas profundas. Tu naturaleza introspectiva te lleva a explorar los misterios de la vida. La espiritualidad y el conocimiento son tus guías principales.",
        8: "El éxito material y el logro de metas ambiciosas caracterizan tu camino. Posees habilidades ejecutivas naturales y la determinación para alcanzar posiciones de poder e influencia. La abundancia es tu derecho de nacimiento.",
        9: "Eres el humanitario, el que sirve al bien común. Tu compasión y generosidad te impulsan a hacer del mundo un lugar mejor. Tu misión es inspirar y elevar a la humanidad a través de tu ejemplo y servicio.",
        11: "Como número maestro, posees una intuición extraordinaria y capacidades psíquicas naturales. Eres un canal de inspiración e iluminación para otros. Tu sensibilidad es tanto tu don como tu desafío.",
        22: "El Maestro Constructor, capaz de materializar sueños en gran escala. Combinas la visión del visionario con la practicidad del constructor. Tienes el potencial de crear algo que beneficie a la humanidad.",
        33: "El Maestro Sanador, cuya misión es elevar el nivel de conciencia de la humanidad a través del amor incondicional y la compasión. Tu presencia misma es sanadora y transformadora."
      },
      numeroDelAlma: {
        1: "Tu alma anhela liderazgo e independencia. Buscas ser reconocido como una autoridad en tu campo y necesitas la libertad para tomar tus propias decisiones.",
        2: "Tu alma busca armonía, amor y cooperación. Necesitas sentirte conectado con otros y crear relaciones significativas llenas de comprensión mutua.",
        3: "Tu alma vibra con la necesidad de expresión creativa y comunicación. Buscas alegría, diversión y la oportunidad de compartir tus talentos artísticos con el mundo.",
        4: "Tu alma desea orden, estabilidad y la satisfacción de construir algo duradero. Necesitas sentir que tu trabajo tiene propósito y contribuye a algo mayor.",
        5: "Tu alma anhela libertad, aventura y nuevas experiencias. Buscas variedad, viajes y la emoción de lo desconocido. La rutina es tu mayor enemigo.",
        6: "Tu alma busca amor, familia y la oportunidad de nutrir y cuidar a otros. El hogar, la belleza y la armonía son esenciales para tu bienestar espiritual.",
        7: "Tu alma busca sabiduría, comprensión profunda y conexión espiritual. Necesitas tiempo para la reflexión, el estudio y la exploración de los misterios de la vida.",
        8: "Tu alma desea éxito material, reconocimiento y la capacidad de influir en el mundo de manera significativa. Buscas poder y autoridad para crear cambios positivos.",
        9: "Tu alma vibra con el deseo de servir a la humanidad. Buscas oportunidades para hacer una diferencia en el mundo a través de la compasión y el servicio desinteresado.",
        11: "Tu alma busca inspiración espiritual y la oportunidad de ser un canal de luz para otros. Necesitas desarrollar tu intuición y confiar en tu guía interior.",
        22: "Tu alma desea crear algo grandioso que beneficie a la humanidad. Buscas la oportunidad de materializar visiones que puedan transformar el mundo.",
        33: "Tu alma vibra con el amor universal y el deseo de sanar y elevar a otros. Buscas ser un instrumento de paz y transformación en el mundo."
      },
      numeroDestino: {
        1: "Tu destino es liderar e innovar. Estás llamado a abrir nuevos caminos y ser pionero en tu campo. El universo te impulsa hacia posiciones de liderazgo donde puedas inspirar a otros.",
        2: "Tu destino es ser el mediador y constructor de puentes. Estás llamado a crear armonía, cooperar con otros y ser el pacificador en situaciones de conflicto.",
        3: "Tu destino es expresar, crear e inspirar. Estás llamado a usar tus talentos artísticos y comunicativos para iluminar y alegrar la vida de otros.",
        4: "Tu destino es construir y crear orden. Estás llamado a establecer bases sólidas, crear sistemas duraderos y ser el pilar de confiabilidad para otros.",
        5: "Tu destino es explorar y expandir horizontes. Estás llamado a ser el aventurero que descubre nuevas posibilidades y comparte la libertad con otros.",
        6: "Tu destino es nutrir y armonizar. Estás llamado a ser el sanador, el consejero y el creador de hogares llenos de amor y belleza.",
        7: "Tu destino es buscar y enseñar la verdad. Estás llamado a ser el filósofo, el investigador y el guía espiritual que ilumina los misterios de la existencia.",
        8: "Tu destino es materializar y lograr. Estás llamado a alcanzar el éxito material y usar tu poder e influencia para crear abundancia y oportunidades para otros.",
        9: "Tu destino es servir y elevar a la humanidad. Estás llamado a ser el humanitario que trabaja por el bien común y inspira a otros a través de tu compasión.",
        11: "Tu destino es inspirar e iluminar. Estás llamado a ser el visionario que trae nueva luz al mundo a través de tu intuición y sensibilidad espiritual.",
        22: "Tu destino es construir a gran escala. Estás llamado a materializar visiones grandiosas que puedan transformar la sociedad y beneficiar a la humanidad.",
        33: "Tu destino es sanar y transformar. Estás llamado a ser el maestro del amor que eleva la conciencia de la humanidad a través de tu compasión ilimitada."
      }
    }

    return interpretations[type]?.[number] || `Número ${number}: Una energía única que combina múltiples aspectos numerológicos.`
  }

  const getRecommendations = (report: NumerologyReport): string[] => {
    const recommendations = []
    
    if (report.numerosMaestros.length > 0) {
      recommendations.push(`Tienes números maestros (${report.numerosMaestros.join(', ')}), lo que indica un potencial espiritual especial. Dedica tiempo a la meditación y el desarrollo personal.`)
    }
    
    recommendations.push(`En tu año personal ${report.anoPersonal}, enfócate en ${getYearFocus(report.anoPersonal)}.`)
    recommendations.push(`Tu día personal ${report.diaPersonal} sugiere ${getDayGuidance(report.diaPersonal)}.`)
    
    return recommendations
  }

  const getYearFocus = (year: number): string => {
    const focuses: { [key: number]: string } = {
      1: "nuevos comienzos, iniciativas personales y establecer tu independencia",
      2: "cooperación, relaciones y paciencia en el desarrollo de proyectos",
      3: "creatividad, comunicación y expresión personal",
      4: "construcción, organización y establecimiento de bases sólidas",
      5: "cambios, libertad y nuevas experiencias",
      6: "responsabilidades familiares, hogar y servicios a otros",
      7: "introspección, estudio y desarrollo espiritual",
      8: "logros materiales, negocios y reconocimiento",
      9: "completar ciclos, servicio humanitario y preparación para nuevos comienzos"
    }
    
    return focuses[year] || "equilibrio y crecimiento personal"
  }

  const getDayGuidance = (day: number): string => {
    const guidance: { [key: number]: string } = {
      1: "es un día perfecto para liderar iniciativas y tomar decisiones importantes",
      2: "es ideal para colaborar, mediar y fortalecer relaciones",
      3: "es excelente para actividades creativas y comunicación",
      4: "es perfecto para trabajar duro y organizar aspectos prácticos",
      5: "es ideal para aventuras, cambios y nuevas experiencias",
      6: "es perfecto para dedicar tiempo a la familia y el hogar",
      7: "es ideal para la reflexión, el estudio y la búsqueda espiritual",
      8: "es excelente para negocios y asuntos materiales",
      9: "es perfecto para el servicio a otros y la generosidad"
    }
    
    return guidance[day] || "mantener equilibrio en todas las áreas de tu vida"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !birthDate) return

    setCalculating(true)

    try {
      // Cálculo directo (el sistema de agentes se puede usar como mejora futura)
      const numeroPersonal = calculateLifePathNumber(birthDate)
      const numeroDestino = calculateNameNumber(name)
      const numeroDelAlma = calculateSoulUrgeNumber(name)
      const numeroPersonalidad = calculatePersonalityNumber(name)
      const anoPersonal = calculatePersonalYear(birthDate, currentYear)
      const diaPersonal = calculatePersonalDay(birthDate)
      const numeroPinaculo = calculatePinnacleNumber(birthDate)
      
      const numerosMaestros = [numeroPersonal, numeroDestino, numeroDelAlma, numeroPersonalidad]
        .filter(num => [11, 22, 33].includes(num))

      const localResult: NumerologyReport = {
        numeroPersonal,
        numeroDelAlma,
        numeroDestino,
        numeroPersonalidad,
        anoPersonal,
        numeroPinaculo,
        diaPersonal,
        semanaPersonal: Math.floor(diaPersonal / 7) + 1,
        mesPersonal: new Date().getMonth() + 1,
        interpretaciones: {
          numeroPersonal: getSpanishInterpretation(numeroPersonal, 'numeroPersonal'),
          numeroDelAlma: getSpanishInterpretation(numeroDelAlma, 'numeroDelAlma'),
          numeroDestino: getSpanishInterpretation(numeroDestino, 'numeroDestino'),
          numeroPersonalidad: getSpanishInterpretation(numeroPersonalidad, 'numeroPersonalidad'),
          anoPersonal: `Tu año personal ${anoPersonal} te invita a ${getYearFocus(anoPersonal)}.`,
          numeroPinaculo: `Tu número del pináculo ${numeroPinaculo} representa el punto culminante de tu potencial.`,
          diaPersonal: `Hoy ${getDayGuidance(diaPersonal)}.`,
          semanaPersonal: `Esta semana está influenciada por energías de transformación y crecimiento.`,
          mesPersonal: `Este mes trae energías de expansión y nuevas oportunidades.`
        },
        numerosMaestros,
        recomendaciones: [],
        compatibilidad: "Análisis de compatibilidad disponible con datos adicionales."
      }
      
      localResult.recomendaciones = getRecommendations(localResult)
      setResult(localResult)

    } catch (error) {
      console.error('Error en el cálculo numerológico:', error)
    }

    setCalculating(false)
  }

  if (!isClient) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="numerology-card text-center">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Cargando Mapa Numerológico...
          </h2>
          <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="numerology-card text-center mb-8">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          🗺️ Mi Mapa Numerológico Completo
        </h2>
        <p className="text-gray-600 text-lg">
          Descubre los secretos de tu personalidad y destino a través de la numerología
        </p>
      </div>

      <form onSubmit={handleSubmit} className="numerology-card mb-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Tu nombre completo sin tildes"
              required
            />
          </div>
          
          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Nacimiento *
            </label>
            <input
              type="date"
              id="birthDate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={calculating || !name.trim() || !birthDate}
          className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          {calculating ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generando tu mapa numerológico...
            </span>
          ) : (
            '🔮 Descubrir Mis Números'
          )}
        </button>
      </form>

      {result && (
        <div className="space-y-8">
          {/* Resumen Principal */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="numerology-card text-center">
              <h3 className="text-lg font-semibold text-purple-700 mb-2">🌟 MI ESENCIA</h3>
              <div className="text-3xl font-bold text-purple-600 mb-2">{result.numeroPersonal}</div>
              <p className="text-sm text-gray-600">Número Personal</p>
            </div>
            
            <div className="numerology-card text-center">
              <h3 className="text-lg font-semibold text-indigo-700 mb-2">🎯 MI MISIÓN</h3>
              <div className="text-3xl font-bold text-indigo-600 mb-2">{result.numeroDelAlma}</div>
              <p className="text-sm text-gray-600">Número del Alma</p>
            </div>
            
            <div className="numerology-card text-center">
              <h3 className="text-lg font-semibold text-pink-700 mb-2">🗓️ MI AÑO {currentYear}</h3>
              <div className="text-3xl font-bold text-pink-600 mb-2">{result.anoPersonal}</div>
              <p className="text-sm text-gray-600">Año Personal</p>
            </div>
            
            <div className="numerology-card text-center">
              <h3 className="text-lg font-semibold text-emerald-700 mb-2">⛰️ MI PINÁCULO</h3>
              <div className="text-3xl font-bold text-emerald-600 mb-2">{result.numeroPinaculo}</div>
              <p className="text-sm text-gray-600">Punto Culminante</p>
            </div>
          </div>

          {/* MI ENERGÍA DE HOY */}
          <div className="numerology-card">
            <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              ⚡ MI ENERGÍA DE HOY
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-700 mb-2">Día Personal</h4>
                <div className="text-2xl font-bold text-orange-600">{result.diaPersonal}</div>
                <p className="text-sm text-orange-600 mt-2">{result.interpretaciones.diaPersonal}</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-700 mb-2">Semana Personal</h4>
                <div className="text-2xl font-bold text-yellow-600">{result.semanaPersonal}</div>
                <p className="text-sm text-yellow-600 mt-2">{result.interpretaciones.semanaPersonal}</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <h4 className="font-semibold text-amber-700 mb-2">Mes Personal</h4>
                <div className="text-2xl font-bold text-amber-600">{result.mesPersonal}</div>
                <p className="text-sm text-amber-600 mt-2">{result.interpretaciones.mesPersonal}</p>
              </div>
            </div>
          </div>

          {/* Interpretaciones Detalladas */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="numerology-card">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="text-2xl mr-2">🌟</span>
                Mi Esencia - Número Personal {result.numeroPersonal}
              </h3>
              <p className="text-purple-700 leading-relaxed">{result.interpretaciones.numeroPersonal}</p>
            </div>

            <div className="numerology-card">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="text-2xl mr-2">🎯</span>
                Mi Misión - Número del Alma {result.numeroDelAlma}
              </h3>
              <p className="text-indigo-700 leading-relaxed">{result.interpretaciones.numeroDelAlma}</p>
            </div>

            <div className="numerology-card">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="text-2xl mr-2">🚀</span>
                Mi Destino - Número {result.numeroDestino}
              </h3>
              <p className="text-pink-700 leading-relaxed">{result.interpretaciones.numeroDestino}</p>
            </div>

            <div className="numerology-card">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="text-2xl mr-2">🎭</span>
                Mi Personalidad - Número {result.numeroPersonalidad}
              </h3>
              <p className="text-emerald-700 leading-relaxed">{result.interpretaciones.numeroPersonalidad}</p>
            </div>
          </div>

          {/* Año Personal y Pináculo */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="numerology-card">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="text-2xl mr-2">🗓️</span>
                Mi Año {currentYear} - Personal {result.anoPersonal}
              </h3>
              <p className="text-pink-700 leading-relaxed">{result.interpretaciones.anoPersonal}</p>
            </div>

            <div className="numerology-card">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="text-2xl mr-2">⛰️</span>
                Mi Pináculo - Número {result.numeroPinaculo}
              </h3>
              <p className="text-emerald-700 leading-relaxed">{result.interpretaciones.numeroPinaculo}</p>
            </div>
          </div>

          {/* Números Maestros y Recomendaciones */}
          {result.numerosMaestros.length > 0 && (
            <div className="numerology-card">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="text-2xl mr-2">✨</span>
                Números Maestros Detectados
              </h3>
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg">
                <p className="text-amber-700 font-semibold mb-2">
                  Tienes números maestros: {result.numerosMaestros.join(', ')}
                </p>
                <p className="text-amber-600 text-sm">
                  Los números maestros indican un potencial espiritual especial y mayores responsabilidades kármicas.
                </p>
              </div>
            </div>
          )}

          <div className="numerology-card">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="text-2xl mr-2">💡</span>
              Recomendaciones Personalizadas
            </h3>
            <div className="space-y-3">
              {result.recomendaciones.map((rec, index) => (
                <div key={index} className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                  <p className="text-blue-700">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pie de página */}
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">
              ✨ Tu mapa numerológico ha sido generado con insights de https://numerologia-cotidiana.com ✨
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Basado en análisis competitivo y técnicas avanzadas de numerología
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default NumerologyCalculator
