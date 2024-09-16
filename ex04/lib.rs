use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
    program_error::ProgramError,
    system_instruction,
    program::invoke,
    sysvar::{rent::Rent, Sysvar},
};


pub enum SolProgramInstruction {

    Initialize,


    Deposit { amount: u64 },


    Withdraw,
}

impl SolProgramInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&tag, rest) = input.split_first().ok_or(ProgramError::InvalidInstructionData)?;
        Ok(match tag {
            0 => Self::Initialize,
            1 => {
                let amount = Self::unpack_u64(rest)?;
                Self::Deposit { amount }
            }
            2 => Self::Withdraw,
            _ => return Err(ProgramError::InvalidInstructionData),
        })
    }

    fn unpack_u64(input: &[u8]) -> Result<u64, ProgramError> {
        let amount = input
            .get(..8)
            .and_then(|slice| slice.try_into().ok())
            .map(u64::from_le_bytes)
            .ok_or(ProgramError::InvalidInstructionData)?;
        Ok(amount)
    }
}

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = SolProgramInstruction::unpack(instruction_data)?;

    match instruction {
        SolProgramInstruction::Initialize => {
            msg!("Initialisation du compte...");
            initialize_account(program_id, accounts)
        }
        SolProgramInstruction::Deposit { amount } => {
            msg!("Dépôt de {} lamports...", amount);
            deposit_sol(program_id, accounts, amount)
        }
        SolProgramInstruction::Withdraw => {
            msg!("Retrait de 10% des SOL déposés...");
            withdraw_sol(program_id, accounts)
        }
    }
}

fn initialize_account(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let account_to_initialize = next_account_info(account_info_iter)?;

    let rent = &Rent::from_account_info(next_account_info(account_info_iter)?)?;
    if !rent.is_exempt(account_to_initialize.lamports(), account_to_initialize.data_len()) {
        return Err(ProgramError::AccountNotRentExempt);
    }

    Ok(())
}

fn deposit_sol(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    amount: u64,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let depositor_account = next_account_info(account_info_iter)?;
    let deposit_account = next_account_info(account_info_iter)?;

    invoke(
        &system_instruction::transfer(depositor_account.key, deposit_account.key, amount),
        &[depositor_account.clone(), deposit_account.clone()],
    )?;

    Ok(())
}

fn withdraw_sol(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let source_account = next_account_info(account_info_iter)?;
    let destination_account = next_account_info(account_info_iter)?;
    let signer_account = next_account_info(account_info_iter)?;

    if !signer_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    let lamports_to_withdraw = source_account.lamports() / 10;
    **source_account.try_borrow_mut_lamports()? -= lamports_to_withdraw;
    **destination_account.try_borrow_mut_lamports()? += lamports_to_withdraw;

    Ok(())
}
