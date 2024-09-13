import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Holding {
  'currentPrice' : number,
  'purchasePrice' : number,
  'quantity' : number,
  'assetType' : string,
  'symbol' : string,
}
export interface _SERVICE {
  'addHolding' : ActorMethod<[Holding], undefined>,
  'getHoldings' : ActorMethod<[], Array<Holding>>,
  'removeHolding' : ActorMethod<[bigint], undefined>,
  'updatePrices' : ActorMethod<[], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
