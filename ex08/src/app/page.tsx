"use client";
import React, { useEffect, useState } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createTree, mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { generateSigner, percentAmount } from '@metaplex-foundation/umi';
import { ValidDepthSizePair } from "@solana/spl-account-compression";
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import data from '@/../data.json';
import HomeClient from '@/components/client';
import BlurIn from '@/components/magicui/blur-in';
import { Button, Input } from 'antd';
import { mintFunction } from './utils/Mint';

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
		const merkleTree = generateSigner(umi);
		console.log("MerkleTree:", merkleTree);

		const Tree = await createTree(umi, {
			merkleTree,
			maxDepth: maxDepthSizePair.maxDepth,
			maxBufferSize: maxDepthSizePair.maxBufferSize,
			public: false,
		});
		console.log("Tree:", Tree);
		await Tree.sendAndConfirm(umi);

		const collectionAddress = generateSigner(umi);
		console.log("collectionAddress:", collectionAddress);

		const Nft = createNft(umi, {
			mint: collectionAddress,
			name: data.name,
			symbol: data.symbol,
			uri: "https://github.com/Juiiceee/Fellowship_Solana/blob/main/ex08/data.json",
			sellerFeeBasisPoints: percentAmount(0),
			isCollection: true,
		});
		console.log("Nft:", Nft);
		await Nft.sendAndConfirm(umi);

		mintFunction(umi, merkleTree, collectionAddress, data);
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
