import React, { useState, useRef } from 'react'
import { useSelector } from 'react-redux';
import { useChat } from '../hooks/useChat';
import { useEffect } from 'react';
import { Send, Image, Mic, Square } from 'lucide-react';



function Dashboard() {


    const chats  = useSelector((state) => state.chat)
    const currentChatId = useSelector((state) => state.chat.currentChatId)

console.log(typeof chats.chats[currentChatId])

    const chat = useChat()

    const [inputValue, setInputValue] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const [isRecording, setIsRecording] = useState(false)

    const fileInputRef = useRef(null)
    const mediaRecorderRef = useRef(null)
    const audioChunksRef = useRef([])
  

    useEffect(() => {
        chat.initializeSocketConnection()
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
                <div className="flex-1 overflow-y-auto">
                    {/* <div className="p-3 space-y-2">
                        {chats.chats[currentChatId]?.map((chat) => (
                            <button
                                key={chat.id}
                                className="w-full text-left px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-sm truncate"
                            >
                                {chat.title}
                            </button>
                        ))}
                    </div> */}
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
                                className={`max-w-xs md:max-w-md lg:max-w-2xl rounded-4xl px-4 py-3 md:px-6 md:py-4 ${
                                    message.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-800 text-gray-100'
                                }`}
                            >
                                {message.image && (
                                    <img src={message.image} alt="Message" className="w-full rounded-lg mb-2 max-w-xs" />
                                )}
                                <p className="text-sm md:text-base leading-relaxed">{message.content}</p>
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
                                    className={`px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors flex items-center justify-center ${
                                        isRecording
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
