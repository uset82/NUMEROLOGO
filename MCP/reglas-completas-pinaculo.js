#!/usr/bin/env node

// SISTEMA COMPLETO DEL PINÁCULO CON TODAS LAS REGLAS
console.log('📚 REGLAS COMPLETAS DEL PINÁCULO');
console.log('═'.repeat(70));

// REGLA CRÍTICA PARA NEGATIVOS
console.log('\n🔴 REGLA FUNDAMENTAL PARA K, L, N:');
console.log('Si A, B o C = 11 o 22, se convierten en 2 o 4 SOLO para las restas');
console.log('• 11 → 2');
console.log('• 22 → 4');
console.log('• 33 → 6 (si aplicara)');

// Aplicar a 23/11/1994
console.log('\n📊 APLICACIÓN CORRECTA - 23/11/1994:');

const fecha = '23/11/1994';
const A_original = 11;  // MES
const B_original = 5;   // DÍA: 23→5
const C_original = 5;   // AÑO: 1994→23→5

console.log(`\nValores originales:`);
console.log(`A = ${A_original} (mes)`);
console.log(`B = ${B_original} (día)`);
console.log(`C = ${C_original} (año)`);

// Conversión para negativos
const A_para_resta = A_original === 11 ? 2 : (A_original === 22 ? 4 : A_original);
const B_para_resta = B_original === 11 ? 2 : (B_original === 22 ? 4 : B_original);
const C_para_resta = C_original === 11 ? 2 : (C_original === 22 ? 4 : C_original);

console.log(`\nValores para restas (K,L,N):`);
console.log(`A = ${A_original} → ${A_para_resta}`);
console.log(`B = ${B_original} → ${B_para_resta}`);
console.log(`C = ${C_original} → ${C_para_resta}`);

// Cálculos correctos
console.log('\n🔹 CÁLCULOS NEGATIVOS:');
const K = Math.abs(A_para_resta - B_para_resta);
console.log(`K = |${A_para_resta} - ${B_para_resta}| = ${K} (Adolescencia)`);

const L = Math.abs(B_para_resta - C_para_resta);
console.log(`L = |${B_para_resta} - ${C_para_resta}| = ${L} (Juventud)`);

const M = K !== L ? Math.abs(K - L) : K + L;
console.log(`M = ${K !== L ? `|${K} - ${L}|` : `${K} + ${L}`} = ${M} (Adultez)`);

const N = Math.abs(A_para_resta - C_para_resta);
console.log(`N = |${A_para_resta} - ${C_para_resta}| = ${N} (Adulto mayor)`);

const O = K + L + M;
console.log(`\nO = ${K} + ${L} + ${M} = ${O} (Inconsciente negativo)`);

const P = 3 + O; // D=3
console.log(`P = 3 + ${O} = ${P} (Mi sombra)`);

const Q = K + M;
console.log(`Q = ${K} + ${M} = ${Q} (Ser inferior 1)`);

const R = L + M;
console.log(`R = ${L} + ${M} = ${R} (Ser inferior 2)`);

const S = Q + R;
console.log(`S = ${Q} + ${R} = ${S} (Ser inferior 3)`);

// Nueva información: T (Ausentes)
console.log('\n🔹 CÁLCULO DE T (AUSENTES):');
console.log('T = números del 1 al 9 que NO aparecen en el Pináculo');

// Recopilar todos los números del pináculo
const todosLosNumeros = [
    11, 5, 5, 3,  // A, B, C, D
    7, 8, 5, 4,   // H, X, Y, Z
    7, 1, 8,      // E, F, G
    7, 1,         // I, J
    3, 0, 3, 3,   // K, L, M, N (usando valores corregidos)
    6, 9, 6, 3, 9 // O, P, Q, R, S
];

// Contar apariciones del 1 al 9
const apariciones = new Array(10).fill(0);
todosLosNumeros.forEach(num => {
    if (num >= 0 && num <= 9) apariciones[num]++;
});

console.log('\nApariciones por número:');
for (let i = 1; i <= 9; i++) {
    console.log(`${i}: ${apariciones[i]} veces`);
}

const ausentes = [];
for (let i = 1; i <= 9; i++) {
    if (apariciones[i] === 0) ausentes.push(i);
}

console.log(`\nNúmeros ausentes: ${ausentes.join(', ')}`);
console.log(`T = ${ausentes.length === 1 ? ausentes[0] : ausentes.join('+')}`);

// RESUMEN COMPLETO CORREGIDO
console.log('\n✅ RESUMEN FINAL CORREGIDO 23/11/1994:');
console.log('═'.repeat(50));
console.log('BASE: A=11⭐, B=5, C=5, D=3');
console.log('SUPERIOR: H=7, X=8, Y=5, Z=4');
console.log('CICLOS: E=7, F=1, G=8');
console.log('OCULTO: I=7, J=1');
console.log('NEGATIVOS: K=3, L=0, M=3, N=3, O=6, P=9, Q=6, R=3, S=9');
console.log('ESPECIAL: W=0, Z=4, T=2 (ausente)');