"use client";
import Payement from '../components/Payement'
import ShimmerButton from '@/components/magicui/shimmer-button'

export default function HomePage() {
	return (
		<div>
			<div className='mt-3 flex justify-center items-center'>
				<h1 className='text-5xl border-4 border-black '>Put the price</h1>
			</div>
			<Payement />
			<div className='bg-red flex justify-center items-center'>
			</div>
		</div>
	)
}