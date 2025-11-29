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
            return <strong key={j} className="font-bold text-white">{part.slice(2, -2)}</strong>;
          }
          return <span key={j}>{part}</span>;
        })}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 group`}>
      <div className={`max-w-[85%] md:max-w-[75%] lg:max-w-[65%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        
        {/* Avatar / Name */}
        <div className="flex items-center gap-2 mb-1">
          {isUser ? (
             <span className="text-xs font-medium text-gray-400">You</span>
          ) : (
             <span className="text-xs font-medium text-purple-400">Alex • Host</span>
          )}
        </div>

        {/* Bubble */}
        <div
          className={`px-5 py-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed ${
            isUser
              ? 'bg-gray-800 text-gray-100 rounded-tr-sm border border-gray-700'
              : 'bg-gradient-to-br from-indigo-900/40 to-gray-900 text-gray-100 rounded-tl-sm border border-indigo-900/30'
          }`}
        >
          {/* Attached Image Display */}
          {message.image && (
            <div className="mb-3 rounded-lg overflow-hidden border border-gray-600/50">
              <img 
                src={message.image} 
                alt="User uploaded content" 
                className="max-h-64 object-cover w-full" 
              />
            </div>
          )}

          {/* Text Content */}
          <div className="whitespace-pre-wrap text-gray-200">
            {formatText(message.text)}
          </div>
          
          {/* Thinking Indicator for historical messages (visual flourish) */}
          {message.isThinking && !isUser && (
             <div className="mt-2 flex items-center gap-1.5 text-xs text-purple-300/60">
                <span className="material-icons text-[14px]">psychology</span>
                <span>Deep Thought Analysis</span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
