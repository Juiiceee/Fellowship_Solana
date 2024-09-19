import { mintToCollectionV1 } from "@metaplex-foundation/mpl-bubblegum";
import { publicKey } from "@metaplex-foundation/umi";

export async function mintFunction(umi: any, leaf: string, merkleTree: any, collectionAddress: any, data: any) {

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
	const txMint = await mintNFT.sendAndConfirm(umi);
	console.log("Mint", txMint);
}