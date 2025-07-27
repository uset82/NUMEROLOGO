/**
 * Real MCP Numerology Logic Agent Implementation
 * Uses actual MCP protocol for communication
 */

import { MCPAgent } from '../../mcp/server'

export interface NumerologyInput {
  name: string
  birthDate: string
  fullName?: string
  middleName?: string
}

export interface NumerologyReport {
  lifePathNumber: number
  destinyNumber: number
  soulUrgeNumber: number
  personalityNumber: number
  birthDayNumber: number
  expressionNumber: number
  maturityNumber: number
  interpretation: {
    lifePath: string
    destiny: string
    soulUrge: string
    personality: string
    overall: string
  }
  luckyNumbers: number[]
  compatibleNumbers: number[]
  challengeNumbers: number[]
}

export class RealNumerologyLogicAgent implements MCPAgent {
  public readonly id = 'numerology-logic'
  public readonly name = 'Real Numerology Logic Agent'
  public readonly role = 'Mathematical Algorithm Designer'
  public readonly capabilities = ['numerology_calculation', 'number_interpretation', 'lucky_numbers']

  private letterValues: { [key: string]: number } = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
    J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
    S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
  }

  private vowels = 'AEIOU'

  public async handleRequest(request: any): Promise<any> {
    console.log(`[Numerology Logic Agent] Received request:`, request.type)

    switch (request.type) {
      case 'numerology_calculation':
        return await this.generateReport(request.input)
      
      case 'number_interpretation':
        return await this.interpretNumber(request.input)
      
      case 'lucky_numbers':
        return await this.calculateLuckyNumbersFromInput(request.input)
      
      default:
        throw new Error(`Unknown request type: ${request.type}`)
    }
  }

  public async generateReport(input: NumerologyInput): Promise<NumerologyReport> {
    console.log(`[Numerology Logic Agent] Generating report for: ${input.name}`)

    const lifePathNumber = this.calculateLifePathNumber(input.birthDate)
    const destinyNumber = this.calculateDestinyNumber(input.name)
    const soulUrgeNumber = this.calculateSoulUrgeNumber(input.name)
    const personalityNumber = this.calculatePersonalityNumber(input.name)
    const birthDayNumber = this.calculateBirthDayNumber(input.birthDate)
    const expressionNumber = destinyNumber // Same as destiny in most systems
    const maturityNumber = this.calculateMaturityNumber(lifePathNumber, destinyNumber)

    const interpretation = this.generateInterpretation({
      lifePathNumber,
      destinyNumber,
      soulUrgeNumber,
      personalityNumber
    })

    const luckyNumbers = this.calculateLuckyNumbers(lifePathNumber, destinyNumber)
    const compatibleNumbers = this.calculateCompatibleNumbers(lifePathNumber)
    const challengeNumbers = this.calculateChallengeNumbers(input.birthDate)

    console.log(`[Numerology Logic Agent] Report completed for: ${input.name}`)

    return {
      lifePathNumber,
      destinyNumber,
      soulUrgeNumber,
      personalityNumber,
      birthDayNumber,
      expressionNumber,
      maturityNumber,
      interpretation,
      luckyNumbers,
      compatibleNumbers,
      challengeNumbers
    }
  }

  private calculateLifePathNumber(birthDate: string): number {
    const digits = birthDate.replace(/\D/g, '').split('').map(Number)
    return this.reduceToSingleDigit(digits.reduce((sum, digit) => sum + digit, 0))
  }

  private calculateDestinyNumber(name: string): number {
    return this.calculateNameNumber(name)
  }

  private calculateSoulUrgeNumber(name: string): number {
    const vowelsOnly = name.toUpperCase().split('').filter(char => this.vowels.includes(char))
    const sum = vowelsOnly.reduce((total, char) => total + (this.letterValues[char] || 0), 0)
    return this.reduceToSingleDigit(sum)
  }

  private calculatePersonalityNumber(name: string): number {
    const consonantsOnly = name.toUpperCase().split('').filter(char => 
      /[A-Z]/.test(char) && !this.vowels.includes(char)
    )
    const sum = consonantsOnly.reduce((total, char) => total + (this.letterValues[char] || 0), 0)
    return this.reduceToSingleDigit(sum)
  }

  private calculateBirthDayNumber(birthDate: string): number {
    const dayMatch = birthDate.match(/\d{1,2}(?=\D|$)/)
    if (!dayMatch) return 1
    const day = parseInt(dayMatch[0])
    return this.reduceToSingleDigit(day)
  }

  private calculateMaturityNumber(lifePath: number, destiny: number): number {
    return this.reduceToSingleDigit(lifePath + destiny)
  }

  private calculateNameNumber(name: string): number {
    const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '')
    const sum = cleanName.split('').reduce((total, char) => total + (this.letterValues[char] || 0), 0)
    return this.reduceToSingleDigit(sum)
  }

  private reduceToSingleDigit(num: number): number {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
      num = num.toString().split('').map(Number).reduce((sum, digit) => sum + digit, 0)
    }
    return num
  }

  private calculateLuckyNumbers(lifePath: number, destiny: number): number[] {
    const base = [lifePath, destiny]
    const additional = [
      (lifePath + destiny) % 9 + 1,
      (lifePath * 2) % 9 + 1,
      (destiny * 2) % 9 + 1
    ]
    return [...new Set([...base, ...additional])].sort((a, b) => a - b).slice(0, 5)
  }

  private calculateCompatibleNumbers(lifePath: number): number[] {
    const compatibilityMap: { [key: number]: number[] } = {
      1: [1, 5, 7],
      2: [2, 4, 8],
      3: [3, 6, 9],
      4: [2, 4, 8],
      5: [1, 5, 7],
      6: [3, 6, 9],
      7: [1, 5, 7],
      8: [2, 4, 8],
      9: [3, 6, 9],
      11: [2, 6, 9],
      22: [4, 6, 8],
      33: [3, 6, 9]
    }
    return compatibilityMap[lifePath] || [1, 5, 9]
  }

  private calculateChallengeNumbers(birthDate: string): number[] {
    const digits = birthDate.replace(/\D/g, '').split('').map(Number)
    if (digits.length < 8) return [0, 0, 0, 0]

    const month = parseInt(birthDate.substring(0, 2)) || 1
    const day = parseInt(birthDate.substring(3, 5)) || 1
    const year = parseInt(birthDate.substring(6)) || 2000

    const challenge1 = Math.abs(this.reduceToSingleDigit(month) - this.reduceToSingleDigit(day))
    const challenge2 = Math.abs(this.reduceToSingleDigit(day) - this.reduceToSingleDigit(year))
    const challenge3 = Math.abs(challenge1 - challenge2)
    const challenge4 = Math.abs(this.reduceToSingleDigit(month) - this.reduceToSingleDigit(year))

    return [challenge1, challenge2, challenge3, challenge4]
  }

  private generateInterpretation(numbers: {
    lifePathNumber: number
    destinyNumber: number
    soulUrgeNumber: number
    personalityNumber: number
  }) {
    return {
      lifePath: this.getLifePathInterpretation(numbers.lifePathNumber),
      destiny: this.getDestinyInterpretation(numbers.destinyNumber),
      soulUrge: this.getSoulUrgeInterpretation(numbers.soulUrgeNumber),
      personality: this.getPersonalityInterpretation(numbers.personalityNumber),
      overall: this.getOverallInterpretation(numbers)
    }
  }

  private getLifePathInterpretation(number: number): string {
    const interpretations: { [key: number]: string } = {
      1: "Natural leader with pioneering spirit. You're independent and innovative.",
      2: "Peaceful cooperator who works well with others. You're diplomatic and supportive.",
      3: "Creative communicator with artistic talents. You're expressive and social.",
      4: "Practical builder focused on stability. You're organized and reliable.",
      5: "Freedom-loving adventurer who craves variety. You're versatile and progressive.",
      6: "Nurturing caretaker focused on family and responsibility. You're compassionate and healing.",
      7: "Spiritual seeker with analytical mind. You're introspective and seek deeper truths.",
      8: "Material achiever with business acumen. You're ambitious and focused on success.",
      9: "Humanitarian helper with universal perspective. You're generous and idealistic.",
      11: "Intuitive inspirational leader. You have heightened spiritual awareness.",
      22: "Master builder who can manifest dreams into reality. You have powerful practical abilities.",
      33: "Master teacher with exceptional compassion. You inspire and heal others."
    }
    return interpretations[number] || "Unique spiritual path with special significance."
  }

  private getDestinyInterpretation(number: number): string {
    const interpretations: { [key: number]: string } = {
      1: "Destined to lead and pioneer new paths in your chosen field.",
      2: "Destined to bring harmony and cooperation to challenging situations.",
      3: "Destined to express creativity and inspire others through communication.",
      4: "Destined to build lasting foundations and create practical solutions.",
      5: "Destined to explore freedom and bring progressive change to the world.",
      6: "Destined to nurture others and create harmony in family and community.",
      7: "Destined to seek wisdom and share spiritual insights with others.",
      8: "Destined to achieve material success and lead in business or organization.",
      9: "Destined to serve humanity and make the world a better place.",
      11: "Destined to be a spiritual teacher and illuminate the path for others.",
      22: "Destined to manifest great projects that benefit humanity on a large scale.",
      33: "Destined to be a healer and teacher, inspiring others through love and compassion."
    }
    return interpretations[number] || "Destined for a unique path of service and growth."
  }

  private getSoulUrgeInterpretation(number: number): string {
    const interpretations: { [key: number]: string } = {
      1: "Deep desire to be independent and achieve personal success.",
      2: "Deep desire for harmony, partnership, and peaceful relationships.",
      3: "Deep desire to express creativity and bring joy to others.",
      4: "Deep desire for security, order, and systematic achievement.",
      5: "Deep desire for freedom, adventure, and varied experiences.",
      6: "Deep desire to love, nurture, and care for family and community.",
      7: "Deep desire to understand life's mysteries and gain spiritual wisdom.",
      8: "Deep desire for material achievement and recognition of your accomplishments.",
      9: "Deep desire to serve humanity and make a positive impact on the world.",
      11: "Deep desire to inspire others and fulfill your spiritual mission.",
      22: "Deep desire to build something lasting that improves the world.",
      33: "Deep desire to heal and teach others through unconditional love."
    }
    return interpretations[number] || "Deep desire for a unique form of self-expression and contribution."
  }

  private getPersonalityInterpretation(number: number): string {
    const interpretations: { [key: number]: string } = {
      1: "Others see you as confident, independent, and naturally authoritative.",
      2: "Others see you as gentle, cooperative, and easy to approach.",
      3: "Others see you as charming, creative, and socially engaging.",
      4: "Others see you as reliable, practical, and well-organized.",
      5: "Others see you as dynamic, versatile, and exciting to be around.",
      6: "Others see you as warm, caring, and naturally supportive.",
      7: "Others see you as mysterious, intellectual, and deeply thoughtful.",
      8: "Others see you as powerful, successful, and materially focused.",
      9: "Others see you as compassionate, generous, and globally minded.",
      11: "Others see you as inspiring, intuitive, and spiritually aware.",
      22: "Others see you as capable of great achievements and practical mastery.",
      33: "Others see you as a natural healer and source of unconditional love."
    }
    return interpretations[number] || "Others see you as someone with a unique and special presence."
  }

  private getOverallInterpretation(numbers: {
    lifePathNumber: number
    destinyNumber: number
    soulUrgeNumber: number
    personalityNumber: number
  }): string {
    let overall = "Your numerological profile reveals a unique blend of qualities. "

    if (numbers.lifePathNumber === numbers.destinyNumber) {
      overall += "Your life path and destiny are in perfect alignment, suggesting a clear sense of purpose. "
    }

    if (numbers.soulUrgeNumber === numbers.personalityNumber) {
      overall += "Your inner desires match your outer expression, indicating authenticity in your interactions. "
    }

    const masterNumbers = [numbers.lifePathNumber, numbers.destinyNumber, numbers.soulUrgeNumber, numbers.personalityNumber].filter(n => [11, 22, 33].includes(n))
    if (masterNumbers.length > 0) {
      overall += "The presence of master numbers indicates heightened spiritual potential and greater responsibility in this lifetime. "
    }

    overall += "Focus on balancing your spiritual growth with practical achievements for the most fulfilling path forward."

    return overall
  }

  private async interpretNumber(input: { number: number; type: string }): Promise<any> {
    const { number, type } = input
    
    switch (type) {
      case 'lifePath':
        return { interpretation: this.getLifePathInterpretation(number) }
      case 'destiny':
        return { interpretation: this.getDestinyInterpretation(number) }
      case 'soulUrge':
        return { interpretation: this.getSoulUrgeInterpretation(number) }
      case 'personality':
        return { interpretation: this.getPersonalityInterpretation(number) }
      default:
        return { interpretation: "Number interpretation not available for this type." }
    }
  }

  private async calculateLuckyNumbersFromInput(input: { name?: string; birthDate?: string; lifePath?: number; destiny?: number }): Promise<any> {
    let lifePath = input.lifePath
    let destiny = input.destiny

    if (!lifePath && input.birthDate) {
      lifePath = this.calculateLifePathNumber(input.birthDate)
    }
    if (!destiny && input.name) {
      destiny = this.calculateDestinyNumber(input.name)
    }

    if (lifePath && destiny) {
      const luckyNumbers = this.calculateLuckyNumbers(lifePath, destiny)
      return { luckyNumbers }
    }

    return { error: "Insufficient data to calculate lucky numbers" }
  }
}

// Create and export the real agent instance
export const realNumerologyLogicAgent = new RealNumerologyLogicAgent()
