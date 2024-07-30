import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

async function main() {
	const connection = new Connection("https://api.devnet.solana.com");
	const payer = Keypair.fromSecretKey(Uint8Array.from());

	const receiver = new PublicKey("GyETGp22PjuTTiQJQ2P9oAe7oioFjJ7tbTBr1qiXZoa8");
	const transaction = new Transaction().add(
		SystemProgram.transfer({
			fromPubkey: payer.publicKey,
			toPubkey: receiver,
			lamports: 1000000000,
		})
	);
	transaction.feePayer = payer.publicKey,
	transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
	transaction.partialSign(payer);
	const signature = await connection.sendRawTransaction(transaction.serialize());
	console.log(signature);
}

main();