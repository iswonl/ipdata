import { App } from "./app"

async function main() {
  const app = new App()
  await app.init()
}

main()
  .then(() => process.exit(0))
  .catch((err) => console.error(err))
