import React, { useState, useEffect, useRef } from 'react';
import { Message, Role } from './types';
import { generateResponse } from './services/geminiService';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isThinkingEnabled, setIsThinkingEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    setMessages([
      {
        id: 'init-1',
        role: Role.MODEL,
        text: "Welcome to The Insight Engine. I'm Alex. I'm here to help you deconstruct complex ideas, strategies, or problems. What topic shall we put on the table today?",
        isThinking: false
      }
    ]);
  }, []);

  const handleSend = async () => {
    if ((!input.trim() && !image) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: input,
      image: image,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setImage(null);
    setIsLoading(true);

    try {
      const responseText = await generateResponse(
        messages, // Pass history excluding the one we just added (handled inside service by mapping) - wait, service maps the passed array. We need to pass the *current* messages state which doesn't have the new one yet? No, setState is async. 
        // Better: Pass 'messages' (current state) as history, and 'input'/'image' as current turn.
        input,
        image,
        isThinkingEnabled
      );

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: responseText,
        isThinking: isThinkingEnabled
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        role: Role.MODEL,
        text: "I encountered an issue analyzing that. Could you rephrase or try again?",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#111827] text-gray-200 overflow-hidden font-sans">
      
      {/* Header */}
      <header className="flex-none p-4 md:p-6 border-b border-gray-800 bg-[#111827]/80 backdrop-blur-sm z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
             <span className="material-icons text-white">graphic_eq</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">The Insight Engine</h1>
            <p className="text-xs text-gray-400 font-medium">Hosted by Alex (AI)</p>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4 pb-20">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          
          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start mb-6 animate-pulse">
              <div className="bg-gray-800/50 px-5 py-4 rounded-2xl rounded-tl-sm border border-gray-700/50 flex items-center gap-3">
                 <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                 </div>
                 <span className="text-xs text-gray-400 font-medium">
                   {isThinkingEnabled ? 'Alex is thinking deeply...' : 'Alex is responding...'}
                 </span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="flex-none bg-[#111827] z-20">
         <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-2"></div>
         <ChatInput 
            input={input}
            setInput={setInput}
            image={image}
            setImage={setImage}
            isThinkingEnabled={isThinkingEnabled}
            setIsThinkingEnabled={setIsThinkingEnabled}
            isLoading={isLoading}
            onSend={handleSend}
         />
      </footer>
    </div>
  );
};

export default App;
