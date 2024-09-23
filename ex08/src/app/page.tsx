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
import Generate from './utils/Generate';
import ScrapAddress from './utils/ScrapAddress';

export default function Home() {
	const [urlIpfs, setUrlIpfs] = React.useState("");
	const [isClient, setIsClient] = useState(false);
	const { publicKey, signTransaction, signAllTransactions, wallet } = useWallet()
	const ipfsUrl = 'https://plum-accurate-bobcat-724.mypinata.cloud/ipfs/QmVnoYjK4ZyDZrJhtMTTQxAyiY1iuKMdSiaomNKhAU6vvg';

	useEffect(() => {
		setIsClient(true);
	}, []);

	const umi = createUmi("https://devnet.helius-rpc.com/?api-key=c7260fbe-27cf-4a2b-a51b-a070101c082a").use(walletAdapterIdentity({ publicKey, signTransaction, signAllTransactions })).use(mplBubblegum()).use(mplTokenMetadata());

	const maxDepthSizePair: ValidDepthSizePair = {
		maxDepth: 14,
		maxBufferSize: 64,
	};

	const checkData = async () => {
		const data = await ScrapAddress();
		console.log(data);
	}

	const INITIAL_BATCH_SIZE = 5;
	const INITIAL_DELAY = 3000;
	const MAX_RETRIES = 3;

	const generateTree = async () => {
		const data = await ScrapAddress();
		let batchSize = INITIAL_BATCH_SIZE;
		const results: string[] = [];
		let delay = INITIAL_DELAY;
		const { merkleTree, collectionAddress } = await Generate(umi, maxDepthSizePair);

		for (let i = 0; i < data.length; i += batchSize) {
			const batch = data.slice(i, i + batchSize);
			let retries = 0;
			let batchResults: string[] = [];

			while (retries < MAX_RETRIES) {
				try {
					const batchPromises = batch.map((address) =>
						mintFunction(umi, address, merkleTree, collectionAddress)
					);
					batchResults = await Promise.all(batchPromises);
					break; // Success, exit retry loop
				} catch (error) {
					console.error(`Error minting batch (attempt ${retries + 1}):`, error);
					retries++;
					if (retries === MAX_RETRIES) {
						throw new Error(`Failed to mint batch after ${MAX_RETRIES} attempts`);
					}
					batchSize = Math.max(1, Math.floor(batchSize / 2));
					delay *= 2;
					await new Promise((resolve) => setTimeout(resolve, delay));
				}
			}
			results.push(...batchResults);
			console.log(
				`Minted ${batchResults.length} cNFTs. Total: ${results.length}/${data.length}`
			);

			if (i + batchSize < data.length) {
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		};
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
					<button onClick={checkData}>Salutfeur</button>
					<div className="flex items-center justify-center flex-col">
						<img src={urlIpfs} style={{ maxWidth: '50%' }} />
					</div>
					<Button className="mt-10" type="primary" onClick={generateTree}>Mint all Token</Button>
				</div>
			</div>}
		</div>
	);
}
