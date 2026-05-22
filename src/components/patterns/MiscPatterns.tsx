import React, { useState, useEffect, useRef } from 'react';

// --- RENDER PROPS PATTERN ---
interface MouseTrackerProps {
  render: (position: { x: number; y: number }) => React.ReactNode;
}

export const MouseTracker: React.FC<MouseTrackerProps> = ({ render }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative h-64 w-full bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden group">
      <div className="text-slate-400 font-bold tracking-widest uppercase text-xs group-hover:text-blue-500 transition-colors">
        Render Props Area
      </div>
      {render(position)}
    </div>
  );
};

// --- FUNCTION AS CHILDREN PATTERN ---
interface CounterProps {
  children: (count: number, increment: () => void, decrement: () => void) => React.ReactNode;
}

export const Counter: React.FC<CounterProps> = ({ children }) => {
  const [count, setCount] = useState(0);
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  return <>{children(count, increment, decrement)}</>;
};

// --- CONTROLLED VS UNCONTROLLED ---
export const InputPatterns: React.FC = () => {
  const [controlledValue, setControlledValue] = useState('');
  const uncontrolledRef = useRef<HTMLInputElement>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
      <div className="space-y-4">
        <h4 className="font-black text-slate-800 uppercase tracking-tighter text-lg">Controlled</h4>
        <input 
          value={controlledValue}
          onChange={(e) => {
            console.log(`%c[Controlled]%c Value changed to: %c${e.target.value}`, 'color: #3b82f6; font-weight: bold', 'color: inherit', 'color: #3b82f6; font-weight: bold');
            setControlledValue(e.target.value);
          }}
          className="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all"
          placeholder="Syncing with state..."
        />
        <div className="bg-blue-50 p-3 rounded-xl">
           <p className="text-xs font-bold text-blue-600">STATE: <span className="text-slate-800 font-mono">{controlledValue || 'Empty'}</span></p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-black text-slate-800 uppercase tracking-tighter text-lg">Uncontrolled</h4>
        <div className="flex gap-3">
          <input 
            ref={uncontrolledRef}
            className="flex-1 px-5 py-3 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 outline-none transition-all"
            placeholder="Direct DOM access..."
          />
          <button 
            onClick={() => {
              const val = uncontrolledRef.current?.value;
              console.log(`%c[Uncontrolled]%c Reading value from DOM: %c${val}`, 'color: #10b981; font-weight: bold', 'color: inherit', 'color: #10b981; font-weight: bold');
              alert(`Uncontrolled Value: ${val}`);
            }}
            className="px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors shadow-lg active:scale-95"
          >
            Read
          </button>
        </div>
        <div className="bg-emerald-50 p-3 rounded-xl">
           <p className="text-xs font-bold text-emerald-600 italic">Accessed via useRef() on demand (No re-renders on type)</p>
        </div>
      </div>
    </div>
  );
};
