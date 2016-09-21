// dependencies

var Q = require('q');

// exports

module.exports = {
    infinite: _infinite
};

// private methods

function _infinite(callback, delay) {
    var iterationCounter = 0;
    var currentIteration;

    if (!callback) {
        throw new Error("Callback wasn't provided.");
    }

    if (!delay || typeof delay !== 'number') {
        throw new Error("Delay wasn't provided or it is not a number.");
    }

    var promise = _startLoop(delay, callback, _changeCurrentIteration).fail(_reject);
    promise.cancel = _cancel;
    return promise;

    function _changeCurrentIteration(iteration) {
        currentIteration = iteration;
        currentIteration.counter = ++iterationCounter;
    }

    function _cancel() {
        console.log("Cancelling iteration " + currentIteration.counter);
        currentIteration.reject({ cancelled: true });
        return currentIteration;
    }
}

function _reject(rejection) {
    if (!rejection.cancelled) throw rejection;
}

function _startLoop(delay, callback, onIterationChanged) {
    var iteration = _executeNewIteration(delay, callback);
    var loop = iteration.action.then(_startLoop.bind(null, delay, callback, onIterationChanged));
    (typeof onIterationChanged === 'function') && onIterationChanged(iteration);
    return loop;
}

function _executeNewIteration(delay, callback) {
    var iteration = _createIteration(delay);

    iteration.action = iteration.promise.then(callback);

    return iteration;
}

function _createIteration(delay) {
    var delayed = Q.delay(delay);
    var deferred = Q.defer();
    delayed.then(deferred.resolve);
    return deferred;
}