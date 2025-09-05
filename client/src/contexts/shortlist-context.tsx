import React, { createContext, useContext, useState, ReactNode } from "react";

interface ShortlistContextType {
  shortlistedIds: Set<string>;
  addToShortlist: (studentId: string) => void;
  removeFromShortlist: (studentId: string) => void;
  isShortlisted: (studentId: string) => boolean;
  shortlistCount: number;
  clearShortlist: () => void;
}

const ShortlistContext = createContext<ShortlistContextType | undefined>(undefined);

export function ShortlistProvider({ children }: { children: ReactNode }) {
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set());

  const addToShortlist = (studentId: string) => {
    setShortlistedIds(prev => new Set([...Array.from(prev), studentId]));
  };

  const removeFromShortlist = (studentId: string) => {
    setShortlistedIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(studentId);
      return newSet;
    });
  };

  const isShortlisted = (studentId: string) => {
    return shortlistedIds.has(studentId);
  };

  const clearShortlist = () => {
    setShortlistedIds(new Set());
  };

  return (
    <ShortlistContext.Provider value={{
      shortlistedIds,
      addToShortlist,
      removeFromShortlist,
      isShortlisted,
      shortlistCount: shortlistedIds.size,
      clearShortlist
    }}>
      {children}
    </ShortlistContext.Provider>
  );
}

export function useShortlist() {
  const context = useContext(ShortlistContext);
  if (context === undefined) {
    throw new Error('useShortlist must be used within a ShortlistProvider');
  }
  return context;
}