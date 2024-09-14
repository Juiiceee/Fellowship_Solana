"use client";
import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
 
export default function Home() {
	const { wallet } = useWallet();
	const [Wallet, setWallet] = useState();

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="border hover:border-slate-900 rounded">
        <WalletMultiButton style={{}} />
    	<p>{wallet?.toString()}</p>
      </div>
	{/* <button onClick={()=>{console.log("salut")}}>salut</button> */}
    </main>
  );
}