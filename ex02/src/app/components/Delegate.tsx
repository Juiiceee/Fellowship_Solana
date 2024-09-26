"use client";
import { createApproveInstruction } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection, PublicKey, Transaction } from "@solana/web3.js";
import { useState } from "react";
import * as React from 'react';
import Button from '@mui/material/Button';
import { MagicCard } from "@/components/magicui/magic-card";

interface TokenAccountProps {
	tokenAccountAddress: string;
}

export default function Delegate({ tokenAccountAddress }: TokenAccountProps) {

	const [amount, setAmount] = useState<string>("");
	const [destinationAdress, setDestinationAccount] = useState<string>("");
	console.log(amount);
	const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
	const { publicKey, sendTransaction } = useWallet();


	const delegateToken = async () => {
		const tx = new Transaction().add(
			createApproveInstruction(
				new PublicKey(tokenAccountAddress),
				new PublicKey(destinationAdress),
				publicKey,
				BigInt(amount)
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
				<Button onClick={delegateToken} variant="contained" color="secondary">Transfer</Button>
			</div>
		</MagicCard>
	);
}