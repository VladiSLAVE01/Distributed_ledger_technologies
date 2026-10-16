import { ethers } from "ethers";

export const providerUrl = "https://ethereum-sepolia-rpc.publicnode.com";
export const provider = new ethers.JsonRpcProvider(providerUrl);