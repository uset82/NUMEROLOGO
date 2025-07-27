/**
 * Real Agent Integration for Next.js
 * This connects your frontend to the real working agents
 */

import { realNumerologyLogicAgent } from '../agents/real-numerology-logic'
import { realCarlosManagerAgent } from '../agents/real-carlos-manager'

// Initialize the agent system
let isInitialized = false

export async function initializeAgentSystem() {
  if (isInitialized) return
  
  console.log('[Agent System] Initializing real MCP agents...')
  
  // The agents are already instantiated as singletons
  // Just mark as initialized
  isInitialized = true
  
  console.log('[Agent System] ✅ Real agents ready!')
  return true
}

// Agent API for frontend use
export class AgentAPI {
  static async calculateNumerology(name: string, birthDate: string) {
    await initializeAgentSystem()
    
    console.log(`[Agent API] Processing numerology calculation for: ${name}`)
    
    try {
      // Create task via Carlos Manager
      const task = await realCarlosManagerAgent.createTask({
        type: 'numerology_calculation',
        priority: 'high',
        input: { name, birthDate }
      })
      
      // Assign to numerology agent
      await realCarlosManagerAgent.assignTaskToAgent(task.id, 'numerology-logic')
      
      // Execute the calculation
      const result = await realNumerologyLogicAgent.handleRequest({
        taskId: task.id,
        type: 'numerology_calculation',
        input: { name, birthDate }
      })
      
      // Mark task as completed
      await realCarlosManagerAgent.completeTask(task.id, result)
      
      console.log(`[Agent API] ✅ Numerology calculation completed for: ${name}`)
      
      return {
        success: true,
        data: result,
        taskId: task.id
      }
      
    } catch (error) {
      console.error('[Agent API] ❌ Numerology calculation failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallback: this.getFallbackCalculation(name, birthDate)
      }
    }
  }
  
  static async getAgentStatus() {
    await initializeAgentSystem()
    
    try {
      const teamStatus = await realCarlosManagerAgent.getTeamStatus()
      
      return {
        success: true,
        data: {
          agents: [
            {
              id: realCarlosManagerAgent.id,
              name: realCarlosManagerAgent.name,
              role: realCarlosManagerAgent.role,
              status: 'active',
              capabilities: realCarlosManagerAgent.capabilities
            },
            {
              id: realNumerologyLogicAgent.id,
              name: realNumerologyLogicAgent.name,
              role: realNumerologyLogicAgent.role,
              status: 'active',
              capabilities: realNumerologyLogicAgent.capabilities
            }
          ],
          teamMetrics: teamStatus.teamMetrics,
          systemStatus: 'operational',
          lastUpdate: new Date().toISOString()
        }
      }
    } catch (error) {
      console.error('[Agent API] ❌ Failed to get agent status:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  static async createTask(type: string, input: any, priority: 'low' | 'medium' | 'high' = 'medium') {
    await initializeAgentSystem()
    
    try {
      const task = await realCarlosManagerAgent.createTask({
        type,
        priority,
        input
      })
      
      return {
        success: true,
        taskId: task.id,
        data: task
      }
    } catch (error) {
      console.error('[Agent API] ❌ Failed to create task:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  static async getTaskStatus(taskId: string) {
    await initializeAgentSystem()
    
    try {
      const result = await realCarlosManagerAgent.handleRequest({
        type: 'task_management',
        input: { action: 'get_status', taskId }
      })
      
      return {
        success: true,
        data: result.task
      }
    } catch (error) {
      console.error('[Agent API] ❌ Failed to get task status:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  static async interpretNumber(number: number, type: string) {
    await initializeAgentSystem()
    
    try {
      const result = await realNumerologyLogicAgent.handleRequest({
        type: 'number_interpretation',
        input: { number, type }
      })
      
      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error('[Agent API] ❌ Failed to interpret number:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  static async getLuckyNumbers(input: { name?: string; birthDate?: string; lifePath?: number; destiny?: number }) {
    await initializeAgentSystem()
    
    try {
      const result = await realNumerologyLogicAgent.handleRequest({
        type: 'lucky_numbers',
        input
      })
      
      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error('[Agent API] ❌ Failed to get lucky numbers:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  // Fallback calculation for when agents fail
  private static getFallbackCalculation(name: string, birthDate: string) {
    console.log('[Agent API] 🔄 Using fallback calculation...')
    
    const calculateLifePath = (date: string): number => {
      const digits = date.replace(/\D/g, '').split('').map(Number)
      let sum = digits.reduce((acc, digit) => acc + digit, 0)
      while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
        sum = sum.toString().split('').map(Number).reduce((acc, digit) => acc + digit, 0)
      }
      return sum
    }
    
    const calculateNameNumber = (name: string): number => {
      const values: { [key: string]: number } = {
        A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
        J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
        S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
      }
      
      let sum = 0
      for (const char of name.toUpperCase().replace(/[^A-Z]/g, '')) {
        sum += values[char] || 0
      }
      
      while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
        sum = sum.toString().split('').map(Number).reduce((acc, digit) => acc + digit, 0)
      }
      
      return sum
    }
    
    return {
      lifePathNumber: calculateLifePath(birthDate),
      destinyNumber: calculateNameNumber(name),
      soulUrgeNumber: calculateNameNumber(name.replace(/[^aeiouAEIOU]/g, '')),
      personalityNumber: calculateNameNumber(name.replace(/[aeiouAEIOU]/g, '')),
      interpretation: {
        lifePath: 'Fallback calculation - agents temporarily unavailable',
        destiny: 'Fallback calculation - agents temporarily unavailable',
        soulUrge: 'Fallback calculation - agents temporarily unavailable',
        personality: 'Fallback calculation - agents temporarily unavailable',
        overall: 'This is a basic calculation. For detailed analysis, please try again when agents are available.'
      }
    }
  }
}

// Export individual agents for advanced use
export { realNumerologyLogicAgent, realCarlosManagerAgent }
