## Truffle Example of failing Error propagation on generic function calls

#### Usage
```
truffle compile
truffle test
```

#### Setup

Let A, B be two contracts. A has an instance of B and B has a function that
throws(`function gothrow(){ throw; }`). If this function is called via solidity
interface (e.g. `b.gothrow()`) the error is propagated to the caller (A) and
results in an overall throw of the transaction. If the function is called
in a generic way (`address(b).call(bytes4(sha("gothrow()")));`) an error in B
is thrown but **NOT** propagated and the calling function proceeds with its
transaction!

##### System
```
Truffle v1.0.2
EthereumJS TestRPC v2.0.1
OS X 10.10.5
node v5.10.1
```

#### Contracts

`B.sol`
```
contract B {
  bool public status;
  function B() {
    status = false;
  }
  function gothrow() {
    throw;
  }
  function testGeneric() {
    status = true;
  }
}
```

`A.sol`
```
import "B.sol";

contract A {
  B b;
  bool public status;
  function A() {
    b = new B();
    status = false;
  }

  // should fail setting status to true
  function shouldFail() {
    b.gothrow();
    status = true;
  }

  // should fail setting status to true
  function shouldFail2() {
    address(b).call(bytes4(sha3("gothrow()")));
    status = true;
  }

  // should succeed seting b's status to true
  function testGeneric() {
    address(b).call(bytes4(sha3("testGeneric()")));
  }
  function getBStatus() returns (bool _status) {
    return b.status();
  }
}
```
#### Observation
If `a.shouldFail()` is called an `Invalid JUMP Error` is thrown and a's status
is not affected.

If `a.shouldFail2()` is called no Error is thrown and a's status is set to true.

#### Tests

`test/test.js`
```
contract('Test normal error propagation', function(accounts) {
  it("should fail 1", function(done) {
    var a = A.deployed();

    a.shouldFail().then(res => {
      return a.status.call();
    }).catch(err => {
      // expected
    }).then(status => {
      assert(!status, "status should be false");
    }).then(done).catch(done);

  });
});

contract('Test generic error propagation', function(accounts) {
  it("should fail 2", function(done) {
    var a = A.deployed();

    a.shouldFail2().then(res => {
      return a.status.call();
    }).catch(err => {
      // expected
    }).then(status => {
      assert(!status, "status should be false");
    }).then(done).catch(done);
  });
});

contract('Test generic function call', function(accounts) {
  it("test generic", function(done) {
    var a = A.deployed();

    a.testGeneric().then(res => {
      return a.getBStatus.call();
    }).then(status => {
      assert(status);
    }).then(done).catch(done);
  });
});
```

#### Execution log
```
Using environment test.
Compiling contracts...


  Contract: Test normal error propagation
    ✓ should fail 1

  Contract: Test generic error propagation
    1) should fail 2
    > No events were emitted

  Contract: Test generic function call
    ✓ test generic (70ms)


  2 passing (719ms)
  1 failing

  1) Contract: Test generic error propagation should fail 2:
     AssertionError: status should be false
      at test.js:25:7
      at tryCatcher (/usr/local/lib/node_modules/truffle/node_modules/ether-pudding/node_modules/bluebird/js/release/util.js:16:23)
      at Promise._settlePromiseFromHandler (/usr/local/lib/node_modules/truffle/node_modules/ether-pudding/node_modules/bluebird/js/release/promise.js:502:31)
      at Promise._settlePromise (/usr/local/lib/node_modules/truffle/node_modules/ether-pudding/node_modules/bluebird/js/release/promise.js:559:18)
      at Promise._settlePromise0 (/usr/local/lib/node_modules/truffle/node_modules/ether-pudding/node_modules/bluebird/js/release/promise.js:604:10)
      at Promise._settlePromises (/usr/local/lib/node_modules/truffle/node_modules/ether-pudding/node_modules/bluebird/js/release/promise.js:683:18)
      at Async._drainQueue (/usr/local/lib/node_modules/truffle/node_modules/ether-pudding/node_modules/bluebird/js/release/async.js:138:16)
      at Async._drainQueues (/usr/local/lib/node_modules/truffle/node_modules/ether-pudding/node_modules/bluebird/js/release/async.js:148:10)
      at Immediate.Async.drainQueues [as _onImmediate] (/usr/local/lib/node_modules/truffle/node_modules/ether-pudding/node_modules/bluebird/js/release/async.js:17:14)
      at Function.module.exports.loopWhile (/usr/local/lib/node_modules/truffle/node_modules/deasync/index.js:64:21)
      at /usr/local/lib/node_modules/truffle/node_modules/deasync/index.js:36:18
      at runTask (/usr/local/lib/node_modules/truffle/cli.js:46:12)
      at Object.<anonymous> (/usr/local/lib/node_modules/truffle/cli.js:331:14)
      at node.js:404:3



```
