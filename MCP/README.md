# Numerologo - Multi-Agent Numerology System

A cutting-edge numerology application powered by AI agents working collaboratively to provide comprehensive numerological insights.

## 🤖 Multi-Agent Architecture

This application features a sophisticated Multi-Agent System with 5 specialized AI agents:

### 1. **Carlos Manager** 🎯
- **Role**: Project Manager & Team Coordinator
- **Responsibilities**: Supervises all agents, assigns tasks, monitors progress
- **Location**: `/src/agents/carlos-manager/`

### 2. **Numerology Logic Agent** 🔢
- **Role**: Mathematical Algorithm Designer
- **Responsibilities**: Implements numerology calculations, interpretations
- **Location**: `/src/agents/numerology-logic/`

### 3. **Coding Agent** 💻
- **Role**: Frontend & Backend Developer
- **Responsibilities**: Implements UI components, API endpoints
- **Location**: `/src/agents/coding-agent/`

### 4. **Debugging Agent** 🐛
- **Role**: Bug Detective & Resolver
- **Responsibilities**: Identifies and fixes bugs, monitors system health
- **Location**: `/src/agents/debugging-agent/`

### 5. **Testing/QA Agent** ✅
- **Role**: Quality Assurance Specialist
- **Responsibilities**: Runs tests, validates functionality, ensures quality
- **Location**: `/src/agents/testing-qa/`

## 🚀 Features

- **Complete Numerology Calculations**: Life Path, Destiny, Soul Urge, and Personality numbers
- **Advanced Interpretations**: Detailed insights for each numerological aspect
- **Lucky Numbers**: Personalized lucky number generation
- **Compatibility Analysis**: Number compatibility for relationships
- **Real-time Agent Dashboard**: Monitor agent activity and performance
- **Beautiful UI**: Modern design with Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Agent Communication**: Model Context Protocol (MCP)
- **Package Manager**: npm
- **Linting**: ESLint
- **Development**: VS Code optimized

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd numerologo-mcp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Usage

### Basic Numerology Calculation
1. Enter your full name in the input field
2. Select your birth date
3. Click "Calculate Numerology"
4. Watch the agents work together to generate your report

### Agent Dashboard
- Monitor real-time agent activity
- View task completion statistics
- Observe agent coordination in action

## 🏗️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run test suite

### VS Code Tasks

Use Ctrl+Shift+P and type "Tasks: Run Task" to access:
- **dev**: Start development server
- **build**: Build the application
- **lint**: Check code quality
- **test**: Run tests
- **carlos-agent-start**: Initialize Carlos Manager
- **agents-status**: Check all agent statuses

## 🔧 Configuration

### TypeScript Configuration
The project is configured with path aliases for clean imports:
- `@/*` - src directory
- `@/agents/*` - agent modules
- `@/components/*` - React components
- `@/lib/*` - utility libraries
- `@/utils/*` - helper functions

### ESLint Configuration
Custom rules for TypeScript and Next.js best practices are configured in `.eslintrc.js`.

### Tailwind CSS
Custom numerology-themed colors and components are defined in `tailwind.config.js`.

## 🤝 Agent Communication

Agents communicate through the Carlos Manager using a task-based system:

```typescript
// Example task creation
carlosManager.createTask(
  'Calculate Life Path Number',
  'Process user birth date for numerology',
  'numerology-logic',
  'high'
)
```

## 📊 Numerology Calculations

### Supported Calculations
- **Life Path Number**: Your life's journey and purpose
- **Destiny Number**: Your ultimate life goal
- **Soul Urge Number**: Your inner desires and motivations
- **Personality Number**: How others perceive you
- **Birth Day Number**: Natural talents and abilities
- **Lucky Numbers**: Personalized fortune numbers
- **Compatibility**: Relationship compatibility analysis

### Calculation Accuracy
All calculations follow traditional numerology methods with support for master numbers (11, 22, 33).

## 🧪 Testing

The testing strategy includes:
- Unit tests for numerology calculations
- Component testing for React components
- Integration tests for agent communication
- End-to-end testing for user workflows

## 🔒 Security

- Input validation for all user data
- XSS protection
- Secure agent communication
- Error handling and logging

## 📈 Performance

- Optimized React components with React.memo
- Efficient numerology algorithms
- Lazy loading for better performance
- Background agent processing

## 🐛 Debugging

The Debugging Agent continuously monitors:
- Application errors
- Agent communication issues
- Performance bottlenecks
- User experience problems

## 🤖 GitHub Copilot Integration

This project is optimized for GitHub Copilot with:
- Comprehensive instructions in `.github/copilot-instructions.md`
- Type-safe code patterns
- Well-documented agent interfaces
- Clear architectural guidelines

## 📝 Contributing

1. Follow the established agent architecture
2. Maintain TypeScript type safety
3. Use proper error handling
4. Document agent communications
5. Test all numerology calculations

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Carlos Manager for exceptional project coordination
- The entire agent team for collaborative development
- The numerology community for calculation standards
- GitHub Copilot for development assistance

---

**Built with ❤️ by the Multi-Agent Team**
