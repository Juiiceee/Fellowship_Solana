"use client";
import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
				<button disabled={(amount <= 0? true: false)} className="bg-black text-white rounded px-5 py-2 mt-10" onClick={() => { router.push("/codeQr?amount=" + amount) }}>
					Display qrcode
				</button>
			</div>
		</>
	)
}
