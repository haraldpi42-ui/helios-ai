# Helios AI - General AI Agent Platform

**Ask Anything, Finish Everything**

Helios AI is a fullstack AI agent platform with React frontend and n8n workflow backend for managing, processing, and answering user requests through intelligent AI agents.

![Helios AI](https://img.shields.io/badge/AI-Agent%20Platform-green)
![React](https://img.shields.io/badge/React-19-blue)
![n8n](https://img.shields.io/badge/n8n-Workflows-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Features

### 🤖 Powerful AI Agents
Build intelligent agents that learn and improve from every interaction automatically.

### ⚡ n8n Workflows
Powered by flexible n8n workflows for unlimited customization and integration possibilities.

### 🧠 Self-Evolving
AI agents that continuously learn and adapt based on usage patterns and feedback.

### 📚 Knowledge Base
Upload documents and build a comprehensive knowledge base for context-aware responses.

### 🎯 Task Automation
Automate complex workflows and tasks with intelligent agent orchestration.

### 👥 Agent Marketplace
Discover and remix community-created agents to accelerate your workflow.

## Tech Stack

### Frontend
- **React 19** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - Beautiful component library
- **tRPC** - End-to-end typesafe APIs
- **Wouter** - Lightweight routing

### Backend
- **Node.js** - Runtime environment
- **Express 4** - Web framework
- **tRPC 11** - Type-safe API layer
- **Drizzle ORM** - Database toolkit
- **MySQL/TiDB** - Database
- **n8n** - Workflow automation

### Infrastructure
- **n8n Webhooks** - AI workflow processing
- **Manus OAuth** - Authentication
- **S3** - File storage

## Getting Started

### Prerequisites
- Node.js 22+
- pnpm
- MySQL/TiDB database
- n8n instance (optional for development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/haraldpi42-ui/helios-ai.git
cd helios-ai
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Configure the following variables:
- `DATABASE_URL` - Your database connection string
- `JWT_SECRET` - Secret for session signing
- `VITE_APP_ID` - Manus OAuth app ID
- `N8N_CHAT_WEBHOOK_URL` - n8n chat workflow webhook
- `N8N_TASK_WEBHOOK_URL` - n8n task workflow webhook
- `N8N_KNOWLEDGE_WEBHOOK_URL` - n8n knowledge workflow webhook

4. Push database schema:
```bash
pnpm db:push
```

5. Start development server:
```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
helios-ai/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   │   ├── Home.tsx   # Landing page
│   │   │   ├── Chat.tsx   # Chat interface
│   │   │   ├── AgentStore.tsx
│   │   │   └── KnowledgeBase.tsx
│   │   ├── components/    # Reusable components
│   │   ├── lib/          # Utilities
│   │   └── App.tsx       # Main app component
├── server/                # Backend Express application
│   ├── routers.ts        # tRPC API routes
│   ├── db.ts             # Database helpers
│   ├── n8n-service.ts    # n8n webhook integration
│   └── _core/            # Core framework files
├── drizzle/              # Database schema & migrations
│   └── schema.ts         # Database tables
├── shared/               # Shared types & constants
└── storage/              # S3 storage helpers
```

## n8n Workflow Integration

Helios AI uses n8n workflows for AI processing. The platform communicates with n8n via webhooks.

### Setting up n8n Workflows

1. **Chat Agent Workflow**
   - Create a webhook trigger node (POST method)
   - Path: `/helios-chat`
   - Process incoming messages with LLM
   - Return AI response

2. **Task Processing Workflow**
   - Create a webhook trigger node (POST method)
   - Path: `/helios-task`
   - Route tasks based on type
   - Execute specialized processing

3. **Knowledge Base Workflow**
   - Create a webhook trigger node (POST method)
   - Path: `/helios-knowledge`
   - Process document uploads
   - Generate embeddings for search

### Webhook Configuration

Update the webhook URLs in `server/n8n-service.ts`:

```typescript
const N8N_WEBHOOKS = {
  chat: "https://your-n8n-instance.com/webhook/helios-chat",
  task: "https://your-n8n-instance.com/webhook/helios-task",
  knowledge: "https://your-n8n-instance.com/webhook/helios-knowledge",
};
```

Or set environment variables:
```bash
N8N_CHAT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/helios-chat
N8N_TASK_WEBHOOK_URL=https://your-n8n-instance.com/webhook/helios-task
N8N_KNOWLEDGE_WEBHOOK_URL=https://your-n8n-instance.com/webhook/helios-knowledge
```

## Database Schema

### Core Tables

- **users** - User accounts and authentication
- **conversations** - Chat sessions
- **messages** - Chat message history
- **tasks** - Async agent tasks
- **documents** - Knowledge base documents
- **agents** - Agent configurations and metrics
- **userCredits** - Credit system for usage tracking

## API Routes

### Authentication
- `auth.me` - Get current user
- `auth.logout` - Logout user

### Conversations
- `conversations.list` - List user conversations
- `conversations.get` - Get conversation details
- `conversations.create` - Create new conversation
- `conversations.archive` - Archive conversation

### Messages
- `messages.list` - Get conversation messages
- `messages.send` - Send message and get AI response

### Tasks
- `tasks.list` - List user tasks
- `tasks.get` - Get task details
- `tasks.create` - Create new task

### Documents
- `documents.list` - List knowledge base documents
- `documents.get` - Get document details
- `documents.create` - Upload new document
- `documents.delete` - Delete document

### Agents
- `agents.myAgents` - List user's agents
- `agents.publicAgents` - List public agents
- `agents.get` - Get agent details
- `agents.create` - Create new agent
- `agents.remix` - Remix existing agent

### Credits
- `credits.get` - Get user credit balance

## Development

### Running Tests
```bash
pnpm test
```

### Building for Production
```bash
pnpm build
```

### Database Migrations
```bash
# Generate migration
pnpm db:generate

# Apply migration
pnpm db:migrate

# Push schema directly (development)
pnpm db:push
```

## Deployment

The application can be deployed to any Node.js hosting platform:

1. Build the application:
```bash
pnpm build
```

2. Set environment variables on your hosting platform

3. Start the production server:
```bash
pnpm start
```

## Inspiration

Helios AI is inspired by:
- **Skywork AI** - Multi-modal AI agent platform
- **LemonAI** - Self-evolving general AI agents

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Manus](https://manus.im) platform
- Powered by [n8n](https://n8n.io) workflows
- UI components from [shadcn/ui](https://ui.shadcn.com)

## Support

For support, please open an issue on GitHub or contact the maintainers.

---

**Made with ❤️ by the Helios AI Team**

