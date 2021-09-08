export default ({ IDL }) => {
  const TokenIdentifier = IDL.Text;
  const AccountIdentifier_2 = IDL.Text;
  const AccountIdentifier = AccountIdentifier_2;
  const User = IDL.Variant({
    'principal' : IDL.Principal,
    'address' : AccountIdentifier,
  });
  const BalanceRequest_2 = IDL.Record({
    'token' : TokenIdentifier,
    'user' : User,
  });
  const BalanceRequest = BalanceRequest_2;
  const Balance = IDL.Nat;
  const CommonError_2 = IDL.Variant({
    'InvalidToken' : TokenIdentifier,
    'Other' : IDL.Text,
  });
  const Result_4 = IDL.Variant({ 'ok' : Balance, 'err' : CommonError_2 });
  const BalanceResponse_2 = Result_4;
  const BalanceResponse = BalanceResponse_2;
  const Extension_2 = IDL.Text;
  const Extension = Extension_2;
  const TokenIdentifier_2 = TokenIdentifier;
  const Metadata_2 = IDL.Variant({
    'fungible' : IDL.Record({
      'decimals' : IDL.Nat8,
      'metadata' : IDL.Opt(IDL.Vec(IDL.Nat8)),
      'name' : IDL.Text,
      'symbol' : IDL.Text,
    }),
    'nonfungible' : IDL.Record({ 'metadata' : IDL.Opt(IDL.Vec(IDL.Nat8)) }),
  });
  const Metadata = Metadata_2;
  const CommonError = CommonError_2;
  const Result_3 = IDL.Variant({ 'ok' : Metadata, 'err' : CommonError });
  const Balance_2 = Balance;
  const User_2 = User;
  const AccountIdentifier_3 = AccountIdentifier;
  const Result_2 = IDL.Variant({ 'ok' : Balance_2, 'err' : CommonError });
  const Memo = IDL.Vec(IDL.Nat8);
  const SubAccount_2 = IDL.Vec(IDL.Nat8);
  const SubAccount = SubAccount_2;
  const TransferRequest_2 = IDL.Record({
    'to' : User,
    'token' : TokenIdentifier,
    'notify' : IDL.Bool,
    'from' : User,
    'memo' : Memo,
    'subaccount' : IDL.Opt(SubAccount),
    'amount' : Balance,
  });
  const TransferRequest = TransferRequest_2;
  const Result = IDL.Variant({
    'ok' : Balance,
    'err' : IDL.Variant({
      'CannotNotify' : AccountIdentifier,
      'InsufficientBalance' : IDL.Null,
      'InvalidToken' : TokenIdentifier,
      'Rejected' : IDL.Null,
      'Unauthorized' : AccountIdentifier,
      'Other' : IDL.Text,
    }),
  });
  const TransferResponse_2 = Result;
  const TransferResponse = TransferResponse_2;
  const tcrn = IDL.Service({
    'acceptCycles' : IDL.Func([], [], []),
    'availableCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'balance' : IDL.Func([BalanceRequest], [BalanceResponse], ['query']),
    'extensions' : IDL.Func([], [IDL.Vec(Extension)], ['query']),
    'faucet' : IDL.Func([], [IDL.Bool], []),
    'metadata' : IDL.Func([TokenIdentifier_2], [Result_3], ['query']),
    'mint' : IDL.Func([Balance_2, User_2], [], []),
    'registry' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(AccountIdentifier_3, Balance_2))],
        ['query'],
      ),
    'setMinter' : IDL.Func([IDL.Principal], [], []),
    'supply' : IDL.Func([TokenIdentifier_2], [Result_2], ['query']),
    'transfer' : IDL.Func([TransferRequest], [TransferResponse], []),
  });
  return tcrn;
};
export const init = ({ IDL }) => { return []; };