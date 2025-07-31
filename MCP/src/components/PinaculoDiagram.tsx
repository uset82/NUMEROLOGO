'use client'

import React, { useState, useEffect } from 'react'
import { PinnacleStructure, PinaculoCalculator, PinaculoResults } from '@/types/pinaculo'

interface PinaculoDiagramProps {
  birthDay?: number
  birthMonth?: number
  birthYear?: number
  name?: string
}

function PinaculoDiagram({ birthDay, birthMonth, birthYear, name }: PinaculoDiagramProps) {
  const [structure, setStructure] = useState<PinnacleStructure | null>(null)
  const [calculations, setCalculations] = useState<PinaculoResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null)
        // Load structure from JSON file
        const response = await fetch('/data/pinaculo-structure.json')
        const structureData: PinnacleStructure = await response.json()
        setStructure(structureData)
      } catch (error) {
        console.error('Error loading Pináculo structure:', error)
        setError(error instanceof Error ? error.message : 'Error desconocido cargando la estructura')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    if (birthDay && birthMonth && birthYear && name) {
      const calc = PinaculoCalculator.calculateComplete(name, birthDay, birthMonth, birthYear)
      setCalculations(calc)
    }
  }, [birthDay, birthMonth, birthYear, name])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-lg text-gray-600">Cargando tu Diagrama del Pináculo...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error cargando el Pináculo</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (!structure || !calculations || !birthDay || !birthMonth || !birthYear) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🎭</span>
        </div>
        <p className="text-blue-800 text-lg">
          ¡Tu Diagrama del Pináculo está listo!
        </p>
        <p className="text-blue-600 mt-2">
          Ingresa tu nombre y fecha de nacimiento arriba para ver tu mapa numerológico personalizado.
        </p>
      </div>
    )
  }

  const renderDiagram = () => {
    if (!calculations) return null

    // Number circle component matching reference style
    const NumberCircle = ({ 
      number, 
      letter, 
      label = '',
      color, 
      size = 'w-12 h-12',
      textColor = 'text-white'
    }: { 
      number: number, 
      letter: string, 
      label?: string,
      color: string,
      size?: string,
      textColor?: string
    }) => (
      <div className="relative flex flex-col items-center">
        <div className={`${size} ${color} rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity shadow-lg border-2 border-gray-200`}>
          <span className={`${textColor} font-bold text-lg`}>{number}</span>
        </div>
        <div className="text-sm font-bold mt-1 text-gray-900 bg-white/90 px-2 py-1 rounded shadow-sm border mobile-label">{letter}</div>
        <div className="text-xs text-gray-700 mt-0.5 text-center bg-white/80 px-1 rounded max-w-24 truncate shadow-sm">{label}</div>
      </div>
    )

    // W Triplicidad from PPT formula
    const W = calculations.W || 0;

    return (
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        {/* Main Pyramid Diagram - Exact pinnacle.png Layout */}
        <div className="flex-1 flex justify-center overflow-x-auto">
          <div className="relative min-w-max" style={{ width: '700px', height: '600px' }}>
            
            {/* TOP LEVEL - H (TU DESTINO) */}
            <div className="absolute" style={{ top: '0px', left: '50%', transform: 'translateX(-50%)' }}>
              <NumberCircle 
                number={calculations.H} 
                letter="H" 
                label="TU DESTINO"
                color="bg-green-500"
              />
            </div>

            {/* SECOND LEVEL - G and J */}
            <div className="absolute" style={{ top: '80px', left: '30%', transform: 'translateX(-50%)' }}>
              <NumberCircle 
                number={calculations.G} 
                letter="G" 
                label="RE-IDENTIFICACIÓN"
                color="bg-green-400"
              />
            </div>
            <div className="absolute" style={{ top: '80px', left: '70%', transform: 'translateX(-50%)' }}>
              <NumberCircle 
                number={calculations.J} 
                letter="J" 
                label="MI ESPEJO"
                color="bg-green-400"
              />
            </div>

            {/* THIRD LEVEL - E, I, F */}
            <div className="absolute" style={{ top: '160px', left: '20%', transform: 'translateX(-50%)' }}>
              <NumberCircle 
                number={calculations.E} 
                letter="E" 
                label="IMPLANTACIÓN"
                color="bg-green-300"
              />
            </div>
            <div className="absolute" style={{ top: '160px', left: '50%', transform: 'translateX(-50%)' }}>
              <NumberCircle 
                number={calculations.I} 
                letter="I" 
                label="SUBCONSCIENTE"
                color="bg-green-300"
              />
            </div>
            <div className="absolute" style={{ top: '160px', left: '80%', transform: 'translateX(-50%)' }}>
              <NumberCircle 
                number={calculations.F} 
                letter="F" 
                label="ENCUENTRO MAESTRO"
                color="bg-green-300"
              />
            </div>

            {/* CENTER DIAMOND - A, B, C, D */}
            <div className="absolute" style={{ top: '240px', left: '15%', transform: 'translateX(-50%)' }}>
              <NumberCircle 
                number={calculations.A} 
                letter="A" 
                label="TAREA PENDIENTE"
                color="bg-purple-400"
              />
            </div>
            <div className="absolute" style={{ top: '240px', left: '40%', transform: 'translateX(-50%)' }}>
              <NumberCircle 
                number={calculations.B} 
                letter="B" 
                label="MI ESENCIA"
                color="bg-purple-400"
              />
            </div>
            <div className="absolute" style={{ top: '240px', left: '60%', transform: 'translateX(-50%)' }}>
              <NumberCircle 
                number={calculations.C} 
                letter="C" 
                label="VIDA PASADA"
                color="bg-purple-400"
              />
            </div>
            <div className="absolute" style={{ top: '240px', left: '85%', transform: 'translateX(-50%)' }}>
              <NumberCircle 
                number={calculations.D} 
                letter="D" 
                label="MI MÁSCARA"
                color="bg-purple-400"
              />
            </div>

            {/* LOWER LEVEL 1 - K, O, L */}
            <div className="absolute" style={{ top: '320px', left: '25%', transform: 'translateX(-50%)' }}>
              <NumberCircle 
                number={calculations.K} 
                letter="K" 
                label="ADOLESCENCIA"
                color="bg-red-500"
              />
            </div>
            <div className="absolute" style={{ top: '320px', left: '50%', transform: 'translateX(-50%)' }}>
              <NumberCircle 
                number={calculations.O} 
                letter="O" 
                label="INCONSCIENTE NEG."
                color="bg-red-500"
              />
            </div>
            <div className="absolute" style={{ top: '320px', left: '75%', transform: 'translateX(-50%)' }}>
              <NumberCircle 
                number={calculations.L} 
                letter="L" 
                label="JUVENTUD"
                color="bg-red-500"
              />
            </div>

            {/* LOWER LEVEL 2 - M */}
            <div className="absolute" style={{ top: '400px', left: '50%', transform: 'translateX(-50%)' }}>
              <NumberCircle 
                number={calculations.M} 
                letter="M" 
                label="ADULTEZ"
                color="bg-red-400"
              />
            </div>

            {/* W (TRIPLICIDAD) - LEFT SIDE */}
            {W !== 0 && (
              <div className="absolute" style={{ top: '320px', left: '5%', transform: 'translateX(-50%)' }}>
                <NumberCircle 
                  number={W} 
                  letter="W" 
                  label="TRIPLICIDAD"
                  color="bg-red-600"
                />
              </div>
            )}

            {/* LOWER LEVEL 3 - P, N */}
            <div className="absolute" style={{ top: '400px', left: '30%', transform: 'translateX(-50%)' }}>
              <NumberCircle 
                number={calculations.P} 
                letter="P" 
                label="MI SOMBRA"
                color="bg-red-400"
              />
            </div>
            <div className="absolute" style={{ top: '400px', left: '70%', transform: 'translateX(-50%)' }}>
              <NumberCircle 
                number={calculations.N} 
                letter="N" 
                label="ADULTO MAYOR"
                color="bg-red-400"
              />
            </div>

            {/* BOTTOM LEVEL - Q, R, S */}
            <div className="absolute" style={{ top: '480px', left: '25%', transform: 'translateX(-50%)' }}>
              <NumberCircle 
                number={calculations.Q} 
                letter="Q" 
                label="SER INFERIOR 1"
                color="bg-red-300"
              />
            </div>
            <div className="absolute" style={{ top: '480px', left: '50%', transform: 'translateX(-50%)' }}>
              <NumberCircle 
                number={calculations.R} 
                letter="R" 
                label="SER INFERIOR 2"
                color="bg-red-300"
              />
            </div>
            <div className="absolute" style={{ top: '480px', left: '75%', transform: 'translateX(-50%)' }}>
              <NumberCircle 
                number={calculations.S} 
                letter="S" 
                label="SER INFERIOR 3"
                color="bg-red-300"
              />
            </div>

            {/* Full Connecting Lines - Exact from pinnacle.png */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
              {/* H to G/J */}
              <line x1="50%" y1="30" x2="30%" y2="110" stroke="#3B82F6" strokeWidth="2" />
              <line x1="50%" y1="30" x2="70%" y2="110" stroke="#3B82F6" strokeWidth="2" />
              
              {/* G to E/I */}
              <line x1="30%" y1="110" x2="20%" y2="190" stroke="#3B82F6" strokeWidth="2" />
              <line x1="30%" y1="110" x2="50%" y2="190" stroke="#3B82F6" strokeWidth="2" />
              
              {/* J to I/F */}
              <line x1="70%" y1="110" x2="50%" y2="190" stroke="#3B82F6" strokeWidth="2" />
              <line x1="70%" y1="110" x2="80%" y2="190" stroke="#3B82F6" strokeWidth="2" />
              
              {/* E to A */}
              <line x1="20%" y1="190" x2="15%" y2="270" stroke="#3B82F6" strokeWidth="2" />
              
              {/* I to B */}
              <line x1="50%" y1="190" x2="40%" y2="270" stroke="#3B82F6" strokeWidth="2" />
              
              {/* F to C */}
              <line x1="80%" y1="190" x2="60%" y2="270" stroke="#3B82F6" strokeWidth="2" />
              
              {/* J to D diagonal */}
              <line x1="70%" y1="110" x2="85%" y2="270" stroke="#3B82F6" strokeWidth="2" />
              
              {/* Center diamond */}
              <line x1="15%" y1="270" x2="40%" y2="270" stroke="#3B82F6" strokeWidth="2" />
              <line x1="40%" y1="270" x2="60%" y2="270" stroke="#3B82F6" strokeWidth="2" />
              <line x1="60%" y1="270" x2="85%" y2="270" stroke="#3B82F6" strokeWidth="2" />
              
              {/* Center to lower K/O/L */}
              <line x1="15%" y1="270" x2="25%" y2="350" stroke="#3B82F6" strokeWidth="2" />
              <line x1="40%" y1="270" x2="25%" y2="350" stroke="#3B82F6" strokeWidth="2" />
              <line x1="40%" y1="270" x2="50%" y2="350" stroke="#3B82F6" strokeWidth="2" />
              <line x1="60%" y1="270" x2="50%" y2="350" stroke="#3B82F6" strokeWidth="2" />
              <line x1="60%" y1="270" x2="75%" y2="350" stroke="#3B82F6" strokeWidth="2" />
              <line x1="85%" y1="270" x2="75%" y2="350" stroke="#3B82F6" strokeWidth="2" />
              
              {/* Lower to M */}
              <line x1="25%" y1="350" x2="50%" y2="430" stroke="#3B82F6" strokeWidth="2" />
              <line x1="50%" y1="350" x2="50%" y2="430" stroke="#3B82F6" strokeWidth="2" />
              <line x1="75%" y1="350" x2="50%" y2="430" stroke="#3B82F6" strokeWidth="2" />
              
              {/* M to P/N */}
              <line x1="50%" y1="430" x2="30%" y2="430" stroke="#3B82F6" strokeWidth="2" />
              <line x1="50%" y1="430" x2="70%" y2="430" stroke="#3B82F6" strokeWidth="2" />
              
              {/* P/N to Q/R/S */}
              <line x1="30%" y1="430" x2="25%" y2="510" stroke="#3B82F6" strokeWidth="2" />
              <line x1="30%" y1="430" x2="50%" y2="510" stroke="#3B82F6" strokeWidth="2" />
              <line x1="70%" y1="430" x2="50%" y2="510" stroke="#3B82F6" strokeWidth="2" />
              <line x1="70%" y1="430" x2="75%" y2="510" stroke="#3B82F6" strokeWidth="2" />
              
              {/* W connection to K */}
              <line x1="5%" y1="350" x2="25%" y2="350" stroke="#3B82F6" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Legend/Descriptions Panel from PPT */}
        <div className="w-full lg:w-1/3 lg:pl-6">
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-3">Tu Pináculo Personal (PPT CLASE 1)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span>A. Tarea No Aprendida</span>
                  </div>
                  <span className="font-bold text-purple-600">{calculations.A}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span>B. Mi Esencia</span>
                  </div>
                  <span className="font-bold text-blue-600">{calculations.B}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-400 rounded-full mr-2"></div>
                    <span>C. Vida Pasada</span>
                  </div>
                  <span className="font-bold text-purple-600">{calculations.C}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 ${calculations.D === 22 ? 'bg-yellow-600' : 'bg-purple-600'} rounded-full mr-2`}></div>
                    <span>D. Mi Máscara</span>
                  </div>
                  <span className={`font-bold ${calculations.D === 22 ? 'text-yellow-600' : 'text-purple-600'}`}>{calculations.D}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                    <span>I. Núm. del Subconsciente</span>
                  </div>
                  <span className="font-bold text-yellow-600">{calculations.I}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 ${calculations.J === 11 ? 'bg-yellow-500' : 'bg-blue-600'} rounded-full mr-2`}></div>
                    <span>J. Número del Inconsciente</span>
                  </div>
                  <span className={`font-bold ${calculations.J === 11 ? 'text-yellow-600' : 'text-blue-600'}`}>{calculations.J}</span>
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-bold text-red-800 mb-3">Números Negativos</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span>P. Mi Sombra</span>
                  </div>
                  <span className="font-bold text-red-600">{calculations.P}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
                    <span>O. Número de Inconsciente Negativo</span>
                  </div>
                  <span className="font-bold text-red-600">{calculations.O}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
                    <span>Q. Ser Inferior 1</span>
                  </div>
                  <span className="font-bold text-red-600">{calculations.Q}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
                    <span>R. Ser Inferior 2</span>
                  </div>
                  <span className="font-bold text-red-600">{calculations.R}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 ${calculations.S === 11 ? 'bg-yellow-600' : 'bg-red-600'} rounded-full mr-2`}></div>
                    <span>S. Ser Inferior 3</span>
                  </div>
                  <span className={`font-bold ${calculations.S === 11 ? 'text-yellow-600' : 'text-red-600'}`}>{calculations.S}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-900 mb-2">🎭 DIAGRAMA DEL PINÁCULO</h3>
        <p className="text-gray-600">
          Visualización interactiva de tu mapa numerológico basado en tu fecha de nacimiento.
        </p>
      </div>

      {/* Main Diagram */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        {renderDiagram()}
      </div>

      {/* Detailed Descriptions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Life Stages */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl border border-green-200 shadow-lg">
          <h4 className="font-bold text-green-800 mb-4 flex items-center text-lg">
            <div className="w-6 h-6 bg-green-600 rounded-full mr-3"></div>
            Etapas de Realización
          </h4>
          <div className="space-y-3">
            <div className="bg-white/80 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">E. Primera Realización</span>
                <span className="text-xl font-bold text-green-600">{calculations.E}</span>
              </div>
              <p className="text-sm text-gray-600">Edad: 0-27 años - Formación de la personalidad</p>
            </div>
            <div className="bg-white/80 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">F. Segunda Realización</span>
                <span className="text-xl font-bold text-green-600">{calculations.F}</span>
              </div>
              <p className="text-sm text-gray-600">Edad: 28-36 años - Desarrollo profesional</p>
            </div>
            <div className="bg-white/80 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">G. Tercera Realización</span>
                <span className="text-xl font-bold text-green-600">{calculations.G}</span>
              </div>
              <p className="text-sm text-gray-600">Edad: 37-45 años - Madurez y consolidación</p>
            </div>
            <div className="bg-white/80 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">H. Destino Final</span>
                <span className="text-xl font-bold text-blue-600">{calculations.H}</span>
              </div>
              <p className="text-sm text-gray-600">Edad: 46+ años - Propósito de vida</p>
            </div>
          </div>
        </div>

        {/* Core Identity */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl border border-blue-200 shadow-lg">
          <h4 className="font-bold text-blue-800 mb-4 flex items-center text-lg">
            <div className="w-6 h-6 bg-blue-600 rounded-full mr-3"></div>
            Identidad Central
          </h4>
          <div className="space-y-3">
            <div className="bg-white/80 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">A. Número de Karma</span>
                <span className="text-xl font-bold text-green-600">{calculations.A}</span>
              </div>
              <p className="text-sm text-gray-600">Mi tarea pendiente - Lo que vine a aprender</p>
            </div>
            <div className="bg-white/80 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">B. Número Personal</span>
                <span className="text-xl font-bold text-blue-600">{calculations.B}</span>
              </div>
              <p className="text-sm text-gray-600">¿Quién soy? - Mi verdadera esencia</p>
            </div>
            <div className="bg-white/80 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">C. Vida Pasada</span>
                <span className="text-xl font-bold text-green-600">{calculations.C}</span>
              </div>
              <p className="text-sm text-gray-600">¿Quién fui? - Experiencias anteriores</p>
            </div>
            <div className="bg-white/80 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">D. Personalidad</span>
                <span className="text-xl font-bold text-purple-600">{calculations.D}</span>
              </div>
              <p className="text-sm text-gray-600">Mi máscara - Cómo me ven otros</p>
            </div>
          </div>
        </div>

        {/* Hidden Aspects */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-xl border border-purple-200 shadow-lg">
          <h4 className="font-bold text-purple-800 mb-4 flex items-center text-lg">
            <div className="w-6 h-6 bg-purple-600 rounded-full mr-3"></div>
            Aspectos Profundos
          </h4>
          <div className="space-y-3">
            <div className="bg-white/80 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">I. Subconsciente</span>
                <span className="text-xl font-bold text-purple-600">{calculations.I}</span>
              </div>
              <p className="text-sm text-gray-600">La guía a mi destino - Intuición interna</p>
            </div>
            <div className="bg-white/80 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">J. Inconsciente</span>
                <span className="text-xl font-bold text-blue-600">{calculations.J}</span>
              </div>
              <p className="text-sm text-gray-600">Mi espejo - Reflejo interno</p>
            </div>
            <div className="bg-white/80 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">P. Sombra</span>
                <span className="text-xl font-bold text-red-600">{calculations.P}</span>
              </div>
              <p className="text-sm text-gray-600">Número de sombra - Aspectos ocultos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PinaculoDiagram
