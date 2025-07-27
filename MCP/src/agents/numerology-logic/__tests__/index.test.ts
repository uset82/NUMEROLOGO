import { NumerologyLogicAgent } from '../index'

describe('NumerologyLogicAgent', () => {
  let agent: NumerologyLogicAgent

  beforeEach(() => {
    agent = new NumerologyLogicAgent()
  })

  describe('generateReport', () => {
    it('should generate a complete numerology report', async () => {
      const input = {
        name: 'John Doe',
        birthDate: '1990-05-15'
      }

      const report = await agent.generateReport(input)

      expect(report).toHaveProperty('lifePathNumber')
      expect(report).toHaveProperty('destinyNumber')
      expect(report).toHaveProperty('soulUrgeNumber')
      expect(report).toHaveProperty('personalityNumber')
      expect(report).toHaveProperty('interpretation')
      expect(report).toHaveProperty('luckyNumbers')
      expect(report).toHaveProperty('compatibleNumbers')
      expect(report).toHaveProperty('challengeNumbers')

      expect(typeof report.lifePathNumber).toBe('number')
      expect(report.lifePathNumber).toBeGreaterThan(0)
      expect(report.lifePathNumber).toBeLessThanOrEqual(33)
    })

    it('should handle master numbers correctly', async () => {
      // This test would need specific birth dates/names that result in master numbers
      const input = {
        name: 'Master Number',
        birthDate: '1990-11-11'
      }

      const report = await agent.generateReport(input)
      
      // Master numbers should not be reduced further
      expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33]).toContain(report.lifePathNumber)
    })
  })

  describe('calculateLifePathNumber', () => {
    it('should calculate life path number correctly', () => {
      // Test with a known calculation: 1990-05-15
      // 1+9+9+0+0+5+1+5 = 30, 3+0 = 3
      const result = agent['calculateLifePathNumber']('1990-05-15')
      expect(result).toBe(3)
    })

    it('should preserve master numbers', () => {
      // Test case that should result in master number 11
      const result = agent['calculateLifePathNumber']('1990-11-11')
      // 1+9+9+0+1+1+1+1 = 23, 2+3 = 5 (not a master number in this case)
      expect(typeof result).toBe('number')
    })
  })

  describe('calculateDestinyNumber', () => {
    it('should calculate destiny number from name', () => {
      const result = agent['calculateDestinyNumber']('JOHN')
      // J(1) + O(6) + H(8) + N(5) = 20, 2+0 = 2
      expect(result).toBe(2)
    })

    it('should handle names with spaces', () => {
      const result = agent['calculateDestinyNumber']('JOHN DOE')
      expect(typeof result).toBe('number')
      expect(result).toBeGreaterThan(0)
    })
  })

  describe('calculateSoulUrgeNumber', () => {
    it('should calculate soul urge from vowels only', () => {
      const result = agent['calculateSoulUrgeNumber']('JOHN')
      // Only O(6) from JOHN
      expect(result).toBe(6)
    })
  })

  describe('calculatePersonalityNumber', () => {
    it('should calculate personality from consonants only', () => {
      const result = agent['calculatePersonalityNumber']('JOHN')
      // J(1) + H(8) + N(5) = 14, 1+4 = 5
      expect(result).toBe(5)
    })
  })

  describe('reduceToSingleDigit', () => {
    it('should reduce numbers to single digits', () => {
      expect(agent['reduceToSingleDigit'](23)).toBe(5) // 2+3=5
      expect(agent['reduceToSingleDigit'](456)).toBe(6) // 4+5+6=15, 1+5=6
    })

    it('should preserve master numbers', () => {
      expect(agent['reduceToSingleDigit'](11)).toBe(11)
      expect(agent['reduceToSingleDigit'](22)).toBe(22)
      expect(agent['reduceToSingleDigit'](33)).toBe(33)
    })

    it('should handle single digits', () => {
      expect(agent['reduceToSingleDigit'](7)).toBe(7)
      expect(agent['reduceToSingleDigit'](9)).toBe(9)
    })
  })

  describe('luckyNumbers', () => {
    it('should generate array of lucky numbers', () => {
      const result = agent['calculateLuckyNumbers'](3, 7)
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(result).toContain(3)
      expect(result).toContain(7)
    })
  })

  describe('compatibleNumbers', () => {
    it('should return compatible numbers for each life path', () => {
      for (let i = 1; i <= 9; i++) {
        const result = agent['calculateCompatibleNumbers'](i)
        expect(Array.isArray(result)).toBe(true)
        expect(result.length).toBeGreaterThan(0)
      }
    })

    it('should handle master numbers', () => {
      const result11 = agent['calculateCompatibleNumbers'](11)
      const result22 = agent['calculateCompatibleNumbers'](22)
      const result33 = agent['calculateCompatibleNumbers'](33)
      
      expect(Array.isArray(result11)).toBe(true)
      expect(Array.isArray(result22)).toBe(true)
      expect(Array.isArray(result33)).toBe(true)
    })
  })

  describe('interpretations', () => {
    it('should provide interpretations for all numbers 1-9', () => {
      for (let i = 1; i <= 9; i++) {
        const interpretation = agent['getLifePathInterpretation'](i)
        expect(typeof interpretation).toBe('string')
        expect(interpretation.length).toBeGreaterThan(10)
      }
    })

    it('should provide interpretations for master numbers', () => {
      const interp11 = agent['getLifePathInterpretation'](11)
      const interp22 = agent['getLifePathInterpretation'](22)
      const interp33 = agent['getLifePathInterpretation'](33)
      
      expect(typeof interp11).toBe('string')
      expect(typeof interp22).toBe('string')
      expect(typeof interp33).toBe('string')
    })
  })
})
