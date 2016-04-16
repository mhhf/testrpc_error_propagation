import "B.sol";

contract A {
  B b;
  bool public status;
  function A() {
    b = new B();
    status = false;
  }
  function shouldFail() {
    b.gothrow();
    status = true;
  }
  function shouldFail2() {
    address(b).call(bytes4(sha3("gothrow()")));
    status = true;
  }
  function testGeneric() {
    address(b).call(bytes4(sha3("testGeneric()")));
  }
  function getBStatus() returns (bool _status) {
    return b.status();
  }
}
