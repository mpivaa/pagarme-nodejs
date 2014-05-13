module.exports = function(PagarMe) {
  var Request = require('./request')(PagarMe);
  var base64 = require('../utils/base64');
  var querystring = require('querystring');

  var Transaction = new PagarMe.ModelConstructor("Transaction");

  Transaction.prototype.charge = function() {
    var _this = this;
    var request = new Request(this.constructor.url());
    request.params = this;
    request.run();
    request.error = this.error;
    request.api_error = this.api_error;
    request.success = function(res, data) {
      _this.update(data);
      if(data.status === "refused") {
        _this.refused();
      } else if(data.status === "paid") {
        _this.paid();
      }
    }
  }

  Transaction.prototype.refund = function(callback) {
    callback = callback || function () {}
    var _this = this;
    var request = new Request(this.url() + '/refund');
    request.params = this;
    request.run();
    request.error = this.error;
    request.api_error = this.api_error;
    request.success = function(res, data) {
      _this.update(data);
      callback(res);
    }
  }

  Transaction.prototype.card_data_parameters = function () {
    return {
      card_number: this.card_number,
      card_holder_name: this.card_holder_name,
      card_expiration_date: this.card_expiration_date,
      card_cvv: this.card_cvv
    }
  }

  Transaction.prototype.generate_card_hash = function() {
    var _this = this;
    var request = new Request(Transaction.url() + "/card_hash_key", 'GET')
    request.run();
    request.success(function(res, data) {
      //ursa will crypt
      data['public_key']
      params = querystring.stringify(_this.card_data_parameters());
      data['id']+"_"+base64.encode(public_key.public_encrypt())
    })
  }

  Transaction.prototype.paid = function () {}
  Transaction.prototype.refused = function () {}
  Transaction.prototype.error = function () {}
  Transaction.prototype.api_error = function () {}
  return Transaction;
}

