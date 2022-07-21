localnet-validator:
	solana-test-validator -r --ledger devnet

devnet-init:
	solana airdrop 1 localnet/admin.json -u devnet

testnet-airdrop:
	solana airdrop 10 localnet/admin.json -u testnet

localnet-deploy:
	cd program; cargo-build-bpf
	solana program deploy program/target/deploy/ip_data.so -u localhost --program-id localnet/program.json

devnet-deploy: test
	cd program; cargo-build-bpf
	solana program deploy program/target/deploy/ip_data.so -u devnet --program-id localnet/program.json --keypair localnet/admin.json --upgrade-authority localnet/admin.json

client:
    cd client; npm install
    cd client; ./node_modules/.bin/ts-node src/main.ts
