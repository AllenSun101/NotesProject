"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { fetchFromIPFS, uploadToIPFS } from "../utils/ipfs";
import contractABI from "../utils/NotesApp.json";

const CONTRACT_ADDRESS = "0x1B837A2F68DB5fAEdc2E8f4a6da65D5C5cC888FB";

export default function NotesList({ signer }: { signer: ethers.Signer }) {
    const [notes, setNotes] = useState<{ cid: string; content: string }[]>([]);

    async function loadNotes() {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
        const userAddress = await signer.getAddress();
        const cids: string[] = await contract.getNotes(userAddress);

        const fetched = await Promise.all(
        cids.map(async (cid) => ({
            cid,
            content: await fetchFromIPFS(cid)
        }))
        );
        setNotes(fetched);
    }

    useEffect(() => {
        loadNotes();
    }, []);

    return (
        <div>
        <h2 className="text-xl mb-2">Your Notes</h2>
        {notes.map((note, idx) => (
            <div key={idx} className="border p-2 mb-2">
            <textarea
                defaultValue={note.content}
                className="w-full border p-1"
                rows={3}
                onBlur={async (e) => {
                    const newContent = e.target.value;
                    const newCid = await uploadToIPFS(newContent);

                    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
                    const tx = await contract.updateNote(idx, newCid);
                    await tx.wait();

                    loadNotes(); // refresh after update
                }}
            />
            </div>
        ))}
        <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={async () => {
                const emptyCid = await uploadToIPFS("");
                const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
                const tx = await contract.addNote(emptyCid);
                await tx.wait();
                loadNotes();
            }}
            >
            + New Note
        </button>
        </div>
    );
}
