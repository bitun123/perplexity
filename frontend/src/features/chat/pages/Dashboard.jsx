import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useChat } from '../hooks/useChat';
import { Send, Image, Mic, Square, Copy, ThumbsUp, ThumbsDown, Share, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// ─── Message Action Buttons ───────────────────────────────────────────────────
const MessageActions = ({ message }) => {
    const [copied, setCopied] = useState(false);
    const [liked, setLiked] = useState(null);

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
                onClick={handleCopy}
                className="p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
                title="Copy"
            >
                {copied ? <Check size={15} className="text-green-400" /> : <Copy size={15} />}
            </button>
            <button
                onClick={() => setLiked(liked === 'up' ? null : 'up')}
                className={`p-1.5 rounded-md transition-colors ${liked === 'up' ? 'text-blue-400 bg-blue-400/10' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}
                title="Good response"
            >
                <ThumbsUp size={15} />
            </button>
            <button
                onClick={() => setLiked(liked === 'down' ? null : 'down')}
                className={`p-1.5 rounded-md transition-colors ${liked === 'down' ? 'text-red-400 bg-red-400/10' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}
                title="Bad response"
            >
                <ThumbsDown size={15} />
            </button>
            <button
                className="p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
                title="Share"
            >
                <Share size={15} />
            </button>
        </div>
    );
};

// ─── Markdown Renderer ────────────────────────────────────────────────────────
const MarkdownContent = ({ content }) => (
    <ReactMarkdown
        components={{
            h1: ({ children }) => (
                <h1 className="mt-0 mb-5 text-2xl font-bold text-white">{children}</h1>
            ),
            h2: ({ children }) => (
                <h2 className="mt-6 mb-4 text-xl font-bold text-white">{children}</h2>
            ),
            h3: ({ children }) => (
                <h3 className="mt-4 mb-2 text-base font-semibold text-gray-200">{children}</h3>
            ),
            p: ({ children }) => (
                <p className="mb-4 last:mb-0 text-sm md:text-base leading-7 text-gray-200">{children}</p>
            ),
            ul: ({ children }) => (
                <ul className="mb-4 ml-5 space-y-2 list-disc">{children}</ul>
            ),
            ol: ({ children }) => (
                <ol className="mb-4 ml-5 space-y-2 list-decimal">{children}</ol>
            ),
            li: ({ children }) => (
                <li className="text-sm md:text-base text-gray-300">{children}</li>
            ),
            code: ({ inline, className, children }) => {
                const match = /language-(\w+)/.exec(className || '');
                const lang = match ? match[1] : 'javascript';

                if (!inline) {
                    return (
                        <div className="mb-5 rounded-xl overflow-hidden border border-gray-700 bg-gray-900">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                                <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">
                                    {lang}
                                </span>
                                <button
                                    onClick={() => navigator.clipboard.writeText(String(children))}
                                    className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-700"
                                >
                                    Copy
                                </button>
                            </div>
                            <SyntaxHighlighter
                                language={lang}
                                style={atomDark}
                                customStyle={{
                                    margin: 0,
                                    padding: '1.25rem',
                                    background: '#0d1117',
                                    fontSize: '0.85rem',
                                    lineHeight: '1.6',
                                }}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        </div>
                    );
                }

                return (
                    <code className="rounded-md bg-gray-800 border border-gray-700 px-2 py-1 font-mono text-xs text-blue-300">
                        {children}
                    </code>
                );
            },
            pre: ({ children }) => <div className="mb-1">{children}</div>,
            blockquote: ({ children }) => (
                <div className="my-5 px-4 py-3 rounded-lg bg-blue-500/10 border-l-4 border-blue-500 text-gray-300">
                    {children}
                </div>
            ),
            hr: () => <hr className="my-4 border-gray-700" />,
            a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
                    {children}
                </a>
            ),
            strong: ({ children }) => (
                <strong className="font-semibold text-gray-200 text-[1.05rem]">{children}</strong>
            ),
            em: ({ children }) => <em className="italic text-gray-300">{children}</em>,
            table: ({ children }) => (
                <div className="mb-5 overflow-x-auto rounded-xl border border-gray-700 bg-gray-900/50">
                    <table className="w-full text-sm">{children}</table>
                </div>
            ),
            thead: ({ children }) => (
                <thead className="bg-gray-900 text-gray-200 border-b border-gray-700">{children}</thead>
            ),
            tbody: ({ children }) => (
                <tbody className="divide-y divide-gray-700">{children}</tbody>
            ),
            tr: ({ children }) => (
                <tr className="hover:bg-gray-800/30 transition-colors">{children}</tr>
            ),
            td: ({ children }) => <td className="px-5 py-3 text-gray-300">{children}</td>,
            th: ({ children }) => (
                <th className="px-5 py-3 text-left font-semibold text-gray-100">{children}</th>
            ),
        }}
    >
        {content}
    </ReactMarkdown>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard() {
    const chats = useSelector((state) => state.chat);
    const currentChatId = useSelector((state) => state.chat.currentChatId);
    const { user } = useSelector((state) => state.auth);

    const chat = useChat();

    const [inputValue, setInputValue] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [isRecording, setIsRecording] = useState(false);

    const fileInputRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const messagesEndRef = useRef(null);

    // ✅ Auto scroll on new messages / tokens
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chats.chats[currentChatId]?.messages?.length,
        chats.chats[currentChatId]?.messages?.at(-1)?.content]);

    useEffect(() => {
        chat.initializeSocketConnection();
        chat.handleGetChats();
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputValue.trim() === '' && !selectedImage) return;
        chat.handleSendMessage({ message: inputValue, chatId: currentChatId });
        setInputValue('');
        setSelectedImage(null);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setSelectedImage(event.target?.result);
            reader.readAsDataURL(file);
        }
    };

    const handleVoiceRecord = async () => {
        if (!isRecording) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                audioChunksRef.current = [];

                mediaRecorder.ondataavailable = (event) => audioChunksRef.current.push(event.data);
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
                    console.log('Voice recorded:', audioBlob);
                };

                mediaRecorder.start();
                setIsRecording(true);
            } catch (error) {
                console.error('Error accessing microphone:', error);
            }
        } else {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
        }
    };

    const removeSelectedImage = () => {
        setSelectedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const messages = chats.chats[currentChatId]?.messages ?? [];

    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden">

            {/* ── Sidebar ── */}
            <aside className="hidden md:flex w-full md:w-64 lg:w-78 bg-gray-950 border-r border-gray-800 flex-col">
                <div className="p-4 border-b border-gray-800">
                    <button className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors">
                        + New Chat
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-2 no-scrollbar pt-5">
                    {Object.values(chats.chats || {}).map((c) => (
                        <button
                            key={c.id}
                            type="button"
                            onClick={() => chat.handleOpenChat(c.id)}
                            className={`w-full cursor-pointer rounded-xl px-3 py-2 text-left text-base font-medium transition ${
                                currentChatId === c.id
                                    ? 'bg-gray-800 text-white'
                                    : 'bg-gray-950 text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            {c.title}
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 px-4 py-2">
                        <div className="w-8 h-8 rounded-full bg-[#4E868D] flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-md font-medium truncate">{user?.username || 'User'}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── Main ── */}
            <main className="flex-1 flex flex-col w-full md:w-auto justify-center items-center bg-gray-950">

                {/* Messages */}
                <div className="w-[70rem] flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 no-scrollbar">

                    {messages.length === 0 && (
                        <div className="flex h-full items-center justify-center text-gray-600 text-sm">
                            Start a conversation…
                        </div>
                    )}

                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'w-full'}`}
                        >
                            <div
                                className={`group max-w-[95%] rounded-2xl px-5 py-4 md:px-7 md:py-5 ${
                                    message.role === 'user'
                                        ? 'bg-gray-700 text-white ml-auto rounded-3xl'
                                        : 'text-gray-100 mr-auto'
                                }`}
                            >
                                {message.image && (
                                    <img src={message.image} alt="Message" className="w-full rounded-lg mb-2 max-w-xs" />
                                )}

                                {message.role === 'user' ? (
                                    <p className="text-sm md:text-base">{message.content}</p>
                                ) : (
                                    <div className="space-y-2">
                                        <MarkdownContent content={message.content} />

                                        {/* ✅ Blinking cursor while streaming */}
                                        {message.streaming && (
                                            <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-0.5 rounded-sm align-middle" />
                                        )}

                                        {/* ✅ Action buttons — hidden while streaming */}
                                        {!message.streaming && (
                                            <MessageActions message={message} />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    <div ref={messagesEndRef} />
                </div>

                {/* ── Input Area ── */}
                <div className="p-4 md:pb-5">
                    <div className="w-[70rem] mx-auto">
                        {selectedImage && (
                            <div className="mb-3 relative inline-block">
                                <img
                                    src={selectedImage}
                                    alt="Selected"
                                    className="h-20 md:h-24 rounded-lg border border-gray-700"
                                />
                                <button
                                    onClick={removeSelectedImage}
                                    className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleSendMessage} className="w-full">
                            <div className="flex gap-2 md:gap-3 items-end">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-6 md:px-4 py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors flex items-center justify-center"
                                    title="Attach image"
                                >
                                    <Image size={20} />
                                </button>

                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-4 bg-gray-800 rounded-4xl text-white placeholder-gray-500 border-none outline-none text-sm md:text-base"
                                />

                                <button
                                    type="button"
                                    onClick={handleVoiceRecord}
                                    className={`px-5 md:px-4 py-4 rounded-lg transition-colors flex items-center justify-center ${
                                        isRecording
                                            ? 'bg-red-600 hover:bg-red-700 text-white'
                                            : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
                                    }`}
                                    title={isRecording ? 'Stop recording' : 'Record voice'}
                                >
                                    {isRecording ? <Square size={20} /> : <Mic size={20} />}
                                </button>

                                <button
                                    type="submit"
                                    disabled={chats.isLoading}
                                    className="px-5 py-4 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95 text-white rounded-lg transition-colors flex items-center justify-center"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;