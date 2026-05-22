import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface PromptContextType {
  role: string;
  setRole: (role: string) => void;
  task: string;
  setTask: (task: string) => void;
  constraints: string[];
  addConstraint: (c: string) => void;
  removeConstraint: (index: number) => void;
}

const PromptContext = createContext<PromptContextType | undefined>(undefined);

function usePrompt() {
  const context = useContext(PromptContext);
  if (!context) throw new Error('AIPromptBuilder must be used within its provider');
  return context;
}

export const AIPromptBuilder: React.FC<{ children: ReactNode }> & {
  Role: React.FC;
  Task: React.FC;
  Constraints: React.FC;
  Preview: React.FC;
} = ({ children }) => {
  const [role, setRole] = useState('Senior Product Designer');
  const [task, setTask] = useState('');
  const [constraints, setConstraints] = useState<string[]>([]);

  useEffect(() => {
    console.group('%c[AIPromptBuilder] Update', 'color: #6366f1; font-weight: bold');
    console.log('Role:', role);
    console.log('Task:', task);
    console.log('Constraints:', constraints);
    console.groupEnd();
  }, [role, task, constraints]);

  const addConstraint = (c: string) => c && setConstraints([...constraints, c]);
  const removeConstraint = (i: number) => setConstraints(constraints.filter((_, idx) => idx !== i));

  return (
    <PromptContext.Provider value={{ role, setRole, task, setTask, constraints, addConstraint, removeConstraint }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-10 bg-slate-50 rounded-[2.5rem] border border-slate-200 shadow-2xl">
        <div className="space-y-8">{children}</div>
        <AIPromptBuilder.Preview />
      </div>
    </PromptContext.Provider>
  );
};

const Role: React.FC = () => {
  const { role, setRole } = usePrompt();
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">AI Persona</label>
      <input 
        value={role} 
        onChange={(e) => setRole(e.target.value)}
        className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 shadow-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium"
      />
    </div>
  );
};

const Task: React.FC = () => {
  const { task, setTask } = usePrompt();
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">The Mission</label>
      <textarea 
        value={task} 
        onChange={(e) => setTask(e.target.value)}
        className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 shadow-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium min-h-[120px]"
        placeholder="What should the AI build today?"
      />
    </div>
  );
};

const Constraints: React.FC = () => {
  const { constraints, addConstraint, removeConstraint } = usePrompt();
  const [val, setVal] = useState('');

  return (
    <div className="space-y-4">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Hard Constraints</label>
      <div className="flex gap-3">
        <input 
          value={val} 
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (addConstraint(val), setVal(''))}
          className="flex-1 px-6 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
          placeholder="e.g. No external APIs"
        />
        <button onClick={() => { addConstraint(val); setVal(''); }} className="px-6 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-lg active:scale-95 transition-all">+</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {constraints.map((c, i) => (
          <div key={i} className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full flex items-center gap-2 border border-indigo-100 animate-fadeIn">
            {c}
            <button onClick={() => removeConstraint(i)} className="hover:text-indigo-900 transition-colors">×</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const Preview: React.FC = () => {
  const { role, task, constraints } = usePrompt();
  const prompt = `Act as a ${role}.\n\nYour task is to: ${task || '[Pending]'}\n\nConstraints:\n${constraints.length ? constraints.map(c => `- ${c}`).join('\n') : '- None'}`;

  return (
    <div className="bg-slate-900 rounded-[2rem] p-10 shadow-2xl flex flex-col border border-slate-800">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-indigo-400 font-black uppercase tracking-widest text-xs">Prompt Engine</h3>
        <button onClick={() => navigator.clipboard.writeText(prompt)} className="bg-slate-800 hover:bg-slate-700 text-[10px] text-white font-bold px-4 py-2 rounded-xl border border-slate-700 transition-all">COPY</button>
      </div>
      <pre className="flex-1 text-slate-300 font-mono text-sm leading-relaxed whitespace-pre-wrap overflow-auto scrollbar-hide">
        {prompt}
      </pre>
    </div>
  );
};

AIPromptBuilder.Role = Role;
AIPromptBuilder.Task = Task;
AIPromptBuilder.Constraints = Constraints;
AIPromptBuilder.Preview = Preview;
