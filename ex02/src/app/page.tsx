"use client";
import { useState } from "react";
import HomeClient from "./client";
import Transfer from "@/app/components/Transfer";
import Mint from "@/app/components/Mint";
import Burn from "@/app/components/Burn";
import CreateToken from "@/app/components/CreateToken";
import CreateTokenAccount from "@/app/components/CreateTokenAccount";

export default function Home() {
  const [mintAddress, setMintAddress] = useState("");
  const [associatedAddress, setAssociatedAddress] = useState("");

  const handleMintAddressChange = (newMintAddress: string) => {
    setMintAddress(newMintAddress);
  };

  const handleAssociatedAddressChange = (newAssociatedAddress: string) => {
    setAssociatedAddress(newAssociatedAddress);
  };


  return (
    <>
      <HomeClient />
      <div className="flex justify-center items-center">
		<div className="flex justify-center max-w-96 mt-8 items-center">
			<CreateToken onMintAddressChange={handleMintAddressChange} />
		</div>
		<div>
		{!mintAddress ? (
            <div className="flex justify-center max-w-96 mt-8 items-center">
            </div>
          ) : (
			  <div>
				<CreateTokenAccount mintAddress={mintAddress} getAssociated={handleAssociatedAddressChange} />
				<Mint mintAddress={mintAddress} tokenAccountAddress={associatedAddress}/>
				<Transfer />
				<Burn />
			</div>
		  )}
		</div>
      </div>
      <div>Current Mint Address: {mintAddress}</div>
	  <div>Current Associated: {associatedAddress}</div>
    </>
  );
}
