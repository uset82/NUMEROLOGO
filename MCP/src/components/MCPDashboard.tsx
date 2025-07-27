'use client'

import React, { useState, useEffect } from 'react'

interface MCPStatus {
  connected: boolean
  serverVersion: string
  lastHeartbeat: Date
  messagesExchanged: number
  activeConnections: number
}

interface MCPMessage {
  id: string
  timestamp: Date
  sender: string
  receiver: string
  type: 'task' | 'response' | 'heartbeat' | 'error'
  content: string
  status: 'sent' | 'delivered' | 'processed' | 'error'
}

export function MCPDashboard() {
  const [isClient, setIsClient] = useState(false)
  const [mcpStatus, setMcpStatus] = useState<MCPStatus>({
    connected: true,
    serverVersion: '1.0.0',
    lastHeartbeat: new Date('2025-01-01T00:00:00Z'), // Fixed date for SSR
    messagesExchanged: 47,
    activeConnections: 5
  })

  const [messages, setMessages] = useState<MCPMessage[]>([
    {
      id: '1',
      timestamp: new Date('2025-01-01T00:00:00Z'),
      sender: 'Carlos Manager',
      receiver: 'Numerology Logic Agent',
      type: 'task',
      content: 'Calculate life path number for user input',
      status: 'processed'
    },
    {
      id: '2',
      timestamp: new Date('2025-01-01T00:01:00Z'),
      sender: 'Numerology Logic Agent',
      receiver: 'Carlos Manager',
      type: 'response',
      content: 'Life path calculation completed: Result = 7',
      status: 'delivered'
    },
    {
      id: '3',
      timestamp: new Date('2025-01-01T00:02:00Z'),
      sender: 'Testing/QA Agent',
      receiver: 'Carlos Manager',
      type: 'heartbeat',
      content: 'Status check: All systems operational',
      status: 'sent'
    }
  ])

  useEffect(() => {
    setIsClient(true)
    
    // Initialize with current timestamp only after client-side hydration
    setMcpStatus(prev => ({
      ...prev,
      lastHeartbeat: new Date()
    }))

    // Update message timestamps to current time
    setMessages(prev => prev.map((msg, index) => ({
      ...msg,
      timestamp: new Date(Date.now() - (prev.length - index) * 60000) // Stagger by minutes
    })))
  }, [])

  useEffect(() => {
    if (!isClient) return

    // Simulate MCP activity only after hydration
    const interval = setInterval(() => {
      setMcpStatus(prev => ({
        ...prev,
        lastHeartbeat: new Date(),
        messagesExchanged: prev.messagesExchanged + Math.floor(Math.random() * 3)
      }))

      // Add new simulated message occasionally
      if (Math.random() > 0.7) {
        const agents = ['Carlos Manager', 'Numerology Logic Agent', 'Coding Agent', 'Debugging Agent', 'Testing/QA Agent']
        const types: MCPMessage['type'][] = ['task', 'response', 'heartbeat']
        
        const newMessage: MCPMessage = {
          id: Date.now().toString(),
          timestamp: new Date(),
          sender: agents[Math.floor(Math.random() * agents.length)],
          receiver: agents[Math.floor(Math.random() * agents.length)],
          type: types[Math.floor(Math.random() * types.length)],
          content: 'Agent communication simulation...',
          status: 'sent'
        }

        setMessages(prev => [newMessage, ...prev.slice(0, 9)]) // Keep last 10 messages
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isClient])

  const getStatusColor = (status: MCPMessage['status']) => {
    switch (status) {
      case 'sent': return 'bg-blue-100 text-blue-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'processed': return 'bg-purple-100 text-purple-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: MCPMessage['type']) => {
    switch (type) {
      case 'task': return '📋'
      case 'response': return '💬'
      case 'heartbeat': return '💓'
      case 'error': return '❌'
      default: return '📄'
    }
  }

  return (
    <div className="space-y-6">
      {/* MCP Server Status */}
      <div className="numerology-card">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          MCP Server Status
        </h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Connection:</span>
            <span className={`ml-2 font-medium ${mcpStatus.connected ? 'text-green-600' : 'text-red-600'}`}>
              {mcpStatus.connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Version:</span>
            <span className="ml-2 font-medium text-gray-900">{mcpStatus.serverVersion}</span>
          </div>
          <div>
            <span className="text-gray-600">Messages:</span>
            <span className="ml-2 font-medium text-gray-900">{mcpStatus.messagesExchanged}</span>
          </div>
          <div>
            <span className="text-gray-600">Connections:</span>
            <span className="ml-2 font-medium text-gray-900">{mcpStatus.activeConnections}</span>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          Last heartbeat: {isClient ? mcpStatus.lastHeartbeat.toLocaleTimeString() : 'Loading...'}
        </div>
      </div>

      {/* Message Log */}
      <div className="numerology-card">
        <h3 className="font-semibold text-gray-900 mb-4">Agent Communication Log</h3>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className="bg-gray-50 rounded-lg p-3 border">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getTypeIcon(message.type)}</span>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      {message.sender} → {message.receiver}
                    </div>
                    <div className="text-xs text-gray-500">
                      {isClient ? message.timestamp.toLocaleTimeString() : 'Loading...'}
                    </div>
                  </div>
                </div>
                <span className={`agent-status text-xs ${getStatusColor(message.status)}`}>
                  {message.status}
                </span>
              </div>
              <div className="text-sm text-gray-700 ml-7">
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Protocol Information */}
      <div className="numerology-card bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="font-semibold text-gray-900 mb-2">Model Context Protocol</h3>
        <p className="text-sm text-gray-700 mb-3">
          Enabling seamless communication between AI agents through standardized message exchange.
        </p>
        <div className="flex gap-4 text-xs">
          <div>
            <span className="text-gray-600">Protocol:</span>
            <span className="ml-1 font-medium">MCP v1.0</span>
          </div>
          <div>
            <span className="text-gray-600">Transport:</span>
            <span className="ml-1 font-medium">WebSocket</span>
          </div>
          <div>
            <span className="text-gray-600">Encoding:</span>
            <span className="ml-1 font-medium">JSON-RPC</span>
          </div>
        </div>
      </div>
    </div>
  )
}
