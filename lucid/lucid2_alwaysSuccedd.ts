import { Blockfrost, Data, Lucid, Crypto, Addresses, fromText } from "https://deno.land/x/lucid/mod.ts";

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

//scripts alwaysSucceed 

const alwaysSucceed_scripts = lucid.newScript({
    type: "PlutusV3",
    script: "58af01010029800aba2aba1aab9faab9eaab9dab9a48888896600264653001300700198039804000cc01c0092225980099b8748008c01cdd500144c8cc896600266e1d2000300a375400d13232598009808001456600266e1d2000300c375400713371e6eb8c03cc034dd5180798069baa003375c601e601a6ea80222c805a2c8070dd7180700098059baa0068b2012300b001300b300c0013008375400516401830070013003375400f149a26cac80081",
    });
    
    const alwaysSucceedAddress = alwaysSucceed_scripts.toAddress();
    console.log(`Always succeed address: ${alwaysSucceedAddress}`);
   // Định nghĩa cấu trúc Datum
   const DatumSchema = Data.Object({
    msg: Data.Bytes, // msg là một ByteArray
    });
    // Định nghĩa cấu trúc Redeemer
    const RedeemerSchema = Data.Object({
    msg: Data.Bytes, // msg là một ByteArray
    });
    
    const Datum = () => Data.to({ msg: fromText("Mai Tue Linh_115") }, DatumSchema); 
    console.log("Datum: ", Datum());
    // Tạo một Redeemer với giá trị cụ thể
    const Redeemer = () => Data.to({ msg: fromText("Mai Tue Linh_115") }, RedeemerSchema); 
    const lovelace_lock=50_000_000n 

    
    console.log(`Lovelace lock: ${lovelace_lock}`);
    //Deno.exit(0); // Thoát chương trình

    const policyId = "b646c7bf5e7aec2ac8a0a18d8b3e162e7063bb373f609d3e9ccdb30e";
    const hexAssetName = "424b30333a20313135"; // "Mai Tue Linh_115" hex
    const fullTokenName = policyId + hexAssetName;
    const tokenAmount = 500n;
    


    export async function lockUtxo(lovelace: bigint,): Promise<string> {
        const tx = await lucid
        .newTx()
        .payToContract(
            alwaysSucceedAddress,
            { Inline: Datum() },
            {
              lovelace,
              [fullTokenName]: tokenAmount,
            }
          )
        .commit();
        
        const signedTx = await tx.sign().commit();
        console.log(signedTx);
        
        const txHash = await signedTx.submit();
        
        return txHash;
        }

//  const txHash = await lockUtxo(lovelace_lock);
//  console.log(`Transaction hash: ${txHash}`);


// Mở khóa UTxO
export async function unlockUtxo(redeemer: RedeemerSchema ): Promise<string> {

    const utxo = (await lucid.utxosAt(alwaysSucceedAddress)).find((utxo) => 
    !utxo.scriptRef && utxo.datum === redeemer // && utxo.assets.lovelace == lovelace
    );
    console.log(`redeemer: ${redeemer}`);
    console.log(`UTxO unlock: ${utxo}`);
    
    console.log(utxo);
    if (!utxo) throw new Error("No UTxO with found");
    const tx = await lucid
    .newTx()
    .collectFrom([utxo], Redeemer())
    .attachScript(alwaysSucceed_scripts)
    .commit();
    
    const signedTx = await tx.sign().commit();
    
    const txHash = await signedTx.submit();
    
    return txHash;
    }


// Gọi hàm redeemUtxo để mở khóa UTxO
const redeemTxHash = await unlockUtxo(Redeemer());
console.log(`Transaction hash: ${redeemTxHash}`);