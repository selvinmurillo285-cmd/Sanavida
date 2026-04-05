import React from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Sparkles, Loader2, Utensils, Activity, Heart } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

type AgentType = 'nutritionist' | 'menopause' | 'diabetes';

interface AgentConfig {
  id: AgentType;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  welcomeMessage: string;
  systemInstruction: string;
  promptPrefix: string;
}

const AGENT_CONFIGS: Record<AgentType, AgentConfig> = {
  nutritionist: {
    id: 'nutritionist',
    name: 'Nutricionista',
    description: 'Experto en alimentación saludable y metas de salud.',
    icon: <Bot size={20} />,
    color: 'emerald',
    welcomeMessage: '¡Hola! Soy tu Nutricionista personal de Sanavida. ¿En qué puedo ayudarte hoy con tu alimentación o metas de salud?',
    systemInstruction: "Eres el Agente Nutricionista de Sanavida. Eres experto en nutrición general, pérdida de peso y equilibrio hormonal. Siempre promueves un estilo de vida saludable y equilibrado.",
    promptPrefix: "Eres un experto nutricionista de Sanavida. Tu objetivo es ayudar a los usuarios con consejos de alimentación saludable, recetas y equilibrio hormonal. Responde de manera profesional, empática y basada en ciencia."
  },
  menopause: {
    id: 'menopause',
    name: 'Especialista en menopausia',
    description: 'Especialista en perimenopausia, menopausia y postmenopausia.',
    icon: <Bot size={20} />,
    color: 'rose',
    welcomeMessage: 'Consulta con Asistente Especialista en Menopausia. Habla con nuestro experto. Con nuestra gente experta para resolver tus dudas en tu menopausia. En el periodo de tu menopausia.',
    systemInstruction: "Eres el Asistente Especialista en Menopausia de Sanavida. Posees un conocimiento profundo y científico sobre los cambios hormonales, síntomas vasomotores, salud ósea, metabolismo y bienestar emocional durante la perimenopausia, menopausia y postmenopausia.",
    promptPrefix: "Eres un Asistente Especialista en Menopausia, experto científico en salud femenina, especializado en perimenopausia, menopausia y postmenopausia. Tu objetivo es ayudar a las mujeres a navegar estas etapas con biohacking, nutrición y cambios de estilo de vida. Responde de manera científica pero con un lenguaje claro y sencillo."
  },
  diabetes: {
    id: 'diabetes',
    name: 'Especialista en diabetes',
    description: 'Experto en control de glucosa y nutrición para diabéticos.',
    icon: <Bot size={20} />,
    color: 'blue',
    welcomeMessage: '¡Hola! Soy tu Especialista en Diabetes de Sanavida. ¿Tienes dudas sobre cómo manejar tus niveles de glucosa o qué alimentos son mejores para ti?',
    systemInstruction: "Eres el Especialista en Diabetes de Sanavida. Eres experto en el manejo de la diabetes tipo 1, tipo 2 y prediabetes a través de la nutrición y el estilo de vida. Siempre promueves el control glucémico y la salud metabólica.",
    promptPrefix: "Eres un especialista en diabetes de Sanavida. Tu objetivo es ayudar a los usuarios a manejar sus niveles de azúcar en sangre a través de la alimentación y hábitos saludables. Responde de manera científica, clara y empática."
  }
};

export function AIAssistants({ initialAgent = 'menopause' }: { initialAgent?: AgentType }) {
  const [activeAgent, setActiveAgent] = React.useState<AgentType>(initialAgent);

  React.useEffect(() => {
    setActiveAgent(initialAgent);
  }, [initialAgent]);

  const [messages, setMessages] = React.useState<Record<AgentType, Message[]>>({
    nutritionist: [{ role: 'assistant', content: AGENT_CONFIGS.nutritionist.welcomeMessage }],
    menopause: [{ role: 'assistant', content: AGENT_CONFIGS.menopause.welcomeMessage }],
    diabetes: [{ role: 'assistant', content: AGENT_CONFIGS.diabetes.welcomeMessage }]
  });
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const config = AGENT_CONFIGS[activeAgent];

  const colorMap = {
    emerald: {
      bg: 'bg-emerald-600',
      bgLight: 'bg-emerald-50/30',
      bgIcon: 'bg-emerald-100',
      text: 'text-emerald-600',
      textDark: 'text-emerald-700',
      border: 'border-emerald-100',
      pulse: 'bg-emerald-500',
      hover: 'hover:bg-emerald-700'
    },
    rose: {
      bg: 'bg-rose-600',
      bgLight: 'bg-rose-50/30',
      bgIcon: 'bg-rose-100',
      text: 'text-rose-600',
      textDark: 'text-rose-700',
      border: 'border-rose-100',
      pulse: 'bg-rose-500',
      hover: 'hover:bg-rose-700'
    },
    blue: {
      bg: 'bg-blue-600',
      bgLight: 'bg-blue-50/30',
      bgIcon: 'bg-blue-100',
      text: 'text-blue-600',
      textDark: 'text-blue-700',
      border: 'border-blue-100',
      pulse: 'bg-blue-500',
      hover: 'hover:bg-blue-700'
    }
  };

  const colors = colorMap[config.color as keyof typeof colorMap];

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeAgent]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => ({
      ...prev,
      [activeAgent]: [...prev[activeAgent], { role: 'user', content: userMessage }]
    }));
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: `${config.promptPrefix} Pregunta: ${userMessage}` }]
          }
        ],
        config: {
          systemInstruction: config.systemInstruction
        }
      });

      const assistantMessage = response.text || 'Lo siento, tuve un problema al procesar tu solicitud. Por favor, intenta de nuevo.';
      setMessages(prev => ({
        ...prev,
        [activeAgent]: [...prev[activeAgent], { role: 'assistant', content: assistantMessage }]
      }));
    } catch (error) {
      console.error('Error calling Gemini:', error);
      setMessages(prev => ({
        ...prev,
        [activeAgent]: [...prev[activeAgent], { role: 'assistant', content: 'Hubo un error al conectar con el servicio. Por favor, verifica tu conexión.' }]
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[700px] bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className={`p-6 border-b border-gray-50 ${colors.bgLight} flex items-center justify-between`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2 ${colors.bg} text-white rounded-2xl`}>
            {config.icon}
          </div>
          <div>
            <h3 className="font-black text-gray-900 tracking-tight">{config.name}</h3>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 ${colors.pulse} rounded-full animate-pulse`} />
              <span className={`text-xs ${colors.text} font-bold`}>Especialista 24/7</span>
            </div>
          </div>
        </div>
        <div className={`hidden md:flex items-center space-x-2 px-3 py-1 bg-white rounded-full border ${colors.border}`}>
          <Sparkles size={12} className={colors.text} />
          <span className={`text-[10px] font-black ${colors.textDark} uppercase tracking-widest`}>Elite Access</span>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-[#FAFAF9]"
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={activeAgent}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {messages[activeAgent].map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[85%] space-x-3 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                    message.role === 'user' ? 'bg-gray-100 text-gray-600' : `${colors.bgIcon} ${colors.text}`
                  }`}>
                    {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    message.role === 'user' 
                      ? 'bg-gray-900 text-white font-medium rounded-tr-none' 
                      : 'bg-white text-gray-800 rounded-tl-none shadow-sm border border-gray-100'
                  }`}>
                    {message.content}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex space-x-3">
              <div className={`w-8 h-8 rounded-xl ${colors.bgIcon} ${colors.text} flex items-center justify-center`}>
                <Loader2 size={16} className="animate-spin" />
              </div>
              <div className="p-4 bg-white text-gray-400 rounded-2xl rounded-tl-none text-sm italic shadow-sm border border-gray-100">
                El especialista está analizando...
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t border-gray-100">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Haz tu consulta al ${config.name.toLowerCase()}...`}
            className="w-full pl-6 pr-16 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`absolute right-2 p-3 ${colors.bg} text-white rounded-xl ${colors.hover} disabled:opacity-50 disabled:hover:${colors.bg} transition-all`}
          >
            <Send size={18} />
          </button>
        </div>
        <p className="mt-3 text-[10px] text-center text-gray-400 uppercase font-bold tracking-widest">
          Asesoría especializada para miembros Elite
        </p>
      </div>
    </div>
  );
}
