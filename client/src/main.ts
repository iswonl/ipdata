import { App } from "./app"
import BN from "bn.js"

async function main() {
  const app = new App()
  await app.init()
  const dataKeypair = await app.createIPDataAccount([new BN(1),new BN(2),new BN(3)])
  console.log(dataKeypair)
}

main()
  .then(() => process.exit(0))
  .catch((err) => console.error(err))
