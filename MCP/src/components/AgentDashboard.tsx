'use client'

import React, { useState, useEffect } from 'react'

interface Agent {
  id: string
  name: string
  role: string
  status: 'active' | 'idle' | 'working'
  lastActivity: string
  tasksCompleted: number
}

const initialAgents: Agent[] = [
  {
    id: 'carlos-manager',
    name: 'Carlos',
    role: 'Project Manager',
    status: 'active',
    lastActivity: 'Coordinating team tasks',
    tasksCompleted: 15
  },
  {
    id: 'numerology-logic',
    name: 'Numerology Logic Agent',
    role: 'Algorithm Designer',
    status: 'working',
    lastActivity: 'Calculating life path numbers',
    tasksCompleted: 8
  },
  {
    id: 'coding-agent',
    name: 'Coding Agent',
    role: 'Frontend/Backend Developer',
    status: 'active',
    lastActivity: 'Building React components',
    tasksCompleted: 12
  },
  {
    id: 'debugging-agent',
    name: 'Debugging Agent',
    role: 'Bug Hunter',
    status: 'idle',
    lastActivity: 'Waiting for issues',
    tasksCompleted: 5
  },
  {
    id: 'testing-qa',
    name: 'Testing/QA Agent',
    role: 'Quality Assurance',
    status: 'working',
    lastActivity: 'Running test suites',
    tasksCompleted: 10
  }
]

export function AgentDashboard() {
  const [isClient, setIsClient] = useState(false)
  const [agents, setAgents] = useState<Agent[]>(initialAgents)
  const [realAgentData, setRealAgentData] = useState<any>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    // Load real agent status
    const loadRealAgentStatus = async () => {
      try {
        const { AgentAPI } = await import('@/lib/agentSystem')
        const result = await AgentAPI.getAgentStatus()
        
        if (result.success && result.data) {
          setRealAgentData(result.data)
          
          // Update agent list with real data
          const updatedAgents = result.data.agents.map((agent: any) => ({
            id: agent.id,
            name: agent.name,
            role: agent.role,
            status: agent.status as 'active' | 'idle' | 'working',
            lastActivity: `Real agent: ${agent.capabilities.join(', ')}`,
            tasksCompleted: result.data?.teamMetrics.completedTasks || 0
          }))
          
          setAgents(updatedAgents)
        }
      } catch (error) {
        console.error('[Dashboard] Failed to load real agent status:', error)
      }
    }

    loadRealAgentStatus()

    // Update agent status periodically
    const interval = setInterval(() => {
      loadRealAgentStatus()
    }, 5000)

    return () => clearInterval(interval)
  }, [isClient])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '🟢'
      case 'working': return '🟡'
      case 'idle': return '⚪'
      default: return '⚪'
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active': return 'agent-active'
      case 'working': return 'agent-working'
      case 'idle': return 'agent-idle'
      default: return 'agent-idle'
    }
  }

  return (
    <div className="space-y-4">
      {agents.map((agent) => (
        <div key={agent.id} className="numerology-card">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                {getStatusIcon(agent.status)}
                {agent.name}
              </h3>
              <p className="text-sm text-gray-600">{agent.role}</p>
            </div>
            <span className={`agent-status ${getStatusClass(agent.status)}`}>
              {isClient ? agent.status : 'loading'}
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-2">{agent.lastActivity}</p>
          <div className="text-xs text-gray-500">
            Tasks completed: {agent.tasksCompleted}
          </div>
        </div>
      ))}
      
      <div className="numerology-card bg-gradient-to-r from-purple-50 to-indigo-50">
        <h3 className="font-semibold text-gray-900 mb-2">Team Performance</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Tasks:</span>
            <span className="font-medium ml-2">
              {agents.reduce((sum, agent) => sum + agent.tasksCompleted, 0)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Active Agents:</span>
            <span className="font-medium ml-2">
              {agents.filter(agent => agent.status === 'active').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
