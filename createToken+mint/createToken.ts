import {
	Connection,
	PublicKey,
	clusterApiUrl,
	Keypair,
	Transaction,
	sendAndConfirmTransaction,
  } from '@solana/web3.js';
  import {
	Token,
	TOKEN_PROGRAM_ID,
	AccountLayout,
	ASSOCIATED_TOKEN_PROGRAM_ID,
	u64
  } from '@solana/spl-token';
  
  async () => {
	const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  
	const payer = Keypair.generate();
  
	const airdropSignature = await connection.requestAirdrop(
		payer.publicKey,
		2e9
	);
	await connection.confirmTransaction(airdropSignature);
  
	const mintAuthority = Keypair.generate();
  
	const token = await Token.createMint(
		connection,
		payer,
		mintAuthority.publicKey,
		null,
		9,
		TOKEN_PROGRAM_ID
	);
  
	// Génération d'une nouvelle adresse associée pour le token
	const payerTokenAccount = await token.getOrCreateAssociatedAccountInfo(
		payer.publicKey
	);
  
	// Mint de quelques tokens pour l'account du payer
	await token.mintTo(
		payerTokenAccount.address,
		mintAuthority.publicKey,
		[],
		1000000 // 1 token (en comptant les décimales)
	);
  
	console.log('Token créé avec succès!');
	console.log('Adresse du token:', token.publicKey.toBase58());
	console.log('Account associé du payer:', payerTokenAccount.address.toBase58());
  }
  