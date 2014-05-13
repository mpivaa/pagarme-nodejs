module.exports = function(PagarMe) {
  var Request = require('./request')(PagarMe);
  function ModelConstructor(model_name) {
    var Model = function(attrs) {
      this.model_name = model_name;
      this.update(attrs);
    }

    Model.url = function (){
      return model_name.toLowerCase()+'s';
    }

    Model.prototype.url = function() {
      if(!this.id) {
        throw new Error("Cant save model");
      }
      return this.constructor.url() + '/' + this.id;
    }

    Model.prototype.update = function(attrs) {
      for(var i in attrs) {
        this[i] = attrs[i];
      }
    }

    Model.prototype.save = function(callback) {
      callback = callback || function () {}
      var _this = this;
      var request = new Request(this.constructor.url(), 'PUT');
      request.parameters = this;
      request.run();
      request.success = function(res, data) {
        _this.update(data);
        callback(null);
      }
    }

    Model.prototype.create = function(callback) {
      callback = callback || function () {}
      var _this = this;
      var request = new Request(this.constructor.url());
      request.parameters = this;
      request.run();
      request.success = function(res, data) {
        _this.update(data);
        callback(null);
      }
    }

    Model.find_by_id = function(id, callback) {
      callback = callback || function () {}
      var _this = this;
      var request = new Request(Model.url() + '/' + id, 'GET');
      request.run();
      request.success = function(res, data) {
        var model = new Model(data);
        callback(null, model);
      }
    }

    Model.find_by = function(params, callback, page, count) {
      page = page || 1
      count = count || 10
      callback = callback || function () {}
      if(page < 1 || count < 1) {
        callback(new Error('Page or count cant be less than 0'), null);
      }
      var _this = this;
      var request = new Request(Model.url(), 'GET');
      request.params = params;
      request.params.page = page;
      request.params.count = count;
      request.run();
      request.success = function(res, data) {
        var models = [];
        for(var i in data)
          models.push(new Model(data[i]));
        callback(null, model);
      }
    }

    Model.all = function(callback, page, count) {
      page = page || 1
      count = count || 10
      callback = callback || function () {}

      var _this = this;
      var request = new Request(Model.url(), 'GET');
      request.params = {page: page, count: count}
      request.run();
      request.success = function(res, data) {
        var models = [];
        for(var i in data)
          models.push(new Model(data[i]));
        callback(null, models);
      }
    }

    return Model;
  }

  return ModelConstructor;
}