"use client";
import { createMintToCheckedInstruction, createMintToInstruction, getAccount, mintToChecked } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection, PublicKey, Transaction } from "@solana/web3.js";
import { useState } from "react";
import * as React from 'react';
import Button from '@mui/material/Button';

interface TokenAccountProps {
	mintAddress: string;
	tokenAccountAddress: string;
}

export default function Mint({ mintAddress, tokenAccountAddress }: TokenAccountProps) {

	const [amount, setAmount] = useState<string>("");
	let mint = false;
	console.log(amount);
	const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
	const { publicKey, sendTransaction } = useWallet();

	const [tokenAmount, setTokenAmount] = useState<string>("");

	const queryMintToken = async () =>
	{
		//const account = await getAccount(connection, new PublicKey(tokenAccountAddress));
		const account = await connection.getTokenAccountBalance(new PublicKey(tokenAccountAddress));
		setTokenAmount(account.value.amount);
	}

	const mintToken = async () => {
		const tx = new Transaction().add(
			createMintToInstruction(
				new PublicKey(mintAddress), // mint
				new PublicKey(tokenAccountAddress), // receiver (should be a token account)
				publicKey, // mint authority
				BigInt(amount * 1e8), // amount. if your decimals is 8, you mint 10^8 for 1 token.
				8 // decimals
			)
		);

		const signature = await sendTransaction(tx, connection);
		await connection.confirmTransaction(signature, "confirmed");
		mint = true;
	};
	return (
		<div>
			<h1>Mint</h1>
			<input type="number" placeholder="amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
			<Button onClick={mintToken} variant="contained" color={mint ? "success" : "secondary"}>
			Mint
			</Button>
			<div>
				<p>mintAddress: {mintAddress}</p>
				<p>tokenAccountAddress: {tokenAccountAddress}</p>
				<button onClick={queryMintToken}>Total token</button>
				<p>Amount: {tokenAmount ? (Number(tokenAmount) / 1e8) + " Tokens" : ""}</p>
			</div>
		</div>
	);
}