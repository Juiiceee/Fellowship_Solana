"use client";
import { createMintToCheckedInstruction, createMintToInstruction, getAccount, mintToChecked } from "@solana/spl-token";
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

export default function Mint({ mintAddress, tokenAccountAddress }: TokenAccountProps) {

	const [amount, setAmount] = useState<string>("");
	const [isMinted, setIsMinted] = useState<boolean>(false);
	const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
	const { publicKey, sendTransaction } = useWallet();

	const [tokenAmount, setTokenAmount] = useState<string>("");

	const queryMintToken = async () => {
		const account = await connection.getTokenAccountBalance(new PublicKey(tokenAccountAddress));
		setTokenAmount(account.value.amount);
	}

	const mintToken = async () => {
		const tx = new Transaction().add(
			createMintToInstruction(
				new PublicKey(mintAddress),
				new PublicKey(tokenAccountAddress),
				publicKey,
				BigInt(amount * 1e8),
				8
			)
		);

		const signature = await sendTransaction(tx, connection);
		await connection.confirmTransaction(signature, "confirmed");
		setIsMinted(true);
	};
	return (
		<MagicCard className="mb-5 p-3 flex items-center justify-center flex-col">
			<div className="flex items-center justify-center flex-col">
				<h1 className="text-2xl">Mint</h1>
				<input className="my-3" type="number" placeholder="amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
				<div className={isMinted ? "" : ""}>
					<Button disabled={!amount ? true : false} onClick={mintToken} variant="contained" color={isMinted ? "success" : "secondary"}>
						Mint
					</Button>
				</div>
				{isMinted &&
					<div>
						<div className="my-3">
							<Button variant="contained" color="secondary" onClick={queryMintToken}>Get total token</Button>
						</div>
						<p className="border-2 border-black px-2">Amount: {tokenAmount ? (Number(tokenAmount) / 1e8) + " Tokens" : ""}</p>
					</div>
				}
			</div>
		</MagicCard>
	);
}