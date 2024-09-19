import { createTree } from "@metaplex-foundation/mpl-bubblegum";
import { createNft } from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, percentAmount, Umi } from "@metaplex-foundation/umi";
import { ValidDepthSizePair } from "@solana/spl-account-compression";
import data from '@/../data.json';

export default async function Generate(umi: Umi, maxDepthSizePair: ValidDepthSizePair) {
	const merkleTree = generateSigner(umi);
	console.log("MerkleTree:", merkleTree);

	const Tree = await createTree(umi, {
		merkleTree,
		maxDepth: maxDepthSizePair.maxDepth,
		maxBufferSize: maxDepthSizePair.maxBufferSize,
		public: false,
	});
	console.log("Tree:", Tree);
	await Tree.sendAndConfirm(umi);

	const collectionAddress = generateSigner(umi);
	console.log("collectionAddress:", collectionAddress);

	const Nft = createNft(umi, {
		mint: collectionAddress,
		name: data.name,
		symbol: data.symbol,
		uri: "https://github.com/Juiiceee/Fellowship_Solana/blob/main/ex08/data.json",
		sellerFeeBasisPoints: percentAmount(0),
		isCollection: true,
	});
	console.log("Nft:", Nft);
	await Nft.sendAndConfirm(umi);

	return ({ merkleTree, collectionAddress, Nft });
}