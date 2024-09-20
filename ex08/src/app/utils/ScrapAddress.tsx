"use server";
import fs from 'fs';

export default async function ScrapAddress(): Promise<string[]> {
	const data = fs.readFileSync('./address.txt',
		{ encoding: 'utf8', flag: 'r' }).split('\n');

	return (data);
}
