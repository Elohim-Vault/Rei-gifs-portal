use anchor_lang::prelude::*;

declare_id!("FUcBbwK4tqdb2AeunbgHBRPPRKKnzetBKat6YGh1pffS");
// RPC means Remote Procedure call
#[program]
pub mod myepicproject {
    use super::*;
    // Initialization method
    pub fn start_stuff_off(ctx: Context<StartStuffOff>, account_bump: u8) -> ProgramResult {
        ctx.accounts.base_account.bump = account_bump;
        Ok(())
    }

    // Context is the first parameter of every RPC Handler. It's a container
    // for the currently program_id
    // ProgramResult it's a Result type that returns OK if the programs run well or ProgramError
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

    pub fn upvote(ctx: Context<Upvote>, id: u64) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        for gif in &mut base_account.gif_list {
            if gif.id == id {
                gif.votes += 1;
            }
        }
        Ok(())
    }

    // pub fn tip(ctx: Context<Tip>, amount: u64) -> ProgramResult {
    //     Ok(())
    // }
}

// Implement a deserializer in struct data.
// how to initialize it and what to hold in our StartStuffOff context.
#[derive(Accounts)]
#[instruction(base_account_bump: u8)]
pub struct StartStuffOff<'info> {
    #[account(
        init,
        payer = user,
        seeds = [b"base_account".as_ref()],
        bump = base_account_bump,
        space = 9000
    )]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)] 
    pub user: Signer<'info>,
    pub system_program: Program <'info, System>,
}
    
// Specify what data you want in the AddGif Context.
// Add the signer who calls the AddGif method to the struct so that we can save it
#[derive(Accounts)]
pub struct AddGif<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

// how to serialize/deserialize the struct.
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub id: u64,
    pub gif_link: String,
    pub address: Pubkey,
    pub votes: u32,
}


#[derive(Accounts)]
pub struct Upvote<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>
}

// This struct will be serialized and stored
#[account]
#[derive(Default)]
pub struct BaseAccount {
    pub total_gifs: u64,
    pub gif_list: Vec<ItemStruct>,
    pub bump: u8,
}
