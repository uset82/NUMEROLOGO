// TEST MANUAL DE CÁLCULO H
console.log('🧮 CALCULANDO H MANUALMENTE:');
console.log('═══════════════════════════');

// Datos de Carlos Carpio
const month = 6;
const year = 1982;

console.log(`Mes: ${month}`);
console.log(`Año: ${year}`);

// H1 = A + C (sin reducir)
const H1 = month + year;
console.log(`\nH1 = ${month} + ${year} = ${H1}`);

// Reducir H1
console.log(`\nReduciendo H1 = ${H1}:`);
console.log(`${H1} → 1+9+8+8 = ${1+9+8+8} = 26`);
console.log(`26 → 2+6 = ${2+6} = 8`);

// Pero... ¿será que hay un error?
console.log(`\n🤔 ¿Debería ser 7?`);
console.log(`Verificando: 1+9+8+8 = ${1+9+8+8}`);
console.log(`26 → 2+6 = ${2+6}`);

// Tal vez el año se suma diferente?
console.log(`\n🔍 ¿Será que se suma el año dígito por dígito?`);
console.log(`Año 1982: 1+9+8+2 = ${1+9+8+2} = 20`);
console.log(`H1 = ${month} + 20 = ${month + 20} = 26`);
console.log(`26 → 2+6 = ${2+6} = 8`);

// ¿O tal vez Month + (año reducido)?
console.log(`\n🔍 ¿O Month + año reducido?`);
console.log(`Año 1982: 1+9+8+2 = 20 → 2+0 = 2`);
console.log(`H1 = ${month} + 2 = ${month + 2} = 8`);

console.log(`\n🤷‍♂️ Todos dan 8, pero el screenshot muestra 7...`);