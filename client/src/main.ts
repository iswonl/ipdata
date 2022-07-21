import { App } from "./app"
import BN from "bn.js"

async function main() {
  const app = new App()
  await app.init()
  const dataKeypair = await app.createIPDataAccount({ip_array: [new BN(1), new BN(2), new BN(3)]})
  console.log("created account:", dataKeypair.publicKey.toBase58())
  const data = await app.readIPDataAccount(dataKeypair.publicKey)
  console.log("saved data:", JSON.stringify(data.ip_array))
}

main()
  .then(() => process.exit(0))
  .catch((err) => console.error(err))
