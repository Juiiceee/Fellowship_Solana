import { mintToCollectionV1 } from "@metaplex-foundation/mpl-bubblegum";
import { KeypairSigner, publicKey, Umi } from "@metaplex-foundation/umi";
import data from '@/../data.json';
import { PublicKey as MetaplexPublicKey } from "@metaplex-foundation/umi-public-keys";

export async function mintFunction(umi: Umi, leaf: string, merkleTree: MetaplexPublicKey, collectionAddress: MetaplexPublicKey) {

	const txMint = await mintToCollectionV1(umi, {
		leafOwner: publicKey(leaf),
		merkleTree: merkleTree,
		collectionMint: collectionAddress,
		metadata: {
			name: data.name,
			uri: "https://github.com/Juiiceee/Fellowship_Solana/blob/main/ex08/data.json",
			sellerFeeBasisPoints: 0,
			collection: { key: collectionAddress, verified: false },
			creators: [
				{
					address: umi.identity.publicKey,
					verified: false,
					share: 100,
				},
			],
		},
	}).sendAndConfirm(umi, { send: { commitment: 'finalized' } });

	//await new Promise(resolve => setTimeout(resolve, 5000));
	console.log("Mint", txMint, "owner", publicKey(leaf));
}