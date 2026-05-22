import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tabs compound components must be used within <Tabs>');
  return context;
}

export const Tabs: React.FC<{ children: ReactNode; defaultValue: string }> & {
  List: React.FC<{ children: ReactNode }>;
  Trigger: React.FC<{ id: string; children: ReactNode }>;
  Content: React.FC<{ id: string; children: ReactNode }>;
} = ({ children, defaultValue }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (id: string) => {
    console.log(`%c[TabsContext]%c Active Tab ID: %c${id}`, 'color: #8b5cf6; font-weight: bold', 'color: inherit', 'color: #8b5cf6; font-weight: bold');
    setActiveTab(id);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className="w-full bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const List: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="flex p-2 bg-slate-50/80 border-b border-slate-100 gap-2">
    {children}
  </div>
);

const Trigger: React.FC<{ id: string; children: ReactNode }> = ({ id, children }) => {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === id;

  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
        isActive
          ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200'
          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
      }`}
    >
      {children}
    </button>
  );
};

const Content: React.FC<{ id: string; children: ReactNode }> = ({ id, children }) => {
  const { activeTab } = useTabs();
  if (activeTab !== id) return null;
  return <div className="p-8 animate-fadeIn">{children}</div>;
};

Tabs.List = List;
Tabs.Trigger = Trigger;
Tabs.Content = Content;
