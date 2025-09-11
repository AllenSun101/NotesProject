async function main() {
  const Notes = await ethers.getContractFactory("Notes");
  console.log("Deploying contract...");

  const contract = await Notes.deploy();

  await contract.waitForDeployment();

  console.log("Contract deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
