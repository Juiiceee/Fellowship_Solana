use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("5irzRSoezBU1kUctkd2wZXtTNSVesnvxQS56GysMHev7");

#[program]
pub mod game {
    use super::*;
    // handler function
    pub fn initia(ctx: Context<Initia>, key: Pubkey) -> Result<()> {
        let coffre = &mut ctx.accounts.token_account;
        coffre.owner = key;
        coffre.
        Ok(())
    }

    pub fn depo(ctx: Context<Depo>, amount: u64) -> Result<()> {
    
    
    }
}

#[derive(Accounts)]
pub struct Initia<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(init, payer = signer, space = 8 + 32 + (4 + 32)*50)]
    pub token_account: Account<'info, TokenAccount>,
}

#
