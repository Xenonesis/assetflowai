"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, MessageSquare, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/ai/chat",
  } as any) as any;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      {/* Floating Action Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-transform duration-300 z-40 ${
          isOpen ? "scale-0" : "scale-100"
        }`}
      >
        <Sparkles className="w-6 h-6" />
      </Button>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-6 right-6 w-full max-w-sm h-[600px] max-h-[calc(100vh-3rem)] bg-[var(--surface-elevated)] border border-[var(--border)] rounded-2xl shadow-xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out z-50 origin-bottom-right ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="h-14 border-b border-[var(--border)] bg-[var(--surface-elevated)] flex items-center justify-between px-4">
          <div className="flex items-center gap-2 text-[var(--primary)] font-medium">
            <Sparkles className="w-5 h-5" />
            <span>AssetFlow AI</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background)] h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-60">
              <Bot className="w-12 h-12 text-[var(--text-muted)]" />
              <p className="text-sm text-[var(--text-secondary)]">
                Hi! I'm AssetFlow AI. How can I help you manage your assets today?
              </p>
            </div>
          ) : (
            messages.map((m: any) => (
              <div
                key={m.id}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === "user"
                      ? "bg-[var(--primary)] text-white rounded-br-sm"
                      : "bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl rounded-bl-sm px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-[var(--text-secondary)]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-elevated)]">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 bg-[var(--background)] border border-[var(--border)] rounded-full pl-4 pr-1.5 py-1.5 focus-within:ring-1 focus-within:ring-[var(--primary)] transition-all"
          >
            <input
              type="text"
              value={input || ""}
              onChange={handleInputChange}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent text-sm focus:outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)]"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !(input || "").trim()}
              className="w-8 h-8 rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shrink-0 disabled:opacity-50"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
