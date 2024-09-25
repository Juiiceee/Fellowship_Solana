"use client";
import { createAssociatedTokenAccountInstruction, createMintToCheckedInstruction, createMintToInstruction, createTransferInstruction, getAccount, getAssociatedTokenAddress, mintToChecked } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection, PublicKey, Transaction } from "@solana/web3.js";
import { useState } from "react";
import * as React from 'react';
import Button from '@mui/material/Button';
import { MagicCard } from "@/components/magicui/magic-card";

interface TokenAccountProps {
	mintAddress: string;
	tokenAccountAddress: string;
}

export default function Delegate({ mintAddress, tokenAccountAddress }: TokenAccountProps) {

	const [amount, setAmount] = useState<string>("");
	const [destinationAdress, setDestinationAccount] = useState<string>("");
	let mint = false;
	console.log(amount);
	const tx = new Transaction();
	const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
	const { publicKey, sendTransaction } = useWallet();


	const transferToken = async () => {
		const associatedTokenAddress = await getAssociatedTokenAddress(
			new PublicKey(mintAddress),
			new PublicKey(destinationAdress)
		);
		const isAccountGood = await connection.getAccountInfo(
			new PublicKey(associatedTokenAddress)
		);
		if (!isAccountGood) {
			tx.add(
				createAssociatedTokenAccountInstruction(
					publicKey,
					associatedTokenAddress,
					publicKey,
					mintAddress
				)
			);
		}
		tx.add(
			createTransferInstruction(
				new PublicKey(tokenAccountAddress),
				new PublicKey(associatedTokenAddress),
				publicKey,
				BigInt(amount * 1e8)
			)
		);

		const signature = await sendTransaction(tx, connection);
		await connection.confirmTransaction(signature, "confirmed");
	}
	return (
		<MagicCard className="my-3 p-3 flex items-center justify-center flex-col">
			<div className="flex items-center justify-center flex-col">
				<h1 className="text-2xl">Delegate</h1>
				<input type="text" value={destinationAdress} onChange={(e) => setDestinationAccount(e.target.value)} placeholder="Destination Adress" />
				<input className="my-2" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="amount" />
				<Button onClick={transferToken} variant="contained" color="secondary">Transfer</Button>
			</div>
		</MagicCard>
	);
}