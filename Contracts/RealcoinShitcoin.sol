import "./Ownable.sol";
pragma solidity 0.5.12;

contract RealcoinShitcoin{

  uint public balance;

  function placeBet(string memory bet, uint betAmount) public payable returns(uint amount){
    require(balance >= betAmount, "Not enough ether in contract to allow the bet.");
    uint result = randomize(2);

    if((compareStrings(bet, "Realcoin") && result == 0) || (compareStrings(bet, "Shitcoin") && result == 1))
    {

      balance = balance - betAmount;
      //send 2x bet amount (bet + win) to sender
      msg.sender.transfer(betAmount * 2);

      return (betAmount);
    }
    balance = balance + betAmount;
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
