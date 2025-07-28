// Interfaces for Pináculo Numerology System
export interface PinaculoPosition {
  name: string;
  position: string;
  formula: string;
  color: 'purple' | 'green' | 'red';
  description: string;
  category: 'base' | 'ciclos' | 'superior' | 'negativos' | 'nombre';
}

export interface NodePosition {
  x: number;
  y: number;
}

export interface Connection {
  from: string;
  to: string;
}

export interface PinaculoStructure {
  description: string;
  version: string;
  positions: Record<string, PinaculoPosition>;
  calculations: {
    base_numbers: Record<string, string>;
    derived_formulas: Record<string, string>;
  };
  interpretations: {
    positive_numbers: Record<string, string>;
    negative_aspects: Record<string, string>;
  };
  display_config: {
    diagram: {
      width: number;
      height: number;
      center_x: number;
      center_y: number;
    };
    node_positions: Record<string, NodePosition>;
    connections: Connection[];
  };
}

export interface CalculationResult {
  value: number;
  formula: string;
  correct?: boolean;
  master_number?: boolean;
  note?: string;
  depends_on?: string;
}

export interface BirthDateInput {
  birth_date: string;
  day: number;
  month: number;
  year: number;
}

export interface PinaculoCalculation {
  input: BirthDateInput;
  base_calculations: Record<string, CalculationResult>;
  derived_calculations: Record<string, CalculationResult>;
  negative_calculations: Record<string, CalculationResult>;
  interpretations_shown: Record<string, {
    number: number;
    description: string;
  }>;
}

export interface PinaculoExample {
  example_calculation: PinaculoCalculation;
  formula_corrections: {
    note: string;
    recommendations: string[];
  };
}

// Utility functions for calculations
export class PinaculoCalculator {
  
  /**
   * Reduce a number to single digit, preserving master numbers (11, 22, 33)
   */
  static reduceNumber(num: number): number {
    // Preserve master numbers
    if (num === 11 || num === 22 || num === 33) {
      return num;
    }
    
    while (num > 9) {
      const digits = num.toString().split('').map(d => parseInt(d));
      num = digits.reduce((sum, digit) => sum + digit, 0);
      
      // Check for master numbers after reduction
      if (num === 11 || num === 22 || num === 33) {
        return num;
      }
    }
    
    return num;
  }

  /**
   * Calculate negative numbers with special rule for negative results
   */
  static calculateNegative(a: number, b: number): number {
    const result = a - b;
    if (result < 0) {
      return 10 + result;
    }
    return this.reduceNumber(result);
  }

  /**
   * Calculate year reduction
   */
  static reduceYear(year: number): number {
    return this.reduceNumber(year);
  }

  /**
   * Calculate base numbers from birth date
   */
  static calculateBaseNumbers(day: number, month: number, year: number) {
    return {
      A: this.reduceNumber(month), // MES
      B: this.reduceNumber(day),   // DÍA  
      C: this.reduceYear(year)     // AÑO
    };
  }

  /**
   * Calculate all Pináculo positions
   */
  static calculateAllPositions(day: number, month: number, year: number) {
    const base = this.calculateBaseNumbers(day, month, year);
    
    // Calculate D
    const D = this.reduceNumber(base.A + base.B + base.C);
    
    // Calculate derived positions
    const E = this.reduceNumber(base.A + base.B);
    const F = this.reduceNumber(base.B + base.C);
    const G = this.reduceNumber(E + F);
    const I = this.reduceNumber(base.C + D);
    const H = this.reduceNumber(G + I);
    const J = this.reduceNumber(H + I);
    
    // Calculate negative positions
    const K = this.calculateNegative(base.A, base.B);
    const L = this.calculateNegative(base.B, base.C);
    const M = this.reduceNumber(K + L);
    const N = this.calculateNegative(E, F);
    const O = this.reduceNumber(M + N);
    const P = this.calculateNegative(G, I);
    const Q = this.reduceNumber(P + N);
    const R = this.reduceNumber(Q + O);
    const S = this.reduceNumber(R); // Simplified for now
    
    return {
      // Base numbers
      A: base.A, B: base.B, C: base.C, D,
      // Positive derived
      E, F, G, H, I, J,
      // Negative numbers  
      K, L, M, N, O, P, Q, R, S
    };
  }
}

// Import JSON data directly
import pinaculoStructureData from '@/data/pinaculo-structure.json'
import pinaculoExampleData from '@/data/pinaculo-example.json'

// Export the data loader functions
export function loadPinaculoStructure(): PinaculoStructure {
  try {
    // Use imported data directly instead of fetch
    const data = pinaculoStructureData;
    // The JSON file has a wrapper, so we need to extract the pinaculoStructure
    return (data as any).pinaculoStructure || (data as any);
  } catch (error) {
    console.error('Error loading Pináculo structure:', error);
    throw new Error('No se pudo cargar la estructura del Pináculo: ' + (error instanceof Error ? error.message : 'Error desconocido'));
  }
}

export function loadPinaculoExample(): PinaculoExample {
  try {
    // Use imported data directly instead of fetch
    const data = pinaculoExampleData;
    return (data as any).pinaculoExample || (data as any);
  } catch (error) {
    console.error('Error loading Pináculo example:', error);
    throw new Error('No se pudo cargar el ejemplo del Pináculo: ' + (error instanceof Error ? error.message : 'Error desconocido'));
  }
}
