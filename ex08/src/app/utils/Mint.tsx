import { mintToCollectionV1 } from "@metaplex-foundation/mpl-bubblegum";
import { KeypairSigner, publicKey, Umi } from "@metaplex-foundation/umi";
import data from '@/../data.json';

export async function mintFunction(umi: Umi, leaf: string, merkleTree: KeypairSigner, collectionAddress: KeypairSigner) {

	const mintNFT = mintToCollectionV1(umi, {
		leafOwner: publicKey(leaf),
		merkleTree: merkleTree.publicKey,
		collectionMint: collectionAddress.publicKey,
		metadata: {
			name: data.name,
			uri: "https://github.com/Juiiceee/Fellowship_Solana/blob/main/ex08/data.json",
			sellerFeeBasisPoints: 0,
			collection: { key: collectionAddress.publicKey, verified: false },
			creators: [
				{
					address: umi.identity.publicKey,
					verified: false,
					share: 100,
				},
			],
		},
	});
	const txMint = await mintNFT.sendAndConfirm(umi, {
		confirm: {
		  commitment: "confirmed",
		},
		send: {
		  commitment: "confirmed",
		  maxRetries: 0,
		},
	});
	console.log("Mint", txMint);
}