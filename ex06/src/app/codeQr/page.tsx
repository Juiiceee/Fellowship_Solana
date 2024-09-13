"use client";
import { createQR, encodeURL, EncodeURLComponents} from "@solana/pay";
import { Keypair, PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

export default function Checkout() {
  const Searchrouter = useSearchParams();

  const posiQr = useRef<HTMLDivElement>(null)

  const amount = Searchrouter.get('amount');
  const bigNumberAmount = new BigNumber(amount || '0');
  

  const reference = useMemo(() => Keypair.generate().publicKey, []);

  const urlParams: EncodeURLComponents = {
    recipient: new PublicKey('GyETGp22PjuTTiQJQ2P9oAe7oioFjJ7tbTBr1qiXZoa8'),
    splToken: new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'),
    bigNumberAmount,
    reference,
    label: 'Payment for friends',
    message: 'Thanks for your payment!',
  }
  const url = encodeURL(urlParams)
  useEffect(() => {
    const qr = createQR(url, 512, 'transparent')
    if (posiQr.current && bigNumberAmount.isGreaterThan(0)) {
      posiQr.current.innerHTML = ''
      qr.append(posiQr.current)
    }
  })

  const router = useRouter();

  return (
    <div className="flex flex-col items-center gap-8">
      <button onClick={() => {router.back()}} className="border border-black px-2 "> Return</button>

      <h2 className="text-5xl font-bold">Cost ${bigNumberAmount.toString()}</h2>
      <div ref={posiQr} />
    </div>
  )
}
