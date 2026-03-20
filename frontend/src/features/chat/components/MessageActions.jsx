import { useState } from "react";
import { Send, Image, Mic, Square, Copy, ThumbsUp, ThumbsDown, Share, Check } from 'lucide-react';


const MessageActions = ({ message }) => {
    const [copied, setCopied] = useState(false);
    const [liked, setLiked] = useState(null);

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };


    const handleDownload = () => {
        const blob = new Blob([message.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `message-${message._id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    return (
        <div className="flex items-center gap-1 mt-3  transition-opacity duration-200  ">
            <button
                onClick={handleCopy}
                className="p-1 sm:p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
                title="Copy"
            >
                {copied ? <Check size={13} className="sm:w-4 sm:h-4 text-green-400" /> : <Copy size={13} className="sm:w-4 sm:h-4" />}
            </button>
            <button
                onClick={() => setLiked(liked === 'up' ? null : 'up')}
                className={`p-1 sm:p-1.5 rounded-md transition-colors  cursor-pointer ${liked === 'up' ? 'text-blue-400 bg-blue-400/10 ' : 'text-gray-500 hover:text-white hover:bg-gray-800 '}`}
                title="Good response"
            >
                <ThumbsUp size={13} className="sm:w-4 sm:h-4" />
            </button>
            <button
                onClick={() => setLiked(liked === 'down' ? null : 'down')}
                className={`p-1 sm:p-1.5 rounded-md transition-colors  cursor-pointer ${liked === 'down' ? 'text-red-400 bg-red-400/10' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}
                title="Bad response"
            >
                <ThumbsDown size={13} className="sm:w-4 sm:h-4" />
            </button>
            <button
                className="p-1 sm:p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
                title="Share"
                onClick={handleDownload}

            >
                <Share size={13} className="sm:w-4 sm:h-4"   />
            </button>
        </div>
    );
};


export default MessageActions;