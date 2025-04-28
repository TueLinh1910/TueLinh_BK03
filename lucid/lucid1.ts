import { Blockfrost, Lucid, Crypto, fromText } from "https://deno.land/x/lucid/mod.ts";

// Provider selection
// There are multiple builtin providers you can choose from in Lucid.

// Blockfrost

const lucid = new Lucid({
  provider: new Blockfrost(
    "https://cardano-preview.blockfrost.io/api/v0",
    "previewWOr9KVPQRwOUXviCtEBP51Y4ukzW2F1H",
  ),
});

const seed = "snow minimum asset slight mean throw equip glide coin humble swap worry deny label raven ocean mercy use today ship crater build combine spice"
lucid.selectWalletFromSeed(seed, { addressType: "Base", index: 0 });

// console.log(lucid);

// Deno.exit(0);

const address = await lucid.wallet.address(); // Bech32 address
console.log (`Đ/c ví gửi: ${address}`) //Hiện thị địa chỉ ví
// Deno.exit(0);

const utxos = await lucid.wallet.getUtxos();
console.log (utxos) //Hiện thị toàn bộ UTxOs

const utxo=utxos[1];
// console.log(utxo) //Hiện thị 1 UTxO

const assets = utxo.assets;

// // Hiển thị thông tin assets
// console.log("Assets:", assets);


// // Hiển thị toàn bộ tài sản và giá trị của chúng
for (const assetname in assets) {
console.log(`Assetname: ${assetname}, Value: ${assets[assetname]}`);
 } 

