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
