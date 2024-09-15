"use client";
import { createMintToCheckedInstruction, createMintToInstruction, mintToChecked } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection, PublicKey, Transaction } from "@solana/web3.js";
import { useState } from "react";

interface TokenAccountProps {
	mintAddress: string;
	tokenAccountAddress: string;
}

export default function Mint({ mintAddress, tokenAccountAddress }: TokenAccountProps) {
	
	const [amount, setAmount] = useState<string>("");

	console.log(amount);
	const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
	const { publicKey, sendTransaction } = useWallet();

	const mintToken = async () => {
		let tx = new Transaction().add(
			createMintToInstruction(
				new PublicKey(mintAddress), // mint
				new PublicKey(tokenAccountAddress), // receiver (should be a token account)
				publicKey, // mint authority
				BigInt(amount), // amount. if your decimals is 8, you mint 10^8 for 1 token.
				8 // decimals
			)
		);

		const signature = await sendTransaction(tx, connection);
		await connection.confirmTransaction(signature, "confirmed");
	};
	return (
		<div>
			<h1>Mint</h1>
			<input type="number" placeholder="amount" value={amount} onChange={(e) => setAmount(e.target.value)}/>
			<button onClick={mintToken}>Mint</button>
			<div>
				<p>mintAddress: {mintAddress}</p>
				<p>tokenAccountAddress: {tokenAccountAddress}</p>
				<p>amount: {amount}</p>
			</div>
		</div>
	);
}