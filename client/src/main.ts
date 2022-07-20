import { App } from "./app"

async function main() {
  const app = new App()
  await app.init()
  const dataKeypair = await app.createIPDataAccount([1,2,3])
  console.log(dataKeypair)
}

main()
  .then(() => process.exit(0))
  .catch((err) => console.error(err))
