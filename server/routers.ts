import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Conversations
  conversations: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getUserConversations } = await import("./db");
      return getUserConversations(ctx.user.id);
    }),
    get: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
      const { getConversation } = await import("./db");
      return getConversation(input.id);
    }),
    create: protectedProcedure.input(z.object({ 
      title: z.string().optional(),
      agentType: z.string().default("general")
    })).mutation(async ({ ctx, input }) => {
      const { createConversation } = await import("./db");
      const id = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return createConversation({ id, userId: ctx.user.id, ...input });
    }),
    archive: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
      const { updateConversation } = await import("./db");
      await updateConversation(input.id, { status: "archived" });
      return { success: true };
    }),
  }),

  // Messages
  messages: router({
    list: protectedProcedure.input(z.object({ conversationId: z.string() })).query(async ({ input }) => {
      const { getConversationMessages } = await import("./db");
      return getConversationMessages(input.conversationId);
    }),
    send: protectedProcedure.input(z.object({
      conversationId: z.string(),
      content: z.string(),
    })).mutation(async ({ ctx, input }) => {
      const { createMessage, getConversationMessages } = await import("./db");
      const { callChatWorkflow, getMockAIResponse } = await import("./n8n-service");
      
      // Save user message
      const userMsgId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await createMessage({
        id: userMsgId,
        conversationId: input.conversationId,
        role: "user",
        content: input.content,
      });

      // Get conversation history for context
      const history = await getConversationMessages(input.conversationId);
      const formattedHistory = history.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));
      
      // Call n8n webhook for AI processing
      let aiResponse: string;
      try {
        const n8nResult = await callChatWorkflow({
          message: input.content,
          conversationId: input.conversationId,
          userId: ctx.user.id,
          history: formattedHistory,
        });
        
        if (n8nResult.success && n8nResult.data?.response) {
          aiResponse = n8nResult.data.response;
        } else {
          // Fallback to mock response if n8n fails
          aiResponse = getMockAIResponse(input.content);
        }
      } catch (error) {
        console.error("n8n workflow error:", error);
        aiResponse = getMockAIResponse(input.content);
      }
      
      const assistantMsgId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const assistantResponse = await createMessage({
        id: assistantMsgId,
        conversationId: input.conversationId,
        role: "assistant",
        content: aiResponse,
      });

      return { userMessage: { id: userMsgId }, assistantMessage: assistantResponse };
    }),
  }),

  // Tasks
  tasks: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getUserTasks } = await import("./db");
      return getUserTasks(ctx.user.id);
    }),
    get: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
      const { getTask } = await import("./db");
      return getTask(input.id);
    }),
    create: protectedProcedure.input(z.object({
      taskType: z.string(),
      input: z.string(),
      conversationId: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      const { createTask } = await import("./db");
      const id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return createTask({ id, userId: ctx.user.id, ...input });
    }),
  }),

  // Documents (Knowledge Base)
  documents: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getUserDocuments } = await import("./db");
      return getUserDocuments(ctx.user.id);
    }),
    get: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
      const { getDocument } = await import("./db");
      return getDocument(input.id);
    }),
    create: protectedProcedure.input(z.object({
      title: z.string(),
      content: z.string(),
      fileUrl: z.string().optional(),
      mimeType: z.string().optional(),
      size: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      const { createDocument } = await import("./db");
      const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return createDocument({ id, userId: ctx.user.id, ...input });
    }),
    delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
      const { deleteDocument } = await import("./db");
      await deleteDocument(input.id);
      return { success: true };
    }),
  }),

  // Agents
  agents: router({
    myAgents: protectedProcedure.query(async ({ ctx }) => {
      const { getUserAgents } = await import("./db");
      return getUserAgents(ctx.user.id);
    }),
    publicAgents: publicProcedure.query(async () => {
      const { getPublicAgents } = await import("./db");
      return getPublicAgents();
    }),
    get: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
      const { getAgent } = await import("./db");
      return getAgent(input.id);
    }),
    create: protectedProcedure.input(z.object({
      name: z.string(),
      description: z.string().optional(),
      agentType: z.string(),
      configuration: z.string().optional(),
      isPublic: z.enum(["yes", "no"]).default("no"),
    })).mutation(async ({ ctx, input }) => {
      const { createAgent } = await import("./db");
      const id = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return createAgent({ id, userId: ctx.user.id, ...input });
    }),
    remix: protectedProcedure.input(z.object({ agentId: z.string() })).mutation(async ({ ctx, input }) => {
      const { getAgent, createAgent, updateAgent } = await import("./db");
      const original = await getAgent(input.agentId);
      if (!original) throw new Error("Agent not found");
      
      // Increment remix count
      const newRemixCount = String(parseInt(original.remixCount || "0") + 1);
      await updateAgent(input.agentId, { remixCount: newRemixCount });
      
      // Create new agent based on original
      const id = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return createAgent({
        id,
        userId: ctx.user.id,
        name: `${original.name} (Remix)`,
        description: original.description,
        agentType: original.agentType,
        configuration: original.configuration,
        isPublic: "no",
      });
    }),
  }),

  // Credits
  credits: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const { getUserCredits } = await import("./db");
      return getUserCredits(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
