import React, { useState, useEffect } from "react";
import { BookMarked, CheckCircle } from "lucide-react";
import { fetchNotes, saveNote, deleteNote } from "./lib/db";
import { Note } from "./types";

import ListNotes from "./components/ListNotes";
import CreateNote from "./components/CreateNote";
import ReadNote from "./components/ReadNote";

type ViewState = "list" | "create" | "read";

export default function App() {
  const [view, setView] = useState<ViewState>("list");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    const data = await fetchNotes();
    setNotes(data);
    setLoading(false);
  };

  const handleSaveNote = async (noteData: Omit<Note, "id">) => {
    const success = await saveNote(noteData);
    if (success) {
      setView("list");
      loadNotes();
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } else {
      console.error("Failed to save note. Please check your connection.");
    }
  };

  const handleDeleteNote = async (id: string) => {
    // Removed window.confirm as it is blocked in the iframe sandbox environment
    const success = await deleteNote(id);
    if (success) {
      setNotes(notes.filter(n => n.id !== id));
      if (activeNote?.id === id) setView("list");
    }
  };

  const openNote = (note: Note) => {
    setActiveNote(note);
    setView("read");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-8 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-4 cursor-pointer transition-opacity hover:opacity-80"
            onClick={() => setView("list")}
          >
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
              <BookMarked size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-indigo-600 tracking-tight leading-none">Personal Note</h1>
              <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold tracking-widest leading-none">Workspace v2.1</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col pb-[calc(1rem+env(safe-area-inset-bottom))]">
        {loading ? (
          <div className="flex justify-center py-20 flex-1 items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {view === "list" && (
              <ListNotes 
                notes={notes} 
                onAddNote={() => setView("create")} 
                onReadNote={openNote}
                onDeleteNote={handleDeleteNote}
              />
            )}
            
            {view === "create" && (
              <CreateNote 
                onSave={handleSaveNote} 
                onCancel={() => setView("list")} 
              />
            )}

            {view === "read" && activeNote && (
              <ReadNote 
                note={activeNote} 
                onBack={() => setView("list")} 
              />
            )}
          </>
        )}
      </main>

      {showSuccessPopup && (
        <div className="fixed bottom-8 right-8 bg-emerald-50 text-emerald-600 px-6 py-4 rounded-2xl shadow-xl border border-emerald-200 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-8 duration-300 z-50">
          <CheckCircle size={24} className="text-emerald-500" />
          <span className="font-bold text-lg">Note saved successfully!</span>
        </div>
      )}
    </div>
  );
}
