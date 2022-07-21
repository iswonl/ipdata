import { App } from "./app"
import BN from "bn.js"

async function main() {
  const app = new App()
  await app.init()
  const dataKeypair = await app.createIPDataAccount([new BN(1)])
  const data = await app.readIPDataAccount(dataKeypair.publicKey)
  console.log("account: " + dataKeypair)
  console.log("data: " + data)
}

main()
  .then(() => process.exit(0))
  .catch((err) => console.error(err))
