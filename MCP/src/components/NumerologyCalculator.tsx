'use client'

import React, { useState, useEffect } from 'react'
import { useClientOnly } from '@/utils/clientOnly'
import { numerologyLogicAgent } from '@/agents/numerology-logic'
import type { NumerologyReport } from '@/agents/numerology-logic'
import PinaculoDiagram from './PinaculoDiagram'

interface NumerologyCalculatorProps {
  isPreviewMode?: boolean
  isDraggableMode?: boolean
}

export function NumerologyCalculator({ isPreviewMode = false, isDraggableMode = false }: NumerologyCalculatorProps) {
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [result, setResult] = useState<NumerologyReport | null>(null)
  const [calculating, setCalculating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isClient = useClientOnly()

  // Preview mode data
  const previewData = {
    name: 'Carlos Carpio',
    birthDate: '06/05/1982'
  }

  // Auto-calculate in preview mode
  useEffect(() => {
    if (isPreviewMode && isClient && !result) {
      handleCalculate(true)
    }
  }, [isPreviewMode, isClient])

  const handleCalculate = async (isPreview = false) => {
    const currentName = isPreview ? previewData.name : name
    const currentBirthDate = isPreview ? previewData.birthDate : birthDate
    
    if (!isPreview) {
      if (!currentName.trim() || !currentBirthDate) {
        setError('Por favor ingresa tu nombre completo y fecha de nacimiento')
        return
      }

      // Validate date format
      const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/
      if (!dateRegex.test(currentBirthDate)) {
        setError('Por favor ingresa la fecha en formato DD/MM/YYYY (ejemplo: 06/05/1982)')
        return
      }
    }

    setCalculating(true)
    setError(null)
    
    try {
      console.log('🔮 Calculando tu Mapa Numerológico...')
      
      const report = await numerologyLogicAgent.generateReport({
        name: currentName.trim(),
        birthDate: currentBirthDate
      })
      
      setResult(report)
      console.log('✅ Cálculo completado:', report)
      
    } catch (err) {
      console.error('❌ Error en el cálculo:', err)
      setError('Error al calcular tu mapa numerológico. Por favor intenta nuevamente.')
    } finally {
      setCalculating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleCalculate(false)
  }

  if (!isClient) {
    return (
      <div className={`${isDraggableMode ? 'p-4' : 'min-h-screen'} bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center`}>
        <div className="numerology-card max-w-md mx-auto p-8">
          <div className="animate-pulse">
            <div className="h-6 bg-purple-200 rounded mb-4"></div>
            <div className="h-4 bg-purple-200 rounded mb-2"></div>
            <div className="h-4 bg-purple-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${isDraggableMode ? 'p-2' : 'min-h-screen'} bg-gradient-to-br from-purple-50 to-indigo-100 ${isDraggableMode ? '' : 'py-12 px-4'}`}>
      <div className={`${isDraggableMode ? '' : 'max-w-4xl mx-auto'}`}>
        
        {/* Header */}
        {!isDraggableMode && (
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-purple-900 mb-4">
              🔮 MI MAPA NUMEROLÓGICO
            </h1>
            <p className="text-xl text-purple-700">
              Sistema del Pináculo - Cálculos Exactos
            </p>
          </div>
        )}

        {/* Input Form */}
        <div className="numerology-card mb-8">
          {isPreviewMode && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center text-yellow-800">
                <span className="mr-2">👁️</span>
                <strong>Modo Vista Previa:</strong> Mostrando ejemplo con datos de muestra
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-purple-900 mb-2">
                👤 Nombre Completo
              </label>
              <input
                type="text"
                id="name"
                value={isPreviewMode ? previewData.name : name}
                onChange={(e) => !isPreviewMode && setName(e.target.value)}
                placeholder="Ej: CARLOS CARPIO"
                className={`w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-medium ${
                  isPreviewMode ? 'bg-gray-100 cursor-not-allowed text-gray-700' : 'bg-white text-gray-900'
                }`}
                required
                disabled={isPreviewMode}
              />
              {isPreviewMode && (
                <p className="text-sm text-gray-600 mt-1">
                  Datos de ejemplo. Cambia a "Mi Cálculo Personal" para ingresar tus datos.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="birthDate" className="block text-lg font-medium text-purple-900 mb-2">
                📅 Fecha de Nacimiento
              </label>
              <input
                type="text"
                id="birthDate"
                value={isPreviewMode ? previewData.birthDate : birthDate}
                onChange={(e) => !isPreviewMode && setBirthDate(e.target.value)}
                placeholder="06/05/1982"
                className={`w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-medium ${
                  isPreviewMode ? 'bg-gray-100 cursor-not-allowed text-gray-700' : 'bg-white text-gray-900'
                }`}
                required
                disabled={isPreviewMode}
              />
              <p className="text-sm text-purple-600 mt-1">
                Formato: DD/MM/YYYY (ejemplo: 06/05/1982)
              </p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {!isPreviewMode && (
              <button
                type="submit"
                disabled={calculating}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {calculating ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Calculando tu Mapa...
                  </span>
                ) : (
                  '🔮 Calcular Mi Mapa Numerológico'
                )}
              </button>
            )}
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-8">
            
            {/* La Energía de tu Nombre */}
            <div className="numerology-card">
              <h2 className="text-3xl font-bold text-purple-900 mb-6 text-center">
                ✨ LA ENERGÍA DE TU NOMBRE ✨
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-6 rounded-lg border-l-4 border-pink-600">
                  <h3 className="text-xl font-bold text-pink-900 mb-2">💝 MI ALMA</h3>
                  <div className="text-4xl font-bold text-pink-700">{result.summary.alma}</div>
                  <p className="text-pink-600 mt-2">Tus deseos más profundos</p>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 p-6 rounded-lg border-l-4 border-emerald-600">
                  <h3 className="text-xl font-bold text-emerald-900 mb-2">🎭 MI EXPRESIÓN</h3>
                  <div className="text-4xl font-bold text-emerald-700">{result.summary.personalidad}</div>
                  <p className="text-emerald-600 mt-2">Cómo te expresas</p>
                </div>
                
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-6 rounded-lg border-l-4 border-orange-600">
                  <h3 className="text-xl font-bold text-orange-900 mb-2">⭐ PODER DEL NOMBRE</h3>
                  <div className="text-4xl font-bold text-orange-700">{result.summary.numeroPersonal}</div>
                  <p className="text-orange-600 mt-2">Fuerza vibracional total</p>
                </div>
              </div>
            </div>

            {/* Horizontal Numerológico */}
            <div className="numerology-card">
              <h2 className="text-2xl font-bold text-purple-900 mb-6">🔢 HORIZONTAL NUMEROLÓGICO</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold text-blue-900">A - TAREA NO APRENDIDA</h3>
                  <div className="text-3xl font-bold text-blue-700">{result.baseNumbers.A}</div>
                  <p className="text-blue-600 text-sm">Lecciones pendientes</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-bold text-green-900">B - MI ESENCIA</h3>
                  <div className="text-3xl font-bold text-green-700">{result.baseNumbers.B}</div>
                  <p className="text-green-600 text-sm">Tu verdadera naturaleza</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-bold text-purple-900">C - MI VIDA PASADA</h3>
                  <div className="text-3xl font-bold text-purple-700">{result.baseNumbers.C}</div>
                  <p className="text-purple-600 text-sm">Influencias anteriores</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-bold text-orange-900">D - MI MÁSCARA</h3>
                  <div className="text-3xl font-bold text-orange-700">{result.positiveNumbers.D}</div>
                  <p className="text-orange-600 text-sm">Personalidad exterior</p>
                </div>
              </div>
            </div>

            {/* Talentos */}
            <div className="numerology-card">
              <h2 className="text-2xl font-bold text-green-900 mb-6">✨ TALENTOS</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(result.positiveNumbers).filter(([key]) => key !== 'D').map(([key, value]) => {
                  const labels: Record<string, string> = {
                    E: 'IMPLANTACIÓN DEL PROGRAMA',
                    F: 'ENCUENTRO CON TU MAESTRO',
                    G: 'RE-IDENTIFICACIÓN CON TU YO',
                    H: 'TU DESTINO',
                    I: 'INCONSCIENTE',
                    J: 'MI ESPEJO',
                    X: 'REACCIÓN',
                    Y: 'MISIÓN',
                    Z: 'REGALO DIVINO'
                  }
                  return (
                    <div key={key} className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h3 className="font-bold text-green-900 text-sm">{key} - {labels[key]}</h3>
                      <div className="text-2xl font-bold text-green-700">{value}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Números Negativos */}
            <div className="numerology-card">
              <h2 className="text-2xl font-bold text-red-900 mb-6">⚠️ NÚMEROS NEGATIVOS (Áreas de Trabajo)</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(result.negativeNumbers).map(([key, value]) => {
                  const labels: Record<string, string> = {
                    K: 'ADOLESCENCIA',
                    L: 'JUVENTUD',
                    M: 'ADULTEZ',
                    N: 'ADULTO MAYOR',
                    O: 'INCONSCIENTE NEGATIVO',
                    P: 'MI SOMBRA',
                    Q: 'SER INFERIOR 1',
                    R: 'SER INFERIOR 2',
                    S: 'SER INFERIOR 3'
                  }
                  return (
                    <div key={key} className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <h3 className="font-bold text-red-900 text-sm">{key} - {labels[key]}</h3>
                      <div className="text-2xl font-bold text-red-700">{value}</div>
                    </div>
                  )
                })}
                {/* Agregar Triplicidad */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="font-bold text-purple-900 text-sm">W - TRIPLICIDAD</h3>
                  <div className="text-2xl font-bold text-purple-700">{result.W}</div>
                  <p className="text-purple-600 text-xs mt-1">Potenciación triple</p>
                </div>
                {/* Agregar Números Ausentes */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-gray-900 text-sm">T - NÚMEROS AUSENTES</h3>
                  <div className="text-lg font-bold text-gray-700">
                    {Array.isArray(result.positiveNumbers.T) ? result.positiveNumbers.T.join(', ') : result.positiveNumbers.T || 'Ninguno'}
                  </div>
                  <p className="text-gray-600 text-xs mt-1">Números faltantes</p>
                </div>
              </div>
            </div>



            {/* Pináculo Diagram Visualization */}
            <div className="numerology-card">
              <h2 className="text-2xl font-bold text-purple-900 mb-6">🎭 DIAGRAMA DEL PINÁCULO</h2>
              <p className="text-gray-600 mb-4">
                Visualización interactiva de tu mapa numerológico basado en tu fecha de nacimiento.
              </p>
              <PinaculoDiagram 
                birthDay={parseInt((isPreviewMode ? previewData.birthDate : birthDate).split('/')[0])}
                birthMonth={parseInt((isPreviewMode ? previewData.birthDate : birthDate).split('/')[1])}
                birthYear={parseInt((isPreviewMode ? previewData.birthDate : birthDate).split('/')[2])}
                name={isPreviewMode ? previewData.name : name}
              />
            </div>


          </div>
        )}
      </div>
    </div>
  )
}
