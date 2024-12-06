import { cn } from "@/lib/utils";
import { MessageSquare, Bot, User } from "lucide-react";
import { motion } from "framer-motion";

interface ChatMessageProps {
  message: {
    role: "user" | "assistant";
    content: string;
  };
  className?: string;
}

export function ChatMessage({ message, className }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-4 group",
        isUser ? "flex-row-reverse" : "flex-row",
        className
      )}
    >
      {/* Avatar */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={cn(
          "flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-xl",
          isUser
            ? "bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] shadow-lg shadow-[var(--accent-blue)]/20"
            : "bg-gradient-to-br from-[var(--accent-teal)] to-[var(--accent-blue)] shadow-lg shadow-[var(--accent-teal)]/20"
        )}
      >
        {isUser ? (
          <User className="h-5 w-5 text-black" />
        ) : (
          <Bot className="h-5 w-5 text-black" />
        )}
      </motion.div>

      {/* Message Bubble */}
      <div className="flex-1 space-y-2">
        {/* Name */}
        <div className={cn(
          "text-sm font-medium",
          isUser ? "text-right text-[var(--accent-blue)]" : "text-[var(--accent-teal)]"
        )}>
          {isUser ? "You" : "Ocean Assistant"}
        </div>

        {/* Message Content */}
        <div
          className={cn(
            "relative group transition-all duration-300",
            "rounded-2xl px-4 py-3 shadow-lg",
            isUser ? (
              "rounded-tr-none bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] text-white"
            ) : (
              "rounded-tl-none glass-card backdrop-blur-sm border border-[var(--glass-border)]"
            )
          )}
        >
          {/* Bubble Pointer */}
          <div
            className={cn(
              "absolute top-0 w-4 h-4 transform",
              isUser ? (
                "right-0 translate-x-1/2 -translate-y-1/2 rotate-45 bg-[var(--accent-blue)]"
              ) : (
                "left-0 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[var(--glass-bg)] border-l border-t border-[var(--glass-border)]"
              )
            )}
          />

          {/* Message Text */}
          <div className={cn(
            "relative z-10 prose max-w-none",
            isUser ? "text-black" : "text-black",
            "prose-p:leading-relaxed prose-pre:rounded-lg"
          )}>
            {message.content}
          </div>

          {/* Hover Effect */}
          <div className={cn(
            "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300",
            isUser ? (
              "bg-gradient-to-br from-[var(--accent-blue)]/10 to-[var(--accent-teal)]/10"
            ) : (
              "bg-[var(--glass-shine)]/5"
            ),
            "group-hover:opacity-100"
          )} />
        </div>

        {/* Timestamp or Additional Info (optional) */}
        <div className={cn(
          "text-xs opacity-60",
          isUser ? "text-right text-[var(--accent-blue)]" : "text-[var(--accent-teal)]"
        )}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  );
}