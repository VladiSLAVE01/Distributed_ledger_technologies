const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const keccak256 = require("ethereum-cryptography/keccak.js").keccak256;
const secp256k1 = require("ethereum-cryptography/secp256k1").secp256k1;

app.use(cors());
app.use(express.json());

const balances = {
  "03fead43e8dd1695c5eee943ffb47760ea0a2aca45ef06e0715b47b3213915e985": 100,
  "02bfee2408c4ecad58d175acfc157c21a5957c3769e2777c3d179d6d185279f891": 50,
  "030255436767f30ef3dda257c32a610f9c4a25352c1560953c915f6ad4e3a79497": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const transaction = req.body;
  console.log("received trx:", transaction);

  const { sender, recipient, amount, hexSign } = transaction;

  // Восстанавливаем ровно ту структуру, которую подписывал клиент
  const message = { sender, amount, recipient };

  const messageHash = keccak256(
    new TextEncoder().encode(JSON.stringify(message))
  );

  const isSigned = secp256k1.verify(hexSign, messageHash, sender);
  console.log("Is signed:", isSigned);

  if (!isSigned) {
    return res.status(400).send({ message: "Not signed!" });
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    return res.status(400).send({ message: "Not enough funds!" });
  }

  balances[sender] -= amount;
  balances[recipient] += amount;
  res.send({ balance: balances[sender] });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}