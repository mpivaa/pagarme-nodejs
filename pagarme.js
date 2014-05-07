function PagarMe() {}

PagarMe.api_key = null;
PagarMe.endpoint = "api.pagar.me";
PagarMe.api_version = 1;
PagarMe.Transaction = require('./transaction.js')(PagarMe);

PagarMe.full_api_url = function(path) {
  return PagarMe.endpoint + "/" + PagarMe.api_version + "/" + path;
}

PagarMe.api_path = function(path) {
  return "/" + PagarMe.api_version +"/" + path;
}

module.exports = PagarMe;