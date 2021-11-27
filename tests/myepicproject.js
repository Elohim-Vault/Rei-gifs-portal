const anchor = require('@project-serum/anchor');
const { SystemProgram } = require('@solana/web3.js');

describe('myepicproject', () => {
  const anchor = require('@project-serum/anchor');

  const main = async () => {
    console.log("🚀 Starting test...")
    // Create and set provider. So that it can communicate with our frontend;
    const provider = anchor.Provider.env();
    anchor.setProvider(provider);
    
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

    // Fetch data from the account
    let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('Gif count: ', account.totalGifs.toString());

    // Add a gif
    const gifLink = "https://media1.giphy.com/media/x872sor0UNWmc/giphy.gif?cid=ecf05e47u9soq8zxs700d4fnutzkztnjd5tn59oslj69f61l&rid=giphy.gif&ct=g";
    await program.rpc.addGif(gifLink, {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey
      }
    });

    await program.rpc.addGif(gifLink, {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey
      }
    });

    account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('Gif count: ', account.totalGifs.toString());
    console.log('Gif list', account.gifList);

    console.log("Trying to upvote");
    // await program.rpc.upvote(0, {
    //   accounts: {
    //     baseAccount: baseAccount.publicKey
    //   }
    // })

    account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('Gif count: ', account.totalGifs.toString());
    console.log('Gif list', account.gifList);
  }

  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
  
  runMain();
});

