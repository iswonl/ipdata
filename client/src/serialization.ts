import lo from "buffer-layout"
import BN from "bn.js"

export interface IPData {
  ip_array: BN[]
}

export function decodeIPData(data: Buffer): IPData {
  let ipdataSchema = lo.struct([lo.u32("size"), lo.seq(lo.ns64(), (data.length - 4) / 8, "ip_array")])
  return ipdataSchema.decode(data)
}

export function encodeIPData(
  ip_data: IPData
): Buffer {
  const ip_array = ip_data.ip_array
  const schema = lo.struct([lo.u32("size"), lo.seq(lo.ns64(), ip_array.length, "ip_array")])
  const b = Buffer.alloc(4 + 8 * ip_array.length)
  schema.encode({size: ip_array.length, ip_array: ip_array }, b)
  return Buffer.from(b)
}
