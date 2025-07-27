/**
 * Carlos Manager Agent - Project Manager and Team Coordinator
 * Responsible for overseeing all other agents and coordinating tasks
 */

export interface Task {
  id: string
  title: string
  description: string
  assignedAgent: string
  status: 'pending' | 'in-progress' | 'completed' | 'blocked'
  priority: 'low' | 'medium' | 'high' | 'critical'
  createdAt: Date
  completedAt?: Date
  dependencies?: string[]
}

export interface AgentStatus {
  id: string
  name: string
  status: 'active' | 'idle' | 'working' | 'error'
  currentTask?: string
  tasksCompleted: number
  lastActivity: Date
}

export class CarlosManager {
  private agents: Map<string, AgentStatus> = new Map()
  private tasks: Map<string, Task> = new Map()
  private taskQueue: string[] = []

  constructor() {
    this.initializeAgents()
  }

  private initializeAgents() {
    const agentConfigs = [
      { id: 'numerology-logic', name: 'Numerology Logic Agent' },
      { id: 'coding-agent', name: 'Coding Agent' },
      { id: 'debugging-agent', name: 'Debugging Agent' },
      { id: 'testing-qa', name: 'Testing/QA Agent' }
    ]

    agentConfigs.forEach(config => {
      this.agents.set(config.id, {
        id: config.id,
        name: config.name,
        status: 'idle',
        tasksCompleted: 0,
        lastActivity: new Date()
      })
    })
  }

  /**
   * Create a new task and assign it to the appropriate agent
   */
  public createTask(
    title: string,
    description: string,
    assignedAgent: string,
    priority: Task['priority'] = 'medium',
    dependencies?: string[]
  ): string {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const task: Task = {
      id: taskId,
      title,
      description,
      assignedAgent,
      status: 'pending',
      priority,
      createdAt: new Date(),
      dependencies
    }

    this.tasks.set(taskId, task)
    this.taskQueue.push(taskId)
    
    console.log(`[Carlos Manager] Created task: ${title} for ${assignedAgent}`)
    this.assignTaskToAgent(taskId)
    
    return taskId
  }

  /**
   * Assign a task to an agent if they're available
   */
  private assignTaskToAgent(taskId: string) {
    const task = this.tasks.get(taskId)
    if (!task) return

    const agent = this.agents.get(task.assignedAgent)
    if (!agent) {
      console.error(`[Carlos Manager] Agent ${task.assignedAgent} not found`)
      return
    }

    if (agent.status === 'idle') {
      agent.status = 'working'
      agent.currentTask = taskId
      agent.lastActivity = new Date()
      task.status = 'in-progress'
      
      console.log(`[Carlos Manager] Assigned task ${task.title} to ${agent.name}`)
      this.notifyAgentOfTask(task.assignedAgent, task)
    }
  }

  /**
   * Complete a task and update agent status
   */
  public completeTask(taskId: string, results?: any) {
    const task = this.tasks.get(taskId)
    if (!task) return

    const agent = this.agents.get(task.assignedAgent)
    if (!agent) return

    task.status = 'completed'
    task.completedAt = new Date()
    
    agent.status = 'idle'
    agent.currentTask = undefined
    agent.tasksCompleted++
    agent.lastActivity = new Date()

    console.log(`[Carlos Manager] Task completed: ${task.title} by ${agent.name}`)
    
    // Check if any pending tasks can now be assigned
    this.processTaskQueue()
  }

  /**
   * Process the task queue and assign available tasks
   */
  private processTaskQueue() {
    const pendingTasks = Array.from(this.tasks.values())
      .filter(task => task.status === 'pending')
      .sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })

    for (const task of pendingTasks) {
      if (this.canAssignTask(task)) {
        this.assignTaskToAgent(task.id)
      }
    }
  }

  /**
   * Check if a task can be assigned (dependencies met, agent available)
   */
  private canAssignTask(task: Task): boolean {
    if (task.dependencies) {
      const dependenciesMet = task.dependencies.every(depId => {
        const depTask = this.tasks.get(depId)
        return depTask?.status === 'completed'
      })
      if (!dependenciesMet) return false
    }

    const agent = this.agents.get(task.assignedAgent)
    return agent?.status === 'idle'
  }

  /**
   * Notify agent of new task (placeholder for actual agent communication)
   */
  private notifyAgentOfTask(agentId: string, task: Task) {
    // In a real implementation, this would send the task to the specific agent
    console.log(`[Carlos Manager] Notifying ${agentId} of task: ${task.title}`)
  }

  /**
   * Get current status of all agents
   */
  public getAgentsStatus(): AgentStatus[] {
    return Array.from(this.agents.values())
  }

  /**
   * Get all tasks with optional filtering
   */
  public getTasks(status?: Task['status']): Task[] {
    const allTasks = Array.from(this.tasks.values())
    return status ? allTasks.filter(task => task.status === status) : allTasks
  }

  /**
   * Get agent performance metrics
   */
  public getPerformanceMetrics() {
    const agents = Array.from(this.agents.values())
    const totalTasks = agents.reduce((sum, agent) => sum + agent.tasksCompleted, 0)
    const activeAgents = agents.filter(agent => agent.status === 'working').length
    
    return {
      totalTasks,
      activeAgents,
      totalAgents: agents.length,
      averageTasksPerAgent: totalTasks / agents.length
    }
  }

  /**
   * Emergency stop all agents
   */
  public emergencyStop() {
    console.log('[Carlos Manager] Emergency stop initiated')
    const agentEntries = Array.from(this.agents.entries())
    for (const [_, agent] of agentEntries) {
      agent.status = 'idle'
      agent.currentTask = undefined
    }
  }
}

// Singleton instance for global access
export const carlosManager = new CarlosManager()
