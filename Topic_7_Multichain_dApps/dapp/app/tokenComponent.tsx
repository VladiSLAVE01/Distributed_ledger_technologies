"use client";
import { getContract, Address } from "viem";
import { contractAbi } from "./abi";
import { ConnectWalletClient } from "./client";
import { useState } from "react";
export default function TokenComponent() {
    const [contractAddress, setContractAddress] = useState("");
    const [tokenId, setTokenId] = useState();
    const setValue = (setter:any) => (evt:any) => setter(evt.target.value);
    const walletClient = ConnectWalletClient();

    async function buttonClick() {
        const checkedAddress = contractAddress as Address;
        const contract = getContract({
            address: checkedAddress,
            abi: contractAbi,
            client: walletClient,
        });
        console.log("Connected to Contract: ", contract);

        const symbol = await contract.read.symbol();
        const name = await contract.read.name();

        console.log(`Symbol: ${symbol}\nName: ${name}\n`);
        const token_id = BigInt(tokenId);
        const owner = await contract.read.ownerOf([token_id]);
        alert(`Symbol: ${symbol}\nName: ${name}\nOwner of token_id = ${token_id}`)
    }

        return (
            <div className="card">
                <label>
                Address:
                <input
                    placeholder="Smart Contract Instance"
                    value={contractAddress}
                    onChange={setValue(setContractAddress)}
                ></input>
                </label>
                <br />
                <label>Token Id:
                <input placeholder="1" value={tokenId} onChange={setValue(setTokenId)}></input> 
                </label>
                    <button
                    className="px-8 py-2 rounded-md flex flex-row items-center justi"
                    onClick={ buttonClick }>
                <h1 className="text-center">Token Info</h1>
            </button>
        </div>
    );
}