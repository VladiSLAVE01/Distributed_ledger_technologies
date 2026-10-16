import { useEffect } from "react";
import { provider } from "./provider";
import BalanceReader from "./BalanceReader";
import BlockExplorer from "./BlockExplorer";
import VendingMachine from "./VendingMachine";
import TokenInfo from "./TokenInfo"; // 1. Добавляем импорт
import './App.css';

function App() {
  useEffect(() => {
    async function getNetwork() {
      const network = await provider.getNetwork();
      console.log(network);
    }
    getNetwork();
  }, []);

  return (
    <>
      <BalanceReader provider={provider} />
      <BlockExplorer provider={provider} />
      <VendingMachine provider={provider} />
      <TokenInfo provider={provider} />
    </>
  );
}

export default App;