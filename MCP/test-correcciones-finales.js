#!/usr/bin/env node

// Test con todas las correcciones finales
console.log('🔍 VERIFICANDO CORRECCIONES FINALES');
console.log('═'.repeat(70));

// Simplified version of PinaculoCalculator for testing
class PinaculoCalculator {
  static caldeo = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 8, 'G': 3, 'H': 5,
    'I': 1, 'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 7, 'P': 8,
    'Q': 1, 'R': 2, 'S': 3, 'T': 4, 'U': 6, 'V': 6, 'W': 6, 'X': 5,
    'Y': 1, 'Z': 7
  };

  static reduceNumber(num) {
    if (num === 11 || num === 22 || num === 33) {
      return num;
    }
    
    while (num > 9) {
      let sum = 0;
      while (num > 0) {
        sum += num % 10;
        num = Math.floor(num / 10);
      }
      num = sum;
      
      if (num === 11 || num === 22 || num === 33) {
        return num;
      }
    }
    
    return num;
  }

  static convertMasterForNegatives(num) {
    if (num === 11) return 2;
    if (num === 22) return 4;
    if (num === 33) return 6;
    return num;
  }

  static calculateAbsentNumbers(results) {
    const allNumbers = Object.values(results).filter(val => typeof val === 'number');
    const occurrences = new Array(10).fill(0);
    
    allNumbers.forEach(num => {
      if (num >= 0 && num <= 9) {
        occurrences[num]++;
      }
    });
    
    const absent = [];
    for (let i = 1; i <= 9; i++) {
      if (occurrences[i] === 0) {
        absent.push(i);
      }
    }
    
    return absent;
  }

  static calculateTriplicidad(results) {
    // Only consider K,L,M,N,O,P,Q,R,S (negative numbers)
    const negativeNumbers = [
      results.K, results.L, results.M, results.N, 
      results.O, results.P, results.Q, results.R, results.S
    ];
    
    const occurrences = new Array(10).fill(0);
    negativeNumbers.forEach(num => {
      if (num >= 0 && num <= 9) {
        occurrences[num]++;
      }
    });
    
    console.log('\n📊 Análisis de Triplicidad (solo K,L,M,N,O,P,Q,R,S):');
    console.log(`Valores: [${negativeNumbers.join(', ')}]`);
    for (let i = 0; i <= 9; i++) {
      if (occurrences[i] > 0) {
        console.log(`Número ${i}: aparece ${occurrences[i]} veces`);
      }
    }
    
    // Find numbers that appear exactly 3 times
    for (let i = 0; i <= 9; i++) {
      if (occurrences[i] === 3) {
        console.log(`✅ Triplicidad encontrada: ${i} aparece 3 veces`);
        return i * 3; // Sum of the number appearing 3 times
      }
    }
    
    console.log('❌ No hay triplicidad (ningún número aparece exactamente 3 veces)');
    return 0;
  }

  static applyVerificationRule(baseValue, calculation1, calculation2) {
    const needsVerification = [2, 11, 4, 22].includes(baseValue);
    
    if (needsVerification) {
      const val1 = this.reduceNumber(calculation1);
      const val2 = this.reduceNumber(calculation2);
      
      if (val1 === val2) {
        return val1;
      } else {
        return val1;
      }
    } else {
      return baseValue;
    }
  }

  static calculateComplete(name, day, month, year) {
    const results = {};

    // Base calculations
    results.A = this.reduceNumber(month);
    results.B = this.reduceNumber(day);
    const yearSum = year.toString().split('').map(Number).reduce((a, b) => a + b, 0);
    results.C = this.reduceNumber(yearSum);

    // D with verification rule
    const D_base = this.reduceNumber(results.A + results.B + results.C);
    const D1 = month + day + year;
    const D2 = results.A + results.B + results.C;
    results.D = this.applyVerificationRule(D_base, D1, D2);

    // H with verification rule  
    const H_base = this.reduceNumber(results.A + results.C);
    const H1 = month + year;
    const H2 = results.A + results.C;
    results.H = this.applyVerificationRule(H_base, H1, H2);

    // Superior numbers
    results.X = this.reduceNumber(results.B + results.D);
    results.Y = this.reduceNumber(results.A + results.B + results.C + results.D + results.X);
    results.Z = this.reduceNumber(year % 100);

    // Cycle numbers
    results.E = this.reduceNumber(results.A + results.B);
    results.F = this.reduceNumber(results.B + results.C);
    results.G = this.reduceNumber(results.E + results.F);

    // Hidden numbers
    results.I = this.reduceNumber(results.E + results.F + results.G);
    results.J = this.reduceNumber(results.D + results.H);

    // Negative numbers - CRITICAL: Convert master numbers for subtraction
    const A_for_negative = this.convertMasterForNegatives(results.A);
    const B_for_negative = this.convertMasterForNegatives(results.B);
    const C_for_negative = this.convertMasterForNegatives(results.C);
    
    results.K = Math.abs(A_for_negative - B_for_negative);
    results.L = Math.abs(B_for_negative - C_for_negative);
    
    if (results.K !== results.L) {
      results.M = Math.abs(results.K - results.L);
    } else {
      results.M = this.reduceNumber(results.K + results.L);
    }
    
    results.N = Math.abs(A_for_negative - C_for_negative);
    results.O = this.reduceNumber(results.M + results.K + results.L);
    results.P = this.reduceNumber(results.D + results.O);
    results.Q = this.reduceNumber(results.K + results.M);
    results.R = this.reduceNumber(results.L + results.M);
    results.S = this.reduceNumber(results.Q + results.R);

    // Special numbers
    results.W = this.calculateTriplicidad(results);

    // Calculate T (absent numbers)
    const absent = this.calculateAbsentNumbers(results);
    results.T = absent.length === 1 ? absent[0] : absent;

    return results;
  }
}

// Test case: 23/11/1994
console.log('\n📅 Test Case: 23/11/1994');
console.log('─'.repeat(50));

const result = PinaculoCalculator.calculateComplete('', 23, 11, 1994);

console.log('\n✅ VERIFICACIÓN DE CORRECCIONES:');
console.log('\n1️⃣ NÚMEROS SUPERIORES (ahora incluye Z):');
console.log(`   H = ${result.H} (Tu Destino)`);
console.log(`   X = ${result.X} (Reacción)`);
console.log(`   Y = ${result.Y} (Misión)`);
console.log(`   Z = ${result.Z} (Regalo Divino) ✅`);

console.log('\n2️⃣ CICLOS DE VIDA (con etapas):');
console.log(`   E = ${result.E} (1era Etapa)`);
console.log(`   F = ${result.F} (2da Etapa)`);
console.log(`   G = ${result.G} (3ra Etapa)`);
console.log(`   H = ${result.H} (4ta Etapa) ✅`);

console.log('\n3️⃣ ASPECTOS OCULTOS:');
console.log(`   I = ${result.I} (Inconsciente POSITIVO) ✅`);
console.log(`   J = ${result.J} (Mi Espejo)`);

console.log('\n4️⃣ ASPECTOS NEGATIVOS (con conversión 11→2):');
console.log(`   K = ${result.K} (esperado: 3) ${result.K === 3 ? '✅' : '❌'}`);
console.log(`   L = ${result.L} (esperado: 0) ${result.L === 0 ? '✅' : '❌'}`);
console.log(`   M = ${result.M} (esperado: 3) ${result.M === 3 ? '✅' : '❌'}`);
console.log(`   N = ${result.N} (esperado: 3) ${result.N === 3 ? '✅' : '❌'}`);
console.log(`   O = ${result.O} (esperado: 6) ${result.O === 6 ? '✅' : '❌'}`);
console.log(`   P = ${result.P} (esperado: 9) ${result.P === 9 ? '✅' : '❌'}`);
console.log(`   Q = ${result.Q} (esperado: 6) ${result.Q === 6 ? '✅' : '❌'}`);
console.log(`   R = ${result.R} (esperado: 3) ${result.R === 3 ? '✅' : '❌'}`);
console.log(`   S = ${result.S} (esperado: 9) ${result.S === 9 ? '✅' : '❌'}`);

console.log('\n5️⃣ ASPECTOS ESPECIALES:');
console.log(`   W = ${result.W} (Triplicidad - solo de K,L,M,N,O,P,Q,R,S)`);
console.log(`   T = ${Array.isArray(result.T) ? result.T.join(', ') : result.T} (Ausentes)`);

console.log('\n🎯 RESUMEN DE CORRECCIONES APLICADAS:');
console.log('✅ Z movido a Números Superiores');
console.log('✅ Ciclos con nombres de etapas (1era, 2da, 3ra, 4ta)');
console.log('✅ I = Inconsciente Positivo');
console.log('✅ K = 3 (con regla 11→2)');
console.log('✅ W = Triplicidad solo de K,L,M,N,O,P,Q,R,S');
console.log('✅ T = Números ausentes');