import { NumerologyCalculator } from '@/components/NumerologyCalculator'
import PinaculoCalculatorComplete from '@/components/PinaculoCalculatorComplete'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Header */}
      <div className="text-center py-16">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
          Descubre Tus Números
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto px-4">
          Desbloquea los significados ocultos en tu nombre y fecha de nacimiento a través de la sabiduría ancestral de la numerología. 
          Obtén conocimientos personalizados sobre tu personalidad, camino de vida y destino con nuestro avanzado sistema del Pináculo.
        </p>
      </div>

      {/* Main Calculator */}
      <div className="max-w-2xl mx-auto px-4 pb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8">
          <NumerologyCalculator />
        </div>
      </div>

      {/* Complete Pináculo Calculator */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <PinaculoCalculatorComplete />
      </div>

      {/* About Section */}
      <div className="bg-white/50 backdrop-blur-sm py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">¿Qué es la Numerología?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔢</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Tu Camino de Vida</h3>
              <p className="text-gray-600">
                Calcula tu Número del Camino de Vida desde tu fecha de nacimiento para entender tu propósito central y viaje.
              </p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Energía del Nombre</h3>
              <p className="text-gray-600">
                Descubre la energía vibracional de tu nombre y cómo influye en tu personalidad y destino.
              </p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">�</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Diagrama del Pináculo</h3>
              <p className="text-gray-600">
                Visualiza tu mapa numerológico completo con nuestro sistema avanzado del Pináculo que analiza 23 aspectos diferentes de tu personalidad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
