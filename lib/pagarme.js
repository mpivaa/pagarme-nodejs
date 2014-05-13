function PagarMe() {}

PagarMe.api_key = null;
PagarMe.endpoint = "api.pagar.me";
PagarMe.endpoint_protocol = 'https';
PagarMe.api_version = 1;
PagarMe.ModelConstructor = require('./pagarme/model')(PagarMe);

PagarMe.Customer = new PagarMe.ModelConstructor("Customer");
PagarMe.Phone = new PagarMe.ModelConstructor("Phone");
PagarMe.Address = new PagarMe.ModelConstructor("Address");

PagarMe.Transaction = require('./pagarme/transaction')(PagarMe);

PagarMe.full_api_url = function(path) {
  return PagarMe.endpoint_protocol + '://' + PagarMe.endpoint + "/" + PagarMe.api_version + "/" + path;
}

PagarMe.api_path = function(path) {
  return "/" + PagarMe.api_version +"/" + path;
}

module.exports = PagarMe;