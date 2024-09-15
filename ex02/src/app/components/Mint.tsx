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
	
	const [amount, setAmount] = useState<number>(0);

	// Gestionnaire pour récupérer la valeur de l'input
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
	  const value = event.target.valueAsNumber; // valueAsNumber pour les inputs de type "number"
	  setAmount(value); // Mise à jour de l'état avec la valeur récupérée
	};

	const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
	const { publicKey, sendTransaction } = useWallet();

	const mintToken = async () => {
		// const txhash = await mintToChecked(
		// 	connection, // connection
		// 	publicKey, // fee payer
		// 	mintAddress, // mint
		// 	tokenAccountAddress, // receiver (should be a token account)
		// 	publicKey, // mint authority
		// 	BigInt(amount * 1e8), // amount. if your decimals is 8, you mint 10^8 for 1 token.
		// 	8 // decimals
		// );

		let tx = new Transaction().add(
			createMintToInstruction(
				new PublicKey(mintAddress), // mint
				new PublicKey(tokenAccountAddress), // receiver (should be a token account)
				publicKey, // mint authority
				BigInt(Math.floor(amount * 1e8)), // amount. if your decimals is 8, you mint 10^8 for 1 token.
				8 // decimals
				// [signer1, signer2 ...], // only multisig account will use
			)
		);

		const signature = await sendTransaction(tx, connection);
		await connection.confirmTransaction(signature, "confirmed");
	};
	return (
		<div>
			<h1>Mint</h1>
			<input type="number" name="Mnbr" id="Mnbr" placeholder="amount" />
			<button onClick={mintToken}>Mint</button>
			<div>
				<p>mintAddress: {mintAddress}</p>
				<p>tokenAccountAddress: {tokenAccountAddress}</p>
				<p>amount: {amount}</p>
			</div>
		</div>
	);
}