import React from 'react';
import { useAuth } from './AuthProvider';
import { LogIn, LogOut, User, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthUIProps {
  onAdminClick: () => void;
  isAdminView: boolean;
}

export const AuthUI: React.FC<AuthUIProps> = ({ onAdminClick, isAdminView }) => {
  const { user, profile, login, logout, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  if (!user) {
    return (
      <button 
        onClick={login}
        className="flex items-center space-x-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
      >
        <LogIn size={18} />
        <span>Iniciar Sesión</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-1.5 pr-4 bg-white border border-gray-100 rounded-2xl hover:border-emerald-200 transition-all shadow-sm"
      >
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-emerald-50 flex items-center justify-center text-emerald-600">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <User size={20} />
          )}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-xs font-black text-gray-900 leading-none mb-1">{user.displayName}</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{profile?.currentPlan || 'free'}</p>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 p-3 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-50 mb-2">
                <p className="text-sm font-black text-gray-900">{user.displayName}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>

              {isAdmin && (
                <button 
                  onClick={() => { onAdminClick(); setIsOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all mb-1 ${isAdminView ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <LayoutDashboard size={18} />
                  <span>{isAdminView ? 'Ver App' : 'Panel Admin'}</span>
                </button>
              )}

              <button 
                onClick={() => { logout(); setIsOpen(false); }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all"
              >
                <LogOut size={18} />
                <span>Cerrar Sesión</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
