/**
 * Real MCP Carlos Manager Agent Implementation
 * Uses actual MCP protocol for coordination
 */

import { MCPAgent, MCPTask } from '../../mcp/server'

interface TeamMetrics {
  totalTasks: number
  completedTasks: number
  failedTasks: number
  activeAgents: number
  averageCompletionTime: number
}

export class RealCarlosManagerAgent implements MCPAgent {
  public readonly id = 'carlos-manager'
  public readonly name = 'Real Carlos Manager'
  public readonly role = 'Multi-Agent System Coordinator'
  public readonly capabilities = ['task_management', 'agent_coordination', 'performance_monitoring', 'task_delegation']

  private tasks: Map<string, MCPTask> = new Map()
  private agentWorkload: Map<string, number> = new Map()
  private agentPerformance: Map<string, { completed: number; failed: number; avgTime: number }> = new Map()

  public async handleRequest(request: any): Promise<any> {
    console.log(`[Carlos Manager] Received request:`, request.type)

    switch (request.type) {
      case 'task_management':
        return await this.manageTask(request.input)
      
      case 'agent_coordination':
        return await this.coordinateAgents(request.input)
      
      case 'performance_monitoring':
        return await this.getPerformanceReport(request.input)
      
      case 'task_delegation':
        return await this.delegateTask(request.input)
      
      case 'get_team_status':
        return await this.getTeamStatus()
      
      default:
        throw new Error(`Unknown request type: ${request.type}`)
    }
  }

  public async createTask(taskData: {
    type: string
    priority: 'low' | 'medium' | 'high'
    input: any
    assignedAgent?: string
  }): Promise<MCPTask> {
    const task: MCPTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: taskData.type,
      priority: taskData.priority,
      status: 'pending',
      assignedAgent: taskData.assignedAgent,
      input: taskData.input,
      createdAt: new Date()
    }

    this.tasks.set(task.id, task)
    
    console.log(`[Carlos Manager] Created task ${task.id} with priority ${task.priority}`)
    
    return task
  }

  public async assignTaskToAgent(taskId: string, agentId: string): Promise<boolean> {
    const task = this.tasks.get(taskId)
    if (!task) {
      console.error(`[Carlos Manager] Task ${taskId} not found`)
      return false
    }

    task.assignedAgent = agentId
    task.status = 'in_progress'
    
    // Update agent workload
    const currentWorkload = this.agentWorkload.get(agentId) || 0
    this.agentWorkload.set(agentId, currentWorkload + 1)

    console.log(`[Carlos Manager] Assigned task ${taskId} to agent ${agentId}`)
    return true
  }

  public async completeTask(taskId: string, output: any): Promise<boolean> {
    const task = this.tasks.get(taskId)
    if (!task) {
      console.error(`[Carlos Manager] Task ${taskId} not found`)
      return false
    }

    task.status = 'completed'
    task.output = output
    task.completedAt = new Date()

    // Update agent performance metrics
    if (task.assignedAgent) {
      this.updateAgentPerformance(task.assignedAgent, 'completed', task)
      
      // Reduce agent workload
      const currentWorkload = this.agentWorkload.get(task.assignedAgent) || 0
      this.agentWorkload.set(task.assignedAgent, Math.max(0, currentWorkload - 1))
    }

    console.log(`[Carlos Manager] Task ${taskId} completed successfully`)
    return true
  }

  public async failTask(taskId: string, error: string): Promise<boolean> {
    const task = this.tasks.get(taskId)
    if (!task) {
      console.error(`[Carlos Manager] Task ${taskId} not found`)
      return false
    }

    task.status = 'failed'
    task.output = { error }
    task.completedAt = new Date()

    // Update agent performance metrics
    if (task.assignedAgent) {
      this.updateAgentPerformance(task.assignedAgent, 'failed', task)
      
      // Reduce agent workload
      const currentWorkload = this.agentWorkload.get(task.assignedAgent) || 0
      this.agentWorkload.set(task.assignedAgent, Math.max(0, currentWorkload - 1))
    }

    console.log(`[Carlos Manager] Task ${taskId} failed: ${error}`)
    return true
  }

  private updateAgentPerformance(agentId: string, result: 'completed' | 'failed', task: MCPTask) {
    const current = this.agentPerformance.get(agentId) || { completed: 0, failed: 0, avgTime: 0 }
    
    if (result === 'completed') {
      current.completed++
    } else {
      current.failed++
    }

    // Calculate average completion time
    if (task.completedAt && task.createdAt) {
      const executionTime = task.completedAt.getTime() - task.createdAt.getTime()
      const totalTasks = current.completed + current.failed
      current.avgTime = ((current.avgTime * (totalTasks - 1)) + executionTime) / totalTasks
    }

    this.agentPerformance.set(agentId, current)
  }

  public getOptimalAgent(taskType: string, availableAgents: string[]): string | null {
    // Simple load balancing - choose agent with lowest workload that can handle the task
    let optimalAgent: string | null = null
    let lowestWorkload = Infinity

    for (const agentId of availableAgents) {
      const workload = this.agentWorkload.get(agentId) || 0
      const performance = this.agentPerformance.get(agentId)
      
      // Prefer agents with good performance and low workload
      const successRate = performance ? 
        performance.completed / (performance.completed + performance.failed) : 1
      
      if (workload < lowestWorkload && successRate > 0.7) {
        lowestWorkload = workload
        optimalAgent = agentId
      }
    }

    return optimalAgent
  }

  private async manageTask(input: { action: string; taskId?: string; taskData?: any }): Promise<any> {
    switch (input.action) {
      case 'create':
        const task = await this.createTask(input.taskData)
        return { success: true, taskId: task.id, task }
      
      case 'get_status':
        const task_status = this.tasks.get(input.taskId!)
        return { success: true, task: task_status }
      
      case 'list_all':
        const allTasks = Array.from(this.tasks.values())
        return { success: true, tasks: allTasks }
      
      default:
        return { success: false, error: 'Unknown task management action' }
    }
  }

  private async coordinateAgents(input: { action: string; data?: any }): Promise<any> {
    switch (input.action) {
      case 'balance_workload':
        return await this.balanceWorkload()
      
      case 'get_agent_status':
        const agentId = input.data?.agentId
        return {
          workload: this.agentWorkload.get(agentId) || 0,
          performance: this.agentPerformance.get(agentId) || { completed: 0, failed: 0, avgTime: 0 }
        }
      
      case 'reassign_tasks':
        return await this.reassignFailedTasks()
      
      default:
        return { success: false, error: 'Unknown coordination action' }
    }
  }

  private async balanceWorkload(): Promise<any> {
    const workloads = Array.from(this.agentWorkload.entries())
    const avgWorkload = workloads.reduce((sum, [_, load]) => sum + load, 0) / workloads.length
    
    const imbalancedAgents = workloads.filter(([_, load]) => Math.abs(load - avgWorkload) > 2)
    
    console.log(`[Carlos Manager] Workload balance check: ${imbalancedAgents.length} imbalanced agents`)
    
    return {
      success: true,
      averageWorkload: avgWorkload,
      imbalancedAgents: imbalancedAgents.length,
      recommendations: imbalancedAgents.map(([agentId, load]) => ({
        agentId,
        currentLoad: load,
        recommendation: load > avgWorkload + 2 ? 'reduce' : 'increase'
      }))
    }
  }

  private async reassignFailedTasks(): Promise<any> {
    const failedTasks = Array.from(this.tasks.values()).filter(task => task.status === 'failed')
    let reassigned = 0

    for (const task of failedTasks) {
      // Reset task status and try to reassign
      task.status = 'pending'
      task.assignedAgent = undefined
      reassigned++
    }

    console.log(`[Carlos Manager] Reassigned ${reassigned} failed tasks`)
    
    return {
      success: true,
      reassignedTasks: reassigned
    }
  }

  private async getPerformanceReport(input?: any): Promise<TeamMetrics> {
    const allTasks = Array.from(this.tasks.values())
    const completedTasks = allTasks.filter(task => task.status === 'completed')
    const failedTasks = allTasks.filter(task => task.status === 'failed')
    
    const totalExecutionTime = completedTasks.reduce((sum, task) => {
      if (task.completedAt && task.createdAt) {
        return sum + (task.completedAt.getTime() - task.createdAt.getTime())
      }
      return sum
    }, 0)

    const avgCompletionTime = completedTasks.length > 0 ? totalExecutionTime / completedTasks.length : 0

    return {
      totalTasks: allTasks.length,
      completedTasks: completedTasks.length,
      failedTasks: failedTasks.length,
      activeAgents: this.agentWorkload.size,
      averageCompletionTime: avgCompletionTime
    }
  }

  private async delegateTask(input: { taskType: string; taskData: any; availableAgents: string[] }): Promise<any> {
    const optimalAgent = this.getOptimalAgent(input.taskType, input.availableAgents)
    
    if (!optimalAgent) {
      return { success: false, error: 'No suitable agent available' }
    }

    const task = await this.createTask({
      type: input.taskType,
      priority: 'medium',
      input: input.taskData,
      assignedAgent: optimalAgent
    })

    await this.assignTaskToAgent(task.id, optimalAgent)

    return {
      success: true,
      taskId: task.id,
      assignedAgent: optimalAgent,
      message: `Task delegated to ${optimalAgent}`
    }
  }

  public async getTeamStatus(): Promise<any> {
    const metrics = await this.getPerformanceReport()
    const workloadInfo = Array.from(this.agentWorkload.entries()).map(([agentId, workload]) => ({
      agentId,
      workload,
      performance: this.agentPerformance.get(agentId) || { completed: 0, failed: 0, avgTime: 0 }
    }))

    return {
      teamMetrics: metrics,
      agentWorkloads: workloadInfo,
      systemStatus: 'operational',
      lastUpdate: new Date().toISOString()
    }
  }
}

// Create and export the real manager instance
export const realCarlosManagerAgent = new RealCarlosManagerAgent()
