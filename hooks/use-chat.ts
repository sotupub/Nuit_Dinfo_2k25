"use client";

import { useState } from "react";
import { Message } from "@/lib/types";

const INITIAL_MESSAGES: Message[] = [
  {
    role: "assistant",
    content: "Hello! I'm your cybersecurity assistant. How can I help you stay safe online today?",
  },
];

export function useChat() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    setIsLoading(true);
    
    // Add user message
    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Simulate AI response (replace with actual API call)
      const response = await simulateResponse(content);
      
      // Add AI response
      const botMessage: Message = { role: "assistant", content: response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading };
}

// Temporary simulation - replace with actual API integration
async function simulateResponse(message: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const responses = {
    default: "I can help you learn about cybersecurity best practices. What specific topic interests you?",
    password: "Strong passwords should be unique, long, and combine letters, numbers, and symbols. Consider using a password manager for better security.",
    phishing: "To avoid phishing attacks, always verify the sender's email address, don't click suspicious links, and never share sensitive information via email.",
    malware: "Protect against malware by keeping your software updated, using antivirus protection, and being careful about what you download.",
  };

  const lowercaseMessage = message.toLowerCase();
  
  if (lowercaseMessage.includes("password")) return responses.password;
  if (lowercaseMessage.includes("phishing")) return responses.phishing;
  if (lowercaseMessage.includes("malware")) return responses.malware;
  
  return responses.default;
}