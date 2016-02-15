// var linksController = require('../links/linkController.js');
var userController = require('../users/userController.js');
var testController = require('../test/testController.js');
var helpers = require('./helpers.js'); // our custom middleware

module.exports = function (app, express) {

  app.post('/api/users/signin', userController.signin);
  app.post('/api/users/signup', userController.signup);
  // app.put('/api/users/milage', userController.addMiles);
  // app.get('/api/users/signedin', userController.checkAuth);

  // authentication middleware used to decode token and made available on the request
  // app.use('/api/links', helpers.decode);
  // app.get('/api/links/', linksController.allLinks);
  app.post('/api/users/miles', userController.addMiles);
  app.get('/api/users/getUser', userController.getUser);
  app.get('/', testController.testFunc);
  // If a request is sent somewhere other than the routes above,
  // send it through our custom error handler
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);
};
