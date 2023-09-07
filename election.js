// 导入Truffle的artifacts对象，用来获取合约实例
var Election = artifacts.require("Election");

// 使用contract函数来创建一个测试套件
contract("Election", function(accounts) {
  // 定义一个变量来存储合约实例
  var electionInstance;

  // 使用beforeEach函数来在每个测试用例之前部署一个新的合约实例
  beforeEach(async function() {
    electionInstance = await Election.new();
  });

  // 使用it函数来编写一个测试用例，检查合约是否正确地初始化了两个候选人
  it("should initialize with two candidates", async function() {
    // 获取候选人的总数
    var candidatesCount = await electionInstance.candidatesCount();
    // 使用assert.equal函数来断言候选人的总数等于2
    assert.equal(candidatesCount, 2, "The candidates count was not 2");
    // 获取第一个候选人的信息
    var candidate1 = await electionInstance.candidates(1);
    // 使用assert.equal函数来断言第一个候选人的信息正确
    assert.equal(candidate1.id, 1, "The first candidate's id was not 1");
    assert.equal(candidate1.name, "Candidate 1", "The first candidate's name was not Candidate 1");
    assert.equal(candidate1.description, "The first candidate", "The first candidate's description was not The first candidate");
    assert.equal(candidate1.voteCount, 0, "The first candidate's vote count was not 0");
    // 获取第二个候选人的信息
    var candidate2 = await electionInstance.candidates(2);
    // 使用assert.equal函数来断言第二个候选人的信息正确
    assert.equal(candidate2.id, 2, "The second candidate's id was not 2");
    assert.equal(candidate2.name, "Candidate 2", "The second candidate's name was not Candidate 2");
    assert.equal(candidate2.description, "The second candidate", "The second candidate's description was not The second candidate");
    assert.equal(candidate2.voteCount, 0, "The second candidate's vote count was not 0");
  });

  // 使用it函数来编写一个测试用例，检查合约是否允许合约所有者添加新的候选人
  it("should allow the owner to add new candidates", async function() {
    // 获取合约所有者的地址
    var owner = await electionInstance.owner();
    // 调用addCandidate函数，使用合约所有者的地址作为发送者，添加一个新的候选人
    var result = await electionInstance.addCandidate("Candidate 3", "The third candidate", {from: owner});
    // 获取候选人的总数
    var candidatesCount = await electionInstance.candidatesCount();
    // 使用assert.equal函数来断言候选人的总数等于3
    assert.equal(candidatesCount, 3, "The candidates count was not 3");
    // 获取第三个候选人的信息
    var candidate3 = await electionInstance.candidates(3);
    // 使用assert.equal函数来断言第三个候选人的信息正确
    assert.equal(candidate3.id, 3, "The third candidate's id was not 3");
    assert.equal(candidate3.name, "Candidate 3", "The third candidate's name was not Candidate 3");
    assert.equal(candidate3.description, "The third candidate", "The third candidate's description was not The third candidate");
    assert.equal(candidate3.voteCount, 0, "The third candidate's vote count was not 0");
    // 检查是否触发了addedCandidateEvent事件，并获取事件参数
    var event = result.logs[0].args;
    // 使用assert.equal函数来断言事件参数正确
    assert.equal(event._candidateId.toNumber(), 3, "The added candidate id was not 3");
    assert.equal(event._name, "Candidate 3", "The added candidate name was not Candidate 3");
    assert.equal(event._description, "The third candidate", "The added candidate description was not The third candidate");
  });

  // 使用it函数来编写一个测试用例，检查合约是否拒绝非合约所有者添加新的候选人
  it("should reject non-owner to add new candidates", async function() {
    // 获取非合约所有者的地址
    var nonOwner = accounts[1];
    // 调用addCandidate函数，使用非合约所有者的地址作为发送者，尝试添加一个新的候选人
    try {
      await electionInstance.addCandidate("Candidate 4", "The fourth candidate", {from: nonOwner});
      // 如果没有抛出异常，使用assert.fail函数来失败测试
      assert.fail("The non-owner was able to add a new candidate");
    } catch (error) {
      // 如果抛出异常，使用assert.include函数来检查异常信息是否包含revert字样
      assert.include(error.message, "revert", "The error message did not contain revert");
    }
  });

  // 使用it函数来编写一个测试用例，检查合约是否允许有效的投票
  it("should allow valid voting", async function() {
    // 获取第一个候选人的id
    var candidateId = 1;
    // 获取第一个投票者的地址
    var voter = accounts[0];
    // 调用vote函数，使用第一个投票者的地址作为发送者，投票给第一个候选人
    var result = await electionInstance.vote(candidateId, {from: voter});
    // 获取第一个候选人的票数
var voteCount = await (await electionInstance.candidates(candidateId)).voteCount;
// 使用assert.equal函数来断言第一个候选人的票数等于1
assert.equal(voteCount, 1, "The first candidate's vote count was not 1");

    // 检查是否触发了votedEvent事件，并获取事件参数
    var event = result.logs[0].args;
    // 使用assert.equal函数来断言事件参数正确
    assert.equal(event._candidateId.toNumber(), candidateId, "The voted candidate id was not correct");
  });

  // 使用it函数来编写一个测试用例，检查合约是否拒绝无效的投票
  it("should reject invalid voting", async function() {
    // 获取一个不存在的候选人的id
    var invalidCandidateId = 99;
    // 获取第一个投票者的地址
    var voter = accounts[0];
    // 调用vote函数，使用第一个投票者的地址作为发送者，尝试投票给一个不存在的候选人
    try {
      await electionInstance.vote(invalidCandidateId, {from: voter});
      // 如果没有抛出异常，使用assert.fail函数来失败测试
      assert.fail("The voter was able to vote for an invalid candidate");
    } catch (error) {
      // 如果抛出异常，使用assert.include函数来检查异常信息是否包含revert字样
      assert.include(error.message, "revert", "The error message did not contain revert");
    }


  });
});
