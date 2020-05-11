var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function() {
    //asks user's metamask to connect
    window.ethereum.enable().then(function(accounts){
    contractInstance = new web3.eth.Contract(abi, "0xf2e93fC226839004AFd919785Fc2340d53F4b754", {from: accounts[0]});
    console.log(contractInstance);
    });
    $("#realcoin_button").click({key:0}, placeBet);
    $("#shitcoin_button").click({key:1}, placeBet);
});


async function placeBet(bet){
  $("#result_output").text("");
  $("#img_output").hidden = true;

  var amountInput =$("#amount_input").val();
  console.log("betAmount: " +  amountInput);

  var config = {
    value: web3.utils.toWei($("#amount_input").val(), "ether")
  };

  console.log("bet: " +  bet.data.key);
  var id = Math.random().toString(36);
  console.log(id);
  try {
    let res = await contractInstance.methods.placeBet(id, bet.data.key).send(config);
        try{
            console.log(res);
            await contractInstance.getPastEvents(['betResult'], {id: id, fromBlock: 'latest', toBlock: 'latest'},
            async (err, events) => {
                console.log(events[0].returnValues);
                if(events[0].returnValues.amountWon > 0){
                  $("#result_output").text("You won " + web3.utils.fromWei(events[0].returnValues.amountWon, 'ether') + " ether!");
                }
                else {
                  $("#result_output").text("You are terrible at this game and lost " + amountInput + " ether!");
                }

                if(events[0].returnValues.outcome == 0){
                  $("#img_output").hidden = false;
                  $("#img_output").source = "./shitcoin.jpg";
                }
                else{
                  $("#img_output").hidden = false;
                  $("#img_output").source = "./realcoin.jpg";
                }
            });
        }catch(err){
        console.log(err)
        }
    }catch(err){
        console.log(err)
    }

  /*
  .then(function(result){
    console.log(result);
    for (var i = 0; i < result.events.length; i++) {
    var event = result.events[i];
    console.log(event);

    if (log.event == "Transfer") {
      // We found the event!
      break;
    }

  }
  });
/*
  .on("logs", function(logs){
    console.log(logs);
  })
  .on("receipt", function(receipt){
    console.log(receipt);
  });
*/
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
