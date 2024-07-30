import {Keypair} from "@solana/web3.js";

async function main() {
	const account = Keypair.generate();
	console.log("public key: ", account.publicKey.toBase58(), "\n private key: ", account.secretKey);
}

main();