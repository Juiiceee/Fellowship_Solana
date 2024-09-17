export function usdToSol(nb: string | null) {
	if (nb === null) {
		return null;
	}
	
	return Number(nb) / 137;
}