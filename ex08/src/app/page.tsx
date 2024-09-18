"use client";
import React, { useMemo } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createTree, mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'
import { clusterApiUrl, Connection } from "@solana/web3.js";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { generateSigner } from '@metaplex-foundation/umi';
import { ValidDepthSizePair } from "@solana/spl-account-compression";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

export default function Home() {
	const [urlIpfs, setUrlIpfs] = React.useState("");
	const { publicKey, signTransaction, signAllTransactions, wallet } = useWallet();
	const ipfsUrl = 'https://plum-accurate-bobcat-724.mypinata.cloud/ipfs/QmVnoYjK4ZyDZrJhtMTTQxAyiY1iuKMdSiaomNKhAU6vvg';

	const umi = createUmi("https://api.devnet.solana.com").use(walletAdapterIdentity({publicKey, signTransaction, signAllTransactions})).use(mplBubblegum()).use(mplTokenMetadata());
	// umi.use(walletAdapterIdentity(wallet));

	const maxDepthSizePair: ValidDepthSizePair = {
		maxDepth: 14,
		maxBufferSize: 64,
	  };

	const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

	const generateTree = async () => {
		const merkleTree = generateSigner(umi);

		const builder = await createTree(umi, {
			merkleTree,
			maxDepth: maxDepthSizePair.maxDepth,
			maxBufferSize: maxDepthSizePair.maxBufferSize,
			public: false,
		});

		await builder.sendAndConfirm(umi);
	}
}

return (
	<div>
		<HomeClient />
		{wallet && <div>
			<div className="mt-5 inline-block text-center p-2 border-2 border-white">
				<BlurIn className="text-center" word={"Mint Token for all FellowShip Member"}></BlurIn>
			</div>
			<div className="flex items-center justify-center flex-col">
				<Input className="w-1/2 mt-10 mb-10" placeholder="Url cNFT" value={urlIpfs} onChange={(e) => { setUrlIpfs(e.target.value) }} />
				<span>{ipfsUrl}</span>
				<div className="flex items-center justify-center flex-col">
					<img src={urlIpfs} style={{ maxWidth: '50%' }} />
				</div>
				<Button className="mt-10" type="primary">Mint all Token</Button>
			</div>
		</div>}
	</div>
);
}
