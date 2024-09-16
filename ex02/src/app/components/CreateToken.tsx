import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import * as React from 'react';
import Button from '@mui/material/Button';
import {
	PublicKey,
	Keypair,
	SystemProgram,
	Transaction,
	Connection,
	clusterApiUrl,
} from "@solana/web3.js";
import {
	createInitializeMintInstruction,
	getMinimumBalanceForRentExemptMint,
	TOKEN_PROGRAM_ID,
	MINT_SIZE,
} from "@solana/spl-token";

export default function CreateToken({ onMintAddressChange }: { onMintAddressChange: (address: string) => void }) {
	const { publicKey, sendTransaction } = useWallet();
	const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
	const [mintAddress, setMintAddress] = useState("");

	const generateToken = async () => {
		const mint = Keypair.generate();
		const transaction = new Transaction().add(
			SystemProgram.createAccount({
				fromPubkey: publicKey,
				newAccountPubkey: mint.publicKey,
				space: MINT_SIZE,
				lamports: await getMinimumBalanceForRentExemptMint(connection),
				programId: TOKEN_PROGRAM_ID,
			}),
			createInitializeMintInstruction(
				mint.publicKey,
				Number(8),
				publicKey,
				publicKey
			)
		);

		const signature = await sendTransaction(transaction, connection, {
			signers: [mint],
		});
		await connection.confirmTransaction(signature, "confirmed");

		const mintAddress = mint.publicKey.toBase58();
		setMintAddress(mintAddress);

		onMintAddressChange(mintAddress);
	};

	return (
		<div>
			<h1>CreateToken</h1>
			<Button onClick={generateToken} variant="contained" color={mintAddress ? "success" : "secondary"}>
			CreateToken
			</Button>
			{mintAddress && <div>mintAddress: {mintAddress}</div>}
		</div>
	);
}
