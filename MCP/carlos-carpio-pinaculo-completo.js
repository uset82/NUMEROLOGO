#!/usr/bin/env node

// CALCULADOR COMPLETO DEL PINÁCULO DE CARLOS CARPIO
// Con las 23 letras/nodos y todas las fórmulas exactas

class PinaculoCompleto {
    constructor() {
        this.name = "CARLOS CARPIO";
        this.day = 6;    // 05/06/1982 - día 6
        this.month = 5;  // 05/06/1982 - mes 5 (mayo)
        this.year = 1982;
        
        // Sistema Caldeo para calcular W
        this.caldeo = {
            'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 8, 'G': 3, 'H': 5,
            'I': 1, 'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 7, 'P': 8,
            'Q': 1, 'R': 2, 'S': 3, 'T': 4, 'U': 6, 'V': 6, 'W': 6, 'X': 5,
            'Y': 1, 'Z': 7
        };
        
        this.results = {};
    }

    reduceNumber(num) {
        if (num === 11 || num === 22 || num === 33) {
            return num; // Números maestros
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

    // Aplicar reglas de comprobación para D y H
    applyVerificationRule(baseValue, calculation1, calculation2, label) {
        const needsVerification = [2, 11, 4, 22].includes(baseValue);
        
        if (needsVerification) {
            const val1 = this.reduceNumber(calculation1);
            const val2 = this.reduceNumber(calculation2);
            
            console.log(`🔍 ${label} necesita verificación (${baseValue})`);
            console.log(`  ${label}1 = ${calculation1} → ${val1}`);
            console.log(`  ${label}2 = ${calculation2} → ${val2}`);
            
            if (val1 === val2) {
                console.log(`  ✅ ${label}1 = ${label}2 → ${label} = ${val1}`);
                return val1;
            } else {
                console.log(`  ❌ ${label}1 ≠ ${label}2 → ${label} = ${val1} (se toma ${label}1)`);
                console.log(`  🔮 Simbología: ${val2}/${val1}`);
                return val1;
            }
        } else {
            console.log(`📊 ${label} = ${baseValue} (sin verificación necesaria)`);
            return baseValue;
        }
    }

    // Calcular nombre según sistema Caldeo
    calculateNameNumber(name) {
        let sum = 0;
        for (let char of name.replace(/\s+/g, '')) {
            if (this.caldeo[char.toUpperCase()]) {
                sum += this.caldeo[char.toUpperCase()];
            }
        }
        return this.reduceNumber(sum);
    }

    calculateAll() {
        console.log('🎭 PINÁCULO COMPLETO DE CARLOS CARPIO');
        console.log('═'.repeat(70));
        console.log(`👤 Nombre: ${this.name}`);
        console.log(`📅 Fecha: ${this.day}/${this.month}/${this.year}`);
        console.log();

        // ═══ NIVEL BASE (A, B, C, D) ═══
        console.log('🔷 NIVEL BASE:');
        console.log('─'.repeat(50));
        
        // A = MES (reducido)
        this.results.A = this.reduceNumber(this.month);
        console.log(`A (TAREA NO APRENDIDA) = ${this.month} → ${this.results.A}`);
        
        // B = DÍA (reducido)  
        this.results.B = this.reduceNumber(this.day);
        console.log(`B (MI ESENCIA) = ${this.day} → ${this.results.B}`);
        
        // C = AÑO (reducido)
        const yearSum = this.year.toString().split('').map(Number).reduce((a, b) => a + b, 0);
        this.results.C = this.reduceNumber(yearSum);
        console.log(`C (MI VIDA PASADA) = ${this.year} → ${yearSum} → ${this.results.C}`);
        
        // D = A + B + C (con regla de comprobación)
        const D_base = this.reduceNumber(this.results.A + this.results.B + this.results.C);
        const D1 = this.month + this.day + this.year; // Sin reducir
        const D2 = this.results.A + this.results.B + this.results.C; // Reducidos
        this.results.D = this.applyVerificationRule(D_base, D1, D2, 'D');
        console.log(`D (MI MÁSCARA) = ${this.results.D}`);
        console.log();

        // ═══ NIVEL SUPERIOR (H, Y) ═══  
        console.log('🔷 NIVEL SUPERIOR:');
        console.log('─'.repeat(50));
        
        // H = A + C (con regla de comprobación)
        const H_base = this.reduceNumber(this.results.A + this.results.C);
        const H1 = this.month + this.year; // Sin reducir
        const H2 = this.results.A + this.results.C; // Reducidos
        this.results.H = this.applyVerificationRule(H_base, H1, H2, 'H');
        console.log(`H (TU DESTINO) = ${this.results.H}`);
        
        // X = B + D
        this.results.X = this.reduceNumber(this.results.B + this.results.D);
        console.log(`X (REACCIÓN) = ${this.results.B} + ${this.results.D} → ${this.results.X}`);
        
        // Y = A + B + C + D + X
        this.results.Y = this.reduceNumber(this.results.A + this.results.B + this.results.C + this.results.D + this.results.X);
        console.log(`Y (MISIÓN) = ${this.results.A} + ${this.results.B} + ${this.results.C} + ${this.results.D} + ${this.results.X} → ${this.results.Y}`);
        console.log();

        // ═══ NIVEL CICLOS (E, F, G) ═══
        console.log('🔷 NIVEL CICLOS:');
        console.log('─'.repeat(50));
        
        // E = A + B
        this.results.E = this.reduceNumber(this.results.A + this.results.B);
        console.log(`E (IMPLANTACIÓN DEL PROGRAMA) = ${this.results.A} + ${this.results.B} → ${this.results.E}`);
        
        // F = B + C
        this.results.F = this.reduceNumber(this.results.B + this.results.C);
        console.log(`F (ENCUENTRO CON TU MAESTRO) = ${this.results.B} + ${this.results.C} → ${this.results.F}`);
        
        // G = E + F
        this.results.G = this.reduceNumber(this.results.E + this.results.F);
        console.log(`G (RE-IDENTIFICACIÓN CON TU YO) = ${this.results.E} + ${this.results.F} → ${this.results.G}`);
        console.log();

        // ═══ NIVEL OCULTO (I, J) ═══
        console.log('🔷 NIVEL OCULTO:');
        console.log('─'.repeat(50));
        
        // I = E + F + G
        this.results.I = this.reduceNumber(this.results.E + this.results.F + this.results.G);
        console.log(`I (INCONSCIENTE) = ${this.results.E} + ${this.results.F} + ${this.results.G} → ${this.results.I}`);
        
        // J = D + H
        this.results.J = this.reduceNumber(this.results.D + this.results.H);
        console.log(`J (MI ESPEJO) = ${this.results.D} + ${this.results.H} → ${this.results.J}`);
        console.log();

        // ═══ NIVEL NEGATIVOS (K, L, M, N, O, P, Q, R, S) ═══
        console.log('🔷 NIVEL NEGATIVOS:');
        console.log('─'.repeat(50));
        
        // K = |A - B|
        this.results.K = Math.abs(this.results.A - this.results.B);
        console.log(`K (ADOLESCENCIA) = |${this.results.A} - ${this.results.B}| → ${this.results.K}`);
        
        // L = |B - C|
        this.results.L = Math.abs(this.results.B - this.results.C);
        console.log(`L (JUVENTUD) = |${this.results.B} - ${this.results.C}| → ${this.results.L}`);
        
        // M = K ≠ L ? |K - L| : K + L
        if (this.results.K !== this.results.L) {
            this.results.M = Math.abs(this.results.K - this.results.L);
            console.log(`M (ADULTEZ) = |${this.results.K} - ${this.results.L}| → ${this.results.M} (K ≠ L)`);
        } else {
            this.results.M = this.reduceNumber(this.results.K + this.results.L);
            console.log(`M (ADULTEZ) = ${this.results.K} + ${this.results.L} → ${this.results.M} (K = L)`);
        }
        
        // N = |A - C|
        this.results.N = Math.abs(this.results.A - this.results.C);
        console.log(`N (ADULTO MAYOR) = |${this.results.A} - ${this.results.C}| → ${this.results.N}`);
        
        // O = M + K + L
        this.results.O = this.reduceNumber(this.results.M + this.results.K + this.results.L);
        console.log(`O (INCONSCIENTE NEGATIVO) = ${this.results.M} + ${this.results.K} + ${this.results.L} → ${this.results.O}`);
        
        // P = D + O
        this.results.P = this.reduceNumber(this.results.D + this.results.O);
        console.log(`P (MI SOMBRA) = ${this.results.D} + ${this.results.O} → ${this.results.P}`);
        
        // Q = K + M
        this.results.Q = this.reduceNumber(this.results.K + this.results.M);
        console.log(`Q (SER INFERIOR 1) = ${this.results.K} + ${this.results.M} → ${this.results.Q}`);
        
        // R = L + M
        this.results.R = this.reduceNumber(this.results.L + this.results.M);
        console.log(`R (SER INFERIOR 2) = ${this.results.L} + ${this.results.M} → ${this.results.R}`);
        
        // S = Q + R
        this.results.S = this.reduceNumber(this.results.Q + this.results.R);
        console.log(`S (SER INFERIOR 3) = ${this.results.Q} + ${this.results.R} → ${this.results.S}`);
        console.log();

        // ═══ NIVEL ESPECIAL (W, Z) ═══
        console.log('🔷 NIVEL ESPECIAL:');
        console.log('─'.repeat(50));
        
        // W = Nombre completo (sistema Caldeo)
        this.results.W = this.calculateNameNumber(this.name);
        console.log(`W (TRIPLICIDAD) = ${this.name} → ${this.results.W} (sistema Caldeo)`);
        
        // Z = Últimos 2 dígitos del año
        this.results.Z = this.reduceNumber(this.year % 100);
        console.log(`Z (REGALO DIVINO) = ${this.year % 100} → ${this.results.Z}`);
        console.log();

        // ═══ RESUMEN FINAL ═══
        this.mostrarResumenFinal();
        
        return this.results;
    }

    mostrarResumenFinal() {
        console.log('🎯 RESUMEN FINAL - PINÁCULO DE CARLOS CARPIO');
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
                const valor = this.results[letra];
                const esMaestro = [11, 22, 33].includes(valor) ? ' ⭐' : '';
                console.log(`  ${letra} = ${valor}${esMaestro}`);
            });
        });

        console.log('\n📊 NÚMEROS MAESTROS ENCONTRADOS:');
        const maestros = Object.entries(this.results)
            .filter(([, valor]) => [11, 22, 33].includes(valor))
            .map(([letra, valor]) => `${letra}=${valor}`);
        
        if (maestros.length > 0) {
            console.log(`  ${maestros.join(', ')}`);
        } else {
            console.log('  Ninguno encontrado');
        }

        console.log('\n✅ CÁLCULO COMPLETO FINALIZADO');
    }
}

// Ejecutar
const pinaculo = new PinaculoCompleto();
const resultado = pinaculo.calculateAll();

// Guardar resultado en JSON
const fs = require('fs');
fs.writeFileSync('carlos-carpio-pinaculo-completo.json', JSON.stringify({
    nombre: "Carlos Carpio",
    fecha: "05/06/1982",
    pinaculo: resultado,
    timestamp: new Date().toISOString()
}, null, 2));

console.log('\n💾 Resultado guardado en: carlos-carpio-pinaculo-completo.json');