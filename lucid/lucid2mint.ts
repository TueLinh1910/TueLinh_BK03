import { Blockfrost, Lucid, Crypto, Addresses, fromText } from "https://deno.land/x/lucid/mod.ts";

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

async function createMintingscripts(slot_in:bigint) {
    const { payment } = Addresses.inspect(
    await lucid.wallet.address(),
    );
    
    const mintingScripts = lucid.newScript(
    {
    type: "All",
    scripts: [
    { type: "Sig", keyHash: payment.hash },
    {
    type: "Before",
    slot: slot_in,
    },
    ],
    },
    );
    
    return mintingScripts;
    }

    //=============mintToken=============================================

    async function mintToken(policyId: string, tokenName: string, amount: bigint, slot_in: bigint) {
    const unit = policyId + fromText(tokenName);
    
    //=================Tạo metadata=========================
    const metadata= {
    [policyId]: {
    [tokenName]: {
    "description": "This is Token minted by LUCID",
    "name": `${tokenName}`,
    "id": 1,
    "image": "ipfs://QmRE3Qnz5Q8dVtKghL4NBhJBH4cXPwfRge7HMiBhK92SJX"
    }
    }
    };
    console.log(metadata);
    // Deno.exit(0);
    
    const tx = await lucid.newTx()
    .mint({ [unit]: amount })
    .validTo(Date.now() + 200000)
    .attachScript(await createMintingscripts(slot_in))
    .attachMetadata(721, metadata)
    .commit();
    
    return tx;
    }

    //===Main=====

    const slot_in = BigInt(84885593)
    console.log(`Slot: ${slot_in}`);
    // Deno.exit(0); // Thoát chương trình

    const mintingScripts = await createMintingscripts(slot_in);

    const policyId = mintingScripts.toHash(); // Lấy mã chính sách minting
    console.log(`Mã chính sách minting là: ${policyId}`);
    // Deno.exit(0); // Thoát chương trình

    // Mint token
    const tx = await mintToken(policyId, "BK03: 115", 500n, slot_in);
    //Deno.exit(0); // Thoát chương trình

    let signedtx = await tx.sign().commit();
    let txHash = await signedtx.submit();
    console.log(`Bạn có thể kiểm tra giao dịch tại: https://preview.cexplorer.io/tx/${txHash}`); 

 