import "./Ownable.sol";
pragma solidity 0.5.12;

contract RealcoinShitcoin is Ownable{

  uint public balance;

  constructor() public payable {
    require(msg.value >= 1 ether, "need at least 1 ether to init the contract with");
    balance = msg.value;
  }

  function placeBet(string memory bet) public payable returns(uint amount){
    require(balance >= msg.value, "Not enough ether in contract to allow the bet.");
    uint result = randomize(2);

    if((compareStrings(bet, "Realcoin") && result == 0) || (compareStrings(bet, "Shitcoin") && result == 1))
    {
      balance = balance - msg.value;
      //send 2x bet amount (bet + win) to sender
      msg.sender.transfer(msg.value * 2);

      return (msg.value);
    }
    balance = balance + msg.value;
    return 0;
  }


  function randomize(uint modulus) public view returns (uint){
    return now % modulus;
  }

  function compareStrings (string memory a, string memory b) public pure returns (bool) {
    return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
  }

  function withdrawAll() public onlyOwner returns(uint) {
       uint toTransfer = balance;
       balance = 0;
       msg.sender.transfer(toTransfer);
       return toTransfer;
   }

}
