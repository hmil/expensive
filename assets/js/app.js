
var start = _.once(function() {

  var expenditures = window.expenditures = new Expenditures();

  io.socket.get('/expenditure', function(models, jwres) {
    expenditures.set(models, {parse: true});
  });

  io.socket.on('expenditure', function(evt) {
    switch (evt.verb) {
      case 'created':
        expenditures.add(evt.data, {parse: true});
        break;
      case 'destroyed':
        expenditures.remove(evt.id);
        break;
      case 'updated':
        expenditures.set(
          _.extend({id: evt.id}, evt.data), 
          { parse: true, remove: false }
        );
        break;
      default:
        throw new Error("Unknown verb: "+evt.verb);
    }
  });

  expenditures.on('all', refreshUI);



  // DOM
  var createForm  = $('#add-expenditure-form');
  var editForm    = $('#edit-expenditure-form');
  var item_pool   = $('#expenditures');
  var editModal   = $('#editModal');
  var balance     = $('#balance');
  var item_tpl    = JST['assets/templates/expenditureItem.ejs'];
  var balance_tpl = JST['assets/templates/balance.ejs'];
  var $items      = {};
  var editedItem  = null;


  $('#app')
    .delegate('a[data-action=delete]', 'click', itemAction(function(id) {
      io.socket.delete('/expenditure/'+id, function(data, res) {
        if (res.statusCode === 200) {
          expenditures.remove(id);
        } else {
          console.err(data);
        }
      });
    }))
    .delegate('a[data-action=edit]', 'click', itemAction(function(id) {
      editedItem = expenditures.get(id);
      fillModalForm(editedItem);
      editModal.modal('show');
    }));


  $('#editModal-accept-btn').click(itemAction(function(evt) {

    var formData = getFormData(editForm);
    var id = editedItem.id;
    
    io.socket.put('/expenditure/'+id, formData, function(data, res) {
      if (res.statusCode === 200) {
        expenditures.set(
          _.defaults({id: id}, data), 
          {parse: true, remove: false}
        );
      } else {
        console.err(data);
      }
    });

    editModal.modal('hide');
  }));



  createForm.submit(formAction(createForm, function(formData) {
    console.log(formData);
    io.socket.post('/expenditure', formData, function(data, res) {
      if (res.statusCode === 201) {
        expenditures.add(new expenditures.model(data, {parse: true}));
      } else {
        console.log(data);
      }
    });

  }));




  resetForm(createForm);
  $('.spreadsheet').perfectScrollbar();

  function getFormData(form) {
    return {
      amount: form.find('[name=amount]').val(),
      date: (new Date(form.find('[name=date]').val())).toJSON(),
      description: form.find('[name=description]').val()
    };
  }

  function resetForm(form) {
    form.find('input[type=date]').val((new Date()).toISOString().split('T')[0]);
    form.find('input[type=text]').val('');
  }

  function fillModalForm(item) {
    $('#editModal').find('input[name=date]').val(item.get('date').toISOString().split('T')[0]);
    $('#editModal').find('input[name=amount]').val(item.get('amount'));
    $('#editModal').find('input[name=description]').val(item.get('description'));
  }

  function refreshUI() {
    _.each($items, function(val, key) {
      $items[key].remove();
      delete $items[key];
    });
    expenditures.each(function(item) {
      var $el = $(item_tpl(item.attributes));
      $items[item.id] = $el;
      item_pool.append($el);
    });

    balance.html(balance_tpl({expenditures: expenditures}));

    $('.spreadsheet').perfectScrollbar('update');
  }


  function formAction(form, cb) {
    return function(evt) {
      evt.preventDefault();
      evt.stopPropagation();

      var formData = getFormData(form);
      resetForm(form);
      cb(formData);
    }
  }

  function itemAction(cb) {
    return function(evt) {
      evt.preventDefault();
      evt.stopPropagation();

      var id = $(evt.currentTarget).attr('data-id');
      cb(id);
    };
  }

});

function renderExpense(amount) {
  return '<span class="expense expense-'+ (amount >= 0 ? 'positive' : 'negative') +'">'
          + amount +'</span>';
}



$(function(){
  $('#app').each(start);
});