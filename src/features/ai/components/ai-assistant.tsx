"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, isTextUIPart, type UIMessage } from "ai";
import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, MessageSquare, Loader2, Sparkles, Copy, Check, Share2, RotateCw, MoreHorizontal, Volume2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const chatTransport = new DefaultChatTransport({ api: "/api/ai/chat" });

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [localInput, setLocalInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: chatTransport,
  });
  const isLoading = status === 'submitted' || status === 'streaming';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localInput.trim() || isLoading) return;
    sendMessage?.({ text: localInput });
    setLocalInput("");
  };

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = (text: string) => {
    if (navigator.share) {
      navigator.share({
        title: "AssetFlow AI Response",
        text: text,
      }).catch((err) => console.log(err));
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Response copied to clipboard for sharing!");
    }
  };

  const handleRegenerate = () => {
    const userMsgs = messages.filter((m: any) => m.role === "user");
    if (userMsgs.length === 0) return;
    const lastUserMsg = userMsgs[userMsgs.length - 1] as any;
    const textContent = lastUserMsg.parts?.filter((p: any) => isTextUIPart(p)).map((p: any) => p.text).join('') || lastUserMsg.content || '';
    if (textContent) {
      sendMessage?.({ text: textContent });
    }
  };

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error("Text-to-speech not supported.");
    }
  };

  const handleDownloadMarkdown = (text: string, id: string) => {
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `response-${id.substring(0, 8)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Markdown exported!");
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(prev => prev === id ? null : id);
  };

  useEffect(() => {
    if (!activeMenuId) return;
    const handleDocumentClick = () => {
      setActiveMenuId(null);
    };
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [activeMenuId]);

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
                className={`flex flex-col ${
                  m.role === "user" ? "items-end" : "items-start"
                } space-y-1`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === "user"
                      ? "bg-[var(--primary)] text-white rounded-br-sm"
                      : "bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] rounded-bl-sm"
                  }`}
                >
                  {m.content || (m.parts?.filter((p: any) => isTextUIPart(p)).map((p: any) => p.text).join('') || '')}
                </div>

                {m.role !== "user" && (
                  <div className="flex items-center gap-1 px-1 text-[var(--text-muted)] relative">
                    <button
                      onClick={() => handleCopy(m.content || m.parts?.filter((p: any) => isTextUIPart(p)).map((p: any) => p.text).join('') || '', m.id)}
                      className="p-1 hover:text-[var(--text-primary)] hover:bg-[var(--background)] rounded transition-colors"
                      title="Copy response"
                    >
                      {copiedId === m.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                    </button>
                    
                    <button
                      onClick={() => handleShare(m.content || m.parts?.filter((p: any) => isTextUIPart(p)).map((p: any) => p.text).join('') || '')}
                      className="p-1 hover:text-[var(--text-primary)] hover:bg-[var(--background)] rounded transition-colors"
                      title="Share response"
                    >
                      <Share2 size={12} />
                    </button>

                    <button
                      onClick={handleRegenerate}
                      className="p-1 hover:text-[var(--text-primary)] hover:bg-[var(--background)] rounded transition-colors"
                      title="Regenerate response"
                    >
                      <RotateCw size={12} />
                    </button>

                    <button
                      onClick={(e) => toggleMenu(e, m.id)}
                      className="p-1 hover:text-[var(--text-primary)] hover:bg-[var(--background)] rounded transition-colors"
                      title="More actions"
                    >
                      <MoreHorizontal size={12} />
                    </button>

                    {activeMenuId === m.id && (
                      <div className="absolute left-20 bottom-6 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-lg shadow-lg py-1 z-10 w-28 text-xs text-[var(--text-primary)]">
                        <button
                          onClick={() => {
                            handleSpeak(m.content || m.parts?.filter((p: any) => isTextUIPart(p)).map((p: any) => p.text).join('') || '');
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[var(--background)] flex items-center gap-2"
                        >
                          <Volume2 size={12} className="text-purple-500" />
                          Speak
                        </button>
                        <button
                          onClick={() => {
                            handleDownloadMarkdown(m.content || m.parts?.filter((p: any) => isTextUIPart(p)).map((p: any) => p.text).join('') || '', m.id);
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[var(--background)] flex items-center gap-2"
                        >
                          <Download size={12} className="text-sky-500" />
                          Export .md
                        </button>
                      </div>
                    )}
                  </div>
                )}
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
            onSubmit={handleFormSubmit}
            className="flex items-center gap-2 bg-[var(--background)] border border-[var(--border)] rounded-full pl-4 pr-1.5 py-1.5 focus-within:ring-1 focus-within:ring-[var(--primary)] transition-all"
          >
            <input
              type="text"
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent text-sm focus:outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)]"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !localInput.trim()}
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
