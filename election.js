const Election = artifacts.require("./Election.sol");

contract("Election", function(accounts) {
  let electionInstance;

  it("initializes with two candidates", async function() {
    electionInstance = await Election.deployed();
    const count = await electionInstance.candidatesCount();
    assert.strictEqual(count.toNumber(), 2, "contains the correct candidates count"); // 加上错误信息
  }); // 加上分号

  it("it initializes the candidates with the correct values", async function() {
    const candidate1 = await electionInstance.candidates(1);
    assert.strictEqual(candidate1[0].toNumber(), 1, "contains the correct id"); // 加上分号
    assert.strictEqual(candidate1[1], "Candidate 1", "contains the correct name"); // 加上分号
    assert.strictEqual(candidate1[2].toNumber(), 0, "contains the correct votes count"); // 加上分号
    const candidate2 = await electionInstance.candidates(2);
    assert.strictEqual(candidate2[0].toNumber(), 2, "contains the correct id"); // 加上分号
    assert.strictEqual(candidate2[1], "Candidate 2", "contains the correct name"); // 加上分号
    assert.strictEqual(candidate2[2].toNumber(), 0, "contains the correct votes count"); // 加上分号
  }); // 加上分号

it("allows a voter to cast a vote", async function() {
  
  electionInstance = await Election.deployed();
 
  candidateId = 1;

  await electionInstance.vote(candidateId, { from: accounts[0] });

  const voted = await electionInstance.voters(accounts[0]);

  assert(voted, "the voter was marked as voted"); // 加上分号

  const candidate = await electionInstance.candidates(candidateId);

  var voteCount = candidate[2];
  assert.equal(voteCount, 1, "increments the candidate's vote count"); // 加上错误信息
   }); // 加上分号

it("throws an exception for invalid candidates", async function() { // 使用async/await语法
      electionInstance = await Election.deployed(); // 使用await关键字
      try {
        await electionInstance.vote(99, { from: accounts[1] }); // 使用await关键字
        assert.fail(); // 抛出失败断言
      } catch (error) {
        assert(error.message.indexOf('revert') >= 0, "error message must contain revert"); // 捕获错误并断言
      }
      const candidate1 = await electionInstance.candidates(1); // 使用await关键字
      var voteCount = candidate1[2];
      assert.equal(voteCount, 1, "candidate 1 did not receive any votes"); // 加上错误信息
      const candidate2 = await electionInstance.candidates(2); // 使用await关键字
      var voteCount = candidate2[2];
      assert.equal(voteCount, 0, "candidate 2 did not receive any votes"); // 加上错误信息
}); // 加上分号

it("throws an exception for double voting", async function() { // 使用async/await语法
      electionInstance = await Election.deployed(); // 使用await关键字
      candidateId = 2;
      await electionInstance.vote(candidateId, { from: accounts[1] }); // 使用await关键字
      const candidate = await electionInstance.candidates(candidateId); // 使用await关键字
      var voteCount = candidate[2];
      assert.equal(voteCount, 1, "accepts first vote"); // 加上错误信息
      // Try to vote again
      try {
        await electionInstance.vote(candidateId, { from: accounts[1] }); // 使用await关键字
        assert.fail(); // 抛失败断言
      } catch (error) {
        assert(error.message.indexOf('revert') >= 0, "error message must contain revert"); // 捕获错误并断言
      }
      const candidate1 = await electionInstance.candidates(1); // 使用await关键字
      var voteCount = candidate1[2];
      assert.equal(voteCount, 1, "candidate 1 did not receive any votes"); // 加上错误信息
      const candidate2 = await electionInstance.candidates(2); // 使用await关键字
      var voteCount = candidate2[2];
      assert.equal(voteCount, 1, "candidate 2 did not receive any votes"); // 加上错误信息
}); // 加上分号

}); // 加上分号
