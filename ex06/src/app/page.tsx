import Products from '../components/Payement'

export default function HomePage() {
	return (
		<div>
			<div className='flex justify-center items-center'>
				<h1 className='text-5xl border-4 border-black '>Put the price</h1>
			</div>
			<Products />
			<div className='bg-red flex justify-center items-center'>
			</div>
		</div>
	)
}
