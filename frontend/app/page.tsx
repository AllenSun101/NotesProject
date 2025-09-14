'use client'

import { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../utils/NotesApp.json";
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

const CONTRACT_ADDRESS = "0x1B837A2F68DB5fAEdc2E8f4a6da65D5C5cC888FB";

export default function Home() {
  const [message, setMessage] = useState("");

  async function readMessage() {
    if (!window.ethereum) return alert("Install MetaMask!");
    const provider = new ethers.providers.Web3Provider(window.ethereum as unknown as ethers.providers.ExternalProvider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, provider);
    const msg = await contract.getMessage();
    setMessage(msg);
  }

  async function updateMessage(newMsg: any) {
    if (!window.ethereum) return alert("Install MetaMask!");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum as unknown as ethers.providers.ExternalProvider);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
    const tx = await contract.setMessage(newMsg);
    await tx.wait();
    readMessage();
  }

  return (
    <div>
      <h1 className="text-center py-12 text-2xl">Decentralized Notes App!</h1>
      <p>Message: {message}</p>
      <button onClick={readMessage}>Read</button>
      <button onClick={() => updateMessage("Hello chain!")}>Update</button>
    </div>
  );
}
