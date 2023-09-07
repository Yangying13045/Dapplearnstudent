// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

contract Election {
    // Model a candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Store accounts that have voted
    mapping(address => bool) public voters;

    // Read/write candidates
    mapping(uint => Candidate) public candidates;

    // Store Candidates Count
    uint public candidatesCount;

    // Define an event for voting
    event votedEvent (
        uint indexed _candidateId
    );

    // Define a modifier for checking voting conditions
    modifier validVote(uint _candidateId) {
        // require that they haven’t voted before
        require(!voters[msg.sender]);
        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);
        _;
    }

    constructor() {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    function addCandidate (string memory _name) private {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote (uint _candidateId) public validVote(_candidateId) {
  // record that voter has voted
  voters[msg.sender] = true;
  // update candidate vote Count
  candidates[_candidateId].voteCount ++;
  // trigger voted event
  emit votedEvent(_candidateId);
 }

}
