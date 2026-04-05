import React from 'react';
import { User, Mail, Target, Heart, Settings, LogOut, ShieldCheck, Zap, LogIn } from 'lucide-react';
import { UserProfile, Recipe, Category } from '../types';
import { useAuth } from './AuthProvider';

interface ProfileProps {
  profile: UserProfile;
  favoriteRecipes: Recipe[];
  onRecipeClick: (recipe: Recipe) => void;
  onUpgrade: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ profile, favoriteRecipes, onRecipeClick, onUpgrade }) => {
  const { user, login, logout } = useAuth();

  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-8 animate-in fade-in duration-500">
        <div className="w-24 h-24 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <User size={48} />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Tu Perfil de Salud</h2>
          <p className="text-gray-500 text-lg">Inicia sesión para guardar tus recetas favoritas, ver tus planes y seguir tu progreso.</p>
        </div>
        <button 
          onClick={login}
          className="inline-flex items-center space-x-3 px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
        >
          <LogIn size={24} />
          <span>Iniciar Sesión con Google</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Card */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border-4 border-emerald-50 shadow-inner">
          <User size={64} />
        </div>
        <div className="flex-grow text-center md:text-left">
          <h2 className="text-3xl font-black text-gray-900 mb-2">{profile.name}</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-500">
            <div className="flex items-center space-x-2">
              <Mail size={16} />
              <span className="text-sm">{profile.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target size={16} className="text-emerald-500" />
              <span className="text-sm font-medium">{profile.goal}</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-colors">
            <Settings size={20} />
          </button>
          <button 
            onClick={logout}
            className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Subscription Card */}
      <div className="bg-gradient-to-br from-gray-900 to-emerald-900 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-emerald-900/20">
        <div className="flex items-center space-x-6">
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-3xl text-emerald-400">
            <Zap size={32} fill="currentColor" />
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-1">Plan Actual</div>
            <h3 className="text-2xl font-black capitalize">{profile.currentPlan === 'free' ? 'Gratis' : profile.currentPlan === 'basic' ? 'Esencial' : 'Elite'}</h3>
          </div>
        </div>
        {profile.currentPlan !== 'premium' && (
          <button 
            onClick={onUpgrade}
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/20"
          >
            Mejorar Plan
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-lg shadow-emerald-200">
          <Heart className="mb-4 opacity-80" />
          <div className="text-3xl font-black mb-1">{favoriteRecipes.length}</div>
          <div className="text-sm font-medium opacity-80 uppercase tracking-wider">Favoritos</div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100">
          <ShieldCheck className="mb-4 text-blue-500" />
          <div className="text-3xl font-black mb-1 text-gray-900">Verificado</div>
          <div className="text-sm font-medium text-gray-400 uppercase tracking-wider">Estado de Cuenta</div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100">
          <Target className="mb-4 text-orange-500" />
          <div className="text-3xl font-black mb-1 text-gray-900">85%</div>
          <div className="text-sm font-medium text-gray-400 uppercase tracking-wider">Meta Semanal</div>
        </div>
      </div>

      {/* Favorites Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Tus Recetas Guardadas</h3>
          <button className="text-sm font-bold text-emerald-600 hover:underline">Ver todas</button>
        </div>
        
        {favoriteRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {favoriteRecipes.map(recipe => (
              <div 
                key={recipe.id}
                onClick={() => onRecipeClick(recipe)}
                className="group bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-emerald-200 transition-all"
              >
                <img 
                  src={recipe.image} 
                  alt={recipe.title}
                  className="w-20 h-20 rounded-xl object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1">{recipe.title}</h4>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">{recipe.category}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
            <Heart className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-medium">Aún no has guardado ninguna receta.</p>
            <p className="text-sm text-gray-400 mt-1">Explora el menú para encontrar tus favoritas.</p>
          </div>
        )}
      </section>
    </div>
  );
};
