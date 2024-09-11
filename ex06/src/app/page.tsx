"use client";
import { useState, useEffect } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

// Solana Testnet connection
const connection = new Connection(clusterApiUrl('devnet'));

export default function Home() {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  // Fonction pour connecter le wallet Solana
  const connectWallet = async () => {
    try {
      if ('solana' in window) {
        const provider = (window as any).solana;
        if (provider.isPhantom) {
          const response = await provider.connect();
          setAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana wallet not found! Please install Phantom Wallet.');
      }
    } catch (err) {
      console.error('Error connecting to wallet:', err);
    }
  };

  // Fonction pour obtenir le solde du compte
  const getBalance = async (pubKey: string) => {
    try {
      const publicKey = new PublicKey(pubKey);
      const balanceLamports = await connection.getBalance(publicKey);
      setBalance(balanceLamports / 1e9); // Convertir lamports en SOL
    } catch (err) {
      console.error('Error getting balance:', err);
    }
  };

  // Mettre à jour le solde lorsque l'adresse change
  useEffect(() => {
    if (address) {
      getBalance(address);
    }
  }, [address]);

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Connectez votre portefeuille Solana (Devnet)</h1>
      {!address ? (
        <button onClick={connectWallet} style={{ padding: '10px 20px', fontSize: '16px' }}>
          Connectez-vous avec Phantom
        </button>
      ) : (
        <div>
          <p>Adresse du portefeuille : {address}</p>
          <p>Solde : {balance !== null ? `${balance} SOL` : 'Chargement...'}</p>
        </div>
      )}
    </div>
  );
}
