"use client";
import { useState } from "react";
import { getContract, parseUnits, formatUnits, Address } from "viem";
import { ConnectWalletClient, ConnectPublicClient } from "./client";

const erc20Abi = [
  {
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const CONTRACT_ADDRESS =
  "0xFfc5A2a66Ab379A803F23cCA61b313431f787d3F" as Address;

export default function Erc20Component() {
  const [balance, setBalance] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [decimals, setDecimals] = useState<number>(18);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const setValue =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (evt: React.ChangeEvent<HTMLInputElement>) =>
      setter(evt.target.value);

  async function loadTokenInfo() {
    try {
      const publicClient = ConnectPublicClient();
      const walletClient = ConnectWalletClient();
      const [account] = await walletClient.getAddresses();

      const contract = getContract({
        address: CONTRACT_ADDRESS,
        abi: erc20Abi,
        client: publicClient,
      });

      const [sym, dec, bal] = await Promise.all([
        contract.read.symbol(),
        contract.read.decimals(),
        contract.read.balanceOf([account]),
      ]);

      setSymbol(sym);
      setDecimals(dec);
      setBalance(formatUnits(bal, dec));
      setStatus(`Загружено: ${sym}, баланс ${formatUnits(bal, dec)}`);
    } catch (error) {
      setStatus(
        `Ошибка чтения: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async function handleTransfer() {
    try {
      if (!recipient || !amount) {
        setStatus("Введите адрес и сумму");
        return;
      }
      const walletClient = ConnectWalletClient();
      const [account] = await walletClient.getAddresses();

      const contract = getContract({
        address: CONTRACT_ADDRESS,
        abi: erc20Abi,
        client: walletClient,
      });

      const parsedAmount = parseUnits(amount, decimals);

      setStatus("Отправка транзакции...");
      const hash = await contract.write.transfer(
        [recipient as Address, parsedAmount],
        { account }
      );
      setStatus(`Транзакция отправлена: ${hash}`);

      setTimeout(loadTokenInfo, 3000);
    } catch (error) {
      setStatus(
        `Ошибка перевода: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  return (
    <div className="card">
      <h2>ERC-20 Token Interaction</h2>
      <p>
        <b>Contract:</b> {CONTRACT_ADDRESS}
      </p>
      <p>
        <b>Symbol:</b> {symbol || "—"} | <b>Balance:</b> {balance || "—"}
      </p>

      <button
        className="px-8 py-2 rounded-md bg-blue-600 text-white"
        onClick={loadTokenInfo}
      >
        Load Token Info
      </button>

      <hr className="my-4" />

      <label>
        Recipient:
        <input
          placeholder="0x..."
          value={recipient}
          onChange={setValue(setRecipient)}
        />
      </label>
      <br />
      <label>
        Amount:
        <input
          placeholder="10"
          value={amount}
          onChange={setValue(setAmount)}
        />
      </label>
      <br />
      <button
        className="px-8 py-2 rounded-md bg-green-600 text-white"
        onClick={handleTransfer}
      >
        Transfer
      </button>

      {status && <p className="mt-4 text-sm">{status}</p>}
    </div>
  );
}