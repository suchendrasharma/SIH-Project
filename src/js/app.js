App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("../Certification.json", function(certificate) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Certification = TruffleContract(certificate);
      // Connect provider to interact with contract
      App.contracts.Certification.setProvider(App.web3Provider);
      return App.render();
    });
  },


  render: function() {

        web3.eth.getCoinbase(function(err, account) {
            if (err === null) {
                App.account = account;
            }
        });
        App.contracts.Certification.deployed().then(function(instance){
          return instance.getData("1");
        }).then((certificate) =>{
          console.log(certificate);
        })
  },

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});