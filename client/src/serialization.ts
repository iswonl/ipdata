import lo from "buffer-layout"
import BN from "bn.js"

export interface IPData {
  ip_data: BN[]
}

export function decodeIPData(data: Buffer): IPData {
  let ipdataSchema = lo.struct([lo.u32("size"), lo.seq(lo.ns64(), (data.length - 4) / 8, "ip_array")])
  return ipdataSchema.decode(data).ip_array
}

export function encodeIPData(
  ip_data: Array<BN>
): Buffer {
  const schema = lo.struct([lo.u32("size"), lo.seq(lo.ns64(), ip_data.length, "ip_array")])
  const b = Buffer.alloc(4 + 8 * ip_data.length)
  schema.encode({size: ip_data.length, ip_array: ip_data }, b)
  return Buffer.from(b)
}
