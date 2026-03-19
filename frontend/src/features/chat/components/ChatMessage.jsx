import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, ThumbsUp, ThumbsDown, Share } from "lucide-react";

const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex flex-col max-w-[75%] px-4 py-3 rounded-2xl ${
        isUser
          ? "bg-gray-600 text-white ml-auto"
          : "bg-gray-800 text-gray-100 mr-auto"
      }`}
    >
      {/* Message Content */}
      {isUser ? (
        message.content
      ) : (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          className="prose prose-invert max-w-none"
        >
          {message.content}
        </ReactMarkdown>
      )}

      {/* Actions (only for AI) */}
      {!isUser && (
        <div className="flex items-center gap-3 mt-2 text-gray-400 opacity-0 group-hover:opacity-100 transition">
          <Copy
            size={16}
            className="cursor-pointer hover:text-white"
            onClick={() => navigator.clipboard.writeText(message.content)}
          />
          <ThumbsUp size={16} className="cursor-pointer hover:text-green-400" />
          <ThumbsDown size={16} className="cursor-pointer hover:text-red-400" />
          <Share size={16} className="cursor-pointer hover:text-blue-400" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;