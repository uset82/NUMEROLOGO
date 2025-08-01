'use client';

import React, { useState, useEffect } from 'react';
import { PinaculoCalculator, PinaculoResults } from '@/types/pinaculo';

interface PinaculoCalculatorCompleteProps {
  className?: string;
  isPreviewMode?: boolean;
}

interface PersonData {
  name: string;
  day: number;
  month: number;
  year: number;
}

export default function PinaculoCalculatorComplete({ className = '', isPreviewMode = false }: PinaculoCalculatorCompleteProps) {
  const [personData, setPersonData] = useState<PersonData>({
    name: 'Carlos Carpio',
    day: 6,
    month: 5,
    year: 1982
  });
  const [results, setResults] = useState<PinaculoResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Preview mode data
  const previewData = {
    name: 'Carlos Carpio',
    day: 6,
    month: 5,
    year: 1982
  };

  // Auto-calculate on component mount
  useEffect(() => {
    if (!results) {
      handleCalculate(false);
    }
  }, []);

  const calculateNameEnergy = (name: string) => {
    const vowels = 'AEIOU';
    const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';
    
    let soulNumber = 0;
    let expressionNumber = 0;
    let powerNumber = 0;
    
    const upperName = name.toUpperCase();
    
    // Calculate Soul Number (vowels)
    for (let char of upperName) {
      if (vowels.includes(char)) {
        const numValue = char.charCodeAt(0) - 64;
        soulNumber += numValue;
      }
    }
    
    // Calculate Expression Number (all letters)
    for (let char of upperName) {
      if (char >= 'A' && char <= 'Z') {
        const numValue = char.charCodeAt(0) - 64;
        expressionNumber += numValue;
      }
    }
    
    // Calculate Power Number (soul + expression)
    powerNumber = soulNumber + expressionNumber;
    
    // Reduce to single digit or master number
    const reduceNumber = (num: number): number => {
      if (num === 11 || num === 22 || num === 33) return num;
      while (num > 9) {
        num = Math.floor(num / 10) + (num % 10);
      }
      return num;
    };
    
    return {
      soul: reduceNumber(soulNumber),
      expression: reduceNumber(expressionNumber),
      power: reduceNumber(powerNumber)
    };
  };

  const handleCalculate = (isPreview = false) => {
    const currentData = isPreview ? previewData : personData;

    setIsCalculating(true);
    try {
      const pinaculoResults = PinaculoCalculator.calculateComplete(
        currentData.name,
        currentData.day,
        currentData.month,
        currentData.year
      );
      
      // Add name energy calculations
      const nameEnergy = calculateNameEnergy(currentData.name);
      const completeResults = { ...pinaculoResults, ...nameEnergy };
      
      setResults(completeResults);
    } catch (error) {
      console.error('Error calculating Pináculo:', error);
      alert('Error al calcular el Pináculo');
    } finally {
      setIsCalculating(false);
    }
  };

  const getMasterNumbers = (results: PinaculoResults): string[] => {
    const masterNumbers: string[] = [];
    Object.entries(results).forEach(([key, value]) => {
      if ([11, 22, 33].includes(value)) {
        masterNumbers.push(`${key}=${value}`);
      }
    });
    return masterNumbers;
  };

  const renderNumberGroup = (title: string, numbers: Array<{ key: keyof PinaculoResults; name: string; special?: boolean }>, color: string) => {
    if (!results) return null;

    return (
      <div className={`bg-white rounded-xl shadow-xl p-4 md:p-6 border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 min-h-[200px]`} style={{borderLeftColor: color, borderLeftWidth: '8px'}}>
        <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-800 text-center border-b-2 border-gray-100 pb-2">{title}</h3>
        <div className="grid grid-cols-1 gap-3">
          {numbers.map(({ key, name, special }) => {
            const value = results[key];
            const isMaster = typeof value === 'number' && [11, 22, 33].includes(value);
            
            // Special handling for T (ausentes)
            const displayValue = key === 'T' && Array.isArray(value) 
              ? value.join(', ') 
              : value;
            
            return (
              <div key={key} className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200">
                <span className="text-sm md:text-base font-semibold text-gray-700 flex-1">
                  <span className="inline-block w-6 text-center font-bold text-purple-600 mr-2">{key}</span>
                  {name}
                </span>
                <span className={`font-bold text-lg md:text-xl px-3 py-1 rounded-lg ${isMaster ? 'bg-yellow-100 text-yellow-800' : 'bg-purple-100 text-purple-800'}`}>
                  {displayValue} {isMaster && '⭐'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`max-w-6xl mx-auto p-6 ${className}`}>
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">Calculadora Completa del Pináculo</h1>
        <p className="text-purple-100">Sistema numerológico completo con Energía del Nombre + 23 posiciones</p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Datos Personales</h2>
        
        {isPreviewMode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center text-yellow-800">
              <span className="mr-2">👁️</span>
              <strong>Modo Vista Previa:</strong> Mostrando ejemplo con "Carlos Carpio" (06/05/1982)
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              value={isPreviewMode ? previewData.name : personData.name}
              onChange={(e) => !isPreviewMode && setPersonData({...personData, name: e.target.value})}
              className={`w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium ${
                isPreviewMode ? 'bg-gray-100 cursor-not-allowed text-gray-700' : 'bg-white text-gray-900'
              }`}
              placeholder="Ej: Carlos Carpio"
              disabled={isPreviewMode}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Día
            </label>
            <input
              type="number"
              min="1"
              max="31"
              value={isPreviewMode ? previewData.day : personData.day}
              onChange={(e) => !isPreviewMode && setPersonData({...personData, day: parseInt(e.target.value) || 1})}
              className={`w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium ${
                isPreviewMode ? 'bg-gray-100 cursor-not-allowed text-gray-700' : 'bg-white text-gray-900'
              }`}
              disabled={isPreviewMode}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mes
            </label>
            <input
              type="number"
              min="1"
              max="12"
              value={isPreviewMode ? previewData.month : personData.month}
              onChange={(e) => !isPreviewMode && setPersonData({...personData, month: parseInt(e.target.value) || 1})}
              className={`w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium ${
                isPreviewMode ? 'bg-gray-100 cursor-not-allowed text-gray-700' : 'bg-white text-gray-900'
              }`}
              disabled={isPreviewMode}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Año
            </label>
            <input
              type="number"
              min="1900"
              max="2030"
              value={isPreviewMode ? previewData.year : personData.year}
              onChange={(e) => !isPreviewMode && setPersonData({...personData, year: parseInt(e.target.value) || 1980})}
              className={`w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium ${
                isPreviewMode ? 'bg-gray-100 cursor-not-allowed text-gray-700' : 'bg-white text-gray-900'
              }`}
              disabled={isPreviewMode}
            />
          </div>
        </div>

        {!isPreviewMode && (
          <button
            onClick={() => handleCalculate(false)}
            disabled={isCalculating}
            className="mt-4 w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {isCalculating ? 'Calculando...' : 'Calcular Pináculo Completo'}
          </button>
        )}
      </div>

      {/* Results */}
      {results && (
        <>
          {/* Summary */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-2">
              Pináculo de {isPreviewMode ? previewData.name : personData.name}
            </h2>
            <p className="text-green-100 mb-4">
              Fecha: {isPreviewMode ? `${previewData.day}/${previewData.month}/${previewData.year}` : `${personData.day}/${personData.month}/${personData.year}`}
            </p>
            
            {/* Master Numbers */}
            <div className="bg-white/20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Números Maestros Encontrados:</h3>
              <div className="flex flex-wrap gap-2">
                {getMasterNumbers(results).map((masterNum, index) => (
                  <span key={index} className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                    {masterNum} ⭐
                  </span>
                ))}
                {getMasterNumbers(results).length === 0 && (
                  <span className="text-green-100">Ninguno encontrado</span>
                )}
              </div>
            </div>
          </div>

          {/* Number Groups - 8 Big Boxes (including Name Energy) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {renderNumberGroup(
              "🔷 Energía de tu Nombre",
              [
                { key: 'soul', name: 'MI ALMA' },
                { key: 'expression', name: 'MI EXPRESIÓN' },
                { key: 'power', name: 'PODER DEL NOMBRE' }
              ],
              '#8B5CF6'
            )}

            {renderNumberGroup(
              "🔷 Números Base",
              [
                { key: 'A', name: 'TAREA NO APRENDIDA' },
                { key: 'B', name: 'MI ESENCIA' },
                { key: 'C', name: 'MI VIDA PASADA' },
                { key: 'D', name: 'MI MÁSCARA' }
              ],
              '#9333EA'
            )}

            {renderNumberGroup(
              "🔷 Números Superiores", 
              [
                { key: 'X', name: 'REACCIÓN' },
                { key: 'Y', name: 'MISIÓN' },
                { key: 'Z', name: 'REGALO DIVINO' }
              ],
              '#10B981'
            )}

            {renderNumberGroup(
              "🔷 Ciclos de Vida",
              [
                { key: 'E', name: '1ERA ETAPA - IMPLANTACIÓN DEL PROGRAMA' },
                { key: 'F', name: '2DA ETAPA - ENCUENTRO CON TU MAESTRO' },
                { key: 'G', name: '3RA ETAPA - RE-IDENTIFICACIÓN CON TU YO' },
                { key: 'H', name: '4TA ETAPA - TU DESTINO' }
              ],
              '#6EE7B7'
            )}

            {renderNumberGroup(
              "🔷 Aspectos Ocultos",
              [
                { key: 'I', name: 'INCONSCIENTE POSITIVO' },
                { key: 'J', name: 'MI ESPEJO' }
              ],
              '#34D399'
            )}

            {renderNumberGroup(
              "🔷 Aspectos Negativos (Etapas)",
              [
                { key: 'K', name: 'ADOLESCENCIA' },
                { key: 'L', name: 'JUVENTUD' },
                { key: 'M', name: 'ADULTEZ' },
                { key: 'N', name: 'ADULTO MAYOR' }
              ],
              '#EF4444'
            )}

            {renderNumberGroup(
              "🔷 Aspectos Negativos (Profundos)",
              [
                { key: 'O', name: 'INCONSCIENTE NEGATIVO' },
                { key: 'P', name: 'MI SOMBRA' },
                { key: 'Q', name: 'SER INFERIOR 1' },
                { key: 'R', name: 'SER INFERIOR 2' },
                { key: 'S', name: 'SER INFERIOR 3' }
              ],
              '#F87171'
            )}

            {renderNumberGroup(
              "🔷 Aspectos Especiales",
              [
                { key: 'W', name: 'TRIPLICIDAD' },
                { key: 'T', name: 'AUSENTES', special: true }
              ],
              '#FBBF24'
            )}
          </div>

          {/* Technical Note */}
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <h3 className="text-sm font-semibold text-blue-800 mb-1">Nota Técnica:</h3>
            <p className="text-sm text-blue-700">
              Este cálculo incluye las reglas de comprobación especiales para las posiciones D y H cuando resultan en 2, 11, 4 o 22.
              Los números maestros (11, 22, 33) se preservan sin reducir. Para los cálculos negativos (K, L, N), 
              los números maestros se convierten: 11→2, 22→4, 33→6. Sistema Caldeo aplicado para la Triplicidad (W).
              T muestra los números del 1 al 9 que no aparecen en el Pináculo.
            </p>
          </div>
          
          {/* Extra spacing for mobile */}
          <div className="h-20 md:h-32"></div>
        </>
      )}
    </div>
  );
}