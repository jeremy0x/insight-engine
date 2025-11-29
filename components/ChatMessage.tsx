import React from 'react';
import { Message, Role } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  // Simple formatter to handle bold text (**text**) and newlines
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className={`font-semibold ${isUser ? 'text-white' : 'text-black'}`}>{part.slice(2, -2)}</strong>;
          }
          return <span key={j}>{part}</span>;
        })}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} group animate-fadeIn`}>
      <div className={`max-w-[85%] md:max-w-[75%] lg:max-w-[65%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        
        {/* Avatar / Name */}
        <div className="flex items-center gap-2 mb-1.5">
          {isUser ? (
             <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">You</span>
          ) : (
             <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-900">Alex</span>
          )}
        </div>

        {/* Bubble */}
        <div
          className={`px-5 py-3.5 rounded-lg text-sm md:text-base leading-relaxed shadow-sm ${
            isUser
              ? 'bg-black text-white'
              : 'bg-white text-gray-900 border border-gray-200'
          }`}
        >
          {/* Attached Image Display */}
          {message.image && (
            <div className="mb-3 rounded overflow-hidden border border-gray-200">
              <img 
                src={message.image} 
                alt="User uploaded content" 
                className="max-h-64 object-cover w-full grayscale-[20%]" 
              />
            </div>
          )}

          {/* Text Content */}
          <div className="whitespace-pre-wrap">
            {formatText(message.text)}
          </div>
          
          {/* Thinking Indicator for historical messages (visual flourish) */}
          {message.isThinking && !isUser && (
             <div className="mt-3 pt-2 border-t border-gray-100 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-gray-400">
                <span className="material-icons text-[12px]">psychology</span>
                <span>Analyzed with Thought</span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};