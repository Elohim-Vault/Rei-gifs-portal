use anchor_lang::prelude::*;

declare_id!("FantYsgw81FfqqZ8EYiKLKvHRuDW61Hxhz7TXqAtUbbU");
#[program]
pub mod myepicproject {
    use super::*;
    // Basicamente a função construtora.
    pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        base_account.total_gifs = 0;
        Ok(())
    }

    pub fn add_gif(ctx: Context<AddGif>, gif_link: String ) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        let user = &mut ctx.accounts.user;

        // Build the struct
        let item = ItemStruct {
            id: base_account.total_gifs,
            gif_link: gif_link.to_string(),
            address: *user.to_account_info().key,
            votes: 1,
        };

        base_account.gif_list.push(item);
        base_account.total_gifs += 1;
        Ok(())
    }

    // pub fn upvote(ctx: Context<Upvote>, id: u64) -> ProgramResult {
        
    // }
}
    
#[derive(Accounts)]
pub struct StartStuffOff<'info> {
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program <'info, System>,
}
    
// Specify what data you want in the AddGif Context.
// Getting a handle on the flow of things :)?

// Add the signer who calls the AddGif method to the struct so that we can save it
#[derive(Accounts)]
pub struct AddGif<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub id: u64,
    pub gif_link: String,
    pub address: Pubkey,
    pub votes: u32,
}

#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
    // Attach a Vector of type ItemStruct to the account.
    pub gif_list: Vec<ItemStruct>
}

// #[derive(Accounts)]
// pub struct Upvote<'info> {
//     #[account(mut)]
//     pub base_account = Account<'info, BaseAccount>
//     #[account(mut)]
//     pub user: Signer<'info>

// }

#[derive(Accounts)]
pub struct Initialize {}

