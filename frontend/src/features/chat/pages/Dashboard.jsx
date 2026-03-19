import React, { useState, useRef } from 'react'
import { useSelector } from 'react-redux';
import { useChat } from '../hooks/useChat';
import { useEffect } from 'react';
import { Send, Image, Mic, Square } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';



function Dashboard() {


    const chats = useSelector((state) => state.chat)
    const currentChatId = useSelector((state) => state.chat.currentChatId)


    const chat = useChat()

    const [inputValue, setInputValue] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const [isRecording, setIsRecording] = useState(false)

    const fileInputRef = useRef(null)
    const mediaRecorderRef = useRef(null)
    const audioChunksRef = useRef([])


    useEffect(() => {
        chat.initializeSocketConnection()
        chat.handleGetChats()
    }, [])

    const { user } = useSelector((state) => state.auth);

    const handleSendMessage = (e) => {
        e.preventDefault()
        if (inputValue.trim() === '' && !selectedImage) return

        chat.handleSendMessage({ message: inputValue, chatId: currentChatId })
        setInputValue('')
        setSelectedImage(null)
    }

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                setSelectedImage(event.target?.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleVoiceRecord = async () => {
        if (!isRecording) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                const mediaRecorder = new MediaRecorder(stream)
                mediaRecorderRef.current = mediaRecorder
                audioChunksRef.current = []

                mediaRecorder.ondataavailable = (event) => {
                    audioChunksRef.current.push(event.data)
                }

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' })
                    console.log('Voice recorded:', audioBlob)
                    // Handle audio blob - send to backend
                }

                mediaRecorder.start()
                setIsRecording(true)
            } catch (error) {
                console.error('Error accessing microphone:', error)
            }
        } else {
            mediaRecorderRef.current?.stop()
            setIsRecording(false)
        }
    }

    const removeSelectedImage = () => {
        setSelectedImage(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const openChat = (chatId) => {
        chat.handleOpenChat(chatId)
    }

    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
            {/* Sidebar - Chat List */}
            <aside className="hidden md:flex w-full md:w-64 lg:w-72 bg-gray-900 border-r border-gray-800 flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-800">
                    <button className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors">
                        + New Chat
                    </button>
                </div>

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-2">
                    {Object.values(chats.chats || {}).map((chat) => (
                        <button
                            onClick={() => openChat(chat.id)}
                            key={chat.id}
                            type='button'
                            className='w-full cursor-pointer rounded-xl  bg-gray-800 px-3 py-2 text-left text-base font-medium text-white/90 transition hover:border-white hover:text-white'
                        >
                            {chat.title}
                        </button>
                    ))}
                </div>

                {/* User Profile */}
                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 px-4 py-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm font-bold">
                            {user?.username?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.username || 'User'}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col w-full md:w-auto">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
                    {chats.chats[currentChatId]?.messages?.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs md:max-w-md lg:max-w-2xl rounded-4xl px-4 py-3 md:px-6 md:py-4 ${message.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-800 text-gray-100'
                                    }`}
                            >
                                {message.image && (
                                    <img src={message.image} alt="Message" className="w-full rounded-lg mb-2 max-w-xs" />
                                )}
                                {message.role === 'user' ? (
                                    <p className="text-sm md:text-base">{message.content}</p>
                                ) : (
                                    <ReactMarkdown
                                        components={{
                                            h1: ({ children }) => <h1 className='mb-4 text-2xl font-bold flex items-center gap-2'>{children}</h1>,
                                            h2: ({ children }) => <h2 className='mb-4 mt-4 text-xl font-bold flex items-center gap-2'>{children}</h2>,
                                            h3: ({ children }) => <h3 className='mb-3 mt-3 text-lg font-semibold'>{children}</h3>,
                                            h4: ({ children }) => <h4 className='mb-2 mt-2 text-base font-semibold'>{children}</h4>,
                                            h5: ({ children }) => <h5 className='mb-2 mt-2 text-sm font-semibold'>{children}</h5>,
                                            p: ({ children }) => <p className='mb-3 last:mb-0 text-sm md:text-base leading-relaxed whitespace-pre-wrap'>{children}</p>,
                                            ul: ({ children }) => <ul className='mb-3 ml-6 space-y-2 list-disc'>{children}</ul>,
                                            ol: ({ children }) => <ol className='mb-3 ml-6 space-y-2 list-decimal'>{children}</ol>,
                                            li: ({ children }) => <li className='text-sm md:text-base'><span>{children}</span></li>,
                                            code: ({ inline, className, children }) => {
                                                const match = /language-(\w+)/.exec(className || '');
                                                const lang = match ? match[1] : 'javascript';

                                                if (!inline) {
                                                    return (
                                                        <SyntaxHighlighter
                                                            language={lang}
                                                            style={atomDark}
                                                            className='mb-3 rounded-lg overflow-x-auto text-xs md:text-sm'
                                                            customStyle={{
                                                                padding: '1rem',
                                                                margin: '0.75rem 0',
                                                                borderRadius: '0.5rem',
                                                                background: '#1e293b'
                                                            }}
                                                        >
                                                            {String(children).replace(/\n$/, '')}
                                                        </SyntaxHighlighter>
                                                    );
                                                }

                                                return <code className='rounded bg-slate-700 px-1.5 py-0.5 font-mono text-xs md:text-sm'>{children}</code>;
                                            },
                                            pre: ({ children }) => <div className='mb-3'>{children}</div>,
                                            blockquote: ({ children }) => (
                                                <blockquote className='mb-3 border-l-4 border-blue-400 pl-4 italic text-gray-300'>
                                                    {children}
                                                </blockquote>
                                            ),
                                            hr: () => <hr className='my-4 border-gray-600' />,
                                            a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className='text-blue-400 hover:text-blue-300 underline'>{children}</a>,
                                            strong: ({ children }) => <strong className='font-bold text-white'>{children}</strong>,
                                            em: ({ children }) => <em className='italic text-gray-200'>{children}</em>,
                                            table: ({ children }) => <table className='mb-3 w-full border-collapse border border-gray-600'>{children}</table>,
                                            thead: ({ children }) => <thead className='bg-gray-800'>{children}</thead>,
                                            tbody: ({ children }) => <tbody>{children}</tbody>,
                                            tr: ({ children }) => <tr className='border border-gray-600'>{children}</tr>,
                                            td: ({ children }) => <td className='px-3 py-2 text-sm border border-gray-600'>{children}</td>,
                                            th: ({ children }) => <th className='px-3 py-2 text-sm border border-gray-600 font-bold'>{children}</th>,
                                        }}
                                    >
                                        {message.content}
                                    </ReactMarkdown>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="border-t border-gray-800 bg-gray-900 p-4 md:p-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Image Preview */}
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

                        {/* Input Form */}
                        <form onSubmit={handleSendMessage} className="w-full">
                            <div className="flex gap-2 md:gap-3 items-end">
                                {/* Image Upload */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden border-none outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-3 md:px-4 py-2 md:py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors flex items-center justify-center"
                                    title="Attach image"
                                >
                                    <Image size={20} />
                                </button>

                                {/* Message Input */}
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-2 md:py-2.5 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm md:text-base"
                                />

                                {/* Voice Record */}
                                <button
                                    type="button"
                                    onClick={handleVoiceRecord}
                                    className={`px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors flex items-center justify-center ${isRecording
                                        ? 'bg-red-600 hover:bg-red-700 text-white'
                                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
                                        }`}
                                    title={isRecording ? 'Stop recording' : 'Record voice'}
                                >
                                    {isRecording ? <Square size={20} /> : <Mic size={20} />}
                                </button>

                                {/* Send Button */}
                                <button
                                    type="submit"
                                    className="px-4 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center"
                                >
                                    <Send size={20} className="hidden md:block" />
                                    <Send size={18} className="md:hidden" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Dashboard
