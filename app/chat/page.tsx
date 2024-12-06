"use client";

import { useState } from "react";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chat/chat-message";
import { useChat } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, isLoading } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="water-theme min-h-screen py-8 px-4">
      <div className="wave-container">
        <div className="wave"></div>
        <div className="wave" style={{ animationDelay: "-5s" }}></div>
        <div className="wave" style={{ animationDelay: "-10s" }}></div>
      </div>

      <div className="container mx-auto relative z-10">
        <Card className="glass-card glow w-full max-w-4xl mx-auto backdrop-blur-lg border-opacity-30">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 rounded-full bg-[var(--accent-blue)] bg-opacity-20">
                <MessageSquare className="w-6 h-6 text-[var(--accent-blue)]" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-teal)] bg-clip-text text-transparent">
                Ocean Conservation Assistant
              </h1>
            </div>

            <ScrollArea className="h-[600px] pr-4 rounded-lg">
              <div className="space-y-4 p-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--accent-blue)] bg-opacity-20 flex items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-[var(--accent-blue)]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--accent-blue)]">
                      Start a Conversation
                    </h3>
                    <p className="text-sm text-[var(--glass-border)] mt-2">
                      Ask me anything about ocean conservation and cybersecurity!
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <ChatMessage 
                      key={index} 
                      message={message}
                      className={cn(
                        "glass-card p-4",
                        message.role === "user" ? "bg-[var(--accent-blue)] bg-opacity-10" : "bg-[var(--accent-teal)] bg-opacity-10"
                      )}
                    />
                  ))
                )}
                {isLoading && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-6 h-6 text-[var(--accent-blue)] animate-spin" />
                  </div>
                )}
              </div>
            </ScrollArea>

            <form onSubmit={handleSubmit} className="mt-6 flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about ocean conservation..."
                disabled={isLoading}
                className="flex-1 bg-[var(--glass-bg)] border-[var(--glass-border)] text-white placeholder-[var(--glass-border)]"
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-teal)] text-white hover:opacity-90 transition-opacity"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}