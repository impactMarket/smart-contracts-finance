import { formatEther } from "@ethersproject/units";
import {BigNumberish} from "ethers";

export function toEther(value: number | string): BigInt {
	return BigInt(value) * BigInt(1e18);
}

export function fromEther(value: number | string | BigNumberish): string {
	return formatEther(value.toString());
}



