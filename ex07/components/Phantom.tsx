import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PublicKey } from '@solana/web3.js';

interface PhantomWalletContextProps {
  phantomWalletPublicKey?: PublicKey;
  setPhantomWalletPublicKey: (key: PublicKey | undefined) => void;
}

const PhantomWalletContext = createContext<PhantomWalletContextProps | null>(null);

export const PhantomWalletProvider = ({ children }: { children: ReactNode }) => {
  const [phantomWalletPublicKey, setPhantomWalletPublicKey] = useState<PublicKey>();

  return (
    <PhantomWalletContext.Provider value={{ phantomWalletPublicKey, setPhantomWalletPublicKey }}>
      {children}
    </PhantomWalletContext.Provider>
  );
};

export const usePhantomWallet = () => {
  const context = useContext(PhantomWalletContext);
  if (!context) {
    throw new Error('usePhantomWallet must be used within a PhantomWalletProvider');
  }
  return context || null;
};