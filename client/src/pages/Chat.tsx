import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trpc } from "@/lib/trpc";
import { Loader2, Send, Sparkles, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

export default function Chat() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: conversations } = trpc.conversations.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: messages, refetch: refetchMessages } = trpc.messages.list.useQuery(
    { conversationId: conversationId! },
    { enabled: !!conversationId }
  );

  const createConversation = trpc.conversations.create.useMutation({
    onSuccess: (data) => {
      setConversationId(data.id);
    },
  });

  const sendMessage = trpc.messages.send.useMutation({
    onSuccess: () => {
      refetchMessages();
      setMessage("");
    },
  });

  useEffect(() => {
    if (isAuthenticated && !conversationId && conversations && conversations.length > 0) {
      setConversationId(conversations[0].id);
    }
  }, [isAuthenticated, conversationId, conversations]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation("/");
    return null;
  }

  const handleSend = () => {
    if (!message.trim()) return;

    if (!conversationId) {
      createConversation.mutate(
        { title: message.slice(0, 50), agentType: "general" },
        {
          onSuccess: (conv) => {
            sendMessage.mutate({
              conversationId: conv.id,
              content: message,
            });
          },
        }
      );
    } else {
      sendMessage.mutate({
        conversationId,
        content: message,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50">
      <div className="container mx-auto h-screen flex flex-col py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-lime-500 rounded-lg flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Helios AI</h1>
              <p className="text-sm text-gray-600">Ask Anything, Finish Everything</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/")}
            >
              Home
            </Button>
          </div>
        </div>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col overflow-hidden shadow-lg border-green-200">
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            <div className="space-y-4">
              {!messages || messages.length === 0 ? (
                <div className="text-center py-12">
                  <Sparkles className="h-16 w-16 mx-auto text-green-500 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Start a Conversation
                  </h2>
                  <p className="text-gray-600">
                    Ask me anything and I'll help you accomplish your goals
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-lime-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-green-500 text-white"
                          : "bg-white border border-green-200 text-gray-900"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    {msg.role === "user" && (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-gray-700" />
                      </div>
                    )}
                  </div>
                ))
              )}
              {sendMessage.isPending && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-lime-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div className="bg-white border border-green-200 rounded-2xl px-4 py-3">
                    <Loader2 className="h-5 w-5 animate-spin text-green-500" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-green-200 p-4 bg-white">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Helios AI to make..."
                className="flex-1 border-green-300 focus:border-green-500 focus:ring-green-500"
                disabled={sendMessage.isPending}
              />
              <Button
                onClick={handleSend}
                disabled={!message.trim() || sendMessage.isPending}
                className="bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600"
              >
                {sendMessage.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

