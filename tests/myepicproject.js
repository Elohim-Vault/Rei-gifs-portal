const anchor = require('@project-serum/anchor');
const { SystemProgram,  Connection, clusterApiUrl, } = require('@solana/web3.js');
const assert = require("assert");

function createConnection(url = clusterApiUrl('devnet')) {
  return new Connection(url);
}

describe('Testing myepicproject', () => {
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  it("Create and initialize an account", async () => {
    const program = anchor.workspace.Myepicproject;
    // Create an account keypair for our program to use.
    const baseAccount = anchor.web3.Keypair.generate();
    let tx = await program.rpc.startStuffOff({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount]
    })
    console.log("📝 Your transaction signature", tx);
    _baseAccount = baseAccount
  });

  it("Fetching data from the account", async () => {
    const baseAccount = _baseAccount;
    const program = anchor.workspace.Myepicproject;
    let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    assert("0", account.totalGifs);
  });

  it("Adding a gif", async () => {
    const baseAccount = _baseAccount;
    const program = anchor.workspace.Myepicproject;
    const gifLink = "https://media1.giphy.com/media/x872sor0UNWmc/giphy.gif?cid=ecf05e47u9soq8zxs700d4fnutzkztnjd5tn59oslj69f61l&rid=giphy.gif&ct=g";
    await program.rpc.addGif(gifLink, {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey
      }
    });
    let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    assert(1, account.totalGifs);
  });

  it("Upvote a gif", async () => {
    const baseAccount = _baseAccount;
    const program = anchor.workspace.Myepicproject;
    await program.rpc.upvote(new anchor.BN(0), {
      accounts: {
        baseAccount: baseAccount.publicKey
      }
    })

    let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    assert(2, account.gifList[0].votes);
  });
})