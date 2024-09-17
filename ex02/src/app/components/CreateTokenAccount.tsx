import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { clusterApiUrl } from '@solana/web3.js';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import { useState } from "react";
import * as React from 'react';
import Button from '@mui/material/Button';
import { MagicCard } from "@/components/magicui/magic-card";
interface CreateTokenAccountProps {
	mintAddress: string;
	getAssociated: (newAssociatedAddress: string) => void;
}

export default function CreateTokenAccount({ mintAddress, getAssociated }: CreateTokenAccountProps) {
	const { publicKey, sendTransaction } = useWallet();
	const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
	const [associatedTokenAddress, setAssociatedTokenAddress] = useState<PublicKey | null>(null);

	const generateTokenAccount = async () => {
		const mintPublicKey = new PublicKey(mintAddress);
		const associatedTokenAddress = await getAssociatedTokenAddress(
			mintPublicKey,
			publicKey
		);
		setAssociatedTokenAddress(associatedTokenAddress);
		getAssociated(associatedTokenAddress.toBase58()); // Call the getAssociated callback
		const tx = new Transaction().add(
			createAssociatedTokenAccountInstruction(
				publicKey,
				associatedTokenAddress,
				publicKey,
				mintPublicKey
			)
		);

		const signature = await sendTransaction(tx, connection);
		await connection.confirmTransaction(signature, "confirmed");
	};

	return (
		<MagicCard className="my-3 p-3 flex items-center justify-center flex-col">
			<div className="flex items-center justify-center flex-col">
				<h1 className="text-2xl">Create Token Account</h1>
				<Button onClick={generateTokenAccount} variant="contained" color={associatedTokenAddress ? "success" : "secondary"}>
					Generate
				</Button>
				<div>
					{associatedTokenAddress && <p>Associated: {associatedTokenAddress.toBase58()}</p>}
				</div>
			</div>
		</MagicCard>
	);
}

// import React, { useState } from 'react';
// import { useWallet } from '@solana/wallet-adapter-react';
// import { Connection, PublicKey, Transaction } from '@solana/web3.js';
// import { clusterApiUrl } from '@solana/web3.js';
// import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token';

// interface CreateTokenAccountProps {
// 	mintAddress: string;
// 	getAssociated: (newAssociatedAddress: string) => void;
// }

// export default function CreateTokenAccount({ mintAddress, getAssociated }: CreateTokenAccountProps) {
// 	const { publicKey, sendTransaction } = useWallet();
// 	const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
// 	const [associatedTokenAddress, setAssociatedTokenAddress] = useState<PublicKey | null>(null);
// 	const [isProcessing, setIsProcessing] = useState(true);

// 	const handleCreateTokenAccount = async () => {
// 		setIsProcessing(true);
// 		const mintPublicKey = new PublicKey(mintAddress);
// 		try {
// 			const associatedTokenAddress = await getAssociatedTokenAddress(
// 				mintPublicKey,
// 				publicKey
// 			);
// 			setAssociatedTokenAddress(associatedTokenAddress);
// 			getAssociated(associatedTokenAddress.toBase58()); // Call the getAssociated callback
// 			const transaction = new Transaction().add(
// 				createAssociatedTokenAccountInstruction(
// 					publicKey,
// 					associatedTokenAddress,
// 					publicKey,
// 					mintPublicKey
// 				)
// 			);
// 			const signature = await sendTransaction(transaction, connection);
// 			await connection.confirmTransaction(signature, "confirmed");
// 		}
// 		catch (error) {
// 			console.error(error);
// 		}
// 		finally {
// 			setIsProcessing(false);
// 		};

// 		return (
// 			<div>
// 				<h1>CreateTokenAccount</h1>
// 				<button disabled={isProcessing} onClick={handleCreateTokenAccount}>{isProcessing ? "Processing..." : "Create Token Account"}</button>
// 				<div>
// 					{associatedTokenAddress && <p>Associated: {associatedTokenAddress.toBase58()}</p>}
// 				</div>
// 			</div>
// 		);
// 	}
// }