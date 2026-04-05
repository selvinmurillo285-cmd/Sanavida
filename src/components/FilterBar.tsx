import React from 'react';
import { HealthTag } from '../types';

interface FilterBarProps {
  selectedFilter: HealthTag | 'all' | 'vegetarian';
  setSelectedFilter: (filter: HealthTag | 'all' | 'vegetarian') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ selectedFilter, setSelectedFilter }) => {
  const filters: { id: HealthTag | 'all' | 'vegetarian'; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'vegetarian', label: 'Vegetariano' },
    { id: 'diabetes-friendly', label: 'Diabetes' },
    { id: 'weight-loss', label: 'Pérdida de Peso' },
    { id: 'hormonal-balance', label: 'Menopausia' },
  ];

  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-4 no-scrollbar">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => setSelectedFilter(filter.id)}
          className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all border-2 ${
            selectedFilter === filter.id
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200'
              : 'bg-white text-gray-500 border-gray-100 hover:border-emerald-200 hover:text-emerald-600'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};
