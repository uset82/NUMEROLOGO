#!/usr/bin/env node

// REGLAS DEL PINÁCULO - COMPROBACIÓN D y H
// Basado en las reglas exactas del PDF

class ReglasComprobacionPinaculo {
    constructor() {
        this.name = "CARLOS CARPIO";
        this.day = 6;    // Corregido: 05/06/1982 - día 6
        this.month = 5;  // Corregido: 05/06/1982 - mes 5 (mayo)
        this.year = 1982;
    }

    reduceNumber(num) {
        if (num === 11 || num === 22 || num === 33) {
            return num; // Números maestros
        }
        
        // Suma de dígitos hasta reducir a una cifra
        while (num > 9) {
            let sum = 0;
            while (num > 0) {
                sum += num % 10;
                num = Math.floor(num / 10);
            }
            num = sum;
            
            // Verificar si es número maestro después de la suma
            if (num === 11 || num === 22 || num === 33) {
                return num;
            }
        }
        return num;
    }

    calculateBase() {
        // A = MES, B = DÍA, C = AÑO (todos reducidos)
        const A = this.reduceNumber(this.month);  // 6
        const B = this.reduceNumber(this.day);    // 5
        const yearSum = this.year.toString().split('').map(Number).reduce((a, b) => a + b, 0);
        const C = this.reduceNumber(yearSum);     // 1+9+8+2=20→2
        
        console.log(`A (MES): ${this.month} → ${A}`);
        console.log(`B (DÍA): ${this.day} → ${B}`);
        console.log(`C (AÑO): ${this.year} → ${yearSum} → ${C}`);
        
        return { A, B, C };
    }

    // REGLA CRÍTICA PARA D (NUEVA VERSIÓN CORRECTA)
    calculateD_WithVerification() {
        console.log('\n🔍 CÁLCULO DE D CON REGLA DE COMPROBACIÓN:');
        console.log('═'.repeat(50));
        
        // PASO 1: D1 = A + B + C (SIN REDUCIR)
        const A_raw = this.month;  // 6 (sin reducir)
        const B_raw = this.day;    // 5 (sin reducir) 
        const C_raw = this.year;   // 1982 (sin reducir)
        const D1 = A_raw + B_raw + C_raw; // 6 + 5 + 1982 = 1993
        
        console.log(`📊 PASO 1 - D1 (sin reducir):`);
        console.log(`A + B + C = ${A_raw} + ${B_raw} + ${C_raw} = ${D1}`);
        
        // PASO 2: D2 = A + B + C (REDUCIDOS)
        const A_reduced = this.reduceNumber(this.month);  // 6
        const B_reduced = this.reduceNumber(this.day);    // 5
        const yearSum = this.year.toString().split('').map(Number).reduce((a, b) => a + b, 0);
        const C_reduced = this.reduceNumber(yearSum);     // 1+9+8+2=20→2
        const D2 = A_reduced + B_reduced + C_reduced; // 6 + 5 + 2 = 13
        
        console.log(`📊 PASO 2 - D2 (reducidos):`);
        console.log(`A_red + B_red + C_red = ${A_reduced} + ${B_reduced} + ${C_reduced} = ${D2}`);
        
        // Reducir D2 para comparación
        const D2_reduced = this.reduceNumber(D2); // 13 → 4
        console.log(`D2 reducido: ${D2} → ${D2_reduced}`);
        
        // VERIFICAR SI NECESITA COMPROBACIÓN
        const needsVerification = [2, 11, 4, 22].includes(D2_reduced);
        console.log(`\n🔍 ¿D2=${D2_reduced} necesita verificación? ${needsVerification ? '✅ SÍ' : '❌ NO'}`);
        
        if (needsVerification) {
            // Reducir D1 para comparar
            const D1_reduced = this.reduceNumber(D1); // 1993 → 22
            console.log(`D1 reducido: ${D1} → ${D1_reduced}`);
            
            console.log('\n📋 APLICANDO CONDICIONALES:');
            console.log(`D1_reducido = ${D1_reduced}`);
            console.log(`D2_reducido = ${D2_reduced}`);
            
            if (D1_reduced === D2_reduced) {
                console.log(`✅ D1 = D2 → D = ${D1_reduced}`);
                return D1_reduced;
            } else {
                console.log(`❌ D1 ≠ D2 → D = ${D1_reduced} (se toma D1)`);
                console.log(`🔮 Simbología: ${D2_reduced}/${D1_reduced} (más importante: ${D1_reduced})`);
                return D1_reduced;
            }
        } else {
            console.log(`📊 RESULTADO: D = ${D2_reduced} (sin verificación necesaria)`);
            return D2_reduced;
        }
    }

    // REGLA CRÍTICA PARA H (NUEVA VERSIÓN CORRECTA)
    calculateH_WithVerification() {
        console.log('\n🔍 CÁLCULO DE H CON REGLA DE COMPROBACIÓN:');
        console.log('═'.repeat(50));
        
        // PASO 1: H1 = A + C (SIN REDUCIR)
        const A_raw = this.month;  // 6 (sin reducir)
        const C_raw = this.year;   // 1982 (sin reducir)
        const H1 = A_raw + C_raw; // 6 + 1982 = 1988
        
        console.log(`📊 PASO 1 - H1 (sin reducir):`);
        console.log(`A + C = ${A_raw} + ${C_raw} = ${H1}`);
        
        // PASO 2: H2 = A + C (REDUCIDOS)
        const A_reduced = this.reduceNumber(this.month);  // 6
        const yearSum = this.year.toString().split('').map(Number).reduce((a, b) => a + b, 0);
        const C_reduced = this.reduceNumber(yearSum);     // 1+9+8+2=20→2
        const H2 = A_reduced + C_reduced; // 6 + 2 = 8
        
        console.log(`📊 PASO 2 - H2 (reducidos):`);
        console.log(`A_red + C_red = ${A_reduced} + ${C_reduced} = ${H2}`);
        
        // Reducir H2 para comparación
        const H2_reduced = this.reduceNumber(H2); // 8 → 8
        console.log(`H2 reducido: ${H2} → ${H2_reduced}`);
        
        // VERIFICAR SI NECESITA COMPROBACIÓN
        const needsVerification = [2, 11, 4, 22].includes(H2_reduced);
        console.log(`\n🔍 ¿H2=${H2_reduced} necesita verificación? ${needsVerification ? '✅ SÍ' : '❌ NO'}`);
        
        if (needsVerification) {
            // Reducir H1 para comparar
            const H1_reduced = this.reduceNumber(H1); // 1988 → ?
            console.log(`H1 reducido: ${H1} → ${H1_reduced}`);
            
            console.log('\n📋 APLICANDO CONDICIONALES:');
            console.log(`H1_reducido = ${H1_reduced}`);
            console.log(`H2_reducido = ${H2_reduced}`);
            
            if (H1_reduced === H2_reduced) {
                console.log(`✅ H1 = H2 → H = ${H1_reduced}`);
                return H1_reduced;
            } else {
                console.log(`❌ H1 ≠ H2 → H = ${H1_reduced} (se toma H1)`);
                console.log(`🔮 Simbología: ${H2_reduced}/${H1_reduced} (más importante: ${H1_reduced})`);
                return H1_reduced;
            }
        } else {
            console.log(`📊 RESULTADO: H = ${H2_reduced} (sin verificación necesaria)`);
            return H2_reduced;
        }
    }

    // Aplicar las reglas a Carlos Carpio
    aplicarReglasCompletas() {
        console.log('🎭 REGLAS DEL PINÁCULO - CARLOS CARPIO');
        console.log('═'.repeat(60));
        console.log(`👤 Nombre: ${this.name}`);
        console.log(`📅 Fecha: ${this.day}/${this.month}/${this.year}`);
        
        // Números base
        const { A, B, C } = this.calculateBase();
        
        // Aplicar reglas de comprobación
        const D = this.calculateD_WithVerification();
        const H = this.calculateH_WithVerification();
        
        console.log('\n🎯 RESULTADO FINAL CON REGLAS APLICADAS:');
        console.log('═'.repeat(40));
        console.log(`A = ${A}`);
        console.log(`B = ${B}`);
        console.log(`C = ${C}`);
        console.log(`D = ${D} ${[11, 22, 33].includes(D) ? '⭐ (maestro)' : ''}`);
        console.log(`H = ${H} ${[11, 22, 33].includes(H) ? '⭐ (maestro)' : ''}`);
        
        // Verificar contra el screenshot
        console.log('\n📊 COMPARACIÓN CON SCREENSHOT:');
        console.log(`Screenshot muestra D = 22 → ${D === 22 ? '✅ CORRECTO' : '❌ INCORRECTO'}`);
        console.log(`Screenshot muestra H = 7 → ${H === 7 ? '✅ CORRECTO' : '❌ INCORRECTO'}`);
        
        return { A, B, C, D, H };
    }

    // Mostrar ejemplos del PDF
    mostrarEjemplosDelPDF() {
        console.log('\n📚 EJEMPLOS DEL PDF PARA ENTENDER LAS REGLAS:');
        console.log('═'.repeat(60));
        
        console.log('\n🔸 Ejemplo 1 (18/10/1981) - Regla D:');
        console.log('Comprobación: 10 + 18 + 1981 = 2009 → 11');
        console.log('D = 11 (número maestro)');
        
        console.log('\n🔸 Ejemplo 2 (10/04/1979) - Regla D:');
        console.log('Comprobación: 4 + 10 + 1979 = 1993 → 22');
        console.log('D = 4/22 (número maestro)');
        
        console.log('\n🔸 Ejemplo 3 (03/08/1998) - Regla D:');
        console.log('Comprobación: 3 + 8 + 1998 = 2009 → 11');
        console.log('D = 2/11 (número maestro)');
        
        console.log('\n🔸 Ejemplo H (23/09/2000) - Regla H:');
        console.log('Comprobación: 9 + 2000 = 2009 → 11');
        console.log('H = 11 (número maestro)');
        
        console.log('\n🔸 Ejemplo H (21/12/1970) - Regla H:');
        console.log('Comprobación: 12 + 1970 = 1982 → 20 → 2');
        console.log('H = 11/2 (fracción especial)');
    }
}

// Ejecutar
const calculator = new ReglasComprobacionPinaculo();
calculator.mostrarEjemplosDelPDF();
calculator.aplicarReglasCompletas(); 