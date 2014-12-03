/**
 * MainController
 *
 * @description :: Server-side logic for managing mains
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	


  /**
   * `MainController.index()`
   */
  index: function (req, res) {
    return res.view('homepage');
  },
  
  app: function(req, res) {
    return res.view();
  }
};

