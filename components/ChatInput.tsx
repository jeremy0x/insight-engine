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
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Image Preview */}
      {image && (
        <div className="mb-2 flex items-center gap-2 animate-fadeIn">
          <div className="relative group">
            <img 
              src={image} 
              alt="Preview" 
              className="h-20 w-20 object-cover rounded-lg border border-gray-600" 
            />
            <button
              onClick={clearImage}
              className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full p-1 shadow-lg hover:bg-red-500 transition-colors"
            >
              <span className="material-icons text-sm">close</span>
            </button>
          </div>
          <span className="text-xs text-gray-400">Image attached</span>
        </div>
      )}

      <div className="relative flex flex-col gap-2 bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-700 p-2 shadow-2xl">
        
        {/* Text Area */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Share your thought or topic..."
          className="w-full bg-transparent text-gray-100 placeholder-gray-500 px-3 py-2 focus:outline-none resize-none min-h-[50px] max-h-[150px] scrollbar-hide"
          rows={1}
          disabled={isLoading}
        />

        {/* Toolbar */}
        <div className="flex justify-between items-center px-2 pb-1">
          <div className="flex items-center gap-2">
            {/* Image Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-400 hover:text-gray-100 hover:bg-gray-700 rounded-full transition-all"
              title="Upload Image"
              disabled={isLoading}
            >
              <span className="material-icons">add_photo_alternate</span>
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                isThinkingEnabled
                  ? 'bg-indigo-900/50 text-indigo-300 border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                  : 'bg-gray-800 text-gray-500 border-gray-700 hover:border-gray-600'
              }`}
              title="Toggle Deep Thinking Mode (Gemini 3.0 Pro)"
              disabled={isLoading}
            >
              <span className="material-icons text-[16px]">psychology</span>
              {isThinkingEnabled ? 'Thinking On' : 'Thinking Off'}
            </button>
          </div>

          {/* Send Button */}
          <button
            onClick={onSend}
            disabled={!input.trim() && !image || isLoading}
            className={`p-2 rounded-full flex items-center justify-center transition-all ${
              !input.trim() && !image || isLoading
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-100 text-gray-900 hover:bg-white shadow-lg shadow-white/10'
            }`}
          >
            {isLoading ? (
               <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
               <span className="material-icons">arrow_upward</span>
            )}
          </button>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="text-center mt-3">
        <p className="text-[10px] text-gray-500">
          Powered by Gemini 3.0 Pro Preview • The Insight Engine
        </p>
      </div>
    </div>
  );
};
