/**
 * Real MCP Numerology Logic Agent Implementation
 * Uses actual MCP protocol for communication
 * FIXED: Now uses proper Pináculo system instead of Western numerology
 */

import { MCPAgent } from '../../mcp/server'

export interface NumerologyInput {
  name: string
  birthDate: string
}

export interface NumerologyReport {
  // Números base del Pináculo
  baseNumbers: {
    A: number; // TAREA NO APRENDIDA (Mes)
    B: number; // MI ESENCIA (Día)
    C: number; // MI VIDA PASADA (Año)
  };
  
  // Números positivos del Pináculo
  positiveNumbers: {
    D: number; // MI MÁSCARA
    E: number; // IMPLANTACIÓN DEL PROGRAMA
    F: number; // ENCUENTRO CON TU MAESTRO
    G: number; // RE-IDENTIFICACIÓN CON TU YO
    H: number; // TU DESTINO
    I: number; // INCONSCIENTE
    J: number; // MI ESPEJO
    X: number; // REACCIÓN
    Y: number; // MISIÓN
  };
  
  // Números negativos del Pináculo
  negativeNumbers: {
    K: number; // ADOLESCENCIA
    L: number; // JUVENTUD
    M: number; // ADULTEZ
    N: number; // ADULTO MAYOR
    O: number; // INCONSCIENTE NEGATIVO
    P: number; // MI SOMBRA
    Q: number; // SER INFERIOR 1
    R: number; // SER INFERIOR 2
    S: number; // SER INFERIOR 3
  };
  
  // Números del nombre (Sistema Caldeo)
  nameNumbers: {
    alma: number; // ALMA (Vocales)
    personality: number; // PERSONALIDAD (Consonantes)
    nameTotal: number; // NÚMERO PERSONAL (Nombre completo)
  };
  
  // Regalo Divino
  regaloDivino: number; // Z - REGALO DIVINO
  
  // Resumen principal
  summary: {
    esencia: number; // B
    mision: number; // Y
    alma: number; // Vocales
    personalidad: number; // Consonantes
    numeroPersonal: number; // Nombre completo
    regaloDivino: number; // Z
  };
  
  interpretations: Record<string, string>;
}

export class RealNumerologyLogicAgent implements MCPAgent {
  public readonly id = 'numerology-logic'
  public readonly name = 'Real Numerology Logic Agent (Pináculo System)'
  public readonly role = 'Pináculo Numerology Calculator'
  public readonly capabilities = ['numerology_calculation', 'pinaculo_interpretation', 'chaldean_numbers']

  private letterValues: { [key: string]: number } = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
    'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
  }

  public async handleRequest(request: any): Promise<any> {
    console.log(`[Pináculo Numerology Agent] Received request:`, request.type)

    switch (request.type) {
      case 'numerology_calculation':
        return await this.generateReport(request.input)
      
      case 'pinaculo_interpretation':
        return await this.interpretNumber(request.input)
      
      default:
        throw new Error(`Unknown request type: ${request.type}`)
    }
  }

  public async generateReport(input: NumerologyInput): Promise<NumerologyReport> {
    console.log(`[Pináculo Numerology Agent] Generating report for: ${input.name}`)

    // Parse birth date
    const [day, month, year] = input.birthDate.split('/').map(Number);
    
    // NÚMEROS BASE - EXACT competitor logic
    const A = month;  // MES (no reduction needed, months are 1-12)
    const B = day <= 9 ? day : this.reduceToSingleDigit(day);  // DÍA 
    const C = this.reduceToSingleDigit(year);  // AÑO

    // NÚMEROS POSITIVOS - EXACT formulas
    // CORRECCIÓN: D logic with special case for (day + month) * 2 = 22
    const D_original = this.reduceToSingleDigit(A + B + C);
    const D_theory = (day + month) * 2;
    // Use theory if it gives 22, otherwise use original formula
    const D = (D_theory === 22) ? 22 : D_original;

    const E = this.reduceToSingleDigit(A + B);
    const F = this.reduceToSingleDigit(B + C);
    const G = this.reduceToSingleDigit(E + F);
    const H = this.reduceToSingleDigit(A + C);
    const I = this.reduceToSingleDigit(E + F + G);
    const J = this.reduceToSingleDigit(D + H);
    const X = this.reduceToSingleDigit(B + D);
    const Y = this.reduceToSingleDigit(A + B + C + D + X);

    // NÚMEROS NEGATIVOS - EXACT formulas
    const K = Math.abs(A - B);
    const L = Math.abs(B - C);
    const M = K !== L ? Math.abs(K - L) : this.reduceToSingleDigit(K + L);
    const N = Math.abs(A - C);
    const O = this.reduceToSingleDigit(M + K + L);
    const P = this.reduceToSingleDigit(D + O);
    const Q = this.reduceToSingleDigit(K + M);
    const R = this.reduceToSingleDigit(L + M);
    const S = this.reduceToSingleDigit(Q + R);

    // NÚMEROS DEL NOMBRE - Sistema Caldeo
    const cleanName = input.name.toUpperCase().replace(/[^A-Z]/g, '');
    const nameTotal = cleanName.split('').reduce((sum, letter) => sum + this.getLetterValue(letter), 0);
    const nameNumber = this.reduceToSingleDigit(nameTotal);

    // ALMA (Vocales)
    const vowels = cleanName.split('').filter(c => 'AEIOU'.includes(c));
    const vowelTotal = vowels.reduce((sum, letter) => sum + this.getLetterValue(letter), 0);
    const almaNumber = this.reduceToSingleDigit(vowelTotal);

    // PERSONALIDAD (Consonantes)
    const consonants = cleanName.split('').filter(c => c.match(/[A-Z]/) && !'AEIOU'.includes(c));
    const consonantTotal = consonants.reduce((sum, letter) => sum + this.getLetterValue(letter), 0);
    const personalityNumber = this.reduceToSingleDigit(consonantTotal);

    // REGALO DIVINO (Z)
    const Z = this.reduceToSingleDigit(parseInt(year.toString().slice(-2)));

    const interpretations = this.buildInterpretations({
      A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S,
      X, Y, Z,
      alma: almaNumber,
      personality: personalityNumber,
      nameTotal: nameNumber
    });

    console.log(`[Pináculo Numerology Agent] Report completed for: ${input.name}`)

    return {
      baseNumbers: { A, B, C },
      positiveNumbers: { D, E, F, G, H, I, J, X, Y },
      negativeNumbers: { K, L, M, N, O, P, Q, R, S },
      nameNumbers: {
        alma: almaNumber,
        personality: personalityNumber,
        nameTotal: nameNumber
      },
      regaloDivino: Z,
      summary: {
        esencia: B,
        mision: Y,
        alma: almaNumber,
        personalidad: personalityNumber,
        numeroPersonal: nameNumber,
        regaloDivino: Z
      },
      interpretations
    }
  }

  private getLetterValue(letter: string): number {
    return this.letterValues[letter.toUpperCase()] || 0;
  }

  private reduceToSingleDigit(num: number): number {
    // CRITICAL: Preserve Master Numbers 11, 22, 33
    if (num === 11 || num === 22 || num === 33) {
      return num;
    }
    
    while (num > 9) {
      num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
      // Check again after each reduction
      if (num === 11 || num === 22 || num === 33) {
        return num;
      }
    }
    return num;
  }

  private buildInterpretations(numbers: any): Record<string, string> {
    return {
      // Números Base
      'A': `TAREA NO APRENDIDA (${numbers.A}): Lecciones pendientes de vidas pasadas que debes completar.`,
      'B': `MI ESENCIA (${numbers.B}): Tu verdadera naturaleza y personalidad core.`,
      'C': `MI VIDA PASADA (${numbers.C}): Influencias y experiencias de encarnaciones anteriores.`,
      
      // Números Positivos
      'D': `MI MÁSCARA (${numbers.D}): La personalidad que muestras al mundo exterior.`,
      'E': `IMPLANTACIÓN DEL PROGRAMA (${numbers.E}): Patrones mentales establecidos en la infancia.`,
      'F': `ENCUENTRO CON TU MAESTRO (${numbers.F}): Oportunidades de aprendizaje espiritual.`,
      'G': `RE-IDENTIFICACIÓN CON TU YO (${numbers.G}): Proceso de autodescubrimiento y autenticidad.`,
      'H': `TU DESTINO (${numbers.H}): El propósito principal de tu vida actual.`,
      'I': `INCONSCIENTE (${numbers.I}): Fuerzas subconscientes que influyen en tus decisiones.`,
      'J': `MI ESPEJO (${numbers.J}): Cómo te reflejas en las relaciones con otros.`,
      'X': `REACCIÓN (${numbers.X}): Tu forma instintiva de responder ante los desafíos.`,
      'Y': `MISIÓN (${numbers.Y}): Tu propósito de vida y contribución al mundo.`,
      
      // Números Negativos
      'K': `ADOLESCENCIA (${numbers.K}): Patrones establecidos durante la adolescencia.`,
      'L': `JUVENTUD (${numbers.L}): Experiencias formativas de los primeros años adultos.`,
      'M': `ADULTEZ (${numbers.M}): Lecciones y desafíos de la madurez.`,
      'N': `ADULTO MAYOR (${numbers.N}): Sabiduría y retos de los años dorados.`,
      'O': `INCONSCIENTE NEGATIVO (${numbers.O}): Patrones destructivos ocultos.`,
      'P': `MI SOMBRA (${numbers.P}): Aspectos de ti mismo que tiendes a negar o reprimir.`,
      'Q': `SER INFERIOR 1 (${numbers.Q}): Primera capa de limitaciones autoimpuestas.`,
      'R': `SER INFERIOR 2 (${numbers.R}): Segunda capa de miedos y bloqueos.`,
      'S': `SER INFERIOR 3 (${numbers.S}): Nivel más profundo de resistencias internas.`,
      
      // Números del Nombre
      'ALMA': `ALMA (${numbers.alma}): Tu motivación más profunda y deseos del corazón.`,
      'PERSONALIDAD': `PERSONALIDAD (${numbers.personality}): La imagen que proyectas hacia el exterior.`,
      'NUMERO_PERSONAL': `NÚMERO PERSONAL (${numbers.nameTotal}): La energía total de tu nombre completo.`,
      
      // Regalo Divino
      'Z': `REGALO DIVINO (${numbers.Z}): Tu don especial y talento natural para esta vida.`
    };
  }

  private async interpretNumber(input: { number: number; type: string }): Promise<any> {
    const { number, type } = input
    
    // Return appropriate interpretation based on type
    const interpretations = this.buildInterpretations({ [type]: number });
    return { interpretation: interpretations[type.toUpperCase()] || "Interpretación no disponible para este tipo." }
  }
}

// Create and export the real agent instance
export const realNumerologyLogicAgent = new RealNumerologyLogicAgent()
