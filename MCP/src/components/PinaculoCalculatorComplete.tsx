'use client';

import React, { useState } from 'react';
import { PinaculoCalculator, PinaculoResults } from '@/types/pinaculo';

interface PinaculoCalculatorCompleteProps {
  className?: string;
}

interface PersonData {
  name: string;
  day: number;
  month: number;
  year: number;
}

export default function PinaculoCalculatorComplete({ className = '' }: PinaculoCalculatorCompleteProps) {
  const [personData, setPersonData] = useState<PersonData>({
    name: '',
    day: 1,
    month: 1,
    year: 1980
  });
  const [results, setResults] = useState<PinaculoResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = () => {
    if (!personData.name.trim()) {
      alert('Por favor ingresa un nombre');
      return;
    }

    setIsCalculating(true);
    try {
      const pinaculoResults = PinaculoCalculator.calculateComplete(
        personData.name,
        personData.day,
        personData.month,
        personData.year
      );
      setResults(pinaculoResults);
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
      <div className={`bg-white rounded-lg shadow-md p-4 border-l-4`} style={{borderLeftColor: color}}>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {numbers.map(({ key, name, special }) => {
            const value = results[key];
            const isMaster = typeof value === 'number' && [11, 22, 33].includes(value);
            
            // Special handling for T (ausentes)
            const displayValue = key === 'T' && Array.isArray(value) 
              ? value.join(', ') 
              : value;
            
            return (
              <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-700">
                  {key}: {name}
                </span>
                <span className={`font-bold ${isMaster ? 'text-yellow-600' : 'text-gray-900'}`}>
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
        <p className="text-purple-100">Sistema numerológico completo con las 23 posiciones</p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Datos Personales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              value={personData.name}
              onChange={(e) => setPersonData({...personData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ej: Carlos Carpio"
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
              value={personData.day}
              onChange={(e) => setPersonData({...personData, day: parseInt(e.target.value) || 1})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              value={personData.month}
              onChange={(e) => setPersonData({...personData, month: parseInt(e.target.value) || 1})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              value={personData.year}
              onChange={(e) => setPersonData({...personData, year: parseInt(e.target.value) || 1980})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={isCalculating}
          className="mt-4 w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
        >
          {isCalculating ? 'Calculando...' : 'Calcular Pináculo Completo'}
        </button>
      </div>

      {/* Results */}
      {results && (
        <>
          {/* Summary */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-2">
              Pináculo de {personData.name}
            </h2>
            <p className="text-green-100 mb-4">
              Fecha: {personData.day}/{personData.month}/{personData.year}
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

          {/* Number Groups */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                { key: 'H', name: 'TU DESTINO' },
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
        </>
      )}
    </div>
  );
}