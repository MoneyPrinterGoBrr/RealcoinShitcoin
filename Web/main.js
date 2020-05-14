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
  $("#div_shitcoin").css({display:"none"});
  $("#div_realcoin").css({display:"none"});

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
                  $("#result_output").text("You won " + amountInput + " ether!");
                }
                else {
                  $("#result_output").text("You are terrible at this game and lost " + amountInput + " ether!");
                }

                if(events[0].returnValues.outcome == 0){
                  $("#div_realcoin").css({display:"block"});
                }
                else{
                  $("#div_shitcoin").css({display:"block"});
                }
            });
        }catch(err){
        console.log(err)
        }
    }catch(err){
        console.log(err)
    }
}

function fetchAndDisplay(){
  contractInstance.methods.getPerson().call().then(function(res){
    $("#name_output").text(res.name);
    $("#age_output").text(res.age);
    $("#height_output").text(res.height);
  })
}
