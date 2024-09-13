export const idlFactory = ({ IDL }) => {
  const Holding = IDL.Record({
    'currentPrice' : IDL.Float64,
    'purchasePrice' : IDL.Float64,
    'marketValue' : IDL.Float64,
    'name' : IDL.Text,
    'performance' : IDL.Float64,
    'quantity' : IDL.Float64,
    'assetType' : IDL.Text,
    'symbol' : IDL.Text,
  });
  return IDL.Service({
    'addHolding' : IDL.Func([Holding], [], []),
    'getHoldings' : IDL.Func([], [IDL.Vec(Holding)], ['query']),
    'removeHolding' : IDL.Func([IDL.Nat], [], []),
    'updatePrices' : IDL.Func([], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
