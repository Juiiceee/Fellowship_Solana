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
        coffre.amount = 0;
        Ok(())
    }

    pub fn depo(ctx: Context<Depo>, amount: u64) -> Result<()> {
        let accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.vault_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(program, accounts);
        token::transfer(cpi_ctx, amount)?;
        Ok(())
    
    }
}

#[derive(Accounts)]
pub struct Initia<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(init, payer = signer, space = 8 + 32 + (4 + 32)*50)]
    pub token_account: Account<'info, TokenAccount>,
}

#[derive(Accounts)]
pub struct Depo<'info> {
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub coffre_account: Account<'info, TokenAccount>,
    pub user: Signer<'info>,
    pub token: Program<'info, Token>,
}
