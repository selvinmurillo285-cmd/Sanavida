import React from 'react';
import { Heart, Clock, Flame, Droplets } from 'lucide-react';
import { Recipe, HealthTag } from '../types';
import { motion } from 'motion/react';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  toggleFavorite: (id: string) => void;
  onClick: (recipe: Recipe) => void;
}

const tagLabels: Record<HealthTag, string> = {
  'diabetes-friendly': 'Diabetes',
  'weight-loss': 'Pérdida Peso',
  'hormonal-balance': 'Menopausia'
};

const tagColors: Record<HealthTag, string> = {
  'diabetes-friendly': 'bg-blue-50 text-blue-600 border-blue-100',
  'weight-loss': 'bg-orange-50 text-orange-600 border-orange-100',
  'hormonal-balance': 'bg-purple-50 text-purple-600 border-purple-100'
};

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, isFavorite, toggleFavorite, onClick }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden cursor-pointer" onClick={() => onClick(recipe)}>
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 right-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(recipe.id);
            }}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex flex-wrap gap-2 mb-3">
          {recipe.isVegetarian && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border bg-emerald-50 text-emerald-600 border-emerald-100">
              Vegetariano
            </span>
          )}
          {recipe.tags.map(tag => (
            <span key={tag} className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${tagColors[tag]}`}>
              {tagLabels[tag]}
            </span>
          ))}
        </div>

        <h3 
          className="text-lg font-bold text-gray-900 mb-4 line-clamp-2 cursor-pointer hover:text-emerald-600 transition-colors"
          onClick={() => onClick(recipe)}
        >
          {recipe.title}
        </h3>

        <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
          <div className="flex items-center space-x-2 text-gray-500">
            <Flame size={16} className="text-orange-400" />
            <span className="text-sm font-medium">{recipe.nutritionalInfo.calories} kcal</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <Droplets size={16} className="text-blue-400" />
            <span className="text-sm font-medium">Azúcar: {recipe.nutritionalInfo.sugar}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
