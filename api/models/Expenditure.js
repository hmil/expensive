/**
* Expenditure.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var Expenditure = {

  attributes: {
    person    : { 
      model: 'user',
      required: true
    },
    amount    : { 
      type: 'integer', 
      required: true 
    },
    date      : { 
      type: 'date', 
      required: true
    },
    description: { 
      type: 'string' 
    }
  }
};

module.exports = Expenditure;