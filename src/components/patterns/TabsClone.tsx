import React, { useState, ReactElement, ReactNode } from 'react';

interface TabProps {
  label: string;
  children: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

export const Tab: React.FC<TabProps> = ({ children, isActive }) => {
  if (!isActive) return null;
  return <div className="p-6 bg-white rounded-b-2xl animate-fadeIn shadow-inner border-t border-slate-50">{children}</div>;
};

interface TabsCloneProps {
  children: ReactNode;
}

export const TabsClone: React.FC<TabsCloneProps> = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleTabClick = (index: number, label: string) => {
    console.log(`%c[TabsClone]%c Switching to tab: %c${label}`, 'color: #3b82f6; font-weight: bold', 'color: inherit', 'color: #3b82f6; font-weight: bold');
    setActiveIndex(index);
  };

  const childrenArray = React.Children.toArray(children) as ReactElement<TabProps>[];

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="flex bg-slate-50/50 border-b border-slate-100">
        {childrenArray.map((child, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index, child.props.label)}
            className={`px-6 py-4 text-sm font-bold transition-all duration-300 relative ${
              activeIndex === index 
                ? 'text-blue-600 bg-white' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
            }`}
          >
            {child.props.label}
            {activeIndex === index && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 shadow-[0_-2px_10px_rgba(37,99,235,0.3)]" />
            )}
          </button>
        ))}
      </div>
      <div>
        {childrenArray.map((child, index) => 
          React.cloneElement(child, {
            isActive: index === activeIndex,
            key: index
          })
        )}
      </div>
    </div>
  );
};
