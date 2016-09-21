// dependencies

var assert = require('assert');

var Q = require('q');

// exports

module.exports = Test;

// initialization

function Test() {

}

/*
 Execute tests synchronously.
 */
Test.prototype.start = function _start(executor) {
    try {
        executor();
    }
    catch (err) {
        if (err instanceof assert.AssertionError) {
            console.error("Failed test: \n" + err.message + ": actual - " + err.actual + ", expected - " + err.expected);
            throw new Error("Tests Failed!");
        }
        throw err;
    }
    console.log('Passed!');
};

/**
 * @param executor {function} Should return promise after execution
 */
Test.prototype.async = function _async(executor) {
    var deferred = Q.defer();

    _handleDeferred(deferred, executor());

    deferred.promise.then(function () {
        console.log('Passed!');
    }, function _executorFailed(err) {
        if (err instanceof assert.AssertionError) {
            console.error("Failed test: \n" + err.message + ": actual - " + err.actual + ", expected - " + err.expected);
            throw new Error("Tests Failed!");
        }
        throw err;
    }).done();
};

// private methods

function _handleDeferred(deferred, result) {
    if (!result || !result.then) {
        throw new Error("Function should be a promise value for async tests.");
    } else
        result.then(function (res) {
            deferred.resolve(res);
        }, function (err) {
            deferred.reject(err);
        }).catch(function (err) {
            deferred.reject(err);
        });
}