#!/usr/bin/env node

// CÁLCULO DEL PINÁCULO PARA 23/11/1994
// Usando el sistema completo implementado

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

  static applyVerificationRule(baseValue, calculation1, calculation2, label) {
    const needsVerification = [2, 11, 4, 22].includes(baseValue);
    
    console.log(`\n🔍 ${label} = ${baseValue} - ¿Necesita verificación? ${needsVerification ? '✅ SÍ' : '❌ NO'}`);
    
    if (needsVerification) {
      const val1 = this.reduceNumber(calculation1);
      const val2 = this.reduceNumber(calculation2);
      
      console.log(`  ${label}1 = ${calculation1} → ${val1}`);
      console.log(`  ${label}2 = ${calculation2} → ${val2}`);
      
      if (val1 === val2) {
        console.log(`  ✅ ${label}1 = ${label}2 → ${label} = ${val1}`);
        return val1;
      } else {
        console.log(`  ❌ ${label}1 ≠ ${label}2 → ${label} = ${val1} (se toma ${label}1)`);
        console.log(`  🔮 Simbología: ${val2}/${val1} (más importante: ${val1})`);
        return val1;
      }
    } else {
      console.log(`  📊 ${label} = ${baseValue} (sin verificación necesaria)`);
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
    console.log('🎭 PINÁCULO COMPLETO');
    console.log('═'.repeat(70));
    console.log(`👤 Nombre: ${name || 'NO ESPECIFICADO'}`);
    console.log(`📅 Fecha: ${day}/${month}/${year}`);
    console.log();

    const results = {};

    // NIVEL BASE
    console.log('🔷 NIVEL BASE:');
    console.log('─'.repeat(50));
    
    results.A = this.reduceNumber(month);
    console.log(`A (TAREA NO APRENDIDA) = ${month} → ${results.A}`);
    
    results.B = this.reduceNumber(day);
    console.log(`B (MI ESENCIA) = ${day} → ${results.B}`);
    
    const yearSum = year.toString().split('').map(Number).reduce((a, b) => a + b, 0);
    results.C = this.reduceNumber(yearSum);
    console.log(`C (MI VIDA PASADA) = ${year} → ${yearSum} → ${results.C}`);

    // D con regla de verificación
    const D_base = this.reduceNumber(results.A + results.B + results.C);
    const D1 = month + day + year;
    const D2 = results.A + results.B + results.C;
    results.D = this.applyVerificationRule(D_base, D1, D2, 'D');
    console.log(`D (MI MÁSCARA) = ${results.D}`);

    // NIVEL SUPERIOR
    console.log('\n🔷 NIVEL SUPERIOR:');
    console.log('─'.repeat(50));

    // H con regla de verificación  
    const H_base = this.reduceNumber(results.A + results.C);
    const H1 = month + year;
    const H2 = results.A + results.C;
    results.H = this.applyVerificationRule(H_base, H1, H2, 'H');
    console.log(`H (TU DESTINO) = ${results.H}`);

    results.X = this.reduceNumber(results.B + results.D);
    console.log(`X (REACCIÓN) = ${results.B} + ${results.D} → ${results.X}`);

    results.Y = this.reduceNumber(results.A + results.B + results.C + results.D + results.X);
    console.log(`Y (MISIÓN) = ${results.A} + ${results.B} + ${results.C} + ${results.D} + ${results.X} → ${results.Y}`);

    // NIVEL CICLOS
    console.log('\n🔷 NIVEL CICLOS:');
    console.log('─'.repeat(50));

    results.E = this.reduceNumber(results.A + results.B);
    console.log(`E (IMPLANTACIÓN DEL PROGRAMA) = ${results.A} + ${results.B} → ${results.E}`);

    results.F = this.reduceNumber(results.B + results.C);
    console.log(`F (ENCUENTRO CON TU MAESTRO) = ${results.B} + ${results.C} → ${results.F}`);

    results.G = this.reduceNumber(results.E + results.F);
    console.log(`G (RE-IDENTIFICACIÓN CON TU YO) = ${results.E} + ${results.F} → ${results.G}`);

    // NIVEL OCULTO
    console.log('\n🔷 NIVEL OCULTO:');
    console.log('─'.repeat(50));

    results.I = this.reduceNumber(results.E + results.F + results.G);
    console.log(`I (INCONSCIENTE) = ${results.E} + ${results.F} + ${results.G} → ${results.I}`);

    results.J = this.reduceNumber(results.D + results.H);
    console.log(`J (MI ESPEJO) = ${results.D} + ${results.H} → ${results.J}`);

    // NIVEL NEGATIVOS
    console.log('\n🔷 NIVEL NEGATIVOS:');
    console.log('─'.repeat(50));

    results.K = Math.abs(results.A - results.B);
    console.log(`K (ADOLESCENCIA) = |${results.A} - ${results.B}| → ${results.K}`);

    results.L = Math.abs(results.B - results.C);
    console.log(`L (JUVENTUD) = |${results.B} - ${results.C}| → ${results.L}`);

    if (results.K !== results.L) {
      results.M = Math.abs(results.K - results.L);
      console.log(`M (ADULTEZ) = |${results.K} - ${results.L}| → ${results.M} (K ≠ L)`);
    } else {
      results.M = this.reduceNumber(results.K + results.L);
      console.log(`M (ADULTEZ) = ${results.K} + ${results.L} → ${results.M} (K = L)`);
    }

    results.N = Math.abs(results.A - results.C);
    console.log(`N (ADULTO MAYOR) = |${results.A} - ${results.C}| → ${results.N}`);

    results.O = this.reduceNumber(results.M + results.K + results.L);
    console.log(`O (INCONSCIENTE NEGATIVO) = ${results.M} + ${results.K} + ${results.L} → ${results.O}`);

    results.P = this.reduceNumber(results.D + results.O);
    console.log(`P (MI SOMBRA) = ${results.D} + ${results.O} → ${results.P}`);

    results.Q = this.reduceNumber(results.K + results.M);
    console.log(`Q (SER INFERIOR 1) = ${results.K} + ${results.M} → ${results.Q}`);

    results.R = this.reduceNumber(results.L + results.M);
    console.log(`R (SER INFERIOR 2) = ${results.L} + ${results.M} → ${results.R}`);

    results.S = this.reduceNumber(results.Q + results.R);
    console.log(`S (SER INFERIOR 3) = ${results.Q} + ${results.R} → ${results.S}`);

    // NIVEL ESPECIAL
    console.log('\n🔷 NIVEL ESPECIAL:');
    console.log('─'.repeat(50));

    if (name) {
      results.W = this.calculateNameNumber(name);
      console.log(`W (TRIPLICIDAD) = ${name} → ${results.W} (sistema Caldeo)`);
    } else {
      results.W = 0;
      console.log(`W (TRIPLICIDAD) = [Sin nombre] → 0`);
    }

    results.Z = this.reduceNumber(year % 100);
    console.log(`Z (REGALO DIVINO) = ${year % 100} → ${results.Z}`);

    // RESUMEN FINAL
    console.log('\n🎯 RESUMEN FINAL:');
    console.log('═'.repeat(70));

    const niveles = {
      'BASE': ['A', 'B', 'C', 'D'],
      'SUPERIOR': ['H', 'Y', 'X'],
      'CICLOS': ['E', 'F', 'G'],
      'OCULTO': ['I', 'J'],
      'NEGATIVOS': ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'],
      'ESPECIAL': ['W', 'Z']
    };

    Object.entries(niveles).forEach(([nivel, letras]) => {
      console.log(`\n🔹 ${nivel}:`);
      letras.forEach(letra => {
        const valor = results[letra];
        const esMaestro = [11, 22, 33].includes(valor) ? ' ⭐' : '';
        console.log(`  ${letra} = ${valor}${esMaestro}`);
      });
    });

    const maestros = Object.entries(results)
      .filter(([, valor]) => [11, 22, 33].includes(valor))
      .map(([letra, valor]) => `${letra}=${valor}`);

    console.log('\n📊 NÚMEROS MAESTROS ENCONTRADOS:');
    if (maestros.length > 0) {
      console.log(`  ${maestros.join(', ')}`);
    } else {
      console.log('  Ninguno encontrado');
    }

    console.log('\n✅ CÁLCULO COMPLETO FINALIZADO');
    return results;
  }
}

// CALCULAR PARA 23/11/1994
const resultado = PinaculoCalculator.calculateComplete('', 23, 11, 1994);

// Guardar resultado
const fs = require('fs');
fs.writeFileSync('pinaculo-23-11-1994.json', JSON.stringify({
  fecha: "23/11/1994",
  pinaculo: resultado,
  timestamp: new Date().toISOString()
}, null, 2));

console.log('\n💾 Resultado guardado en: pinaculo-23-11-1994.json');