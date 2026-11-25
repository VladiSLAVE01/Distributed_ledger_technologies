"use client";
import { useState } from "react";
import { ConnectWalletClient, ConnectPublicClient } from "./client";

export default function WalletComponent() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState<bigint>(BigInt(0));

  async function handleClick() {
    try {
      const walletClient = ConnectWalletClient();
      const publicClient = ConnectPublicClient();
      const [account] = await walletClient.getAddresses();
      const balance = await publicClient.getBalance({ address: account });
      setAddress(account);
      setBalance(balance);
    } catch (error) {
      alert(`Connect failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return (
    <div className="card">
      <Status address={address} balance={balance} />
      <button
        className="px-8 py-2 rounded-md flex flex-row items-center justify-center bg-blue-600 text-white"
        onClick={handleClick}
      >
        <h1 className="mx-auto">Connect Wallet</h1>
      </button>
    </div>
  );
}

function Status({
  address,
  balance,
}: {
  address: string | null;
  balance: bigint;
}) {
  if (!address) {
    return (
      <div className="flex items-center">
        <div className="border bg-red-600 border-red-600 rounded-full h-1.5 w-1.5 mr-2"></div>
        <div>Disconnected</div>
      </div>
    );
  }
  return (
    <div className="flex items-center w-full">
      <div className="border bg-green-500 border-green-500 rounded-full h-1.5 w-1.5 mr-2"></div>
      <div className="text-sm md:text-sm">
        {address} <br /> <b>Balance:</b> {balance.toString()} <b>Wei</b>
      </div>
    </div>
  );
}