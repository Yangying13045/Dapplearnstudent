// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

// 导入一些外部库
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Election is Ownable, Pausable {
    // 使用 SafeMath 库来防止溢出
    using SafeMath for uint;

    // 定义一个候选人结构体，增加了一个简介变量
    struct Candidate {
        uint id;
        string name;
        string description;
        uint voteCount;
    }

    // 存储已经投票过的账户地址
    mapping(address => bool) public voters;

    // 存储候选人的结构体实例
    mapping(uint => Candidate) public candidates;

    // 存储候选人的总数
    uint public candidatesCount;

    // 定义一个投票事件，增加了一个时间戳变量
    event votedEvent (
        uint indexed _candidateId,
        uint timestamp
    );

    // 定义一个添加候选人事件
    event addedCandidateEvent (
        uint indexed _candidateId,
        string _name,
        string _description,
        uint timestamp
    );

    // 定义一个检查投票条件的修饰符
    modifier validVote(uint _candidateId) {
        // 要求他们之前没有投过票
        require(!voters[msg.sender]);
        // 要求一个有效的候选人
        require(_candidateId > 0 && _candidateId <= candidatesCount);
        _;
    }

    // 构造函数，初始化合约，并添加两个候选人
    constructor() {
        addCandidate("Candidate 1", "The first candidate");
        addCandidate("Candidate 2", "The second candidate");
    }

    // 添加候选人的函数，只有合约所有者才能调用，且在未暂停状态下才能执行
    function addCandidate (string memory _name, string memory _description) public onlyOwner whenNotPaused {
        candidatesCount = candidatesCount.add(1);
        candidates[candidatesCount] = Candidate(candidatesCount, _name, _description, 0);
        emit addedCandidateEvent(candidatesCount, _name, _description, block.timestamp);
    }

    // 投票给候选人的函数，需要满足投票条件，且在未暂停状态下才能执行
    function vote (uint _candidateId) public validVote(_candidateId) whenNotPaused {
        // 记录投票者已经投票
        voters[msg.sender] = true;
        // 更新候选人的票数
        candidates[_candidateId].voteCount = candidates[_candidateId].voteCount.add(1);
        // 触发投票事件
        emit votedEvent(_candidateId, block.timestamp);
    }

}
