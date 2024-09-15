import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { clusterApiUrl } from '@solana/web3.js';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token';

interface CreateTokenAccountProps {
  mintAddress: string;
  getAssociated: (newAssociatedAddress: string) => void;
}

export default function CreateTokenAccount({ mintAddress, getAssociated }: CreateTokenAccountProps) {
  const { publicKey, sendTransaction } = useWallet();
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const [associatedTokenAddress, setAssociatedTokenAddress] = useState<PublicKey | null>(null);

  const handleCreateTokenAccount = async () => {
    const mintPublicKey = new PublicKey(mintAddress);
    const associatedTokenAddress = await getAssociatedTokenAddress(
      mintPublicKey,
      publicKey
    );
    setAssociatedTokenAddress(associatedTokenAddress);
    getAssociated(associatedTokenAddress.toBase58()); // Call the getAssociated callback
    const transaction = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        publicKey,
        associatedTokenAddress,
        publicKey,
        mintPublicKey
      )
    );

    const signature = await sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, "confirmed");
  };

  return (
    <div>
      <h1>CreateTokenAccount</h1>
      <button onClick={handleCreateTokenAccount}>CreateTokenAccount</button>
      <div>
        {associatedTokenAddress && <p>Associated {associatedTokenAddress.toBase58()}</p>}
      </div>
    </div>
  );
}