import React, { useState, useEffect } from 'react';

// Mock Data
const fetchUserData = () => new Promise<{ name: string; status: string }>(resolve => {
  setTimeout(() => resolve({ name: 'Jaswanth Nan', status: 'Enterprise Admin' }), 1200);
});

// --- HIGHER-ORDER COMPONENT (HOC) ---
export function withUser<P extends object>(WrappedComponent: React.ComponentType<P & { user: any }>) {
  return (props: P) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchUserData().then(data => {
        setUser(data);
        setLoading(false);
      });
    }, []);

    if (loading) return (
      <div className="p-8 rounded-3xl bg-slate-50 border-2 border-slate-100 animate-pulse flex items-center justify-center">
        <span className="text-slate-400 font-bold uppercase text-xs">Loading User (HOC)...</span>
      </div>
    );

    return <WrappedComponent {...props} user={user} />;
  };
}

// --- MODERN HOOK-BASED PATTERN ---
export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData().then(data => {
      setUser(data);
      setLoading(false);
    });
  }, []);

  return { user, loading };
}

// Visual components
const UserBadge: React.FC<{ user: any; title: string; color: string }> = ({ user, title, color }) => (
  <div className={`p-6 rounded-3xl bg-gradient-to-br ${color} text-white shadow-xl`}>
    <div className="text-[10px] font-black uppercase opacity-60 mb-2 tracking-widest">{title}</div>
    <div className="text-2xl font-black mb-1">{user.name}</div>
    <div className="text-sm font-medium opacity-90">{user.status}</div>
  </div>
);

export const UserProfileHOC = withUser(({ user }) => (
  <UserBadge user={user} title="HOC Pattern" color="from-indigo-600 to-purple-700" />
));

export const UserProfileHook: React.FC = () => {
  const { user, loading } = useUser();
  
  if (loading) return (
    <div className="p-8 rounded-3xl bg-slate-50 border-2 border-slate-100 animate-pulse flex items-center justify-center">
      <span className="text-slate-400 font-bold uppercase text-xs">Loading User (Hook)...</span>
    </div>
  );

  return <UserBadge user={user} title="Hook Pattern" color="from-emerald-500 to-teal-700" />;
};
