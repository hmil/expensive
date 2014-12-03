module.exports = function(req, res, next) {

  if (!req.isAuthenticated()) {
    return res.forbidden();
  }

  Expenditure.findOne(req.param('id')).exec(function(err, exp) {
    if (err) next(err);
    if (req.user.id === exp.person) {
      return next();
    } else {
      return res.forbidden();
    }
  });
};