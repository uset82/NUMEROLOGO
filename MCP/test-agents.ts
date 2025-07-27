#!/usr/bin/env node

/**
 * Simple MCP Agent Test
 * Testing basic functionality without complex imports
 */

console.log('🚀 Starting Simple MCP Agent Test...')

// Import the agents directly without MCP server for now
import { realNumerologyLogicAgent } from './src/agents/real-numerology-logic'
import { realCarlosManagerAgent } from './src/agents/real-carlos-manager'

async function testAgents() {
  try {
    console.log('✅ Testing Numerology Logic Agent...')
    
    // Test numerology calculation
    const numerologyResult = await realNumerologyLogicAgent.handleRequest({
      type: 'numerology_calculation',
      input: {
        name: 'Carlos Delgado',
        birthDate: '1985-03-20'
      }
    })
    
    console.log('📊 Numerology Result:')
    console.log(`   Life Path: ${numerologyResult.lifePathNumber}`)
    console.log(`   Destiny: ${numerologyResult.destinyNumber}`)
    console.log(`   Soul Urge: ${numerologyResult.soulUrgeNumber}`)
    console.log(`   Personality: ${numerologyResult.personalityNumber}`)
    
    console.log('\n✅ Testing Carlos Manager Agent...')
    
    // Test task creation
    const task = await realCarlosManagerAgent.createTask({
      type: 'numerology_calculation',
      priority: 'high',
      input: {
        name: 'Test User',
        birthDate: '1990-05-15'
      }
    })
    
    console.log(`📋 Created Task: ${task.id}`)
    
    // Test task assignment
    const assigned = await realCarlosManagerAgent.assignTaskToAgent(task.id, 'numerology-logic')
    console.log(`📌 Task Assigned: ${assigned}`)
    
    // Complete the task
    const completed = await realCarlosManagerAgent.completeTask(task.id, numerologyResult)
    console.log(`✅ Task Completed: ${completed}`)
    
    // Get team status
    const teamStatus = await realCarlosManagerAgent.getTeamStatus()
    console.log('\n📈 Team Status:')
    console.log(`   Total Tasks: ${teamStatus.teamMetrics.totalTasks}`)
    console.log(`   Completed: ${teamStatus.teamMetrics.completedTasks}`)
    console.log(`   Active Agents: ${teamStatus.teamMetrics.activeAgents}`)
    
    console.log('\n🎉 All agents are working properly!')
    console.log('💡 Ready to integrate with your Next.js app')
    
    return {
      success: true,
      numerologyAgent: realNumerologyLogicAgent,
      carlosManager: realCarlosManagerAgent,
      sampleResult: numerologyResult,
      teamStatus
    }
    
  } catch (error) {
    console.error('❌ Agent test failed:', error)
    return { success: false, error }
  }
}

// Run the test
testAgents().then(result => {
  if (result.success) {
    console.log('\n🎯 Agents are ready for your Next.js integration!')
    process.exit(0)
  } else {
    console.error('\n💥 Agent system failed to initialize')
    process.exit(1)
  }
}).catch(console.error)
