import { readFileSync } from "fs"
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
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
  dataPubkey: PublicKey
  programKeypair: Keypair
  connection: Connection

  constructor() {
    this.adminKeypair = App.readKeypairFromPath(__dirname + "/../../localnet/admin.json")
    this.dataPubkey = new PublicKey(0)
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
    console.log("data", this.dataPubkey.toBase58())
    console.log("program", this.programKeypair.publicKey.toBase58())
  }

  async saveIP(ip_array: Array<BN>) {
    var saveIP = new TransactionInstruction({
      programId: this.programKeypair.publicKey,
      keys: [
        {
          pubkey: this.adminKeypair.publicKey,
          isSigner: true,
          isWritable: true,
        },
        { pubkey: this.dataPubkey, isSigner: false, isWritable: true },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data: encodeIPData(ip_array),
    })

    const tx = new Transaction().add(saveIP)
    const txHash = await this.connection.sendTransaction(
      tx,
      [this.dataPubkey, this.adminKeypair],
      { preflightCommitment: "max" }
    )
    console.log("save ip data tx", txHash)
    await delay(3000)
  }

  async readIPDataAccount(): Promise<IPData> {
    const account = await this.connection.getAccountInfo(this.dataPubkey)
    if (!account) {
      console.error("ip data account is not found")
      process.exit(1)
    }
    return decodeIPData(account.data)
  }

  async createIPData() {
    const data = encodeIPData([new BN(1)])
    const lamports = await this.connection.getMinimumBalanceForRentExemption(data.length)
    const createAccountIx = SystemProgram.createAccountWithSeed({
      fromPubkey: this.adminKeypair.publicKey,
      basePubkey: this.dataPubkey,
      seed: "",
      newAccountPubkey: this.dataPubkey,
      space: data.length,
      lamports: lamports,
      programId: this.programKeypair.publicKey,
    })

    const tx = new Transaction().add(createAccountIx)
    const res = await this.connection.sendTransaction(tx, [this.adminKeypair])
    console.log("create ip data tx", res)
    await delay(3000)
  }

  static readKeypairFromPath(path: string): Keypair {
    const data = JSON.parse(readFileSync(path, "utf-8"))
    return Keypair.fromSecretKey(Buffer.from(data))
  }
}
