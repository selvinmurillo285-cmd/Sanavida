import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, X, Save, PlusCircle, MinusCircle, LayoutDashboard, Utensils, BookOpen, Settings, Star } from 'lucide-react';
import { useAdminData } from '../hooks/useAdminData';
import { Recipe, Category, HealthTag, Plan } from '../types';

export const AdminPanel: React.FC = () => {
  const { recipes, books, plans, loading, addRecipe, updateRecipe, deleteRecipe, updatePlan, seedDatabase, seeding } = useAdminData();
  const [activeTab, setActiveTab] = React.useState<'recipes' | 'books' | 'plans'>('recipes');
  const [recipePlanFilter, setRecipePlanFilter] = React.useState<string>('all');
  const [isEditing, setIsEditing] = React.useState<Recipe | null>(null);
  const [isEditingPlan, setIsEditingPlan] = React.useState<Plan | null>(null);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showPlanModal, setShowPlanModal] = React.useState(false);

  const [formData, setFormData] = React.useState<Partial<Recipe>>({
    title: '',
    category: 'breakfast',
    image: '',
    ingredients: [''],
    preparation: [''],
    nutritionalInfo: { calories: 0, sugar: 'Bajo', protein: '0g', carbs: '0g' },
    tags: ['weight-loss'],
    isPremium: false,
    isVegetarian: true,
    tips: '',
    planId: 'free'
  });

  const [planFormData, setPlanFormData] = React.useState<Partial<Plan>>({
    name: '',
    description: '',
    price: 0,
    features: [''],
    recipeLimit: 0
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      await updateRecipe(isEditing.id, formData);
    } else {
      await addRecipe(formData as Omit<Recipe, 'id'>);
    }
    setIsEditing(null);
    setShowAddModal(false);
    resetForm();
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditingPlan) {
      await updatePlan(isEditingPlan.id, planFormData);
    }
    setIsEditingPlan(null);
    setShowPlanModal(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'breakfast',
      image: '',
      ingredients: [''],
      preparation: [''],
      nutritionalInfo: { calories: 0, sugar: 'Bajo', protein: '0g', carbs: '0g' },
      tags: ['weight-loss'],
      isPremium: false,
      isVegetarian: true,
      tips: '',
      planId: 'free'
    });
  };

  const addField = (field: 'ingredients' | 'preparation') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), '']
    }));
  };

  const removeField = (field: 'ingredients' | 'preparation', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index)
    }));
  };

  const updateField = (field: 'ingredients' | 'preparation', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] || []).map((v, i) => i === index ? value : v)
    }));
  };

  const addPlanFeature = () => {
    setPlanFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), '']
    }));
  };

  const removePlanFeature = (index: number) => {
    setPlanFormData(prev => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index)
    }));
  };

  const updatePlanFeature = (index: number, value: string) => {
    setPlanFormData(prev => ({
      ...prev,
      features: (prev.features || []).map((v, i) => i === index ? value : v)
    }));
  };

  const filteredRecipes = recipes.filter(r => {
    if (recipePlanFilter === 'all') return true;
    return r.planId === recipePlanFilter;
  });

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 mb-2">Panel de Administración</h2>
          <p className="text-gray-500">Gestiona el contenido de Sanavida en tiempo real.</p>
          <div className="mt-4">
            <button 
              onClick={seedDatabase}
              disabled={seeding}
              className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold transition-all border ${
                seeding 
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                  : 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200 shadow-sm'
              }`}
            >
              {seeding ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-700"></div>
              ) : (
                <PlusCircle size={20} />
              )}
              <span>{seeding ? 'Cargando Datos...' : 'Cargar Datos de Ejemplo'}</span>
            </button>
          </div>
        </div>
        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveTab('recipes')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'recipes' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Utensils size={18} />
            <span>Recetas</span>
          </button>
          <button 
            onClick={() => setActiveTab('books')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'books' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <BookOpen size={18} />
            <span>Libros</span>
          </button>
          <button 
            onClick={() => setActiveTab('plans')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'plans' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Settings size={18} />
            <span>Planes</span>
          </button>
        </div>
      </div>

      {activeTab === 'recipes' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4 bg-gray-100 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto">
              <button 
                onClick={() => setRecipePlanFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${recipePlanFilter === 'all' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Todos
              </button>
              {plans.map(plan => (
                <button 
                  key={plan.id}
                  onClick={() => setRecipePlanFilter(plan.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${recipePlanFilter === plan.id ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {plan.name}
                </button>
              ))}
            </div>
            <button 
              onClick={() => { resetForm(); setShowAddModal(true); }}
              className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 w-full md:w-auto justify-center"
            >
              <Plus size={20} />
              <span>Añadir Receta</span>
            </button>
          </div>

          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map(recipe => (
                <div key={recipe.id} className="bg-white rounded-3xl border border-gray-100 p-4 flex flex-col relative group">
                  <div className="h-48 rounded-2xl overflow-hidden mb-4 relative">
                    <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg shadow-sm ${
                        recipe.planId === 'premium' ? 'bg-amber-500 text-white' : 
                        recipe.planId === 'basic' ? 'bg-emerald-500 text-white' : 
                        'bg-gray-500 text-white'
                      }`}>
                        {recipe.planId === 'premium' ? 'Elite' : recipe.planId === 'basic' ? 'Esencial' : 'Gratis'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{recipe.category}</span>
                      {recipe.isPremium && <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Premium</span>}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{recipe.title}</h3>
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <button 
                      onClick={() => { setFormData(recipe); setIsEditing(recipe); setShowAddModal(true); }}
                      className="flex-grow flex items-center justify-center space-x-2 py-3 bg-gray-50 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-all"
                    >
                      <Edit2 size={16} />
                      <span>Editar</span>
                    </button>
                    <button 
                      onClick={() => deleteRecipe(recipe.id)}
                      className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-[2.5rem] p-20 text-center border-2 border-dashed border-gray-200">
              <Utensils className="mx-auto text-gray-300 mb-6" size={64} />
              <h3 className="text-2xl font-black text-gray-900 mb-2">No hay recetas todavía</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">Tu base de datos de Firestore está vacía. Puedes añadir una receta manualmente o cargar los datos de ejemplo.</p>
              <button 
                onClick={seedDatabase}
                className="inline-flex items-center space-x-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
              >
                <PlusCircle size={20} />
                <span>Cargar Datos de Ejemplo</span>
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'books' && (
        <div className="space-y-6">
          {books.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map(book => (
                <div key={book.id} className="bg-white rounded-3xl border border-gray-100 p-4 flex flex-col">
                  <div className="h-48 rounded-2xl overflow-hidden mb-4">
                    <img src={book.image} alt={book.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{book.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{book.description}</p>
                    <div className="text-xl font-black text-emerald-600">${book.price}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-[2.5rem] p-20 text-center border-2 border-dashed border-gray-200">
              <BookOpen className="mx-auto text-gray-300 mb-6" size={64} />
              <h3 className="text-2xl font-black text-gray-900 mb-2">No hay libros todavía</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">Tu base de datos de Firestore está vacía. Puedes cargar los datos de ejemplo.</p>
              <button 
                onClick={seedDatabase}
                className="inline-flex items-center space-x-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
              >
                <PlusCircle size={20} />
                <span>Cargar Datos de Ejemplo</span>
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'plans' && (
        <div className="space-y-6">
          {plans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map(plan => (
                <div key={plan.id} className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col">
                  <h3 className="text-xl font-black text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-3xl font-black text-emerald-600 mb-4">${plan.price}</div>
                  <ul className="space-y-2 flex-grow mb-6">
                    {plan.features.map((f, i) => (
                      <li key={i} className="text-sm text-gray-500 flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col space-y-2 mt-4">
                    <button 
                      onClick={() => { setPlanFormData(plan); setIsEditingPlan(plan); setShowPlanModal(true); }}
                      className="w-full flex items-center justify-center space-x-2 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold hover:bg-emerald-100 transition-all"
                    >
                      <Edit2 size={16} />
                      <span>Editar Plan</span>
                    </button>
                    <button 
                      onClick={() => { setRecipePlanFilter(plan.id); setActiveTab('recipes'); }}
                      className="w-full flex items-center justify-center space-x-2 py-3 bg-gray-50 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-all"
                    >
                      <Utensils size={16} />
                      <span>Ver Contenido</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-[2.5rem] p-20 text-center border-2 border-dashed border-gray-200">
              <Star className="mx-auto text-gray-300 mb-6" size={64} />
              <h3 className="text-2xl font-black text-gray-900 mb-2">No hay planes todavía</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">Tu base de datos de Firestore está vacía. Puedes cargar los datos de ejemplo.</p>
              <button 
                onClick={seedDatabase}
                className="inline-flex items-center space-x-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
              >
                <PlusCircle size={20} />
                <span>Cargar Datos de Ejemplo</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Plan Edit Modal */}
      <AnimatePresence>
        {showPlanModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowPlanModal(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-2xl font-black text-gray-900">Editar Plan: {isEditingPlan?.name}</h3>
                <button onClick={() => setShowPlanModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} className="text-gray-400" /></button>
              </div>

              <form onSubmit={handleSavePlan} className="flex-grow overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nombre del Plan</label>
                      <input required type="text" value={planFormData.name} onChange={e => setPlanFormData({...planFormData, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Descripción del Plan</label>
                      <textarea value={planFormData.description || ''} onChange={e => setPlanFormData({...planFormData, description: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none min-h-[100px]" placeholder="Describe el contenido del plan..." />
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Precio ($)</label>
                      <input required type="number" value={planFormData.price} onChange={e => setPlanFormData({...planFormData, price: Number(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Límite de Recetas</label>
                      <input required type="text" value={planFormData.recipeLimit} onChange={e => setPlanFormData({...planFormData, recipeLimit: e.target.value === 'unlimited' ? 'unlimited' : Number(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Características</label>
                    <button type="button" onClick={addPlanFeature} className="text-emerald-600 hover:text-emerald-700"><PlusCircle size={20} /></button>
                  </div>
                  {planFormData.features?.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input type="text" value={feature} onChange={e => updatePlanFeature(idx, e.target.value)} className="flex-grow px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                      <button type="button" onClick={() => removePlanFeature(idx)} className="text-red-400 hover:text-red-500"><MinusCircle size={20} /></button>
                    </div>
                  ))}
                </div>
              </form>

              <div className="p-8 border-t border-gray-100 flex justify-end space-x-4">
                <button onClick={() => setShowPlanModal(false)} className="px-8 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all">Cancelar</button>
                <button onClick={handleSavePlan} className="flex items-center space-x-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
                  <Save size={20} />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-2xl font-black text-gray-900">{isEditing ? 'Editar Receta' : 'Nueva Receta'}</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} className="text-gray-400" /></button>
              </div>

              <form onSubmit={handleSave} className="flex-grow overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Título</label>
                      <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Categoría</label>
                      <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as 'breakfast' | 'lunch' | 'dinner'})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none">
                        <option value="breakfast">Desayuno</option>
                        <option value="lunch">Almuerzo</option>
                        <option value="dinner">Cena</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Imagen URL</label>
                      <input required type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Plan Requerido</label>
                      <select value={formData.planId} onChange={e => setFormData({...formData, planId: e.target.value as any})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none">
                        <option value="free">Gratis (Todos)</option>
                        <option value="basic">Esencial (Basic+Elite)</option>
                        <option value="premium">Elite (Solo Elite)</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-6">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" checked={formData.isPremium} onChange={e => setFormData({...formData, isPremium: e.target.checked})} className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500" />
                        <span className="text-sm font-bold text-gray-700">Premium</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" checked={formData.isVegetarian} onChange={e => setFormData({...formData, isVegetarian: e.target.checked})} className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500" />
                        <span className="text-sm font-bold text-gray-700">Vegetariana</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Información Nutricional</label>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="number" placeholder="Calorías" value={formData.nutritionalInfo?.calories} onChange={e => setFormData({...formData, nutritionalInfo: {...formData.nutritionalInfo!, calories: Number(e.target.value)}})} className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                      <input type="text" placeholder="Azúcar" value={formData.nutritionalInfo?.sugar} onChange={e => setFormData({...formData, nutritionalInfo: {...formData.nutritionalInfo!, sugar: e.target.value}})} className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                      <input type="text" placeholder="Proteína" value={formData.nutritionalInfo?.protein} onChange={e => setFormData({...formData, nutritionalInfo: {...formData.nutritionalInfo!, protein: e.target.value}})} className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                      <input type="text" placeholder="Carbohidratos" value={formData.nutritionalInfo?.carbs} onChange={e => setFormData({...formData, nutritionalInfo: {...formData.nutritionalInfo!, carbs: e.target.value}})} className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Ingredientes</label>
                    <button type="button" onClick={() => addField('ingredients')} className="text-emerald-600 hover:text-emerald-700"><PlusCircle size={20} /></button>
                  </div>
                  {formData.ingredients?.map((ing, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input type="text" value={ing} onChange={e => updateField('ingredients', idx, e.target.value)} className="flex-grow px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                      <button type="button" onClick={() => removeField('ingredients', idx)} className="text-red-400 hover:text-red-500"><MinusCircle size={20} /></button>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Preparación</label>
                    <button type="button" onClick={() => addField('preparation')} className="text-emerald-600 hover:text-emerald-700"><PlusCircle size={20} /></button>
                  </div>
                  {formData.preparation?.map((step, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <span className="w-8 h-8 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-full font-bold text-xs">{idx + 1}</span>
                      <input type="text" value={step} onChange={e => updateField('preparation', idx, e.target.value)} className="flex-grow px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                      <button type="button" onClick={() => removeField('preparation', idx)} className="text-red-400 hover:text-red-500"><MinusCircle size={20} /></button>
                    </div>
                  ))}
                </div>
              </form>

              <div className="p-8 border-t border-gray-100 flex justify-end space-x-4">
                <button onClick={() => setShowAddModal(false)} className="px-8 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all">Cancelar</button>
                <button onClick={handleSave} className="flex items-center space-x-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
                  <Save size={20} />
                  <span>{isEditing ? 'Guardar Cambios' : 'Crear Receta'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
