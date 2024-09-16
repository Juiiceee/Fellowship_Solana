"use client"

import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function HomeClient() {
	const { wallet } = useWallet();
	const [Wallet, setWallet] = useState();
	const [isClient, setIsClient] = useState(false)

	useEffect(() => {
		setIsClient(true)
	}, [])
	return (
		isClient && (
			<main className={!wallet ? "flex items-center justify-center min-h-screen" : "flex items-center justify-end"} >
				<div className="border hover:border-slate-900 rounded" >
					<WalletMultiButton />
				</div>
				{/* <button onClick={()=>{console.log("salut")}}>salut</button> */}
			</main>
		)
	);
}