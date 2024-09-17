"use client";
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ShimmerButton from '@/components/magicui/shimmer-button'

export default function Payement() {
	const router = useRouter();

	const [amount, setAmount] = useState(0);
	return (
		<>
			<div>
				<div className="flex justify-center">
					<h2 className='text-2xl font-bold'>Le montant est de : {amount}</h2>
				</div>
				<div className="flex justify-center">
					<button className="bg-white border border-black rounded text-black px-2 mr-5 mt-2" onClick={() => setAmount(amount - 1)}>-1</button>
					<button className="bg-white border border-black rounded text-black px-2 mr-5 mt-2" onClick={() => setAmount(amount - 5)}>-5</button>
					<button className="bg-white border border-black rounded text-black px-2 mr-5 mt-2" onClick={() => setAmount(amount - 10)}>-10</button>
					<button className="bg-white border border-black rounded text-black px-2 mr-5 mt-2" onClick={() => setAmount(amount - 100)}>-100</button>
					<button className="bg-white border border-black rounded text-black px-2 mr-5 mt-2" onClick={() => setAmount(amount + 1)}>+1</button>
					<button className="bg-white border border-black rounded text-black px-2 mr-5 mt-2" onClick={() => setAmount(amount + 5)}>+5</button>
					<button className="bg-white border border-black rounded text-black px-2 mr-5 mt-2" onClick={() => setAmount(amount + 10)}>+10</button>
					<button className="bg-white border border-black rounded text-black px-2 mr-5 mt-2" onClick={() => setAmount(amount + 100)}>+100</button>
				</div>
			</div>
			<div className='flex justify-center items-center'>
				<ShimmerButton shimmerDuration={(amount <= 0 ? "100s" : "3s")} background={(amount <= 0 ? "rgba(80, 0, 0, 1)" : "rgba(0, 0, 0, 1)")} className='px-5 py-2 mt-10' disabled={(amount <= 0 ? true : false)} onClick={() => { router.push("/codeQr?amount=" + amount) }}>
					<span className='text-white'>
						Display qrcode
					</span>
				</ShimmerButton>


			</div>
		</>
	)
}
