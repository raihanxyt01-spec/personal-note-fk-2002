import React, { useRef } from "react";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { Note } from "../types";
// @ts-ignore
import html2pdf from "html2pdf.js";

interface ReadNoteProps {
  note: Note;
  onBack: () => void;
}

export default function ReadNote({ note, onBack }: ReadNoteProps) {
  const noteRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    if (!noteRef.current) return;
    const opt = {
      margin:       10,
      filename:     `${note.title.replace(/\s+/g, "_")}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(noteRef.current).save();
  };

  const handleShare = async () => {
    const shareData = {
      title: note.title,
      text: `Check out my note: ${note.title}\n\n${note.content.replace(/<[^>]*>?/gm, '')}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      alert("Sharing is not supported on this browser. Try copying the URL.");
    }
  };

  return (
    <div className="w-full pb-24 print:pb-0">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-slate-50/80 backdrop-blur-md pb-4 pt-2 z-10 px-2 print:hidden">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold bg-white px-4 md:px-5 py-2.5 rounded-xl shadow-sm border border-slate-200 transition-all duration-300 hover:-translate-x-1 hover:shadow-md transform-gpu touch-manipulation"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            Study Mode
          </div>
          <button 
            onClick={handleDownloadPDF}
            className="p-3 md:p-2.5 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl shadow-sm border border-slate-200 transition-all duration-300 transform-gpu active:scale-95 touch-manipulation"
            title="Download PDF"
          >
            <Download size={20} />
          </button>
          <button 
            onClick={handleShare}
            className="px-4 md:px-5 py-3 md:py-2.5 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-100 transition-all duration-300 transform-gpu active:scale-95 shadow-sm touch-manipulation"
          >
            <Share2 size={16} /> <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* The Printable Note Content - Bento Grid view */}
      <div ref={noteRef} className="grid grid-cols-1 md:grid-cols-12 auto-rows-auto gap-6 bg-slate-50 p-2 print:flex print:flex-col print:bg-white print:p-0">
        
        {/* Main Content Cell */}
        <div className="md:col-span-8 md:row-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-10 flex flex-col print:border-none print:shadow-none print:p-0 print:mb-6">
          <div className="border-b border-slate-100 pb-6 mb-6">
            <h1 className="text-4xl font-bold text-slate-800 mb-2 leading-tight">{note.title}</h1>
            <p className="text-sm text-slate-400 font-medium">
              {new Date(note.createdAt).toLocaleDateString(undefined, {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>

          {note.content ? (
            <div 
              className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: note.content }}
            />
          ) : (
             <p className="text-slate-400 italic">No content</p>
          )}
        </div>

        {/* Vocabulary Cell */}
        {note.vocabularies && note.vocabularies.length > 0 && (
          <div className="md:col-span-4 bg-slate-900 rounded-3xl shadow-xl p-6 sm:p-8 text-white h-fit max-h-[500px] overflow-y-auto custom-scrollbar print:bg-white print:text-slate-900 print:border-2 print:border-slate-200 print:shadow-none print:max-h-max print:break-inside-avoid print:mb-6 print:overflow-visible">
            <h3 className="font-bold mb-6 flex items-center gap-2 text-indigo-300 text-lg print:text-slate-800">
              Vocabulary
            </h3>
            <ul className="space-y-4">
              {note.vocabularies.map(v => (
                <li key={v.id} className="border-l-2 border-indigo-500 pl-4 py-1 print:border-slate-400">
                  <p className="text-base font-bold mb-1 print:text-slate-800">{v.word}</p>
                  <p className="text-sm text-slate-400 print:text-slate-600">{v.meaning}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Gallery/Image Cell */}
        {note.image && (
          <div className="md:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm h-fit print:border-2 print:shadow-none print:break-inside-avoid print:mb-6">
            <h3 className="font-bold text-slate-800 mb-4 flex justify-between items-center text-lg">
              Gallery
            </h3>
            <div className="bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center p-2 relative h-48 sm:h-64 print:bg-white print:h-auto print:p-0">
              <img src={note.image} alt="Note Attachment" className="max-w-full max-h-full object-contain rounded-xl shadow-sm print:shadow-none" />
            </div>
          </div>
        )}

        {/* Questions Cell */}
        {note.questions && note.questions.length > 0 && (
          <div className="md:col-span-8 bg-indigo-600 rounded-3xl shadow-lg p-6 sm:p-8 text-white h-fit print:bg-white print:text-slate-900 print:shadow-none print:border-2 print:border-slate-200 print:break-inside-avoid">
            <h3 className="font-bold mb-6 flex items-center gap-2 text-lg print:text-slate-800">
              Review Questions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {note.questions.map((q) => (
                <div key={q.id} className="bg-indigo-500/30 p-4 rounded-xl border border-indigo-400/30 print:bg-slate-50 print:border-slate-200">
                  <p className="text-xs font-bold mb-2 text-indigo-200 uppercase tracking-wider print:text-slate-500">Q No. {q.qno}</p>
                  <p className="text-sm font-medium leading-relaxed print:text-slate-800">{q.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
