import React from 'react';
import { Navbar } from './components/Navbar';
import { RecipeCard } from './components/RecipeCard';
import { RecipeModal } from './components/RecipeModal';
import { BookCard } from './components/BookCard';
import { BookReader } from './components/BookReader';
import { FilterBar } from './components/FilterBar';
import { Profile } from './components/Profile';
import { Pricing } from './components/Pricing';
import { CheckoutModal } from './components/CheckoutModal';
import { AIAssistants } from './components/AIAssistants';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { AuthProvider, useAuth } from './components/AuthProvider';
import { AdminPanel } from './components/AdminPanel';
import { recipes as mockRecipes, books as mockBooks, plans as mockPlans } from './data/mockData';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { Category, HealthTag, Recipe, UserProfile, PlanType, Book, Plan } from './types';
import { AnimatePresence, motion } from 'motion/react';
import { Sparkles, Lock, Bot } from 'lucide-react';

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { profile, isAdmin, loading: authLoading, user } = useAuth();
  const [currentCategory, setCurrentCategory] = React.useState<Category>('breakfast');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedFilter, setSelectedFilter] = React.useState<HealthTag | 'all' | 'vegetarian'>('all');
  const [selectedRecipe, setSelectedRecipe] = React.useState<Recipe | null>(null);
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [currentPlan, setCurrentPlan] = React.useState<PlanType>('free');
  const [purchasedBooks, setPurchasedBooks] = React.useState<string[]>([]);
  const [selectedItemForCheckout, setSelectedItemForCheckout] = React.useState<{ id: string; name: string; price: number; type: 'plan' | 'book' } | null>(null);
  const [isAdminView, setIsAdminView] = React.useState(false);
  const [readingBook, setReadingBook] = React.useState<Book | null>(null);

  // Real-time data from Firestore
  const [recipes, setRecipes] = React.useState<Recipe[]>(mockRecipes);
  const [books, setBooks] = React.useState<Book[]>(mockBooks);
  const [plans, setPlans] = React.useState<Plan[]>(mockPlans);

  React.useEffect(() => {
    const unsubRecipes = onSnapshot(collection(db, 'recipes'), (snapshot) => {
      setRecipes(snapshot.empty ? mockRecipes : snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Recipe)));
    });
    const unsubBooks = onSnapshot(collection(db, 'books'), (snapshot) => {
      setBooks(snapshot.empty ? mockBooks : snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book)));
    });
    const unsubPlans = onSnapshot(collection(db, 'plans'), (snapshot) => {
      setPlans(snapshot.empty ? mockPlans : snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plan)));
    });
    return () => {
      unsubRecipes();
      unsubBooks();
      unsubPlans();
    };
  }, []);

  React.useEffect(() => {
    if (profile) {
      setFavorites(profile.favorites || []);
      setCurrentPlan(profile.currentPlan || 'free');
      setPurchasedBooks(profile.purchasedBooks || []);
    }
  }, [profile]);

  const userProfile: UserProfile = {
    uid: profile?.uid || '',
    name: profile?.name || 'Usuario',
    email: profile?.email || '',
    goal: profile?.goal || 'Equilibrio Hormonal y Salud',
    favorites: favorites,
    purchasedBooks: purchasedBooks,
    currentPlan: currentPlan
  };

  const toggleFavorite = async (id: string) => {
    const newFavorites = favorites.includes(id) 
      ? favorites.filter(favId => favId !== id) 
      : [...favorites, id];
    
    setFavorites(newFavorites);
    if (profile) {
      const profileRef = doc(db, 'users', profile.uid);
      try {
        await updateDoc(profileRef, { favorites: newFavorites });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, 'users');
      }
    }
  };

  const handlePlanSelect = async (planId: PlanType) => {
    if (isAdmin || planId === 'free') {
      setCurrentPlan(planId);
      if (profile) {
        const profileRef = doc(db, 'users', profile.uid);
        try {
          await updateDoc(profileRef, { currentPlan: planId });
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, 'users');
        }
      }
      setCurrentCategory('profile');
    } else {
      const plan = plans.find(p => p.id === planId);
      if (plan) {
        setSelectedItemForCheckout({
          id: plan.id,
          name: plan.name,
          price: plan.price,
          type: 'plan'
        });
      }
    }
  };

  const handleBookPurchase = (book: any) => {
    setSelectedItemForCheckout({
      id: book.id,
      name: book.title,
      price: book.price,
      type: 'book'
    });
  };

  const handleCheckoutSuccess = async (itemId: string, type: 'plan' | 'book') => {
    if (profile) {
      const profileRef = doc(db, 'users', profile.uid);
      try {
        if (type === 'plan') {
          await updateDoc(profileRef, { currentPlan: itemId });
          setCurrentPlan(itemId as PlanType);
          setCurrentCategory('profile');
        } else {
          const newBooks = [...purchasedBooks, itemId];
          await updateDoc(profileRef, { purchasedBooks: newBooks });
          setPurchasedBooks(newBooks);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, 'users');
      }
    }
    setSelectedItemForCheckout(null);
  };

  const filteredRecipes = recipes.filter((recipe, index) => {
    const matchesCategory = recipe.category === currentCategory;
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      selectedFilter === 'all' || 
      (selectedFilter === 'vegetarian' ? recipe.isVegetarian : recipe.tags.includes(selectedFilter));
    
    // Plan logic: Admins see everything, others are limited by their plan level
    let isAccessible = isAdmin;
    if (!isAdmin) {
      if (recipe.planId === 'premium') {
        isAccessible = currentPlan === 'premium';
      } else if (recipe.planId === 'basic') {
        isAccessible = currentPlan === 'basic' || currentPlan === 'premium';
      } else {
        // Default to free or if planId is 'free'
        isAccessible = true;
      }
    }
    
    return matchesCategory && matchesSearch && matchesFilter && isAccessible;
  });

  const favoriteRecipes = recipes.filter(r => favorites.includes(r.id));

  const getPageTitle = () => {
    switch (currentCategory) {
      case 'breakfast': return 'Desayunos Saludables';
      case 'lunch': return 'Almuerzos Equilibrados';
      case 'dinner': return 'Cenas Ligeras';
      case 'library': return 'Biblioteca Digital';
      case 'nutritionist': return 'Consulta con Nutricionista';
      case 'profile': return 'Tu Perfil';
      case 'plans': return 'Planes de Suscripción';
      default: return 'Sanavida';
    }
  };

  const getPageDescription = () => {
    switch (currentCategory) {
      case 'breakfast': return 'Comienza tu día con energía y los nutrientes adecuados para tu salud.';
      case 'lunch': return 'Platos completos diseñados para mantener tu glucosa estable y saciarte.';
      case 'dinner': return 'Opciones suaves para una mejor digestión y descanso reparador.';
      case 'library': return 'Recursos educativos y guías expertas para transformar tu estilo de vida.';
      case 'nutritionist': return 'Habla con nuestro agente experto para resolver tus dudas nutricionales al instante.';
      case 'profile': return 'Gestiona tus metas y revisa tus recetas favoritas guardadas.';
      case 'plans': return 'Elige el nivel de acceso que mejor se adapte a tus necesidades de salud.';
      default: return '';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-gray-400 font-bold animate-pulse">Cargando Sanavida...</p>
        </div>
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={{ clientId: (import.meta as any).env.VITE_PAYPAL_CLIENT_ID || "sb" }}>
      <div className="min-h-screen bg-[#FAFAF9] font-sans text-gray-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar 
        currentCategory={currentCategory} 
        setCategory={(cat) => {
          setCurrentCategory(cat);
          setIsAdminView(false);
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAdminClick={() => setIsAdminView(!isAdminView)}
        isAdminView={isAdminView}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {isAdminView && isAdmin ? (
          <AdminPanel />
        ) : (
          <>
            {/* Header Section */}
        <div className="mb-12 text-center md:text-left">
          <motion.div 
            key={currentCategory}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-widest mb-4"
          >
            <Sparkles size={14} />
            <span>Sanavida {currentPlan === 'free' ? 'Básico' : currentPlan === 'basic' ? 'Esencial' : 'Elite'}</span>
          </motion.div>
          <motion.h1 
            key={`${currentCategory}-title`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight"
          >
            {getPageTitle()}
          </motion.h1>
          <motion.p 
            key={`${currentCategory}-desc`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500 max-w-2xl leading-relaxed"
          >
            {getPageDescription()}
          </motion.p>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {currentCategory === 'profile' ? (
            <Profile 
              profile={userProfile} 
              favoriteRecipes={favoriteRecipes}
              onRecipeClick={setSelectedRecipe}
              onUpgrade={() => setCurrentCategory('plans')}
            />
          ) : currentCategory === 'plans' ? (
            <Pricing 
              plans={plans} 
              currentPlan={currentPlan} 
              onSelectPlan={handlePlanSelect} 
            />
          ) : ['nutritionist', 'menopause', 'diabetes'].includes(currentCategory) ? (
            <div className="max-w-4xl mx-auto">
              {currentPlan === 'premium' || isAdmin ? (
                <AIAssistants initialAgent={currentCategory as any} />
              ) : (
                <div className="bg-white rounded-[3rem] border border-gray-100 p-12 text-center flex flex-col items-center">
                  <div className="p-6 bg-emerald-50 text-emerald-600 rounded-full mb-6">
                    <Bot size={48} />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-4">Acceso Elite Requerido</h3>
                  <p className="text-gray-500 max-w-md mb-8">
                    Nuestros Asistentes Especializados (Nutrición, Menopausia y Diabetes) están disponibles exclusivamente para nuestros miembros del Plan Elite.
                    Obtén asesoría experta 24/7, planes a tu medida y mucho más.
                  </p>
                  <button 
                    onClick={() => setCurrentCategory('plans')}
                    className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                  >
                    Mejorar a Plan Elite
                  </button>
                </div>
              )}
            </div>
          ) : currentCategory === 'library' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {books.map(book => {
                const isLocked = !isAdmin && currentPlan === 'free' && book.isPremium && !purchasedBooks.includes(book.id);
                return (
                  <div key={book.id} className="relative">
                    <BookCard 
                      book={book} 
                      isElite={isAdmin || currentPlan === 'premium'}
                      isPurchased={purchasedBooks.includes(book.id)}
                      onPurchase={handleBookPurchase}
                      onRead={(b) => setReadingBook(b)}
                    />
                    {isLocked && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-3xl flex flex-col items-center justify-center p-6 text-center z-10">
                        <div className="p-4 bg-gray-900 text-white rounded-full mb-4">
                          <Lock size={24} />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Contenido Premium</h4>
                        <p className="text-sm text-gray-600 mb-4">Mejora tu plan para acceder a este libro y mucho más.</p>
                        <button 
                          onClick={() => setCurrentCategory('plans')}
                          className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm"
                        >
                          Ver Planes
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-8">
              <FilterBar 
                selectedFilter={selectedFilter} 
                setSelectedFilter={setSelectedFilter} 
              />
              
              {filteredRecipes.length > 0 ? (
                <div className="space-y-12">
                  {/* Vegetarian Section */}
                  {filteredRecipes.some(r => r.isVegetarian) && (
                    <section>
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                          <Sparkles size={20} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">Recetas Vegetarianas</h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredRecipes.filter(r => r.isVegetarian).map(recipe => (
                          <RecipeCard 
                            key={recipe.id} 
                            recipe={recipe}
                            isFavorite={favorites.includes(recipe.id)}
                            toggleFavorite={toggleFavorite}
                            onClick={setSelectedRecipe}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Other Recipes Section */}
                  {filteredRecipes.some(r => !r.isVegetarian) && (
                    <section>
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                          <Sparkles size={20} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">Otras Recetas Saludables</h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredRecipes.filter(r => !r.isVegetarian).map(recipe => (
                          <RecipeCard 
                            key={recipe.id} 
                            recipe={recipe}
                            isFavorite={favorites.includes(recipe.id)}
                            toggleFavorite={toggleFavorite}
                            onClick={setSelectedRecipe}
                          />
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              ) : (
                <div className="py-20 text-center bg-white rounded-[3rem] border border-gray-100">
                  <div className="text-gray-300 mb-4 flex justify-center">
                    <Sparkles size={64} strokeWidth={1} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron recetas</h3>
                  <p className="text-gray-500">Intenta ajustar tus filtros o búsqueda.</p>
                </div>
              )}
              
              {currentPlan === 'free' && (
                <div className="mt-12 p-8 bg-emerald-900 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h4 className="text-2xl font-bold mb-2">¿Quieres más recetas?</h4>
                    <p className="text-emerald-100/70">Desbloquea más de 500 recetas exclusivas y planes personalizados.</p>
                  </div>
                  <button 
                    onClick={() => setCurrentCategory('plans')}
                    className="px-8 py-4 bg-white text-emerald-900 rounded-2xl font-bold hover:bg-emerald-50 transition-all"
                  >
                    Ver Planes Premium
                  </button>
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <img 
            src="https://i.imgur.com/CZXSScV.png" 
            alt="Sanavida Logo" 
            className="h-12 w-auto object-contain mb-4"
            referrerPolicy="no-referrer"
          />
          <p className="text-sm text-gray-400">© 2026 Sanavida. Nutrición consciente para cada etapa de tu vida.</p>
        </div>
      </footer>

      {/* Recipe Detail Modal */}
      <RecipeModal 
        recipe={selectedRecipe} 
        onClose={() => setSelectedRecipe(null)} 
      />

      {/* Checkout Modal */}
      <CheckoutModal 
        item={selectedItemForCheckout}
        onClose={() => setSelectedItemForCheckout(null)}
        onSuccess={handleCheckoutSuccess}
      />

      {readingBook && (
        <BookReader 
          book={readingBook}
          onClose={() => setReadingBook(null)}
        />
      )}
    </div>
    </PayPalScriptProvider>
  );
}
