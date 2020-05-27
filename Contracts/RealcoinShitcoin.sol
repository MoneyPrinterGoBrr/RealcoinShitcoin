import "./Ownable.sol";
import "../../ethereum-api/provableAPI_0.5.sol";
pragma solidity 0.5.12;

contract RealcoinShitcoin is Ownable, usingProvable{

  struct Request {
    string id;
    uint bet;
    uint amount;
    address payable senderAddress;
  }

  uint public balance;

  mapping (bytes32 => Request) private requests;

  uint256 constant NUM_RANDOM_BYTES_REQUESTED = 1;
  uint256 public latestNumber;

  event betResult(string id, uint bet, uint outcome, uint amountWon);

  constructor() public payable {
    require(msg.value >= 0.1 ether, "need at least 0.1 ether to init the contract with");
    balance = msg.value;
  }

  function placeBet(string memory id, uint bet) public payable{
    require(balance >= msg.value, "Not enough ether in contract to allow the bet.");
    Request memory newRequest;
    newRequest.id = id;
    newRequest.bet = bet;
    newRequest.amount = msg.value;
    newRequest.senderAddress = msg.sender;

    bytes32 oracleRequestId = oracleRandomize();
    requests[oracleRequestId] = newRequest;

    /*
    uint result = randomize(2);
    uint toTransfer;

    if(bet == result)
    {
      toTransfer = msg.value * 2;
      balance = balance - toTransfer;
      //send 2x bet amount (bet + win) to sender
      msg.sender.transfer(toTransfer);
    }
    else
    {
      toTransfer = 0;
    }

    emit betResult(id, bet, result, toTransfer);
    */
  }

  //only used for local tests
  /*
  function testRandom() public returns (bytes32){
    bytes32 queryId = bytes32(keccak256(abi.encodePacked(msg.sender)));
    __callback(queryId, "1", bytes("test"));
    return queryId;
  }
  */

  function randomize(uint modulus) public view returns (uint){
    return now % modulus;
  }

  function __callback(bytes32 _queryId, string memory _result, bytes memory _proof) public{
    require(msg.sender == provable_cbAddress());
    uint256 randomNumber = uint256(keccak256(abi.encodePacked(_result))) % 2;
    latestNumber = randomNumber;
    Request memory callbackRequest = requests[_queryId];
    uint amountToTransfer = 0;
    uint uintResult = parseInt(_result);
    if(callbackRequest.bet == uintResult){
      amountToTransfer = callbackRequest.amount * 2;
      balance = balance - amountToTransfer;
      callbackRequest.senderAddress.transfer(amountToTransfer);
    }

    emit betResult(callbackRequest.id, callbackRequest.bet, uintResult, callbackRequest.amount * 2);
  }

  function oracleRandomize() payable public returns (bytes32){
    uint256 QUERY_EXECUTION_DELAY = 0;
    uint256 GAS_FOR_CALLBACK = 200000;
    //queryId used to map to the callback and then the user for result
    return provable_newRandomDSQuery(QUERY_EXECUTION_DELAY, NUM_RANDOM_BYTES_REQUESTED, GAS_FOR_CALLBACK);
    //return testRandom();
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
