"use client";
import React, { useEffect, useState } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { ValidDepthSizePair } from "@solana/spl-account-compression";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import HomeClient from '@/components/client';
import BlurIn from '@/components/magicui/blur-in';
import { Button, Input } from 'antd';
import { mintFunction } from './utils/Mint';
import { Generate } from './utils/Generate';

export default function Home() {
	const [urlIpfs, setUrlIpfs] = React.useState("");
	const [isClient, setIsClient] = useState(false);
	const { publicKey, signTransaction, signAllTransactions, wallet } = useWallet();
	const ipfsUrl = 'https://plum-accurate-bobcat-724.mypinata.cloud/ipfs/QmVnoYjK4ZyDZrJhtMTTQxAyiY1iuKMdSiaomNKhAU6vvg';

	useEffect(() => {
		// Ensure that the component is only rendered on the client side
		setIsClient(true);
	}, []);

	const umi = createUmi("https://api.devnet.solana.com").use(walletAdapterIdentity({ publicKey, signTransaction, signAllTransactions })).use(mplBubblegum()).use(mplTokenMetadata());

	const maxDepthSizePair: ValidDepthSizePair = {
		maxDepth: 14,
		maxBufferSize: 64,
	};

	const generateTree = async () => {

		const { merkleTree, collectionAddress } = await Generate(umi, maxDepthSizePair);
		mintFunction(umi, "GyETGp22PjuTTiQJQ2P9oAe7oioFjJ7tbTBr1qiXZoa8", merkleTree, collectionAddress);
	};

	if (!isClient) return null;

	return (
		<div>
			<HomeClient />
			{wallet && <div>
				<div className="mt-5 text-center ">
					<BlurIn className="text-center inline-block p-2 border-2 border-white" word={"Mint Token for all FellowShip Member"}></BlurIn>
				</div>
				<div className="flex items-center justify-center flex-col">
					<Input className="w-1/2 mt-10 mb-10" placeholder="Url cNFT" value={urlIpfs} onChange={(e) => { setUrlIpfs(e.target.value) }} />
					<span>{ipfsUrl}</span>
					<div className="flex items-center justify-center flex-col">
						<img src={urlIpfs} style={{ maxWidth: '50%' }} />
					</div>
					<Button className="mt-10" type="primary" onClick={generateTree}>Mint all Token</Button>
				</div>
			</div>}
		</div>
	);
}
