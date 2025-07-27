/**
 * Agent System Entry Point
 * Simple exports for the multi-agent system
 */

export { CarlosManager, carlosManager } from './carlos-manager'
export { NumerologyLogicAgent, numerologyLogicAgent } from './numerology-logic'

// Agent system status
export const agentSystemStatus = {
  initialized: true,
  version: '1.0.0',
  agents: {
    carlosManager: 'active',
    numerologyLogic: 'active',
    codingAgent: 'pending',
    debuggingAgent: 'pending',
    testingQA: 'pending'
  }
}
