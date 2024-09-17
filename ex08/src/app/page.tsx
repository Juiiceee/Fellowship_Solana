"use client";
import HomeClient from "@/components/client";
import React from 'react';
import { Button, Input } from 'antd';
import { useWallet } from "@solana/wallet-adapter-react";
import BlurIn from "@/components/magicui/blur-in";

export default function Home() {
	const [urlIpfs, setUrlIpfs] = React.useState("");
	const { wallet } = useWallet();
	const ipfsUrl = 'https://plum-accurate-bobcat-724.mypinata.cloud/ipfs/QmVnoYjK4ZyDZrJhtMTTQxAyiY1iuKMdSiaomNKhAU6vvg';
	return (
		<div>
			<HomeClient />
			{wallet && <div>
				<div className="mt-5 inline-block text-center p-2 border border-white">
					<BlurIn className="" word={"Mint Token for all FellowShip Member"}></BlurIn>
				</div>
				<div className="flex items-center justify-center flex-col">
					<Input className="w-1/2 mt-10 mb-10" placeholder="Basic usage" value={urlIpfs} onChange={(e) => { setUrlIpfs(e.target.value) }} />
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
