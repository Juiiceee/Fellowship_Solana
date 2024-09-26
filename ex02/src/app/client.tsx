"use client"

import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function HomeClient() {
	const { wallet } = useWallet();
	const [isClient, setIsClient] = useState(false)

	useEffect(() => {
		setIsClient(true)
	}, [])
	return (
		isClient && (
			<main className={!wallet ? "flex items-center justify-center min-h-screen relative" : "flex items-center justify-end relative"}>
				<div className={!wallet ? "border hover:border-slate-900 rounded" : "border hover:border-slate-900 rounded absolute top-6 right-3"} >
					<WalletMultiButton />
				</div>
			</main>
		)
	);
}