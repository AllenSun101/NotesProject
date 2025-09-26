'use client'

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import NotesList from "./NotesList";

import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

export default function App() {
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  async function connectWallet() {
    if (!window.ethereum) return alert("Install MetaMask!");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    setSigner(provider.getSigner());
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">IPFS Notes dApp</h1>
      {!signer ? (
        <button
          className="bg-green-500 text-white px-3 py-1 rounded"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : (
        <NotesList signer={signer} />
      )}
    </div>
  );
}
