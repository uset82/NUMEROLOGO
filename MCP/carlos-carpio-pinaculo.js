#!/usr/bin/env node

// Calculadora del Pináculo de Carlos Carpio
// Basada en las fórmulas exactas de PPT CLASE 1.pdf
// Fecha: 06 de mayo 1982

class CarlosPinaculoCalculator {
    constructor() {
        this.name = "CARLOS CARPIO";
        this.birthDate = "06/05/1982";
        this.day = 6;
        this.month = 5;
        this.year = 1982;
        
        // Sistema Caldeo para nombres
        this.caldeoSystem = {
            A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
            J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
            S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
        };
    }

    // Función para reducir números a un solo dígito (preservando 11, 22, 33)
    reduceNumber(num) {
        if (num === 11 || num === 22 || num === 33) {
            return num; // Números maestros
        }
        while (num > 9) {
            num = Math.floor(num / 10) + (num % 10);
        }
        return num;
    }

    // Cálculo de números base
    calculateBaseNumbers() {
        console.log('\n📌 NÚMEROS BASE:');
        console.log('════════════════');
        
        // A = MES (reducido)
        const A = this.reduceNumber(this.month);
        console.log(`A (MES): ${this.month} → ${A} (Tarea no aprendida)`);
        
        // B = DÍA (reducido)
        const B = this.reduceNumber(this.day);
        console.log(`B (DÍA): ${this.day} → ${B} (Mi esencia)`);
        
        // C = AÑO (reducido) - sumar todos los dígitos del año
        const yearDigits = this.year.toString().split('').map(Number);
        const yearSum = yearDigits.reduce((sum, digit) => sum + digit, 0);
        const C = this.reduceNumber(yearSum);
        console.log(`C (AÑO): ${this.year} → ${yearDigits.join('+')} = ${yearSum} → ${C} (Mi vida pasada)`);
        
        return { A, B, C };
    }

    // Cálculo de números positivos
    calculatePositiveNumbers(base) {
        const { A, B, C } = base;
        console.log('\n✨ NÚMEROS POSITIVOS:');
        console.log('═══════════════════');
        
        // D = A + B + C
        const D = this.reduceNumber(A + B + C);
        console.log(`D (Mi máscara): ${A} + ${B} + ${C} = ${A + B + C} → ${D}`);
        
        // E = A + B
        const E = this.reduceNumber(A + B);
        console.log(`E (Implantación del programa): ${A} + ${B} = ${A + B} → ${E}`);
        
        // F = B + C
        const F = this.reduceNumber(B + C);
        console.log(`F (Encuentro con tu maestro): ${B} + ${C} = ${B + C} → ${F}`);
        
        // G = E + F
        const G = this.reduceNumber(E + F);
        console.log(`G (Re-identificación con tu yo): ${E} + ${F} = ${E + F} → ${G}`);
        
        // H = A + C (CORREGIDO desde PPT CLASE 1.pdf)
        const H = this.reduceNumber(A + C);
        console.log(`H (Tu destino): ${A} + ${C} = ${A + C} → ${H}`);
        
        // I = E + F + G (CORREGIDO desde PPT CLASE 1.pdf)
        const I = this.reduceNumber(E + F + G);
        console.log(`I (Inconsciente): ${E} + ${F} + ${G} = ${E + F + G} → ${I}`);
        
        // J = D + H (CORREGIDO desde PPT CLASE 1.pdf)
        const J = this.reduceNumber(D + H);
        console.log(`J (Mi espejo): ${D} + ${H} = ${D + H} → ${J}`);
        
        // X = B + D
        const X = this.reduceNumber(B + D);
        console.log(`X (Reacción): ${B} + ${D} = ${B + D} → ${X}`);
        
        // Y = A + B + C + D + X
        const Y = this.reduceNumber(A + B + C + D + X);
        console.log(`Y (Misión): ${A} + ${B} + ${C} + ${D} + ${X} = ${A + B + C + D + X} → ${Y}`);
        
        return { D, E, F, G, H, I, J, X, Y };
    }

    // Cálculo de números negativos
    calculateNegativeNumbers(base) {
        const { A, B, C } = base;
        console.log('\n⚠️ NÚMEROS NEGATIVOS:');
        console.log('═══════════════════');
        
        // K = |A - B|
        const K = Math.abs(A - B);
        console.log(`K (Adolescencia): |${A} - ${B}| = ${K}`);
        
        // L = |B - C|
        const L = Math.abs(B - C);
        console.log(`L (Juventud): |${B} - ${C}| = ${L}`);
        
        // M = Regla especial: K ≠ L ? |K - L| : K + L
        let M;
        if (K !== L) {
            M = Math.abs(K - L);
            console.log(`M (Adultez): K ≠ L → |${K} - ${L}| = ${M}`);
        } else {
            M = this.reduceNumber(K + L);
            console.log(`M (Adultez): K = L → ${K} + ${L} = ${K + L} → ${M}`);
        }
        
        // N = |A - C|
        const N = Math.abs(A - C);
        console.log(`N (Adulto mayor): |${A} - ${C}| = ${N}`);
        
        // O = M + K + L (CORREGIDO desde PPT CLASE 1.pdf)
        const O = this.reduceNumber(M + K + L);
        console.log(`O (Inconsciente negativo): ${M} + ${K} + ${L} = ${M + K + L} → ${O}`);
        
        // P = D + O
        const positive = this.calculatePositiveNumbers(base);
        const P = this.reduceNumber(positive.D + O);
        console.log(`P (Mi sombra): ${positive.D} + ${O} = ${positive.D + O} → ${P}`);
        
        // Q = K + M
        const Q = this.reduceNumber(K + M);
        console.log(`Q (Ser inferior 1): ${K} + ${M} = ${K + M} → ${Q}`);
        
        // R = L + M
        const R = this.reduceNumber(L + M);
        console.log(`R (Ser inferior 2): ${L} + ${M} = ${L + M} → ${R}`);
        
        // S = Q + R
        const S = this.reduceNumber(Q + R);
        console.log(`S (Ser inferior 3): ${Q} + ${R} = ${Q + R} → ${S}`);
        
        return { K, L, M, N, O, P, Q, R, S };
    }

    // Cálculo de números especiales
    calculateSpecialNumbers() {
        console.log('\n🎁 NÚMEROS ESPECIALES:');
        console.log('════════════════════');
        
        // W = Nombre completo (sistema Caldeo)
        const nameValue = this.name
            .replace(/\s/g, '') // Quitar espacios
            .split('')
            .map(letter => this.caldeoSystem[letter] || 0)
            .reduce((sum, value) => sum + value, 0);
        const W = this.reduceNumber(nameValue);
        console.log(`W (Triplicidad): ${this.name} → ${nameValue} → ${W}`);
        
        // Z = Últimos 2 dígitos del año
        const lastTwoDigits = this.year % 100;
        const Z = this.reduceNumber(lastTwoDigits);
        console.log(`Z (Regalo divino): ${this.year} → ${lastTwoDigits} → ${Z}`);
        
        return { W, Z };
    }

    // Cálculo completo del Pináculo
    calculateCompletePinaculo() {
        console.log('🎭 CÁLCULO DEL PINÁCULO DE CARLOS CARPIO');
        console.log('═'.repeat(50));
        console.log(`👤 Nombre: ${this.name}`);
        console.log(`📅 Fecha de nacimiento: ${this.birthDate}`);
        console.log(`📊 Fórmulas basadas en: PPT CLASE 1.pdf`);
        console.log('═'.repeat(50));
        
        // Calcular todos los números
        const base = this.calculateBaseNumbers();
        const positive = this.calculatePositiveNumbers(base);
        const negative = this.calculateNegativeNumbers(base);
        const special = this.calculateSpecialNumbers();
        
        // Resultado final
        console.log('\n🏆 PINÁCULO COMPLETO DE CARLOS CARPIO:');
        console.log('═'.repeat(50));
        
        const pinaculo = {
            ...base,
            ...positive,
            ...negative,
            ...special
        };
        
        // Mostrar todos los valores ordenados
        const ordenAlfabetico = Object.keys(pinaculo).sort();
        ordenAlfabetico.forEach(key => {
            console.log(`${key}: ${pinaculo[key]}`);
        });
        
        console.log('\n📋 RESUMEN POR CATEGORÍAS:');
        console.log('Base:', `A=${base.A}, B=${base.B}, C=${base.C}`);
        console.log('Positivos:', `D=${positive.D}, E=${positive.E}, F=${positive.F}, G=${positive.G}, H=${positive.H}, I=${positive.I}, J=${positive.J}, X=${positive.X}, Y=${positive.Y}`);
        console.log('Negativos:', `K=${negative.K}, L=${negative.L}, M=${negative.M}, N=${negative.N}, O=${negative.O}, P=${negative.P}, Q=${negative.Q}, R=${negative.R}, S=${negative.S}`);
        console.log('Especiales:', `W=${special.W}, Z=${special.Z}`);
        
        console.log('\n✅ CÁLCULO COMPLETADO SEGÚN PPT CLASE 1.pdf');
        
        return pinaculo;
    }
}

// Ejecutar el cálculo
if (require.main === module) {
    const calculator = new CarlosPinaculoCalculator();
    const resultado = calculator.calculateCompletePinaculo();
    
    // Guardar resultado en JSON
    const fs = require('fs');
    const resultadoCompleto = {
        persona: {
            nombre: "CARLOS CARPIO",
            fechaNacimiento: "06/05/1982",
            dia: 6,
            mes: 5,
            año: 1982
        },
        pinaculo: resultado,
        metadata: {
            timestamp: new Date().toISOString(),
            fuente: "PPT CLASE 1.pdf",
            metodo: "Fórmulas exactas verificadas por Playwright MCP"
        }
    };
    
    fs.writeFileSync('carlos-carpio-pinaculo-resultado.json', JSON.stringify(resultadoCompleto, null, 2));
    console.log('\n💾 Resultado guardado en: carlos-carpio-pinaculo-resultado.json');
}

module.exports = CarlosPinaculoCalculator; 