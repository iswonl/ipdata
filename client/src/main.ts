import { App } from "./app"
import BN from "bn.js"

async function main() {
  const app = new App()
  await app.init()
  const dataKeypair = await app.createIPDataAccount({ip_array: [new BN(1), new BN(2), new BN(3)]})
  const data = await app.readIPDataAccount(dataKeypair.publicKey)
  console.log("account: " + dataKeypair.publicKey)
  console.log("data: " + data.ip_array)
}

main()
  .then(() => process.exit(0))
  .catch((err) => console.error(err))
