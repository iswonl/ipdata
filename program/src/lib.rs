use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    system_instruction,
    program_error::ProgramError,
    pubkey::Pubkey,
    sysvar::{rent::Rent, Sysvar},
    system_program,
};

use solana_program::program::invoke_signed;

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct IPData{
    pub ip_array: Vec<u64>,
}

entrypoint!(process_instruction);

    /// Save ip data to account.
    /// Accounts:
    /// 0. `[signer, writable]` admin, account to paying
    /// 1. `[writable]` ip data account for saving ip
    /// 2. `[]` Rent sysvar
    /// 3. `[]` System program

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    msg!("start smart contract");

    let accounts_iter = &mut accounts.iter();

    let admin_info = next_account_info(accounts_iter)?;
    let data_info = next_account_info(accounts_iter)?;
    let rent_info = next_account_info(accounts_iter)?;
    let system_program_info = next_account_info(accounts_iter)?;

    if !admin_info.is_signer {
        msg!("admin is not signer!");
        return Err(ProgramError::MissingRequiredSignature);
    }
    if !admin_info.is_writable {
        msg!("admin is not writable!");
        return Err(ProgramError::MissingRequiredSignature);
    }
    if !data_info.is_signer {
        msg!("admin is not signer!");
        return Err(ProgramError::MissingRequiredSignature);
    }
    if !data_info.is_writable {
        msg!("data account is not writable!");
        return Err(ProgramError::MissingRequiredSignature);
    }
    if !data_info.data_is_empty() {
        msg!("account already initialized!");
        return Err(ProgramError::AccountAlreadyInitialized);
    }
    
    msg!("creating data account...");

    let data = IPData::try_from_slice(_instruction_data)?;
    let space = _instruction_data.len();
    let rent = &Rent::from_account_info(rent_info)?;
    let lamports = rent.minimum_balance(space);
    invoke_signed(
        &system_instruction::create_account(
            admin_info.key,
            &data_info.key,
            lamports,
            space as u64,
            &program_id,
        ),
        &[admin_info.clone(), data_info.clone(), system_program_info.clone()],
        &[],
    )?;
    msg!("saving data to account...");
    data.serialize(&mut &mut data_info.data.borrow_mut()[..])?;
    msg!("saved ip data {:?} to account {:?}", data_info.data, data_info.key);
    Ok(())
}

// tests
#[cfg(test)]
mod test {
    use super::*;
    use solana_program::clock::Epoch;
    use std::{mem, str::FromStr};

    #[test]
    fn test_data() {
        let program_id = Pubkey::default();
        let admin_key = Pubkey::default();
        let data_key = Pubkey::default();
        let rent_key = Pubkey::from_str("SysvarRent111111111111111111111111111111111").unwrap();
        let sysp_key = system_program::id();

        let mut admin_lamports = 100;
        let mut admin_data:Vec<u8> = vec![];
        let mut data_lamports = 0;
        let mut data_data:Vec<u8> = vec![];
        let mut rent_lamports = 0;
        let mut rent_data:Vec<u8> = vec![];
        let mut sysp_lamports = 0;
        let mut sysp_data:Vec<u8> = vec![];

        let admin_info = AccountInfo::new(
            &admin_key,
            true,
            true,
            &mut admin_lamports,
            &mut admin_data,
            &program_id,
            false,
            Epoch::default(),
        );

        let data_info = AccountInfo::new(
            &data_key,
            false,
            true,
            &mut data_lamports,
            &mut data_data,
            &program_id,
            false,
            Epoch::default(),
        );

        let rent_info = AccountInfo::new(
            &rent_key,
            false,
            false,
            &mut rent_lamports,
            &mut rent_data,
            &program_id,
            true,
            Epoch::default(),
        );

        let sysp_info = AccountInfo::new(
            &sysp_key,
            false,
            false,
            &mut sysp_lamports,
            &mut sysp_data,
            &program_id,
            true,
            Epoch::default(),
        );

        let instruction_data: Vec<u8> = vec![1,0,0,0,1,0,0,0,0,0,0,0];

        let accounts = vec![admin_info, data_info, rent_info, sysp_info];

        assert_eq!(
            IPData::try_from_slice(&instruction_data)
                .unwrap()
                .ip_array,
            vec![1]
        );
        process_instruction(&program_id, &accounts, &instruction_data).unwrap();
        assert_eq!(
            IPData::try_from_slice(&accounts[1].data.borrow())
            .unwrap().ip_array,
            vec![1]
        );
    }
}
