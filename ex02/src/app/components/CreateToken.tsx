import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import * as React from 'react';
import Button from '@mui/material/Button';
import { useTheme } from "next-themes";
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
import { MagicCard } from "@/components/magicui/magic-card";

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
		<MagicCard className="my-3 p-3 flex items-center justify-center flex-col">
			<div className="flex items-center justify-center flex-col">
				<h1 className="text-2xl">Create Token</h1>
				<Button onClick={generateToken} variant="contained" color={mintAddress ? "success" : "secondary"}>
					Generate
				</Button>
				{mintAddress && <div>mintAddress: {mintAddress}</div>}
			</div>
		</MagicCard>
	);
}
