/**
 * n8n Webhook Integration Service
 * 
 * This service handles communication with n8n workflows via webhooks.
 * Configure your n8n webhook URLs in environment variables or here.
 */

interface N8nWebhookResponse {
  success: boolean;
  data?: any;
  error?: string;
}

interface ChatRequest {
  message: string;
  conversationId: string;
  userId: string;
  history: Array<{ role: string; content: string }>;
}

interface TaskRequest {
  taskType: string;
  input: string;
  taskId: string;
  userId: string;
}

/**
 * Configuration for n8n webhooks
 * TODO: Replace these with your actual n8n webhook URLs
 */
const N8N_WEBHOOKS = {
  chat: process.env.N8N_CHAT_WEBHOOK_URL || "https://n8n.the-develop.net/webhook/helios-chat",
  task: process.env.N8N_TASK_WEBHOOK_URL || "https://n8n.the-develop.net/webhook/helios-task",
  knowledge: process.env.N8N_KNOWLEDGE_WEBHOOK_URL || "https://n8n.the-develop.net/webhook/helios-knowledge",
};

/**
 * Call n8n chat workflow
 */
export async function callChatWorkflow(request: ChatRequest): Promise<N8nWebhookResponse> {
  try {
    const response = await fetch(N8N_WEBHOOKS.chat, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`n8n webhook failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error calling n8n chat workflow:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Call n8n task processing workflow
 */
export async function callTaskWorkflow(request: TaskRequest): Promise<N8nWebhookResponse> {
  try {
    const response = await fetch(N8N_WEBHOOKS.task, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`n8n webhook failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error calling n8n task workflow:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Process document with n8n knowledge workflow
 */
export async function processDocumentWithN8n(
  documentId: string,
  content: string,
  userId: string
): Promise<N8nWebhookResponse> {
  try {
    const response = await fetch(N8N_WEBHOOKS.knowledge, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documentId,
        content,
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error(`n8n webhook failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error calling n8n knowledge workflow:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Mock AI response for development when n8n is not available
 */
export function getMockAIResponse(message: string): string {
  const responses = [
    "I'm here to help! This is a mock response. Connect n8n workflows for real AI processing.",
    "That's an interesting question! Once n8n workflows are configured, I'll provide intelligent responses.",
    "I understand your request. The n8n integration will enable advanced AI capabilities.",
    "Great question! Configure the n8n webhook URLs to unlock full AI agent functionality.",
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

