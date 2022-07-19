# Smart contract for saved ip data to blockchain


_Topics:_
- Basics about Solana programming model   
- Serialization and deserialization instruction_data and state in Rust using `borsh`
- Serialization and deserialization instruction_data and state on the client side using `buffer-layout`
- Unit and functional tests for on-chain Solana programs
- Using Solana client `@solana/web3.js`
- Program Derived Addresses
- Create accounts inside on-chain programs
- Deploy on testnet and check it using Solana explorer

### Accounts for smart contract
 0. `[signer, writable]` admin, account to paying
 1. `[writable]` ip data account for saving ip
 2. `[]` Rent sysvar
 3. `[]` System program

### Data
```rust
pub struct IPData {
    //ip address array
    ip_array: Vec<u64>,
}
```


### Accounts:
```
program: 9onZvMzqAFzSHJrLNVWfqLRFFQ5ZCGzNXB4PBxmp6z5Y
admin: EG7uy9FCe4AxL9AavEA1nXDfo2AoBo1ZtBCV224hmoub
data: new pubkey
```

### Links:
- https://docs.solana.com/developing/programming-model/overview
- https://borsh.io
- https://github.com/pabigot/buffer-layout
- https://explorer.solana.com/address/9onZvMzqAFzSHJrLNVWfqLRFFQ5ZCGzNXB4PBxmp6z5Y?cluster=testnet