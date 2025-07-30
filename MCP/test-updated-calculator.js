#!/usr/bin/env node

// Test updated PinaculoCalculator with new rules
console.log('🧪 TESTING UPDATED PINACULO CALCULATOR');
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

  static calculateNameNumber(name) {
    let sum = 0;
    for (let char of name.replace(/\s+/g, '')) {
      if (this.caldeo[char.toUpperCase()]) {
        sum += this.caldeo[char.toUpperCase()];
      }
    }
    return this.reduceNumber(sum);
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
    results.W = this.calculateNameNumber(name);
    results.Z = this.reduceNumber(year % 100);

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

console.log('\n🔷 BASE:');
console.log(`A = ${result.A}${result.A === 11 || result.A === 22 ? ' ⭐' : ''}`);
console.log(`B = ${result.B}`);
console.log(`C = ${result.C}`);
console.log(`D = ${result.D}`);

console.log('\n🔷 NEGATIVOS (con conversión 11→2):');
console.log(`K = ${result.K} (esperado: 3) ${result.K === 3 ? '✅' : '❌'}`);
console.log(`L = ${result.L} (esperado: 0) ${result.L === 0 ? '✅' : '❌'}`);
console.log(`M = ${result.M} (esperado: 3) ${result.M === 3 ? '✅' : '❌'}`);
console.log(`N = ${result.N} (esperado: 3) ${result.N === 3 ? '✅' : '❌'}`);
console.log(`O = ${result.O} (esperado: 6) ${result.O === 6 ? '✅' : '❌'}`);
console.log(`P = ${result.P} (esperado: 9) ${result.P === 9 ? '✅' : '❌'}`);
console.log(`Q = ${result.Q} (esperado: 6) ${result.Q === 6 ? '✅' : '❌'}`);
console.log(`R = ${result.R} (esperado: 3) ${result.R === 3 ? '✅' : '❌'}`);
console.log(`S = ${result.S} (esperado: 9) ${result.S === 9 ? '✅' : '❌'}`);

console.log('\n🔷 ESPECIALES:');
console.log(`T = ${Array.isArray(result.T) ? result.T.join(', ') : result.T} (números ausentes)`);

// Test case 2: Noemi Meza with master number conversion
console.log('\n\n📅 Test Case: Noemi Meza 25/10/1948');
console.log('─'.repeat(50));

const result2 = PinaculoCalculator.calculateComplete('NOEMI MEZA', 25, 10, 1948);

console.log('\n🔷 BASE:');
console.log(`A = ${result2.A}`);
console.log(`B = ${result2.B}`);
console.log(`C = ${result2.C}${result2.C === 22 ? ' ⭐' : ''}`);

console.log('\n🔷 NEGATIVOS (con conversión 22→4):');
console.log(`Conversión para negativos: C=22→4`);
console.log(`K = |1 - 7| = ${result2.K}`);
console.log(`L = |7 - 4| = ${result2.L} (usando C=4)`);
console.log(`M = |6 - 3| = ${result2.M}`);
console.log(`N = |1 - 4| = ${result2.N} (usando C=4)`);
console.log(`Nota: Esta implementación todavía necesita la regla especial de no reducir L antes de usarlo en M`);

console.log('\n🔷 AUSENTES:');
console.log(`T = ${Array.isArray(result2.T) ? result2.T.join(', ') : result2.T}`);