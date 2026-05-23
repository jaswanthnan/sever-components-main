'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FilterContextType {
  filters: Record<string, string[]>;
  toggleFilter: (group: string, value: string) => void;
  clearGroup: (group: string) => void;
  clearAll: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

function useFilters() {
  const context = useContext(FilterContext);
  if (!context) throw new Error('FilterPanel components must be used within <FilterPanel>');
  return context;
}

interface FilterPanelProps {
  children: ReactNode;
  value?: Record<string, string[]>;
  onChange?: (filters: Record<string, string[]>) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> & {
  Group: React.FC<{ name: string; title: string; children: ReactNode }>;
  Item: React.FC<{ group: string; value: string; children: ReactNode }>;
  ClearButton: React.FC<{ group?: string; children: ReactNode }>;
} = ({ children, value, onChange }) => {
  const [internalFilters, setInternalFilters] = useState<Record<string, string[]>>({});
  
  // Use controlled value if provided, otherwise fallback to internal state
  const filters = value !== undefined ? value : internalFilters;

  const toggleFilter = (group: string, val: string) => {
    const currentGroup = filters[group] || [];
    const isRemoving = currentGroup.includes(val);
    const newGroup = isRemoving
      ? currentGroup.filter(v => v !== val)
      : [...currentGroup, val];
      
    const newFilters = { ...filters, [group]: newGroup };
    
    if (value === undefined) setInternalFilters(newFilters);
    if (onChange) onChange(newFilters);
  };

  const clearGroup = (group: string) => {
    const rest = Object.fromEntries(
      Object.entries(filters).filter(([key]) => key !== group)
    ) as Record<string, string[]>;
    if (value === undefined) setInternalFilters(rest);
    if (onChange) onChange(rest);
  };

  const clearAll = () => {
    if (value === undefined) setInternalFilters({});
    if (onChange) onChange({});
  };

  return (
    <FilterContext.Provider value={{ filters, toggleFilter, clearGroup, clearAll }}>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h3 className="font-bold text-slate-800">Filters</h3>
          <button 
            type="button"
            onClick={clearAll}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            Clear All
          </button>
        </div>
        {children}
      </div>
    </FilterContext.Provider>
  );
};

const Group: React.FC<{ name: string; title: string; children: ReactNode }> = ({ name, title, children }) => {
  return (
    <div className="space-y-3" data-group={name}>
      <div className="flex justify-between items-center">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {children}
      </div>
    </div>
  );
};

const Item: React.FC<{ group: string; value: string; children: ReactNode }> = ({ group, value, children }) => {
  const { filters, toggleFilter } = useFilters();
  const isActive = filters[group]?.includes(value);

  return (
    <button
      type="button"
      onClick={() => toggleFilter(group, value)}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
        isActive
          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
          : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600'
      }`}
    >
      {children}
    </button>
  );
};

const ClearButton: React.FC<{ group?: string; children: ReactNode }> = ({ group, children }) => {
  const { clearGroup, clearAll } = useFilters();
  return (
    <button 
      type="button"
      onClick={() => group ? clearGroup(group) : clearAll()}
      className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
    >
      {children}
    </button>
  );
};

FilterPanel.Group = Group;
FilterPanel.Item = Item;
FilterPanel.ClearButton = ClearButton;
