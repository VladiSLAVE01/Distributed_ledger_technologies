import { useState, useEffect } from "react";
import { ethers } from "ethers";

const vmContractAddress = "0x0D17C16BB7bD73Ef868cD452A1B10D069685249f";
const abi = [
  "function symbol() view returns (string)",
  "function getVendingMachineBalance() view returns (uint)",
  "function balanceOf(address addr) view returns (uint)",
  "function purchase(uint amount) payable returns ()"
];

function VendingMachine({ provider }) {
  const [writableContract, setWritableContract] = useState();
  const [address, setAddress] = useState("");
  const [symbol, setSymbol] = useState("");
  const [cupsInMachine, setCupsInMachine] = useState(0);
  const [purchaseCups, setPurchaseCups] = useState("");
  const [accountCups, setAccounCups] = useState(0);

  useEffect(() => {
    if (!symbol) { updateVendingMachineState(); }
    if (writableContract) { updateAccountCups(); }
  }, [symbol, writableContract]);

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function updateVendingMachineState() {
    const readOnlyContract = new ethers.Contract(vmContractAddress, abi, provider);
    const symbol = await readOnlyContract.symbol();
    setSymbol(symbol);
    const cupsInMachine = await readOnlyContract.getVendingMachineBalance();
    setCupsInMachine(cupsInMachine.toString());
  }

  async function connectWallet(evt) {
    evt.preventDefault();
    try {
      const walletProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await walletProvider.getSigner();
      const address = signer.address;
      setAddress(address);
      const writableContract = new ethers.Contract(vmContractAddress, abi, signer);
      setWritableContract(writableContract);
    } catch (exeption) {
      alert(exeption);
    }
  }

  async function updateAccountCups() {
    try {
      const accountCups = await writableContract.balanceOf(address);
      setAccounCups(accountCups.toString());
    } catch (exeption) {
      alert(exeption);
    }
  }

  async function purchaseCupcakes(evt) {
    evt.preventDefault();
    try {
      const tx = await writableContract.purchase(
        purchaseCups,
        { value: ethers.parseUnits(purchaseCups, 'gwei') }
      );
      await tx.wait();
      updateAccountCups();
      updateVendingMachineState();
    } catch (exeption) {
      alert(exeption);
    }
  }

  return (
    <>
      <div className="container">
        <h1>Vending Machine</h1>
        <div className="balance">TOTAL: {cupsInMachine} {symbol}</div>
      </div>
      <form>
        <input
          type="submit"
          className="button"
          value="Connect Wallet"
          onClick={connectWallet}
        />
        <label>Purchase Cupcakes
          <input
            placeholder="1, 2, 3..."
            value={purchaseCups}
            onChange={setValue(setPurchaseCups)}
          />
        </label>
        <input
          type="submit"
          className="button"
          value="Purchase"
          onClick={purchaseCupcakes}
          disabled={!writableContract}
        />
      </form>
      <div className="balance">YOU HAVE: {accountCups} {symbol}</div>
    </>
  );
}

export default VendingMachine;