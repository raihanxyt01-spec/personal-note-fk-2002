import { Bold, Italic, Underline, Highlighter } from "lucide-react";
import React, { useRef, useEffect, useState } from "react";

interface EditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function Editor({ content, onChange, placeholder }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [highlightColor, setHighlightColor] = useState('#fcd34d');

  // Initialize content once
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    if (command === 'hiliteColor') {
       // Use both hiliteColor and backColor for better browser support
       document.execCommand('backColor', false, value);
    }
    document.execCommand(command, false, value);
    if (editorRef.current) {
      handleInput(); // Trigger change manually since execCommand might not fire onInput
    }
  };

  return (
    <div className="flex flex-col bg-transparent overflow-hidden h-full">
      <div className="flex items-center gap-2 p-2 border-b border-slate-100 flex-wrap pb-4 mb-4">
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand('bold'); }}
          className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-bold"
          title="Bold"
        >
          <Bold size={20} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand('italic'); }}
          className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          title="Italic"
        >
          <Italic size={20} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand('underline'); }}
          className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          title="Underline"
        >
          <Underline size={20} />
        </button>
        <div className="w-px h-6 bg-slate-200 mx-1"></div>
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200/60 shadow-sm">
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); execCommand('hiliteColor', highlightColor); }}
            className="px-4 py-2 bg-white text-slate-700 hover:text-indigo-600 rounded-lg shadow-sm text-sm font-bold transition-colors flex items-center gap-2"
            title="Highlight text"
          >
             <Highlighter size={18} style={{ color: highlightColor }} />
             <span className="hidden sm:inline">Highlight</span>
          </button>
          <div className="flex items-center gap-1.5 px-2 mx-1 border-l border-slate-200 pl-3">
            {['#ffff77', '#77ffe4', '#77ff92', '#ff7792'].map(color => (
              <button
                key={color}
                type="button"
                onMouseDown={(e) => { 
                  e.preventDefault(); 
                  setHighlightColor(color);
                  execCommand('hiliteColor', color); 
                }}
                className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${highlightColor === color ? 'border-slate-800 scale-110' : 'border-white shadow-sm'}`}
                style={{ backgroundColor: color }}
                title="Quick color"
              />
            ))}
          </div>
          <div 
            className="relative w-9 h-9 rounded-full p-[2px] cursor-pointer hover:scale-110 transition-transform shrink-0" 
            style={{ background: 'conic-gradient(from 180deg at 50% 50%, #ff0000 0deg, #ff8a00 60deg, #ffe600 120deg, #14ff00 180deg, #00a3ff 240deg, #0500ff 300deg, #ff0000 360deg)' }}
            title="Choose custom color"
          >
            <div 
              className="w-full h-full rounded-full border-2 border-white shadow-inner"
              style={{ backgroundColor: highlightColor }}
            />
            <input
              type="color"
              value={highlightColor}
              onChange={(e) => setHighlightColor(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full block"
            />
          </div>
        </div>
      </div>
      <div
        ref={editorRef}
        onInput={handleInput}
        onBlur={handleInput}
        className="flex-1 overflow-y-auto px-2 outline-none prose prose-slate max-w-none prose-p:leading-relaxed prose-p:text-slate-700 custom-scrollbar min-h-[200px] empty:before:content-[attr(data-placeholder)] empty:before:text-slate-300 empty:before:cursor-text"
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
      ></div>
    </div>
  );
}
