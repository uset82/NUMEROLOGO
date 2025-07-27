/**
 * Real MCP Server Implementation
 * This creates actual agent communication using the Model Context Protocol
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolRequest,
  type ListToolsRequest,
  type Tool,
} from '@modelcontextprotocol/sdk/types.js'

// Agent interface for real MCP communication
export interface MCPAgent {
  id: string
  name: string
  role: string
  capabilities: string[]
  handleRequest(request: any): Promise<any>
}

// Task interface for real task management
export interface MCPTask {
  id: string
  type: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  assignedAgent?: string
  input: any
  output?: any
  createdAt: Date
  completedAt?: Date
}

export class MCPAgentServer {
  private server: Server
  private agents: Map<string, MCPAgent> = new Map()
  private tasks: Map<string, MCPTask> = new Map()
  private taskQueue: MCPTask[] = []

  constructor() {
    this.server = new Server(
      {
        name: 'numerologo-agents',
        version: '1.0.0',
        description: 'Multi-Agent Numerology System with MCP'
      },
      {
        capabilities: {
          tools: {}
        }
      }
    )

    this.setupToolHandlers()
    this.setupAgentHandlers()
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'create_task',
            description: 'Create a new task for an agent',
            inputSchema: {
              type: 'object',
              properties: {
                type: { type: 'string' },
                priority: { type: 'string', enum: ['low', 'medium', 'high'] },
                input: { type: 'object' },
                assignedAgent: { type: 'string', optional: true }
              },
              required: ['type', 'priority', 'input']
            }
          },
          {
            name: 'get_task_status',
            description: 'Get the status of a task',
            inputSchema: {
              type: 'object',
              properties: {
                taskId: { type: 'string' }
              },
              required: ['taskId']
            }
          },
          {
            name: 'calculate_numerology',
            description: 'Calculate numerology numbers for a person',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                birthDate: { type: 'string' }
              },
              required: ['name', 'birthDate']
            }
          },
          {
            name: 'list_agents',
            description: 'List all available agents',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          }
        ] as Tool[]
      }
    })

    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
      const args = request.params.arguments || {}
      
      switch (request.params.name) {
        case 'create_task':
          return await this.createTask(args)
        
        case 'get_task_status':
          return await this.getTaskStatus((args as any).taskId)
        
        case 'calculate_numerology':
          return await this.calculateNumerology(args)
        
        case 'list_agents':
          return await this.listAgents()
        
        default:
          throw new Error(`Unknown tool: ${request.params.name}`)
      }
    })
  }

  private setupAgentHandlers() {
    // Register error handlers
    this.server.onerror = (error) => {
      console.error('[MCP Server Error]:', error)
    }

    // Handle connection events
    process.on('SIGINT', async () => {
      await this.server.close()
      process.exit(0)
    })
  }

  public registerAgent(agent: MCPAgent) {
    this.agents.set(agent.id, agent)
    console.log(`[MCP Server] Registered agent: ${agent.name}`)
  }

  private async createTask(args: any): Promise<any> {
    const task: MCPTask = {
      id: `task_${Date.now()}`,
      type: args.type,
      priority: args.priority,
      status: 'pending',
      assignedAgent: args.assignedAgent,
      input: args.input,
      createdAt: new Date()
    }

    this.tasks.set(task.id, task)
    
    if (task.assignedAgent) {
      await this.assignTaskToAgent(task.id, task.assignedAgent)
    } else {
      this.taskQueue.push(task)
      await this.processTaskQueue()
    }

    return {
      content: [
        {
          type: 'text',
          text: `Task created successfully: ${task.id}`
        }
      ]
    }
  }

  private async assignTaskToAgent(taskId: string, agentId: string): Promise<void> {
    const task = this.tasks.get(taskId)
    const agent = this.agents.get(agentId)

    if (!task || !agent) {
      throw new Error(`Task ${taskId} or Agent ${agentId} not found`)
    }

    task.status = 'in_progress'
    task.assignedAgent = agentId

    try {
      const result = await agent.handleRequest({
        taskId,
        type: task.type,
        input: task.input
      })

      task.status = 'completed'
      task.output = result
      task.completedAt = new Date()

      console.log(`[MCP Server] Task ${taskId} completed by ${agent.name}`)
    } catch (error) {
      task.status = 'failed'
      task.output = { error: error instanceof Error ? error.message : String(error) }
      console.error(`[MCP Server] Task ${taskId} failed:`, error)
    }
  }

  private async processTaskQueue(): Promise<void> {
    // Sort by priority (high -> medium -> low)
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    this.taskQueue.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])

    for (const task of this.taskQueue) {
      const availableAgent = this.findAvailableAgent(task.type)
      if (availableAgent) {
        await this.assignTaskToAgent(task.id, availableAgent.id)
        this.taskQueue = this.taskQueue.filter(t => t.id !== task.id)
      }
    }
  }

  private findAvailableAgent(taskType: string): MCPAgent | null {
    for (const agent of this.agents.values()) {
      if (agent.capabilities.includes(taskType)) {
        return agent
      }
    }
    return null
  }

  private async getTaskStatus(taskId: string): Promise<any> {
    const task = this.tasks.get(taskId)
    if (!task) {
      throw new Error(`Task ${taskId} not found`)
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(task, null, 2)
        }
      ]
    }
  }

  private async calculateNumerology(args: any): Promise<any> {
    // Create a numerology calculation task
    const task = await this.createTask({
      type: 'numerology_calculation',
      priority: 'high',
      input: { name: args.name, birthDate: args.birthDate },
      assignedAgent: 'numerology-logic'
    })

    // Wait for completion (in real implementation, this would be async)
    // For now, return immediate calculation
    const numerologyAgent = this.agents.get('numerology-logic')
    if (numerologyAgent) {
      const result = await numerologyAgent.handleRequest({
        type: 'numerology_calculation',
        input: { name: args.name, birthDate: args.birthDate }
      })

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }
        ]
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: 'Numerology agent not available'
        }
      ]
    }
  }

  private async listAgents(): Promise<any> {
    const agentList = Array.from(this.agents.values()).map(agent => ({
      id: agent.id,
      name: agent.name,
      role: agent.role,
      capabilities: agent.capabilities
    }))

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(agentList, null, 2)
        }
      ]
    }
  }

  public async start() {
    const transport = new StdioServerTransport()
    await this.server.connect(transport)
    console.log('[MCP Server] Numerologo Multi-Agent System started')
  }

  public async close() {
    await this.server.close()
  }
}
