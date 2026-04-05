import React from 'react';
import { Check, Zap, Shield, Star } from 'lucide-react';
import { Plan, PlanType } from '../types';
import { motion } from 'motion/react';

interface PricingProps {
  plans: Plan[];
  currentPlan: PlanType;
  onSelectPlan: (planId: PlanType) => void;
}

export const Pricing: React.FC<PricingProps> = ({ plans, currentPlan, onSelectPlan }) => {
  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-gray-900 mb-4">Elige el plan ideal para ti</h2>
        <p className="text-gray-500 max-w-xl mx-auto mb-6">
          Accede a contenido especializado y herramientas exclusivas para transformar tu salud.
        </p>
        {currentPlan === 'premium' && (
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold border border-emerald-200">
            <Star size={16} />
            <span>Acceso Total de Administrador Activado</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ y: -10 }}
            className={`relative bg-white rounded-[2.5rem] p-8 border-2 transition-all flex flex-col ${
              currentPlan === plan.id
                ? 'border-emerald-500 shadow-2xl shadow-emerald-100'
                : 'border-gray-100 hover:border-emerald-200'
            }`}
          >
            {plan.id === 'premium' && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                Más Popular
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              {plan.description && (
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{plan.description}</p>
              )}
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-black text-gray-900">${plan.price}</span>
                <span className="text-gray-400 font-medium">/mes</span>
              </div>
            </div>

            <ul className="space-y-4 mb-10 flex-grow">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-sm text-gray-600">
                  <div className="mt-0.5 p-0.5 bg-emerald-100 text-emerald-600 rounded-full">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => onSelectPlan(plan.id)}
              disabled={currentPlan === plan.id}
              className={`w-full py-4 rounded-2xl font-bold transition-all ${
                currentPlan === plan.id
                  ? 'bg-emerald-50 text-emerald-600 cursor-default'
                  : 'bg-gray-900 text-white hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200'
              }`}
            >
              {currentPlan === plan.id ? 'Plan Actual' : 'Seleccionar Plan'}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 bg-emerald-50 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center space-x-6">
          <div className="p-4 bg-white rounded-3xl text-emerald-600 shadow-sm">
            <Shield size={32} />
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900">Garantía de Satisfacción</h4>
            <p className="text-emerald-800/60 text-sm">Prueba cualquier plan por 7 días. Si no te gusta, te devolvemos tu dinero.</p>
          </div>
        </div>
        <div className="flex -space-x-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-12 h-12 rounded-full border-4 border-emerald-50 bg-gray-200 overflow-hidden">
              <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
            </div>
          ))}
          <div className="w-12 h-12 rounded-full border-4 border-emerald-50 bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
            +2k
          </div>
        </div>
      </div>
    </div>
  );
};
