import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Copy, Search, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function AgentStore() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: publicAgents, isLoading } = trpc.agents.publicAgents.useQuery();
  const remixAgent = trpc.agents.remix.useMutation({
    onSuccess: () => {
      alert("Agent successfully remixed to your collection!");
    },
  });

  const filteredAgents = publicAgents?.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50">
      {/* Header */}
      <header className="border-b border-green-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-lime-500 rounded-lg flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Agent Store</span>
          </div>
          <Button
            variant="outline"
            onClick={() => setLocation("/chat")}
          >
            Go to Chat
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing AI Agents
          </h1>
          <p className="text-gray-600 mb-6">
            Explore self-evolved AI agents created by our community
          </p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agents..."
              className="pl-10 border-green-300 focus:border-green-500"
            />
          </div>
        </div>

        {/* Agents Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading agents...</p>
          </div>
        ) : filteredAgents && filteredAgents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredAgents.map((agent) => (
              <Card
                key={agent.id}
                className="p-6 border-green-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-lime-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex gap-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Copy className="h-4 w-4" />
                      {agent.remixCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {agent.experienceCount}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {agent.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {agent.description || "No description available"}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      // View agent details
                    }}
                  >
                    View Details
                  </Button>
                  {isAuthenticated && (
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600"
                      onClick={() => remixAgent.mutate({ agentId: agent.id })}
                      disabled={remixAgent.isPending}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Remix
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Sparkles className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No agents found
            </h2>
            <p className="text-gray-600">
              {searchQuery
                ? "Try adjusting your search query"
                : "Be the first to create and share an agent!"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

