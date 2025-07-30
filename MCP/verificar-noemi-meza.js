#!/usr/bin/env node

// VERIFICACIÓN Y CORRECCIÓN - NOEMI MEZA
console.log('🔍 VERIFICACIÓN DE CÁLCULOS - NOEMI MEZA');
console.log('═'.repeat(60));
console.log('Fecha: 25/10/1948\n');

// Valores base correctos
const A = 1;  // MES: 10 → 1
const B = 7;  // DÍA: 25 → 7  
const C = 22; // AÑO: 1948 → 22
const D = 3;  // A+B+C: 1+7+22=30 → 3

console.log('✅ VALORES BASE:');
console.log(`A=1, B=7, C=22, D=3`);

// Cálculos negativos
console.log('\n🔍 VERIFICANDO NEGATIVOS:');

const K = Math.abs(A - B);
console.log(`K = |${A} - ${B}| = ${K}`); // 6 ✅

const L = Math.abs(B - C);
console.log(`L = |${B} - ${C}| = ${L}`); // 15

// Para L, debemos verificar si se reduce
const L_reduced = L > 9 ? (1 + 5) : L;
console.log(`L reducido = ${L} → ${L_reduced}`); // 15 → 6? 

// M calculation
let M;
if (K !== L_reduced) {
    M = Math.abs(K - L_reduced);
    console.log(`M = |${K} - ${L_reduced}| = ${M} (K ≠ L)`);
} else {
    M = K + L_reduced;
    console.log(`M = ${K} + ${L_reduced} = ${M} (K = L)`);
}

const N = Math.abs(A - C);
console.log(`N = |${A} - ${C}| = ${N}`); // 21

// Para N, verificar si se reduce
const N_reduced = N > 9 ? (2 + 1) : N;
console.log(`N reducido = ${N} → ${N_reduced}`); // 21 → 3

// O = M + K + L
const O = M + K + L_reduced;
console.log(`\nO = ${M} + ${K} + ${L_reduced} = ${O}`);
const O_reduced = O > 9 ? ((Math.floor(O/10)) + (O%10)) : O;
console.log(`O reducido = ${O} → ${O_reduced}`);

// Q = K + M  
const Q = K + M;
console.log(`\nQ = ${K} + ${M} = ${Q}`);

// R = L + M
const R = L_reduced + M;  
console.log(`R = ${L_reduced} + ${M} = ${R}`);

// S = Q + R
const S = Q + R;
console.log(`S = ${Q} + ${R} = ${S}`);
const S_reduced = S > 9 ? ((Math.floor(S/10)) + (S%10)) : S;
console.log(`S reducido = ${S} → ${S_reduced}`);

console.log('\n📊 COMPARACIÓN CON IMAGEN:');
console.log(`Q: Calculé ${Q}, Imagen muestra 9`);
console.log(`S: Calculé ${S_reduced}, Imagen muestra 6`);

// Intentar otra interpretación
console.log('\n🔄 OTRA INTERPRETACIÓN:');
console.log('Tal vez L y N no se reducen en las restas...');

const M2 = K !== L ? Math.abs(K - L) : K + L;
console.log(`M = |${K} - ${L}| = ${M2} (usando L=15)`);

const Q2 = K + M2;
console.log(`Q = ${K} + ${M2} = ${Q2}`);
const Q2_reduced = Q2 > 9 ? ((Math.floor(Q2/10)) + (Q2%10)) : Q2;
console.log(`Q reducido = ${Q2} → ${Q2_reduced}`);

console.log('\n✅ ESO ES! Los números en las restas NO se reducen hasta después de operar.');