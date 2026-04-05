import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, CheckCircle2, Loader2, Wallet } from 'lucide-react';
import { Plan } from '../types';
import { PayPalButtons } from "@paypal/react-paypal-js";

interface CheckoutModalProps {
  item: { id: string; name: string; price: number; type: 'plan' | 'book' } | null;
  onClose: () => void;
  onSuccess: (itemId: string, type: 'plan' | 'book') => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ item, onClose, onSuccess }) => {
  const [step, setStep] = React.useState<'form' | 'processing' | 'success'>('form');

  if (!item) return null;

  const handlePayPalSuccess = (details: any) => {
    setStep('processing');
    console.log('Transaction completed by ' + details.payer.name.given_name);
    
    // Simulate a small delay for backend sync if needed
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess(item.id, item.type);
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
          >
            <X size={20} className="text-gray-400" />
          </button>

          <div className="p-8">
            {step === 'form' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-2xl mb-4">
                    <Wallet size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">Finalizar Compra</h3>
                  <p className="text-gray-500">Estás adquiriendo {item.type === 'plan' ? 'el' : 'el libro'} {item.name}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center mb-6 border border-gray-100">
                  <span className="text-gray-600 font-medium">Total a pagar:</span>
                  <span className="text-2xl font-black text-emerald-600">${item.price}</span>
                </div>

                <div className="space-y-4">
                  <PayPalButtons
                    style={{ layout: "vertical", shape: "rect", label: "pay" }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                          {
                            description: `Sanavida - ${item.name}`,
                            amount: {
                              currency_code: "USD",
                              value: item.price.toString(),
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={async (data, actions) => {
                      if (actions.order) {
                        const details = await actions.order.capture();
                        handlePayPalSuccess(details);
                      }
                    }}
                    onError={(err) => {
                      console.error("PayPal Error:", err);
                    }}
                  />
                </div>

                <div className="flex items-center justify-center space-x-2 text-gray-400 text-xs">
                  <ShieldCheck size={14} />
                  <span>Pago seguro procesado por PayPal</span>
                </div>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-20 text-center space-y-6"
              >
                <div className="relative inline-flex">
                  <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-20" />
                  <div className="relative p-6 bg-emerald-50 text-emerald-600 rounded-full">
                    <Loader2 size={48} className="animate-spin" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Confirmando Pago</h3>
                  <p className="text-gray-500">Estamos verificando la transacción con PayPal...</p>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-20 text-center space-y-6"
              >
                <div className="inline-flex p-6 bg-emerald-500 text-white rounded-full shadow-xl shadow-emerald-100">
                  <CheckCircle2 size={48} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-gray-900 mb-2">¡Pago Exitoso!</h3>
                  <p className="text-gray-500">
                    {item.type === 'plan' 
                      ? `Bienvenido a tu nuevo plan ${item.name}.` 
                      : `Has adquirido el libro "${item.name}" con éxito.`}
                  </p>
                </div>
                <p className="text-sm text-emerald-600 font-bold">Redirigiendo...</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
