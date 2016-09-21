// dependencies

var Test = require('./test');
var cases = require('./cases');

// initialization

var instance = new Test();

instance.async(function () {
    return cases.execute();
});

// private methods