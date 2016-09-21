// dependencies

var assert = require('assert');
var Q = require('q');

var timers = require('./src/timers');

// initialization

var testTimer = timers.infinite(function () {
    console.log("Hello!");
}, 100);

assert.ok(testTimer.cancel, "'cancel' method of timer must be exist");

testTimer.cancel();

module.exports = {
    execute: _execute
};

// private functions

function _execute() {
    return Q.all([
        _generateHelloTimerTest(6000, 5000),
        _generateHelloTimerTest(2000, 5000),
        _generateHelloTimerTest(2000, 1000),
        _generateHelloTimerTest(300, 1000),
        _generateHelloTimerTest(2000, 0),
        _generateHelloTimerTest(3000, 0)
    ]);
}

function _generateHelloTimerTest(timerDelay, waitingToCancel) {
    var timer = timers.infinite(_hello, timerDelay);

    return Q.delay(waitingToCancel).then(function () {
        return _cancel(timer);
    }).then(function (res) {
        assert.equal(res.counter, Math.ceil(waitingToCancel / timerDelay) || 1);
    });

    function _hello() {
        console.log(`Hello (${timerDelay}, ${waitingToCancel})`);
    }
}

function _cancel(timer) {
    console.log('Should be cancelled right now.');
    return timer.cancel();
}