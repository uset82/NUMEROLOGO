<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# GitHub Copilot Instructions for Numerologo Multi-Agent System

## Project Overview
This is a Next.js TypeScript application featuring a Multi-Agent System for numerology calculations. The project implements Model Context Protocol (MCP) for agent communication and coordination.

## Architecture
- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, and App Router
- **Multi-Agent System**: 5 specialized AI agents working together
- **MCP Integration**: Model Context Protocol for agent communication
- **Agent Coordination**: Carlos Manager oversees all other agents
- **Error Handling**: ErrorBoundary components for graceful failure recovery
- **Client-Side Safety**: useClientOnly pattern for hydration mismatch prevention

## Agent Roles & Implementation Patterns
1. **Carlos Manager** (`src/agents/carlos-manager/index.ts`):
   - Project manager and team coordinator
   - **Key Methods**: `createTask()`, `assignTaskToAgent()`, `completeTask()`
   - **Pattern**: Singleton instance with Map-based agent storage
   - **Responsibility**: Task queue management, priority-based assignment, agent status tracking

2. **Numerology Logic Agent** (`src/agents/numerology-logic/index.ts`):
   - Mathematical algorithm designer and calculation engine
   - **Key Methods**: `generateReport()`, calculation methods for all number types
   - **Pattern**: Master number preservation (11, 22, 33), letter-to-number mapping
   - **Responsibility**: All numerology calculations, detailed interpretations

3. **Coding Agent**: Frontend and backend development
4. **Debugging Agent**: Bug detection and resolution
5. **Testing/QA Agent**: Quality assurance and testing

## Critical Implementation Patterns

### Task-Based Communication
```typescript
// Carlos Manager task creation pattern
const task = await carlosManager.createTask({
  type: 'numerology_calculation',
  priority: 'high',
  input: { name, birthDate },
  assignedAgent: 'numerology-logic'
})

// Agent assignment pattern
await carlosManager.assignTaskToAgent(taskId, 'numerology-logic')
```

### Agent Singleton Pattern
```typescript
// All agents use singleton instances for global access
export const carlosManager = new CarlosManager()
export const numerologyLogicAgent = new NumerologyLogicAgent()
```

### Client-Side Rendering Safety
```typescript
// ALWAYS use useClientOnly for hydration safety
import { useClientOnly } from '@/utils/clientOnly'

function Component() {
  const isClient = useClientOnly()
  
  // Prevent hydration mismatches
  return (
    <div>
      {isClient ? dynamicContent : 'Loading...'}
    </div>
  )
}
```

### Error Boundary Implementation
```typescript
// Wrap all components with ErrorBoundary
<ErrorBoundary fallback={<CustomErrorMessage />}>
  <YourComponent />
</ErrorBoundary>
```

## Code Style Guidelines
- Use TypeScript for all new files
- Follow Next.js App Router patterns (`src/app/` directory)
- Implement proper error handling with ErrorBoundary components
- Use Tailwind CSS with numerology-themed styling (`numerology-card` class)
- Follow ESLint configuration
- Write comprehensive JSDoc comments
- Use async/await for asynchronous operations
- **CRITICAL**: Always use `'use client'` directive for interactive components

## File Organization & Patterns
- `/src/app/` - Next.js App Router pages and layouts
- `/src/agents/` - Multi-agent system components (singleton pattern)
- `/src/components/` - Reusable React components (ErrorBoundary wrapped)
- `/src/lib/` - Utility libraries and configurations
- `/src/utils/` - Helper functions (clientOnly.ts for hydration safety)

## Agent Communication Patterns
- **Task Creation**: Use Carlos Manager's `createTask()` method
- **Agent Assignment**: Priority-based task queue with `assignTaskToAgent()`
- **Status Tracking**: Real-time agent status monitoring via Map storage
- **Error Handling**: Graceful failure handling with fallback calculations
- **Logging**: All agent activities logged for debugging purposes

## Numerology Calculation Standards
### Core Number Types
- **Life Path Number**: Birth date digit reduction with master number preservation
- **Destiny Number**: Full name letter-to-number conversion
- **Soul Urge Number**: Vowels only from name
- **Personality Number**: Consonants only from name
- **Master Numbers**: Preserve 11, 22, 33 (never reduce)

### Letter-to-Number Mapping (Chaldean System)
```typescript
A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9
J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9
S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
```

### Calculation Accuracy Requirements
- **Input Validation**: Always validate names and birth dates
- **Master Number Preservation**: Never reduce 11, 22, 33 to single digits
- **Error Fallback**: Provide local calculation fallback if agent system fails
- **Comprehensive Reports**: Include all number types plus interpretations

## Component Development Patterns

### Required Component Structure
```typescript
'use client' // ALWAYS include for interactive components

import React, { useState, useEffect } from 'react'
import { useClientOnly } from '@/utils/clientOnly'

export function YourComponent() {
  const isClient = useClientOnly()
  
  // State initialization with SSR-safe defaults
  const [data, setData] = useState(ssrSafeDefault)
  
  useEffect(() => {
    if (!isClient) return
    // Client-side only operations
  }, [isClient])
  
  return (
    <div className="numerology-card">
      {isClient ? actualContent : loadingState}
    </div>
  )
}
```

### Styling Conventions
- Use `numerology-card` class for main containers
- Gradient backgrounds: `bg-gradient-to-r from-purple-50 to-indigo-50`
- Agent status indicators: `agent-status`, `agent-active`, `agent-working`, `agent-idle`
- Focus states: `focus:ring-2 focus:ring-purple-500`
- Responsive design: `grid lg:grid-cols-3 gap-8`

## Development Best Practices
- **Always use TypeScript interfaces** for data structures (see `NumerologyInput`, `NumerologyReport`)
- **Implement proper error boundaries** around all major components
- **Use React hooks appropriately** with `useClientOnly` for hydration safety
- **Follow accessibility guidelines** with proper ARIA labels
- **Optimize for performance** with React.memo where appropriate
- **Write testable code** with clear separation of concerns

## MCP Integration Notes
You can find more info and examples at https://modelcontextprotocol.io/llms-full.txt

### Agent Communication Protocols
- **Message Types**: 'task', 'response', 'heartbeat', 'error'
- **Status Tracking**: 'sent', 'delivered', 'processed', 'failed'
- **Transport**: WebSocket with JSON-RPC encoding
- **Heartbeat**: Regular status checks between agents

### Implementation Examples
```typescript
// MCP message structure
interface MCPMessage {
  id: string
  timestamp: Date
  sender: string
  receiver: string
  type: 'task' | 'response' | 'heartbeat' | 'error'
  content: string
  status: 'sent' | 'delivered' | 'processed' | 'failed'
}
```

## Testing Guidelines
- Write unit tests for all utility functions (see `__tests__` directories)
- Test numerology calculations thoroughly with edge cases
- Mock agent communications in tests using singleton pattern
- Validate user input properly with TypeScript interfaces
- Test error scenarios with ErrorBoundary components
- Use Jest with setupFilesAfterEnv configuration

## Security Considerations
- Validate all user inputs with TypeScript interfaces
- Sanitize data before processing in numerology calculations
- Implement proper error messages without exposing system details
- Protect against XSS with proper input escaping
- Use CSP headers for additional protection

## Performance Optimization
- Use React.memo for expensive components (especially agent dashboards)
- Implement proper loading states with skeleton UI
- Optimize bundle size with proper imports
- Use efficient algorithms for numerology calculations
- Cache frequently accessed data with Map storage patterns
- Minimize re-renders with useClientOnly pattern

## Common Patterns to Follow

### Error Handling Pattern
```typescript
try {
  const result = await numerologyLogicAgent.generateReport(input)
} catch (error) {
  console.error('Agent calculation failed:', error)
  // Fallback to local calculation
  const fallbackResult = localCalculation(input)
}
```

### State Management Pattern
```typescript
// Use Map for agent storage (Carlos Manager pattern)
private agents = new Map<string, Agent>()
private taskQueue: Task[] = []

// Priority-based task processing
const priorityOrder = { high: 3, medium: 2, low: 1 }
```

### Component Export Pattern
```typescript
// Always export both class and singleton instance
export class NumerologyLogicAgent { ... }
export const numerologyLogicAgent = new NumerologyLogicAgent()
```

When suggesting code improvements or new features:
1. **Always consider the multi-agent architecture** and task-based communication
2. **Ensure proper coordination** through Carlos Manager
3. **Implement error boundaries** for graceful failure recovery
4. **Use the established patterns** for consistency
5. **Test thoroughly** with both agent system and fallback calculations
6. **Follow the client-side rendering safety** guidelines
