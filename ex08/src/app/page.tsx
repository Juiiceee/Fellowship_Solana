"use client";
import HomeClient from "@/components/client";
import Image from "next/image";
import React from 'react';
import { Button, Flex, Input } from 'antd';
import { useWallet } from "@solana/wallet-adapter-react";

export default function Home() {
	const [urlIpfs, setUrlIpfs] = React.useState("");
	const { wallet } = useWallet();
	const ipfsUrl = 'https://plum-accurate-bobcat-724.mypinata.cloud/ipfs/QmVnoYjK4ZyDZrJhtMTTQxAyiY1iuKMdSiaomNKhAU6vvg';
	return (
		<div>
			<HomeClient />
			{wallet && <div>
				<div className="border border-white flex items-center justify-center">
					<h1 className="text-3xl">Mint Token for all FellowShip Member</h1>
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
