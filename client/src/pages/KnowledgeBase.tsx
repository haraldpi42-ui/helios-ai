import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, FileText, Loader2, Plus, Sparkles, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function KnowledgeBase() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data: documents, refetch } = trpc.documents.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createDocument = trpc.documents.create.useMutation({
    onSuccess: () => {
      refetch();
      setShowAddForm(false);
      setTitle("");
      setContent("");
    },
  });

  const deleteDocument = trpc.documents.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  if (!isAuthenticated) {
    setLocation("/");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    createDocument.mutate({ title, content });
  };

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
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Knowledge Base</span>
          </div>
          <Button
            variant="outline"
            onClick={() => setLocation("/chat")}
          >
            Go to Chat
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Your Knowledge Base
            </h1>
            <p className="text-gray-600">
              Upload documents to provide context for your AI agents
            </p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Document
          </Button>
        </div>

        {/* Add Document Form */}
        {showAddForm && (
          <Card className="p-6 mb-8 border-blue-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Add New Document
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Document title..."
                  className="border-blue-300 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Document content..."
                  className="border-blue-300 focus:border-blue-500 min-h-[200px]"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={createDocument.isPending}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  {createDocument.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Create Document
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Documents List */}
        {documents && documents.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {documents.map((doc) => (
              <Card
                key={doc.id}
                className="p-6 border-blue-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {doc.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(doc.createdAt!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this document?")) {
                        deleteDocument.mutate({ id: doc.id });
                      }
                    }}
                    disabled={deleteDocument.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                <p className="text-gray-600 line-clamp-4">{doc.content}</p>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No documents yet
            </h2>
            <p className="text-gray-600 mb-4">
              Start building your knowledge base by adding documents
            </p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Document
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

