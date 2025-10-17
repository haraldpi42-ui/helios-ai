import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { BookOpen, Brain, FileText, MessageSquare, Sparkles, Target, Users, Zap } from "lucide-react";
import { useLocation } from "wouter";

/**
 * All content in this page are only for example, delete if unneeded
 * When building pages, remember your instructions in Frontend Workflow, Frontend Best Practices, Design Guide and Common Pitfalls
 */
export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50">
      {/* Header */}
      <header className="border-b border-green-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-lime-500 rounded-lg flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Helios AI</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setLocation("/chat")}
                >
                  Go to Chat
                </Button>
                <Button variant="outline" onClick={() => logout()}>
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={() => window.location.href = getLoginUrl()}
                className="bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600"
              >
                Get Started
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Ask Anything,{" "}
            <span className="bg-gradient-to-r from-green-500 to-lime-500 bg-clip-text text-transparent">
              Finish Everything
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create, Train, and Evolve your AI Agents with Helios AI. Powered by n8n workflows and advanced AI models.
          </p>
          <div className="flex gap-4 justify-center">
            {isAuthenticated ? (
              <Button
                size="lg"
                onClick={() => setLocation("/chat")}
                className="bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-lg px-8 py-6"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Start Chatting
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => window.location.href = getLoginUrl()}
                className="bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-lg px-8 py-6"
              >
                Get Started Free
              </Button>
            )}
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" onClick={() => setLocation("/agents")}>
              <Users className="mr-2 h-5 w-5" />
              Agent Store
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-6 border-green-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-lime-500 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Powerful AI Agents
            </h3>
            <p className="text-gray-600">
              Build intelligent agents that learn and improve from every interaction automatically.
            </p>
          </Card>

          <Card className="p-6 border-green-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-lime-500 to-yellow-500 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              n8n Workflows
            </h3>
            <p className="text-gray-600">
              Powered by flexible n8n workflows for unlimited customization and integration possibilities.
            </p>
          </Card>

          <Card className="p-6 border-green-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Self-Evolving
            </h3>
            <p className="text-gray-600">
              AI agents that continuously learn and adapt based on usage patterns and feedback.
            </p>
          </Card>

          <Card className="p-6 border-green-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Knowledge Base
            </h3>
            <p className="text-gray-600">
              Upload documents and build a comprehensive knowledge base for context-aware responses.
            </p>
          </Card>

          <Card className="p-6 border-green-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Task Automation
            </h3>
            <p className="text-gray-600">
              Automate complex workflows and tasks with intelligent agent orchestration.
            </p>
          </Card>

          <Card className="p-6 border-green-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-500 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Agent Marketplace
            </h3>
            <p className="text-gray-600">
              Discover and remix community-created agents to accelerate your workflow.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
