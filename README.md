# Timers

Promises-like timer library

Here is one method - `infinite` for a while. You can use it to start infinite executing of your callback. If your callback return a promise the timer you created will be waiting for resolution of your promise. If the result of your callback is rejected then the timer is stopped. If the result is executed the timer is created new iteration of executing your callback.
