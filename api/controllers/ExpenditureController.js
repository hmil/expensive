/**
 * ExpenditureController
 *
 * @description :: Server-side logic for managing expenditures
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	create: function(req, res, next) {

    var data = {
      description: req.param('description'),
      amount: req.param('amount'),
      person: req.user,
      date: req.param('date') != null ? new Date(req.param('date')) : new Date()
    };



    // Create new instance of model using data from params
    Expenditure.create(data).exec(function(err, data) {
      if (err) return next(err);

      var expenditure = _.extend(data, {person: req.user});

      if (req.isSocket) {
        // Subscribe the current socket
        Expenditure.subscribe(req, expenditure);
        // Introduce all class listeners to this instance
        Expenditure.introduce(expenditure);
      }

      Expenditure.publishCreate(expenditure, req);

      // (HTTP 201: Created)
      res.status(201).send(expenditure.toJSON());
    });
    
  }
};

