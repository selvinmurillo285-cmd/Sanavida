import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { Book } from '../types';
import { motion } from 'motion/react';

interface BookCardProps {
  book: Book;
  isElite?: boolean;
  onPurchase: (book: Book) => void;
  onRead: (book: Book) => void;
  isPurchased?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({ book, isElite, onPurchase, onRead, isPurchased }) => {
  const handlePurchase = () => {
    if (isElite || isPurchased) return;
    onPurchase(book);
  };

  const canRead = isElite || isPurchased;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl border border-gray-100 p-4 flex flex-col sm:flex-row gap-6 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300"
    >
      <div className="w-full sm:w-40 h-56 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg">
        <img 
          src={book.image} 
          alt={book.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="flex flex-col flex-grow py-2">
        <div className="flex items-center space-x-1 text-amber-400 mb-2">
          {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
          <span className="text-xs text-gray-400 ml-2">(4.9)</span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{book.title}</h3>
        <p className="text-sm text-gray-500 mb-6 line-clamp-3 leading-relaxed">
          {book.description}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className={`text-2xl font-black ${isElite ? 'text-gray-400 line-through text-lg' : 'text-emerald-600'}`}>
              ${book.price}
            </span>
            {isElite && <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Incluido en Elite</span>}
          </div>
          
          <div className="flex items-center space-x-2">
            {canRead && (
              <button
                onClick={() => onRead(book)}
                className="flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all"
              >
                <span>Leer ahora</span>
              </button>
            )}
            <button
              onClick={handlePurchase}
              className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold transition-all ${
                isPurchased || isElite
                  ? 'bg-gray-100 text-gray-400 scale-95' 
                  : 'bg-gray-900 text-white hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200'
              }`}
            >
              {isPurchased ? (
                <span>Comprado</span>
              ) : isElite ? (
                <span>Descargar</span>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  <span>Comprar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
