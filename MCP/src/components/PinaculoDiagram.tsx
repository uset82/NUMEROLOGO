'use client'

import React, { useState, useEffect } from 'react'
import { PinaculoStructure, PinaculoCalculator, loadPinaculoStructure } from '@/types/pinaculo'

interface PinaculoDiagramProps {
  birthDay?: number
  birthMonth?: number
  birthYear?: number
  name?: string
}

function PinaculoDiagram({ birthDay, birthMonth, birthYear, name }: PinaculoDiagramProps) {
  const [structure, setStructure] = useState<PinaculoStructure | null>(null)
  const [calculations, setCalculations] = useState<Record<string, number> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = () => {
      try {
        setError(null)
        const structureData = loadPinaculoStructure()
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
    if (birthDay && birthMonth && birthYear) {
      const calc = PinaculoCalculator.calculateAllPositions(birthDay, birthMonth, birthYear)
      setCalculations(calc)
    }
  }, [birthDay, birthMonth, birthYear])

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

  return (
    <div className="space-y-8">
      {/* Main Pinaculo Display - Matches Competitor Layout */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <div className="flex flex-wrap">
          {/* Pinaculo Grid - Exactly like competitor */}
          <div className="w-full lg:w-2/3 mb-6 lg:mb-0">
            <div className="grid grid-cols-6 gap-2 text-center" style={{ minHeight: '300px' }}>
              {/* Row 1 - Top */}
              <div className="col-span-6 flex justify-center mb-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                    <span className="text-white font-bold text-lg">{calculations.H}</span>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600">H</div>
                </div>
              </div>

              {/* Row 2 */}
              <div></div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors">
                    <span className="text-white font-bold">{calculations.G}</span>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-green-600">G</div>
                </div>
              </div>
              <div></div>
              <div></div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-600 transition-colors">
                    <span className="text-white font-bold">{calculations.I}</span>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-purple-600">I</div>
                </div>
              </div>
              <div></div>

              {/* Row 3 */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors">
                    <span className="text-white font-bold">{calculations.E}</span>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-green-600">E</div>
                </div>
              </div>
              <div></div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors">
                    <span className="text-white font-bold">{calculations.F}</span>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-green-600">F</div>
                </div>
              </div>
              <div></div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                    <span className="text-white font-bold">{calculations.J}</span>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600">J</div>
                </div>
              </div>
              <div></div>

              {/* Row 4 - Main Row */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-700 transition-colors">
                    <span className="text-white font-bold text-lg">{calculations.A}</span>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-green-600">A</div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                    <span className="text-white font-bold text-lg">{calculations.B}</span>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600">B</div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-700 transition-colors">
                    <span className="text-white font-bold text-lg">{calculations.C}</span>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-green-600">C</div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors">
                    <span className="text-white font-bold text-lg">{calculations.D}</span>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-purple-600">D</div>
                </div>
              </div>
              <div></div>
              <div></div>

              {/* Row 5 - Challenge Numbers */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors">
                    <span className="text-white font-bold text-sm">{calculations.K}</span>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-red-600">K</div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors">
                    <span className="text-white font-bold text-sm">{calculations.O}</span>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-red-600">O</div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
                    <span className="text-white font-bold text-sm">{calculations.L}</span>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-red-600">L</div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-8 h-8 bg-red-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-800 transition-colors">
                    <span className="text-white font-bold text-sm">{calculations.M}</span>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-red-700">M</div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-8 h-8 bg-red-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-800 transition-colors">
                    <span className="text-white font-bold text-sm">{calculations.N}</span>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-red-700">N</div>
                </div>
              </div>
              <div></div>

              {/* Row 6 - Bottom challenges */}
              <div></div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors">
                    <span className="text-white font-bold text-sm">{calculations.Q}</span>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-red-600">Q</div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
                    <span className="text-white font-bold text-sm">{calculations.R}</span>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-red-600">R</div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-8 h-8 bg-red-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-800 transition-colors">
                    <span className="text-white font-bold text-sm">{calculations.S}</span>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-red-700">S</div>
                </div>
              </div>
              <div></div>
              <div></div>

              {/* Row 7 - Final challenges */}
              <div></div>
              <div></div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
                    <span className="text-white font-bold text-sm">{calculations.P}</span>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-red-600">P</div>
                </div>
              </div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>

          {/* Legend/Descriptions Panel */}
          <div className="w-full lg:w-1/3 lg:pl-6">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-3">Tu Pináculo Personal</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                      <span>A. Número de Karma - Mi tarea pendiente</span>
                    </div>
                    <span className="font-bold text-green-600">{calculations.A}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                      <span>B. Número personal - ¿Quién soy?</span>
                    </div>
                    <span className="font-bold text-blue-600">{calculations.B}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                      <span>C. Número de vida pasada - ¿Quién fui?</span>
                    </div>
                    <span className="font-bold text-green-600">{calculations.C}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-600 rounded-full mr-2"></div>
                      <span>D. Número de personalidad - Mi máscara</span>
                    </div>
                    <span className="font-bold text-purple-600">{calculations.D}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                      <span>I. Núm. del subconsciente - La guía a mi destino</span>
                    </div>
                    <span className="font-bold text-purple-600">{calculations.I}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span>J. Número del Inconsciente - Mi espejo</span>
                    </div>
                    <span className="font-bold text-blue-600">{calculations.J}</span>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-bold text-red-800 mb-3">Desafíos y Sombras</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                      <span>P. Número de sombra</span>
                    </div>
                    <span className="font-bold text-red-600">{calculations.P}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      <span>O. Número de inconsciente Negativo</span>
                    </div>
                    <span className="font-bold text-red-600">{calculations.O}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      <span>Q. Ser inferior heredado por familia</span>
                    </div>
                    <span className="font-bold text-red-600">{calculations.Q}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                      <span>R. Ser inferior consciente</span>
                    </div>
                    <span className="font-bold text-red-600">{calculations.R}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-700 rounded-full mr-2"></div>
                      <span>S. Ser inferior latente</span>
                    </div>
                    <span className="font-bold text-red-600">{calculations.S}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
