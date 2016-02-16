// var linksController = require('../links/linkController.js');
var userController = require('../users/userController.js');
var helpers = require('./helpers.js'); // our custom middleware

module.exports = function (app, express) {

  app.post('/api/users/signin', userController.signin);
  app.post('/api/users/signup', userController.signup);
  app.post('/api/users/miles', userController.addMiles);
  app.get('/api/users/getUser', userController.getUser);
  app.put('/api/users/profile', userController.setUser);
  app.put('/api/users/ridingGroup', userController.addRidingPartner);

  // If a request is sent somewhere other than the routes above,
  // send it through our custom error handler
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);
};
