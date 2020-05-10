var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function() {
    //asks user's metamask to connect
    window.ethereum.enable().then(function(accounts){
    contractInstance = new web3.eth.Contract(abi, "0xD1adFA911331B06433cc734932FcFe7fE258f466", {from: accounts[0]});
    console.log(contractInstance);
    });
    $("#shitcoin_button").click({key:"Shitcoin"}, placeBet);
    $("#realcoin_button").click({key:"Realcoin"}, placeBet);
});


function placeBet(bet){
  var amountInput =$("#amount_input").val();
  console.log("betAmount: " +  amountInput);
  var config = {
    value: web3.utils.toWei($("#amount_input").val(), "ether")
  };

  console.log("bet: " +  bet.data.key);
  contractInstance.methods.placeBet(bet.data.key).send(config)
  .on("receipt", function(receipt){
    console.log(receipt);
  });
  //console.log("result: " + result);
  //console.log("resultLogs0: " + result.logs[0]);
  /*
  contractInstance.methods.placeBet(bet.data.key).send(config)
  .then(function(result){
    console.log("result: " + result);
    console.log("resultLogs0: " + result.logs[0]);

    if(amount > 0)
    {
      $("#result_output").text("You won " + res[1] + " ether!");
    }
    else {
      $("#result_output").text("You are terrible at this game and lost " + res[1] + " ether!");
    }
  });
  */
}

function fetchAndDisplay(){
  contractInstance.methods.getPerson().call().then(function(res){
    $("#name_output").text(res.name);
    $("#age_output").text(res.age);
    $("#height_output").text(res.height);
  })
}
