/* Load BEFORE LINE/Firebase SDK scripts, including module imports. */
(function () {
  'use strict';
  if (typeof AbortController === 'undefined' || typeof AbortSignal === 'undefined') return;
  function reasonOf(s) {
    return s.reason !== undefined ? s.reason : new DOMException('The operation was aborted.', 'AbortError');
  }
  if (typeof AbortSignal.any !== 'function') {
    Object.defineProperty(AbortSignal, 'any', {
      configurable: true, writable: true,
      value: function (iterable) {
        var signals = Array.from(iterable);
        var controller = new AbortController();
        var listeners = [];
        signals.forEach(function (s) {
          if (!s || typeof s.addEventListener !== 'function' || typeof s.aborted !== 'boolean') {
            throw new TypeError('AbortSignal.any requires AbortSignal inputs');
          }
        });
        function clean() {
          listeners.forEach(function (p) { p[0].removeEventListener('abort', p[1]); });
          listeners = [];
        }
        function finish(s) {
          if (!controller.signal.aborted) controller.abort(reasonOf(s));
          clean();
        }
        for (var i = 0; i < signals.length; i++) {
          if (signals[i].aborted) { finish(signals[i]); return controller.signal; }
        }
        signals.forEach(function (s) {
          var fn = function () { finish(s); };
          listeners.push([s, fn]);
          s.addEventListener('abort', fn, { once: true });
        });
        return controller.signal;
      }
    });
  }
  if (typeof AbortSignal.timeout !== 'function') {
    Object.defineProperty(AbortSignal, 'timeout', {
      configurable: true, writable: true,
      value: function (ms) {
        if (!Number.isFinite(ms) || ms < 0) throw new RangeError('Invalid timeout');
        var c = new AbortController();
        setTimeout(function () { c.abort(new DOMException('The operation timed out.', 'TimeoutError')); }, ms);
        return c.signal;
      }
    });
  }
})();
