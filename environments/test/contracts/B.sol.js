// Factory "morphs" into a Pudding class.
// The reasoning is that calling load in each context
// is cumbersome.

(function() {

  var contract_data = {
    abi: [{"constant":true,"inputs":[],"name":"status","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"gothrow","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"testGeneric","outputs":[],"type":"function"},{"inputs":[],"type":"constructor"}],
    binary: "60606040526000805460ff19169055605a80601a6000396000f3606060405260e060020a6000350463200d2ed28114602e578063531a4559146039578063f15caff414603f575b005b605060005460ff1681565b602c6002565b602c6000805460ff19166001179055565b6060908152602090f3",
    unlinked_binary: "60606040526000805460ff19169055605a80601a6000396000f3606060405260e060020a6000350463200d2ed28114602e578063531a4559146039578063f15caff414603f575b005b605060005460ff1681565b602c6002565b602c6000805460ff19166001179055565b6060908152602090f3",
    address: "0x6f1e28af91ac949f01551e9604d6b120266a668d",
    generated_with: "2.0.6",
    contract_name: "B"
  };

  function Contract() {
    if (Contract.Pudding == null) {
      throw new Error("B error: Please call load() first before creating new instance of this contract.");
    }

    Contract.Pudding.apply(this, arguments);
  };

  Contract.load = function(Pudding) {
    Contract.Pudding = Pudding;

    Pudding.whisk(contract_data, Contract);

    // Return itself for backwards compatibility.
    return Contract;
  }

  Contract.new = function() {
    if (Contract.Pudding == null) {
      throw new Error("B error: Please call load() first before calling new().");
    }

    return Contract.Pudding.new.apply(Contract, arguments);
  };

  Contract.at = function() {
    if (Contract.Pudding == null) {
      throw new Error("B error: lease call load() first before calling at().");
    }

    return Contract.Pudding.at.apply(Contract, arguments);
  };

  Contract.deployed = function() {
    if (Contract.Pudding == null) {
      throw new Error("B error: Please call load() first before calling deployed().");
    }

    return Contract.Pudding.deployed.apply(Contract, arguments);
  };

  if (typeof module != "undefined" && typeof module.exports != "undefined") {
    module.exports = Contract;
  } else {
    // There will only be one version of Pudding in the browser,
    // and we can use that.
    window.B = Contract;
  }

})();
