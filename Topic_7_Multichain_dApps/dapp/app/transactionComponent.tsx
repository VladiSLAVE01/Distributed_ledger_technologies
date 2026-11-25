"use client";
import { useState } from "react";
import { parseGwei, isAddress, getAddress } from "viem";
import { ConnectWalletClient } from "./client";

export default function TransactionComponent() {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (evt: React.ChangeEvent<HTMLInputElement>) =>
      setter(evt.target.value);

  async function handleClick() {
    try {
      if (!isAddress(recipient)) {
        alert("Некорректный адрес получателя");
        return;
      }
      if (!amount || isNaN(Number(amount))) {
        alert("Введите корректную сумму в GWei");
        return;
      }

      const walletClient = ConnectWalletClient();
      const [account] = await walletClient.getAddresses();
      const to = getAddress(recipient);

      const hash = await walletClient.sendTransaction({
        account,
        to,
        value: parseGwei(amount),
      });

      alert(`Transaction successful. Transaction Hash: ${hash}`);
    } catch (error) {
      alert(
        `Transaction failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  return (
    <div className="card">
      <label>
        Amount:
        <input
          placeholder="GWei"
          value={amount}
          onChange={setValue(setAmount)}
        ></input>
      </label>
      <br />

      <label>
        Recipient:
        <input
          placeholder="Address"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <button
        className="px-8 py-2 rounded-md flex flex-row items-center justify-center bg-green-600 text-white"
        onClick={handleClick}
      >
        Send Transaction
      </button>
    </div>
  );
}