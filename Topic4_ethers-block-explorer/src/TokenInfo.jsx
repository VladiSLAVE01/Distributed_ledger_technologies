import { useState, useEffect } from "react";
import { ethers } from "ethers";

// Адрес контракта USDC в сети Sepolia
const tokenAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

// ABI — минимальный набор функций, которые мы хотим вызвать
const abi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)"
];

function TokenInfo({ provider }) {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");

  // Загружаем информацию о токене при старте
  useEffect(() => {
    async function loadTokenInfo() {
      try {
        const contract = new ethers.Contract(tokenAddress, abi, provider);
        const name = await contract.name();
        const symbol = await contract.symbol();
        const decimals = await contract.decimals();
        const totalSupply = await contract.totalSupply();
        setName(name);
        setSymbol(symbol);
        setTotalSupply(ethers.formatUnits(totalSupply, decimals));
      } catch (err) {
        console.error("Ошибка при загрузке данных токена:", err);
      }
    }
    loadTokenInfo();
  }, [provider]);

  // Обработчик изменения адреса для запроса баланса
  async function onAddressChange(evt) {
    const addr = evt.target.value;
    setAddress(addr);
    if (!addr) { setBalance(""); return; }
    try {
      const contract = new ethers.Contract(tokenAddress, abi, provider);
      const decimals = await contract.decimals();
      const raw = await contract.balanceOf(addr);
      setBalance(ethers.formatUnits(raw, decimals));
    } catch (err) {
      setBalance("ошибка: " + err.message);
    }
  }

  return (
    <div className="container">
      <h1>Token Info (USDC / Sepolia)</h1>
      <p><b>Name:</b> {name}</p>
      <p><b>Symbol:</b> {symbol}</p>
      <p><b>Total supply:</b> {totalSupply}</p>
      <label>
        Check balance of address:
        <input
          placeholder="0x..."
          value={address}
          onChange={onAddressChange}
        />
      </label>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default TokenInfo;