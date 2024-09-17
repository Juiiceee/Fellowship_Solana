"use client";
import { createQR, encodeURL } from "@solana/pay";
import { Keypair, PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { usdToSol } from "@/components/calc";
import ShimmerButton from "@/components/magicui/shimmer-button";

export default function Checkout() {
	const Searchrouter = useSearchParams();

	const posiQr = useRef<HTMLDivElement>(null)

	const amount = Searchrouter.get('amount');
	const bigNumberAmount = new BigNumber(usdToSol(amount) || '0');


	const reference = useMemo(() => Keypair.generate().publicKey, []);

	const url: URL = encodeURL({
		recipient: new PublicKey('GyETGp22PjuTTiQJQ2P9oAe7oioFjJ7tbTBr1qiXZoa8'),
		amount: bigNumberAmount,
		reference,
		label: 'Payment for friends',
		message: 'Thanks for your payment!',
	});

	console.log(url.toString())
	useEffect(() => {
		const qr = createQR(url, 512, 'transparent', "white")
		if (posiQr.current) {
			posiQr.current.innerHTML = ''
			qr.append(posiQr.current)
		}
	})

	const router = useRouter();

	return (
		<div className="flex flex-col items-center gap-8">
			<ShimmerButton className='px-5 py-2 mt-10' onClick={() => { router.back() }}>
				<span className='text-white'>
					Return
				</span>
			</ShimmerButton>
			<h2 className="text-5xl font-bold">Cost {bigNumberAmount.toString()} SOL</h2>
			<div ref={posiQr} />
		</div>
	)
}
