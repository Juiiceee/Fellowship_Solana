import { Connection, Keypair, clusterApiUrl } from '@solana/web3.js';
import { MerkleTree } from '@metaplex-foundation/mpl-bubblegum';
import { useWallet } from '@solana/wallet-adapter-react';

export default function ActionButton() {
	const { wallet } = useWallet();
	const connection = new Connection(clusterApiUrl('devnet'));

	// Créer un portefeuille
	const payer = Keypair.generate();

	// Créer un arbre Merkle
	const tree = await MerkleTree.create(connection, payer, {
		maxDepth: 14,   // Définissez la profondeur de l’arbre pour la compression
		maxBufferSize: 64
	});

	console.log("Merkle Tree Created:", tree.publicKey.toBase58());
	return ()
}