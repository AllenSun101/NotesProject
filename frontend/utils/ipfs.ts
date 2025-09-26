import { create } from "ipfs-http-client";

const client = create({
  url: "https://ipfs.infura.io:5001/api/v0"
});

export async function uploadToIPFS(content: string): Promise<string> {
  const { cid } = await client.add(content);
  return cid.toString();
}

export async function fetchFromIPFS(cid: string): Promise<string> {
  const res = await fetch(`https://ipfs.io/ipfs/${cid}`);
  return await res.text();
}
