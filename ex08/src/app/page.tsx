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
import { publicKey as publickeyMeta } from '@metaplex-foundation/umi';
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

	//const umi = createUmi("https://devnet.helius-rpc.com/?api-key=c7260fbe-27cf-4a2b-a51b-a070101c082a").use(walletAdapterIdentity({ publicKey, signTransaction, signAllTransactions })).use(mplBubblegum()).use(mplTokenMetadata());
	const umi = createUmi("https://mainnet.helius-rpc.com/?api-key=c7260fbe-27cf-4a2b-a51b-a070101c082a").use(walletAdapterIdentity({ publicKey, signTransaction, signAllTransactions })).use(mplBubblegum()).use(mplTokenMetadata());

	const maxDepthSizePair: ValidDepthSizePair = {
		maxDepth: 14,
		maxBufferSize: 64,
	};

	const checkData = async () => {
		const data = await ScrapAddress();
		console.log(data);
	}

	const generateTree = async () => {
		const data = await ScrapAddress();
		let nb = 0;
		//const { merkleTree, collectionAddress } = await Generate(umi, maxDepthSizePair);
		const merkleTree = publickeyMeta("GfKZz5Nf1cuHzdG2z1pRkF9WVCjhTuuNs5BBsHRrk5nY");
		const collectionAddress = publickeyMeta("GkaTLxjWvqUdVjgMuoXdQPKrTqDCUkcWY2UWKGXACspV");
		data.forEach(async (address) => {
			console.log(nb++);
			let last = Math.floor(Date.now());
			while (1) {
				let now = Math.floor(Date.now());
				if (now >= last + 3000) {
					last = Math.floor(Date.now());
					break;
				}
			}
			console.log(address.length);
			await mintFunction(umi, address, merkleTree, collectionAddress);
		});
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
					<button className="border p-1 rounded my-3" onClick={checkData}>Check the fellow in console.log</button>
					<div className="flex items-center justify-center flex-col">
						<img src={urlIpfs} style={{ maxWidth: '15%' }} />
					</div>
					<Button className="mt-10" type="primary" onClick={generateTree}>Mint all Token</Button>
				</div>
			</div>}
		</div>
	);
}
