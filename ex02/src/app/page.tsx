"use client";
import { useState } from "react";
import HomeClient from "./client";
import Transfer from "@/app/components/Transfer";
import Mint from "@/app/components/Mint";
import Burn from "@/app/components/Burn";
import Delegate from "@/app/components/Delegate";
import CreateToken from "@/app/components/CreateToken";
import CreateTokenAccount from "@/app/components/CreateTokenAccount";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Home() {
	const [mintAddress, setMintAddress] = useState("");
	const [associatedAddress, setAssociatedAddress] = useState("");
	const { publicKey } = useWallet();

	const handleMintAddressChange = (newMintAddress: string) => {
		setMintAddress(newMintAddress);
	};

	const handleAssociatedAddressChange = (newAssociatedAddress: string) => {
		setAssociatedAddress(newAssociatedAddress);
	};


	return (
		<div>
			<HomeClient />
			{publicKey && 
			<div className="flex justify-center items-center flex-col">
				<div className="flex justify-center mt-8 items-center">
					<CreateToken onMintAddressChange={handleMintAddressChange} />
				</div>
				<div>
					{mintAddress && 
					<div>
						<CreateTokenAccount mintAddress={mintAddress} getAssociated={handleAssociatedAddressChange} />
						{associatedAddress && 
						<div>
							<Mint mintAddress={mintAddress} tokenAccountAddress={associatedAddress} />
							<Burn mintAddress={mintAddress} tokenAccountAddress={associatedAddress}/>
							<Transfer mintAddress={mintAddress} tokenAccountAddress={associatedAddress}/>
							<Delegate tokenAccountAddress={associatedAddress}/>
						</div>
						}
					</div>
					}
				</div>
			</div>
			}
		</div>
	);
}
