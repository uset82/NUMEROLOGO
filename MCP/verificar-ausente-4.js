#!/usr/bin/env node

// Verificar que el 4 es realmente ausente
console.log('🔍 VERIFICACIÓN DEL NÚMERO AUSENTE');
console.log('═'.repeat(50));

const results = {
  A: 11, B: 5, C: 5, D: 3,
  H: 7, X: 8, Y: 5, Z: 4,  // ¡Aquí está el 4!
  E: 7, F: 1, G: 8,
  I: 7, J: 1,
  K: 3, L: 0, M: 3, N: 3,
  O: 6, P: 9, Q: 6, R: 3, S: 9,
  W: 0
};

console.log('\n📊 Todos los valores del Pináculo:');
const allValues = [];
for (const [key, value] of Object.entries(results)) {
  if (typeof value === 'number' && key !== 'W') { // Excluir W que es calculado aparte
    console.log(`${key} = ${value}`);
    allValues.push(value);
  }
}

console.log('\n🔢 Conteo de apariciones (1-9):');
const occurrences = new Array(10).fill(0);
allValues.forEach(num => {
  if (num >= 0 && num <= 9) {
    occurrences[num]++;
  }
});

for (let i = 1; i <= 9; i++) {
  console.log(`${i}: ${occurrences[i]} veces ${occurrences[i] === 0 ? '❌ AUSENTE' : ''}`);
}

console.log('\n💡 ANÁLISIS:');
console.log(`El número 4 aparece en Z = ${results.Z}`);
console.log('Por lo tanto, el 4 NO está ausente.');

// Encontrar los verdaderos ausentes
const ausentes = [];
for (let i = 1; i <= 9; i++) {
  if (occurrences[i] === 0) {
    ausentes.push(i);
  }
}

console.log(`\n✅ Números ausentes reales: ${ausentes.join(', ')}`);

// Si el usuario dice que T=4, verifiquemos su caso específico
console.log('\n🤔 Si en tu caso específico T=4, puede ser porque:');
console.log('1. Estás usando valores diferentes para alguna letra');
console.log('2. Z tiene un valor diferente en tu cálculo');
console.log('3. Hay alguna diferencia en los valores base A, B, C');
console.log('\n¿Podrías verificar cuáles son todos tus valores?');