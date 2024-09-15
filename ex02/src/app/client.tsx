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
    <main className="flex items-center justify-center min-h-screen" >
      <div className="border hover:border-slate-900 rounded" >
		<WalletMultiButton />
		{wallet && wallet.adapter.publicKey?.toBase58()}
	</div>
	{/* <button onClick={()=>{console.log("salut")}}>salut</button> */}
    </main>
)
  );
}