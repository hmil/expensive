

var Expenditure = Backbone.Model.extend({
  parse: function(data) {
    if (data.date) {
      data.date = new Date(data.date);
    }
    return data;
  }
});


var Expenditures = Backbone.Collection.extend({
  model: Expenditure,
  comparator: 'date',

  totalPeople: function() {
    return _(this.map(function(el) { 
        return el.get('person').id; 
      })).uniq().length;
  },

  totalBalance: function() {
    return this.reduce(function(memo, el) {
      return memo + el.get('amount');
    }, 0);
  },

  personalExpense: function(personId) {
    return _(this.filter(function(el) { 
        return el.get('person').id === personId; 
      })).reduce(function(memo, el) {
        return memo + el.get('amount');
      }, 0);
  }
});