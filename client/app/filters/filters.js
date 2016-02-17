// Setup the filter
app.filter('testFilter', function() {
  return function(username) {
    console.log(username)
  };
});
