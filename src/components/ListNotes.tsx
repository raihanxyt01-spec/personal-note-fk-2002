import React, { useState } from "react";
import { Plus, Search, Trash2, BookOpen } from "lucide-react";
import { Note } from "../types";

interface ListNotesProps {
  notes: Note[];
  onAddNote: () => void;
  onReadNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

export default function ListNotes({ notes, onAddNote, onReadNote, onDeleteNote }: ListNotesProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8 px-2">
        <button 
          onClick={onAddNote}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 sm:py-3 rounded-2xl sm:rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all duration-300 hover:shadow-indigo-300 active:scale-95 transform-gpu touch-manipulation text-lg sm:text-base"
        >
          <Plus size={20} /> Add New Note
        </button>

        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={16} className="text-slate-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 sm:py-2 bg-slate-100/80 backdrop-blur-sm border-none rounded-2xl sm:rounded-xl text-base sm:text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700 placeholder-slate-400 shadow-inner"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed shadow-sm">
          <BookOpen strokeWidth={1} size={64} className="text-slate-300 mb-6" />
          <p className="text-slate-500 font-medium">No notes found. Create your first note!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNotes.map(note => (
            <div 
              key={note.id} 
              className="group bg-white rounded-[2rem] p-6 border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-500 ease-out flex flex-col justify-between cursor-pointer hover:-translate-y-2 relative h-64 overflow-hidden transform-gpu will-change-transform"
              onClick={() => onReadNote(note)}
            >
              <div>
                <h3 className="text-base font-bold text-slate-800 mb-1 line-clamp-2">{note.title}</h3>
                <p className="text-xs text-slate-400 mb-4 font-medium">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {note.vocabularies?.length > 0 && (
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded uppercase tracking-wider">
                      {note.vocabularies.length} Vocab
                    </span>
                  )}
                  {note.questions?.length > 0 && (
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded uppercase tracking-wider">
                      {note.questions.length} Qs
                    </span>
                  )}
                  {note.image && (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded uppercase tracking-wider">
                      Image
                    </span>
                  )}
                </div>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note.id);
                }}
                className="absolute bottom-4 right-4 p-3 sm:p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl sm:rounded-xl transition-all duration-300 active:scale-90 touch-manipulation transform-gpu"
                title="Delete Note"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
