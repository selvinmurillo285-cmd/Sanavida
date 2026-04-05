import React from 'react';
import { Book, BookChapter } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, List, Download, X, BookOpen } from 'lucide-react';
import Markdown from 'react-markdown';

interface BookReaderProps {
  book: Book;
  onClose: () => void;
}

export const BookReader: React.FC<BookReaderProps> = ({ book, onClose }) => {
  const [currentChapterIndex, setCurrentChapterIndex] = React.useState(0);
  const [showToc, setShowToc] = React.useState(false);

  const chapters = book.chapters || [
    { title: 'Introducción', content: 'Este libro aún no tiene contenido digital disponible. Pronto podrás leerlo aquí mismo.' },
    { title: 'Capítulo 1', content: 'Contenido en desarrollo...' }
  ];

  const currentChapter = chapters[currentChapterIndex];

  const nextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col">
      {/* Header */}
      <div className="h-16 border-b border-gray-100 px-4 flex items-center justify-between bg-white sticky top-0">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex flex-col">
            <h2 className="text-sm font-black text-gray-900 line-clamp-1">{book.title}</h2>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Lectura Digital</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {book.pdfUrl && (
            <a 
              href={book.pdfUrl}
              download
              className="p-2 text-gray-500 hover:text-emerald-600 transition-colors"
              title="Descargar PDF"
            >
              <Download size={20} />
            </a>
          )}
          <button 
            onClick={() => setShowToc(!showToc)}
            className={`p-2 rounded-xl transition-all ${showToc ? 'bg-emerald-100 text-emerald-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <List size={20} />
          </button>
        </div>
      </div>
      
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-2 flex items-center justify-between shadow-sm z-10">
        <button
          onClick={prevChapter}
          disabled={currentChapterIndex === 0}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-all"
        >
          <ChevronLeft size={18} />
          <span className="hidden sm:inline">Anterior</span>
          <span className="sm:hidden">Atrás</span>
        </button>

        <div className="flex items-center space-x-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black">
          <span>Capítulo {currentChapterIndex + 1}</span>
          <span className="opacity-30">/</span>
          <span>{chapters.length}</span>
        </div>

        <button
          onClick={nextChapter}
          disabled={currentChapterIndex === chapters.length - 1}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold text-gray-900 hover:bg-gray-50 disabled:opacity-30 transition-all"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <span className="sm:hidden">Sig.</span>
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Table of Contents Sidebar (Desktop) */}
        <div className={`hidden lg:block w-72 border-r border-gray-50 bg-gray-50/30 overflow-y-auto transition-all ${showToc ? 'ml-0' : '-ml-72'}`}>
          <div className="p-6 space-y-2">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Contenido</h3>
            {chapters.map((chapter, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentChapterIndex(idx)}
                className={`w-full text-left p-3 rounded-xl text-sm transition-all ${
                  currentChapterIndex === idx 
                    ? 'bg-white text-emerald-600 shadow-sm font-bold border border-emerald-100' 
                    : 'text-gray-500 hover:bg-white hover:text-gray-900'
                }`}
              >
                {idx + 1}. {chapter.title}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile TOC Overlay */}
        <AnimatePresence>
          {showToc && (
            <motion.div 
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="lg:hidden absolute inset-0 z-50 bg-white overflow-y-auto"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-gray-900">Contenido</h3>
                  <button onClick={() => setShowToc(false)} className="p-2 bg-gray-100 rounded-full">
                    <X size={20} />
                  </button>
                </div>
                {chapters.map((chapter, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentChapterIndex(idx);
                      setShowToc(false);
                    }}
                    className={`w-full text-left p-4 rounded-2xl text-base transition-all ${
                      currentChapterIndex === idx 
                        ? 'bg-emerald-50 text-emerald-600 font-bold' 
                        : 'text-gray-600 border border-gray-100'
                    }`}
                  >
                    {idx + 1}. {chapter.title}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-[#FAFAF9]">
          <div className="max-w-3xl mx-auto px-6 py-12 lg:py-20">
            <motion.div
              key={currentChapterIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[3rem] p-8 lg:p-16 shadow-sm border border-gray-100"
            >
              <div className="flex items-center space-x-3 text-emerald-600 mb-8">
                <BookOpen size={20} />
                <span className="text-xs font-black uppercase tracking-widest">Capítulo {currentChapterIndex + 1}</span>
              </div>
              
              <h1 className="text-3xl lg:text-5xl font-black text-gray-900 mb-10 leading-tight">
                {currentChapter.title}
              </h1>

              <div className="prose prose-emerald prose-lg max-w-none text-gray-700 leading-relaxed">
                <div className="markdown-body">
                  <Markdown>{currentChapter.content}</Markdown>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="mt-20 pt-10 border-t border-gray-50 flex items-center justify-between">
                <button
                  onClick={prevChapter}
                  disabled={currentChapterIndex === 0}
                  className="flex items-center space-x-2 text-sm font-bold text-gray-400 hover:text-emerald-600 disabled:opacity-0 transition-all"
                >
                  <ChevronLeft size={20} />
                  <span>Anterior</span>
                </button>

                <div className="text-xs font-bold text-gray-300">
                  {currentChapterIndex + 1} / {chapters.length}
                </div>

                <button
                  onClick={nextChapter}
                  disabled={currentChapterIndex === chapters.length - 1}
                  className="flex items-center space-x-2 text-sm font-bold text-gray-900 hover:text-emerald-600 disabled:opacity-0 transition-all"
                >
                  <span>Siguiente</span>
                  <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
