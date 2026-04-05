import React from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { Recipe, Book, Plan } from '../types';

import { recipes as mockRecipes, books as mockBooks, plans as mockPlans } from '../data/mockData';

export const useAdminData = () => {
  const [recipes, setRecipes] = React.useState<Recipe[]>(mockRecipes);
  const [books, setBooks] = React.useState<Book[]>(mockBooks);
  const [plans, setPlans] = React.useState<Plan[]>(mockPlans);
  const [loading, setLoading] = React.useState(true);
  const [seeding, setSeeding] = React.useState(false);

  React.useEffect(() => {
    const unsubRecipes = onSnapshot(collection(db, 'recipes'), (snapshot) => {
      if (!snapshot.empty) {
        setRecipes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Recipe)));
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'recipes'));

    const unsubBooks = onSnapshot(collection(db, 'books'), (snapshot) => {
      if (!snapshot.empty) {
        setBooks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book)));
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'books'));

    const unsubPlans = onSnapshot(collection(db, 'plans'), (snapshot) => {
      if (!snapshot.empty) {
        setPlans(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plan)));
      }
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'plans');
      setLoading(false);
    });

    return () => {
      unsubRecipes();
      unsubBooks();
      unsubPlans();
    };
  }, []);

  const addRecipe = async (recipe: Omit<Recipe, 'id'>) => {
    try {
      await addDoc(collection(db, 'recipes'), recipe);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'recipes');
    }
  };

  const updateRecipe = async (id: string, updates: Partial<Recipe>) => {
    try {
      await updateDoc(doc(db, 'recipes', id), updates);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'recipes');
    }
  };

  const deleteRecipe = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'recipes', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'recipes');
    }
  };

  const updatePlan = async (id: string, updates: Partial<Plan>) => {
    try {
      await setDoc(doc(db, 'plans', id), updates, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'plans');
    }
  };

  const seedDatabase = async () => {
    if (seeding) return;
    setSeeding(true);
    console.log('Starting database seed...');
    try {
      // Seed Recipes
      for (const recipe of mockRecipes) {
        const { id, ...data } = recipe;
        // Assign planId based on number if it's not present
        if (!data.planId) {
          if (recipe.number <= 100) (data as any).planId = 'free';
          else if (recipe.number <= 500) (data as any).planId = 'basic';
          else (data as any).planId = 'premium';
        }
        await setDoc(doc(db, 'recipes', id), data);
      }
      // Seed Books
      for (const book of mockBooks) {
        const { id, ...data } = book;
        await setDoc(doc(db, 'books', id), data);
      }
      // Seed Plans
      for (const plan of mockPlans) {
        const { id, ...data } = plan;
        await setDoc(doc(db, 'plans', id), data);
      }
      console.log('Database seed completed successfully.');
      alert('Base de datos inicializada con éxito. Todos los contenidos (Recetas, Libros y Planes) han sido cargados.');
    } catch (err) {
      console.error('Error seeding database:', err);
      handleFirestoreError(err, OperationType.CREATE, 'database_seed');
    } finally {
      setSeeding(false);
    }
  };

  return { recipes, books, plans, loading, seeding, addRecipe, updateRecipe, deleteRecipe, updatePlan, seedDatabase };
};
