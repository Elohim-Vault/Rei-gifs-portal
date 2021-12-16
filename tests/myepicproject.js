const anchor = require('@project-serum/anchor');
const { SystemProgram,  Connection, clusterApiUrl} = require('@solana/web3.js');
const assert = require("assert");



describe('Testing myepicproject', () => {
  const provider = anchor.Provider.env();
  let baseAccount;
  let baseAccountBump;

  anchor.setProvider(provider);
  it("Create and initialize an account", async () => {
    const program = anchor.workspace.Myepicproject;
    [baseAccount, baseAccountBump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("base_account")],
      program.programId
    );
    // Create an account keypair for our program to use.
    let tx = await program.rpc.startStuffOff(baseAccountBump, {
      accounts: {
        baseAccount: baseAccount,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: []
    })
    console.log("📝 Your transaction signature", tx);
  });

  it("Fetching data from the account", async () => {
    const program = anchor.workspace.Myepicproject;
    let account = await program.account.baseAccount.fetch(baseAccount);
    assert("0", account.totalGifs);
  });

  it("Adding a gif", async () => {
    const program = anchor.workspace.Myepicproject;
    const gifLink = "https://media1.giphy.com/media/x872sor0UNWmc/giphy.gif?cid=ecf05e47u9soq8zxs700d4fnutzkztnjd5tn59oslj69f61l&rid=giphy.gif&ct=g";
    await program.rpc.addGif(gifLink, {
      accounts: {
        baseAccount: baseAccount,
        user: provider.wallet.publicKey
      }
    });
    let account = await program.account.baseAccount.fetch(baseAccount);
    assert(1, account.totalGifs);
  });

  it("Upvote a gif", async () => {
    const program = anchor.workspace.Myepicproject;
    await program.rpc.upvote(new anchor.BN(0), {
      accounts: {
        baseAccount: baseAccount
      }
    })

    let account = await program.account.baseAccount.fetch(baseAccount);
    assert(2, account.gifList[0].votes);
  });
})