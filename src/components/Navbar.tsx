import React from 'react';
import { Search, Menu, X, Heart, User, BookOpen, Coffee, Utensils, Moon, Bot, LayoutDashboard, ShieldCheck, Star, Activity } from 'lucide-react';
import { Category } from '../types';
import { AuthUI } from './AuthUI';
import { useAuth } from './AuthProvider';

interface NavbarProps {
  currentCategory: Category;
  setCategory: (cat: Category) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAdminClick: () => void;
  isAdminView: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentCategory, 
  setCategory, 
  searchQuery, 
  setSearchQuery,
  onAdminClick,
  isAdminView
}) => {
  const { isAdmin, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'breakfast', label: 'Desayunos', icon: Coffee },
    { id: 'lunch', label: 'Almuerzos', icon: Utensils },
    { id: 'dinner', label: 'Cenas', icon: Moon },
    { id: 'library', label: 'Biblioteca', icon: BookOpen },
    { id: 'nutritionist', label: 'Nutricionista', icon: Bot },
    { id: 'menopause', label: 'Especialista en menopausia', icon: Bot },
    { id: 'diabetes', label: 'Especialista en diabetes', icon: Bot },
    { id: 'plans', label: 'Planes', icon: Star },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => setCategory('breakfast')}
          >
            <img 
              src="https://i.imgur.com/CZXSScV.png" 
              alt="Sanavida Logo" 
              className="h-10 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-6">
            {navItems.slice(0, 4).map((item) => (
              <button
                key={item.id}
                onClick={() => setCategory(item.id as Category)}
                className={`flex items-center space-x-2 text-sm font-bold transition-all ${
                  currentCategory === item.id ? 'text-emerald-600' : 'text-gray-500 hover:text-emerald-500'
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* AI Assistants Buttons (Desktop) */}
          <div className="hidden lg:flex items-center space-x-3 mx-4">
            {navItems.slice(4, 7).map((item) => {
              const isMenopause = item.id === 'menopause';
              const isDiabetes = item.id === 'diabetes';
              const isActive = currentCategory === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setCategory(item.id as Category)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-[10px] font-black transition-all border ${
                    isActive
                      ? isMenopause ? 'bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-100' :
                        isDiabetes ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' :
                        'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100'
                      : isMenopause ? 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100' :
                        isDiabetes ? 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100' :
                        'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
                  }`}
                >
                  <item.icon size={12} />
                  <span className="whitespace-nowrap">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search and Profile */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar recetas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all w-64"
              />
            </div>
            {isAdmin && (
              <button 
                onClick={onAdminClick}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all ${
                  isAdminView 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                }`}
              >
                <ShieldCheck size={18} />
                <span className="hidden lg:inline">Panel Admin</span>
              </button>
            )}
            <AuthUI onAdminClick={onAdminClick} isAdminView={isAdminView} />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar recetas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const isAI = ['nutritionist', 'menopause', 'diabetes'].includes(item.id);
              const isActive = currentCategory === item.id;
              const isMenopause = item.id === 'menopause';
              const isDiabetes = item.id === 'diabetes';
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCategory(item.id as Category);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 p-4 rounded-2xl text-sm font-bold transition-all border ${
                    isActive
                      ? isMenopause ? 'bg-rose-600 text-white border-rose-600' :
                        isDiabetes ? 'bg-blue-600 text-white border-blue-600' :
                        'bg-emerald-600 text-white border-emerald-600'
                      : isAI
                        ? isMenopause ? 'bg-rose-50 text-rose-600 border-rose-100' :
                          isDiabetes ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : 'text-gray-600 hover:bg-gray-50 border-transparent'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => {
                setCategory('profile');
                setIsMenuOpen(false);
              }}
              className={`flex items-center space-x-3 p-4 rounded-2xl text-sm font-bold border border-transparent ${
                currentCategory === 'profile' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <User size={20} />
              <span className="flex-1 text-left">Perfil</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
