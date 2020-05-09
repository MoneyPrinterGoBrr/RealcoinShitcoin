var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function() {
    //asks user's metamask to connect
    window.ethereum.enable().then(function(accounts){
    contractInstance = new web3.eth.Contract(abi, "0xB7765E93c8eF557a58199f5BED77AE089117bFec", {from: accounts[0]});
    console.log(contractInstance);
    });
    $("#shitcoin_button").click(placeBet);
    $("#realcoin_button").click(placeBet);
});


function placeBet(){
  var betAmount = web3.utils.toWei($("#amount_input").val(), "ether");

  var config = {
    value: web3.utils.toWei("1", "ether")
  };

  contractInstance.methods.placeBet(bet, betAmount).send(config).then(function(res){
    if(res.amount > 0)
    {
      $("#result_output").text("You won " + res.amount + " ether!");
    }
    else {
      $("#result_output").text("You are terrible at this game and lost " + res.amount + " ether!");
    }
  })
  .on("transactionHash", function(hash){
    console.log(hash);
  })
  .on("confirmation", function(confirmationNr){
    console.log(confirmationNr);
  })
  .on("receipt", function(receipt){
    console.log(receipt);
    alert("Done");
  })


}

function fetchAndDisplay(){
  contractInstance.methods.getPerson().call().then(function(res){
    $("#name_output").text(res.name);
    $("#age_output").text(res.age);
    $("#height_output").text(res.height);
  })
}
