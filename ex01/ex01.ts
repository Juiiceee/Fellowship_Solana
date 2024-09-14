#!/usr/bin/env node

import { Command } from 'commander';
import { Connection, Keypair, clusterApiUrl, PublicKey, BlockheightBasedTransactionConfirmationStrategy, Transaction, SystemProgram, sendAndConfirmTransaction } from "@solana/web3.js"
import bs58 from "bs58";


const program = new Command();
let connection = new Connection(clusterApiUrl("devnet"));

program
  .name('Generate')
  .description('Generate Keypair')
	.action(() => {
		generateKeypair();
});

async function generateKeypair() {
	const key = Keypair.generate();
	console.log("Private key String: " + bs58.encode(key.secretKey) + "\nPrivate array secret key: " + Array.from(key.secretKey));
	console.log("Public key String: " + key.publicKey.toBase58());

}

program
  .name('aidrop')
  .description('Handle airdrop')
	.action((amount: string, pubKey: PublicKey) => {
		let montant = Number(amount);
		handleAirdrop(montant, pubKey);
});

async function handleAirdrop(montant: number, PublicKey: PublicKey)
{
	const airdroped = await connection.requestAirdrop(PublicKey, montant);
	const block = (await connection.getLatestBlockhash());

	const confirm: BlockheightBasedTransactionConfirmationStrategy = {
		signature: airdroped,
		blockhash: block.blockhash,
		lastValidBlockHeight: block.lastValidBlockHeight,
	};
	await connection.confirmTransaction(confirm);
	console.log("good");
}

program
  .name('send')
  .description('Send Money')
	.action((amount: string, pubKey: PublicKey, privKey: string) => {
		let privateKey = Keypair.fromSecretKey(bs58.decode(privKey));

		let montant = Number(amount);
		send(montant, privateKey, pubKey);
});

async function send(montant: number, PrivateKey: Keypair, PublicKey: PublicKey)
{
	const transaction = new Transaction().add(
		SystemProgram.transfer({
			fromPubkey: PrivateKey.publicKey,
			toPubkey: PublicKey,
			lamports: montant,
		}));
	await sendAndConfirmTransaction(connection, transaction, [PrivateKey]);
	console.log("good");
}

program
  .name('balance')
  .description('Balance account')
	.action(async (pubKey: PublicKey) => {
		const bal = await connection.getBalance(pubKey);
		console.log("Account: {}\nBalance: {}", pubKey, bal);
});


program.parse(process.argv);