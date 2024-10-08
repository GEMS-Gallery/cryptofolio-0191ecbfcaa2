import Hash "mo:base/Hash";

import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Float "mo:base/Float";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Int64 "mo:base/Int64";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Int32 "mo:base/Int32";
import Nat32 "mo:base/Nat32";
import Text "mo:base/Text";

actor {
  public type Holding = {
    name: Text;
    symbol: Text;
    quantity: Float;
    purchasePrice: Float;
    currentPrice: Float;
    marketValue: Float;
    performance: Float;
    assetType: Text;
  };

  private stable var holdingsEntries : [(Principal, [Holding])] = [];
  private var holdings = HashMap.HashMap<Principal, [Holding]>(10, Principal.equal, Principal.hash);

  system func preupgrade() {
    holdingsEntries := Iter.toArray(holdings.entries());
  };

  system func postupgrade() {
    holdings := HashMap.fromIter<Principal, [Holding]>(holdingsEntries.vals(), 10, Principal.equal, Principal.hash);
  };

  public shared(msg) func addHolding(holding: Holding) : async () {
    let userHoldings = switch (holdings.get(msg.caller)) {
      case null [];
      case (?h) h;
    };
    let updatedHoldings = Array.append<Holding>(userHoldings, [holding]);
    holdings.put(msg.caller, updatedHoldings);
  };

  public shared(msg) func removeHolding(index: Nat) : async () {
    switch (holdings.get(msg.caller)) {
      case null return;
      case (?userHoldings) {
        if (index < userHoldings.size()) {
          let updatedHoldings = Array.tabulate<Holding>(userHoldings.size() - 1, func (i) {
            if (i < index) { userHoldings[i] } else { userHoldings[i + 1] }
          });
          holdings.put(msg.caller, updatedHoldings);
        };
      };
    };
  };

  public query(msg) func getHoldings() : async [Holding] {
    switch (holdings.get(msg.caller)) {
      case null [];
      case (?h) h;
    };
  };

  private func generatePriceFluctuation() : Float {
    let randomValue = Nat32.toNat(Int32.toNat32(Int32.bitcountNonZero(Int32.fromNat32(Nat32.fromNat(Nat64.toNat(Int64.toNat64(Int64.fromInt(Time.now()))))))));
    let fluctuation = Float.fromInt(Int.abs(Int.rem(randomValue, 21)) - 10) / 100;
    1 + fluctuation
  };

  public func updatePrices() : async () {
    for ((user, userHoldings) in holdings.entries()) {
      let updatedHoldings = Array.map<Holding, Holding>(userHoldings, func (holding) {
        let newPrice = holding.currentPrice * generatePriceFluctuation();
        let newMarketValue = newPrice * holding.quantity;
        let newPerformance = (newPrice - holding.purchasePrice) / holding.purchasePrice * 100;
        {
          name = holding.name;
          symbol = holding.symbol;
          quantity = holding.quantity;
          purchasePrice = holding.purchasePrice;
          currentPrice = newPrice;
          marketValue = newMarketValue;
          performance = newPerformance;
          assetType = holding.assetType;
        }
      });
      holdings.put(user, updatedHoldings);
    };
  };
}