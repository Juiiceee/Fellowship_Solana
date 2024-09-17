"use client";
import { createBurnInstruction, createMintToCheckedInstruction, createMintToInstruction, getAccount, mintToChecked } from "@solana/spl-token";
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

export default function Burn({ mintAddress, tokenAccountAddress }: TokenAccountProps) {

	const [amount, setAmount] = useState<string>("");
	let burn = false;
	console.log(amount);
	const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
	const { publicKey, sendTransaction } = useWallet();

	const burnToken = async () => {
		const tx = new Transaction().add(
			createBurnInstruction(
				new PublicKey(tokenAccountAddress),
				new PublicKey(mintAddress),
				publicKey,
				BigInt(amount * 1e8)
			)
		);

		const signature = await sendTransaction(tx, connection);
		await connection.confirmTransaction(signature, "confirmed");
		burn = true;
	}
	return (
		<MagicCard className="my-3 p-3 flex items-center justify-center flex-col">
			<div className="flex items-center justify-center flex-col">
				<h1 className="text-2xl">Burn</h1>
				<input className="mb-3" type="number" placeholder="amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
				<Button onClick={burnToken} variant="contained" color={burn ? "success" : "secondary"}>
					Burn
				</Button>
			</div>
		</MagicCard>
	);
}