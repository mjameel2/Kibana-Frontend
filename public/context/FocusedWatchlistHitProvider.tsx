import React, { createContext, useState } from 'react';

interface FocusedWatchlistHitContextProps {
  focusedWatchlistHit: any;
  updateFocusedWatchlistHit: (newFocusedWatchHit: any) => void;
} 

const FocusedWatchlistHitContext = createContext<FocusedWatchlistHitContextProps>(null!);

interface FocusedWatchlistHitProviderProps {
  children: React.ReactNode;
}

const FocusedWatchlistHitProvider = ({ children }: FocusedWatchlistHitProviderProps) => {
  const [focusedWatchlistHit, setFocusedWatchlistHit] = useState('');
  const updateFocusedWatchlistHit = (newFocusedWatchlistHit: any) => setFocusedWatchlistHit(newFocusedWatchlistHit);
  return (
    <FocusedWatchlistHitContext.Provider value={{ focusedWatchlistHit, updateFocusedWatchlistHit }}>
      {children}
    </FocusedWatchlistHitContext.Provider>
  );
};

export {
  FocusedWatchlistHitContext,
  FocusedWatchlistHitProvider
};