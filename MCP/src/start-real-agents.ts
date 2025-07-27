#!/usr/bin/env node

/**
 * Real MCP Multi-Agent System Startup
 * This starts the actual MCP server with working agents
 */

import { MCPAgentServer } from './mcp/server.js'
import { realNumerologyLogicAgent } from './agents/real-numerology-logic/index.js'
import { realCarlosManagerAgent } from './agents/real-carlos-manager/index.js'

async function startRealAgentSystem() {
  console.log('🚀 Starting Real MCP Multi-Agent System...')
  
  try {
    // Create the MCP server
    const mcpServer = new MCPAgentServer()
    
    // Register all real agents
    mcpServer.registerAgent(realCarlosManagerAgent)
    mcpServer.registerAgent(realNumerologyLogicAgent)
    
    console.log('✅ Agents registered:')
    console.log(`   - ${realCarlosManagerAgent.name} (${realCarlosManagerAgent.role})`)
    console.log(`   - ${realNumerologyLogicAgent.name} (${realNumerologyLogicAgent.role})`)
    
    // Start the MCP server
    await mcpServer.start()
    
    console.log('🎯 MCP Server is running and ready to handle agent communication!')
    console.log('📡 Agents can now communicate via Model Context Protocol')
    
    // Test the system with a sample numerology calculation
    console.log('\n🧪 Testing agent communication...')
    
    // Create a test task via Carlos Manager
    const testTask = await realCarlosManagerAgent.createTask({
      type: 'numerology_calculation',
      priority: 'high',
      input: {
        name: 'Test User',
        birthDate: '1990-05-15'
      },
      assignedAgent: 'numerology-logic'
    })
    
    console.log(`📋 Created test task: ${testTask.id}`)
    
    // Assign and execute the task
    await realCarlosManagerAgent.assignTaskToAgent(testTask.id, 'numerology-logic')
    
    // Execute the task through the numerology agent
    const result = await realNumerologyLogicAgent.handleRequest({
      taskId: testTask.id,
      type: 'numerology_calculation',
      input: testTask.input
    })
    
    // Complete the task
    await realCarlosManagerAgent.completeTask(testTask.id, result)
    
    console.log('✅ Test task completed successfully!')
    console.log(`📊 Result: Life Path = ${result.lifePathNumber}, Destiny = ${result.destinyNumber}`)
    
    // Get team status
    const teamStatus = await realCarlosManagerAgent.getTeamStatus()
    console.log('\n📈 Team Status:')
    console.log(`   - Total Tasks: ${teamStatus.teamMetrics.totalTasks}`)
    console.log(`   - Completed: ${teamStatus.teamMetrics.completedTasks}`)
    console.log(`   - Active Agents: ${teamStatus.teamMetrics.activeAgents}`)
    
    console.log('\n🎉 Real MCP Multi-Agent System is fully operational!')
    console.log('💡 You can now integrate this with your Next.js frontend')
    
  } catch (error) {
    console.error('❌ Failed to start MCP Agent System:', error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down MCP Agent System...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down MCP Agent System...')
  process.exit(0)
})

// Start the real agent system
if (import.meta.url === `file://${process.argv[1]}`) {
  startRealAgentSystem().catch(console.error)
}

export { startRealAgentSystem }
