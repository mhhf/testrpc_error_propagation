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
