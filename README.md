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
