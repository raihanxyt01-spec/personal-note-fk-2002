import React, { useState, useRef } from "react";
import { Plus, Trash2, Image as ImageIcon, X } from "lucide-react";
import { Note, Question, Vocabulary } from "../types";
import Editor from "./Editor";

interface CreateNoteProps {
  onSave: (note: Omit<Note, "id">) => void;
  onCancel: () => void;
}

export default function CreateNote({ onSave, onCancel }: CreateNoteProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [newWord, setNewWord] = useState("");
  const [newMeaning, setNewMeaning] = useState("");

  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestionText, setNewQuestionText] = useState("");

  const handleAddVocabulary = () => {
    if (!newWord.trim() || !newMeaning.trim()) return;
    setVocabularies([
      ...vocabularies,
      { id: Date.now().toString(), word: newWord.trim(), meaning: newMeaning.trim() },
    ]);
    setNewWord("");
    setNewMeaning("");
  };

  const handleRemoveVocabulary = (id: string) => {
    setVocabularies(vocabularies.filter(v => v.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert("Image size should be less than 3MB for the database.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddQuestion = () => {
    if (!newQuestionText.trim()) return;
    setQuestions([
      ...questions,
      { id: Date.now().toString(), qno: questions.length + 1, text: newQuestionText.trim() },
    ]);
    setNewQuestionText("");
  };
  
  const handleRemoveQuestion = (id: string) => {
    const newQs = questions.filter(q => q.id !== id);
    // Re-index qno
    setQuestions(newQs.map((q, index) => ({ ...q, qno: index + 1 })));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      return;
    }
    
    onSave({
      title: title.trim(),
      content: content.trim() === "<br>" ? "" : content,
      vocabularies,
      image,
      questions,
      createdAt: Date.now(),
    });
  };

  return (
    <div className="w-full pb-20">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-2xl font-bold text-slate-800">Create New Note</h2>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-700 p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all duration-300 transform-gpu active:scale-90 touch-manipulation">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Title & Body - Main Cell */}
        <div className="md:col-span-8 md:row-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 flex flex-col gap-6">
          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-bold border-none text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-0 bg-transparent"
            required
          />
          
          <div className="flex-1">
            <Editor 
              content={content} 
              onChange={setContent} 
              placeholder="Start writing here..." 
            />
          </div>
        </div>

        {/* Vocabulary Cell */}
        <div className="md:col-span-4 bg-slate-900 rounded-3xl shadow-xl p-6 text-white flex flex-col max-h-[400px]">
          <h3 className="text-lg font-bold text-indigo-300 mb-4 flex items-center gap-2">
            Vocabulary
          </h3>
          
          <div className="space-y-3 mb-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {vocabularies.map((v) => (
              <div key={v.id} className="border-l-2 border-indigo-500 pl-3 relative group">
                 <p className="text-sm font-bold text-white pr-6">{v.word}</p>
                 <p className="text-xs text-slate-400">{v.meaning}</p>
                 <button type="button" onClick={() => handleRemoveVocabulary(v.id)} className="absolute right-0 top-0 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 mt-auto">
            <input 
              type="text" 
              placeholder="Word" 
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 text-sm text-white placeholder-slate-500 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Meaning" 
                value={newMeaning}
                onChange={(e) => setNewMeaning(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddVocabulary())}
                className="flex-1 px-3 py-2 bg-slate-800 text-sm text-white placeholder-slate-500 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button 
                type="button" 
                onClick={handleAddVocabulary}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 md:px-3 py-3 md:py-2 rounded-xl border border-indigo-500 text-sm font-bold transition-all duration-300 transform-gpu active:scale-95 touch-manipulation"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Image Gallery Cell */}
        <div className="md:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">Gallery Image</h3>
            {image && (
               <button 
                type="button" 
                onClick={() => setImage(null)}
                className="text-[10px] uppercase font-bold text-red-500 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors"
              >
                Remove
              </button>
            )}
          </div>
          
          <div className="flex-1 flex flex-col">
            {!image ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 min-h-[150px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-500 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 cursor-pointer transition-all"
              >
                <ImageIcon size={32} className="mb-2 opacity-50" />
                <p className="font-medium text-sm">Choose from Gallery</p>
                <p className="text-[10px] mt-1 opacity-70 uppercase tracking-widest">Size &lt; 3MB</p>
              </div>
            ) : (
              <div className="flex-1 bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center p-2 relative h-[150px]">
                <img src={image} alt="Selected" className="max-h-full max-w-full object-contain rounded-xl shadow-sm" />
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              className="hidden" 
            />
          </div>
        </div>

        {/* Questions Cell */}
        <div className="md:col-span-8 bg-indigo-600 rounded-3xl shadow-lg p-6 sm:p-8 text-white flex flex-col">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-lg">
            Review Questions
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {questions.map((q) => (
              <div key={q.id} className="bg-indigo-500/30 p-4 rounded-2xl border border-indigo-400/30 relative group">
                <p className="text-xs font-semibold mb-1 text-indigo-200 uppercase tracking-wider">Q No. {q.qno}</p>
                <p className="text-sm font-medium leading-relaxed pr-6">{q.text}</p>
                <button type="button" onClick={() => handleRemoveQuestion(q.id)} className="absolute right-3 top-3 text-indigo-300 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-indigo-500/50 rounded-lg">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-auto">
            <input 
              type="text" 
              placeholder={`Type Question ${questions.length + 1}...`}
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddQuestion())}
              className="flex-1 px-4 py-3 bg-indigo-700/50 text-white placeholder-indigo-300 border border-indigo-500 rounded-xl focus:ring-2 focus:ring-white outline-none"
            />
            <button 
              type="button" 
              onClick={handleAddQuestion}
              className="bg-white text-indigo-700 hover:bg-slate-50 px-6 md:px-5 py-4 md:py-3 rounded-xl font-bold transition-all duration-300 transform-gpu active:scale-95 whitespace-nowrap flex items-center gap-1 shadow-sm touch-manipulation block md:inline-flex"
            >
              <Plus size={18} /> Add
            </button>
          </div>
        </div>

        <div className="md:col-span-12 flex justify-end pt-4">
          <button 
            type="submit"
            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-2xl shadow-lg shadow-indigo-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-indigo-300 active:translate-y-0 active:scale-95 transform-gpu touch-manipulation text-lg"
          >
            Save Note
          </button>
        </div>

      </form>
    </div>
  );
}
