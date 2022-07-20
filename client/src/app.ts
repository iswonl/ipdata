import { readFileSync } from "fs"
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Tran saction,
  TransactionInstruction,
} from "@solana/web3.js"
import {
  IPData,
  encodeIPData,
  decodeIPData,  
} from "./serialization"
import BN from "bn.js"

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export class App {
  adminKeypair: Keypair
  programKeypair: Keypair
  connection: Connection

  constructor() {
    this.adminKeypair = App.readKeypairFromPath(__dirname + "/../../localnet/admin.json")
    this.programKeypair = App.readKeypairFromPath(__dirname + "/../../localnet/program.json")
    this.connection = new Connection("http://localhost:8899", "confirmed")
  }

  async init() {
    const res = await this.connection.getAccountInfo(this.programKeypair.publicKey)
    if (!res) {
      console.error("Counter is not deployed. Deploy it first.")
      process.exit(1)
    }
    console.log("admin", this.adminKeypair.publicKey.toBase58())
    console.log("program", this.programKeypair.publicKey.toBase58())
  }

  async createIPDataAccount(ip_array: Array<BN>) {
    const dataKeypair = Keypair.generate();
    console.log(`ipdata key: ${dataKeypair.publicKey.toBase58()}`);
    const saveIPData = new TransactionInstruction({
      programId: this.programKeypair.publicKey,
      keys: [
        { pubkey: this.adminKeypair.publicKey, isSigner: true, isWritable: true, },
        { pubkey: dataKeypair.publicKey, isSigner: false, isWritable: true },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data: encodeIPData(ip_array),
    })

    const tx = new Transaction().add(saveIPData)
    const txHash = await this.connection.sendTransaction(
      tx,
      [dataKeypair, this.adminKeypair],
      { preflightCommitment: "max" }
    )
    console.log("save ip data tx", txHash)
    await delay(3000)
    return dataKeypair
  }

  static readKeypairFromPath(path: string): Keypair {
    const data = JSON.parse(readFileSync(path, "utf-8"))
    return Keypair.fromSecretKey(Buffer.from(data))
  }
}
