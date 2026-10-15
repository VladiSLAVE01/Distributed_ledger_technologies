import { useState } from "react";
import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import * as secp from "ethereum-cryptography/secp256k1";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const transaction = {
      sender: address,
      amount: parseInt(sendAmount),
      recipient: recipient,
    };

    const messageHash = keccak256(
      new TextEncoder().encode(JSON.stringify(transaction))
    );

    const signature = secp.secp256k1.sign(messageHash, privateKey);

    const signedTransaction = {
      ...transaction,
      hexSign: signature.toCompactHex(),
    };

    console.log("trx: ", signedTransaction);

    try {
      const {
        data: { balance },
      } = await server.post(`send`, signedTransaction);
      setBalance(balance);
    } catch (ex) {
      alert(ex.response?.data?.message || ex.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        />
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address"
          value={recipient}
          onChange={setValue(setRecipient)}
        />
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;