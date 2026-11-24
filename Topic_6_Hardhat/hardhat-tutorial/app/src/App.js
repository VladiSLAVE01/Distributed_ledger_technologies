import { useState } from 'react'
import './App.css'
function App() {
    const [account, setAccount] = useState('')
    const [tokens, setTokens] = useState('no')

    return (
        <>
        <h1>Token vending machine</h1>
        <h3>Current account {account} has {tokens} Tokens</h3>
        </>
    )
}

export default App

