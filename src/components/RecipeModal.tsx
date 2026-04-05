import React from 'react';
import { X, CheckCircle2, Info, Flame, Droplets, Zap, Dumbbell, Sparkles } from 'lucide-react';
import { Recipe } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  if (!recipe) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-md rounded-full text-gray-900 hover:bg-white shadow-lg transition-all"
          >
            <X size={20} />
          </button>

          {/* Image Section */}
          <div className="w-full md:w-1/2 h-64 md:h-auto relative">
            <img 
              src={recipe.image} 
              alt={recipe.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:hidden" />
          </div>

          {/* Content Section */}
          <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto custom-scrollbar">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
              {recipe.title}
            </h2>

            {/* Nutritional Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-emerald-50 p-3 rounded-2xl flex flex-col items-center text-center">
                <Flame size={20} className="text-emerald-600 mb-1" />
                <span className="text-xs text-emerald-800 font-bold uppercase tracking-wider">Calorías</span>
                <span className="text-sm font-medium text-emerald-900">{recipe.nutritionalInfo.calories}</span>
              </div>
              <div className="bg-blue-50 p-3 rounded-2xl flex flex-col items-center text-center">
                <Droplets size={20} className="text-blue-600 mb-1" />
                <span className="text-xs text-blue-800 font-bold uppercase tracking-wider">Azúcar</span>
                <span className="text-sm font-medium text-blue-900">{recipe.nutritionalInfo.sugar}</span>
              </div>
              <div className="bg-orange-50 p-3 rounded-2xl flex flex-col items-center text-center">
                <Zap size={20} className="text-orange-600 mb-1" />
                <span className="text-xs text-orange-800 font-bold uppercase tracking-wider">Proteína</span>
                <span className="text-sm font-medium text-orange-900">{recipe.nutritionalInfo.protein}</span>
              </div>
              <div className="bg-purple-50 p-3 rounded-2xl flex flex-col items-center text-center">
                <Dumbbell size={20} className="text-purple-600 mb-1" />
                <span className="text-xs text-purple-800 font-bold uppercase tracking-wider">Carbs</span>
                <span className="text-sm font-medium text-purple-900">{recipe.nutritionalInfo.carbs}</span>
              </div>
            </div>

            <div className="space-y-8">
              <section>
                <div className="flex items-center space-x-2 mb-4">
                  <Info size={20} className="text-emerald-600" />
                  <h3 className="text-lg font-bold text-gray-900">Ingredientes</h3>
                </div>
                <ul className="grid grid-cols-1 gap-3">
                  {recipe.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-gray-600">
                      <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{ing}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle2 size={20} className="text-emerald-600" />
                  <h3 className="text-lg font-bold text-gray-900">Preparación</h3>
                </div>
                <div className="space-y-4">
                  {recipe.preparation.map((step, idx) => (
                    <div key={idx} className="flex space-x-4">
                      <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <p className="text-sm text-gray-600 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </section>

              {recipe.tips && (
                <section className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles size={18} className="text-emerald-600" />
                    <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider">Tip Saludable</h3>
                  </div>
                  <p className="text-sm text-emerald-700 leading-relaxed italic">
                    "{recipe.tips}"
                  </p>
                </section>
              )}

              {recipe.scientificExplanations && Object.keys(recipe.scientificExplanations).length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Sparkles size={20} className="text-emerald-600" />
                    <h3 className="text-lg font-bold text-gray-900">¿Por qué es bueno para ti?</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(recipe.scientificExplanations).map(([tag, explanation]) => (
                      <div key={tag} className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <h4 className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-2">
                          {tag === 'diabetes-friendly' ? 'Para Diabéticos' : 
                           tag === 'weight-loss' ? 'Para Pérdida de Peso' : 
                           'Para la Menopausia'}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
