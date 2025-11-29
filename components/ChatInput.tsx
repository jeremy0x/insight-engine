import React, { useRef } from 'react';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  image: string | null;
  setImage: (value: string | null) => void;
  isThinkingEnabled: boolean;
  setIsThinkingEnabled: (value: boolean) => void;
  isLoading: boolean;
  onSend: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  image,
  setImage,
  isThinkingEnabled,
  setIsThinkingEnabled,
  isLoading,
  onSend
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Image Preview */}
      {image && (
        <div className="mb-2 flex items-center gap-2 animate-fadeIn">
          <div className="relative group">
            <img 
              src={image} 
              alt="Preview" 
              className="h-16 w-16 object-cover rounded border border-gray-200 grayscale" 
            />
            <button
              onClick={clearImage}
              className="absolute -top-2 -right-2 bg-black text-white rounded-full p-0.5 shadow hover:bg-gray-800 transition-colors"
            >
              <span className="material-icons text-xs">close</span>
            </button>
          </div>
        </div>
      )}

      <div className="relative flex flex-col gap-2 bg-white rounded-xl border border-gray-200 p-2 shadow-sm focus-within:ring-1 focus-within:ring-gray-200 transition-all">
        
        {/* Text Area */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="w-full bg-transparent text-gray-900 placeholder-gray-400 px-3 py-2 focus:outline-none resize-none min-h-[48px] max-h-[150px] scrollbar-hide text-base"
          rows={1}
          disabled={isLoading}
        />

        {/* Toolbar */}
        <div className="flex justify-between items-center px-1 pb-1">
          <div className="flex items-center gap-2">
            {/* Image Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-50 rounded-md transition-all"
              title="Upload Image"
              disabled={isLoading}
            >
              <span className="material-icons text-xl">add_photo_alternate</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Thinking Mode Toggle */}
            <button
              onClick={() => setIsThinkingEnabled(!isThinkingEnabled)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                isThinkingEnabled
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
              title="Toggle Deep Thinking Mode"
              disabled={isLoading}
            >
              <span className="material-icons text-[14px]">psychology</span>
              {isThinkingEnabled ? 'Thinking On' : 'Thinking Off'}
            </button>
          </div>

          {/* Send Button */}
          <button
            onClick={onSend}
            disabled={!input.trim() && !image || isLoading}
            className={`p-2 rounded-full flex items-center justify-center transition-all ${
              !input.trim() && !image || isLoading
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800 shadow-sm'
            }`}
          >
            {isLoading ? (
               <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
               <span className="material-icons text-lg">arrow_upward</span>
            )}
          </button>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="text-center mt-3">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest">
          The Insight Engine • Powered by Gemini 3.0 Pro
        </p>
      </div>
    </div>
  );
};