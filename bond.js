// Generated by CoffeeScript 1.3.3
(function() {
  var allStubs, arrayEqual, bond, createReturnSpy, createThroughSpy, enhanceSpy, registerHooks, registeredHooks,
    __slice = [].slice;

  createThroughSpy = function(getValue, bondApi) {
    var spy;
    spy = function() {
      var args, isConstructor, result;
      args = Array.prototype.slice.call(arguments);
      spy.calledArgs[spy.called] = args;
      spy.called++;
      isConstructor = Object.keys(this).length === 0;
      result = getValue.apply(this, args);
      if (isConstructor) {
        return this;
      }
      return result;
    };
    return enhanceSpy(spy, getValue, bondApi);
  };

  createReturnSpy = function(getValue, bondApi) {
    var spy;
    spy = function() {
      var args;
      args = Array.prototype.slice.call(arguments);
      spy.calledArgs[spy.called] = args;
      spy.called++;
      return getValue.apply(this, args);
    };
    return enhanceSpy(spy, getValue, bondApi);
  };

  enhanceSpy = function(spy, original, bondApi) {
    var k, v;
    spy.prototype = original.prototype;
    spy.called = 0;
    spy.calledArgs = [];
    spy.calledWith = function() {
      var args, lastArgs;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (!spy.called) {
        return false;
      }
      lastArgs = spy.calledArgs[spy.called - 1];
      return arrayEqual(args, lastArgs);
    };
    for (k in bondApi) {
      v = bondApi[k];
      spy[k] = v;
    }
    return spy;
  };

  arrayEqual = function(A, B) {
    var a, b, i, _i, _len;
    for (i = _i = 0, _len = A.length; _i < _len; i = ++_i) {
      a = A[i];
      b = B[i];
      if (a !== b) {
        return false;
      }
    }
    return true;
  };

  registeredHooks = false;

  allStubs = [];

  registerHooks = function() {
    var after, _ref, _ref1;
    if (registeredHooks) {
      return;
    }
    after = (_ref = (_ref1 = typeof afterEach !== "undefined" && afterEach !== null ? afterEach : testDone) != null ? _ref1 : this.cleanup) != null ? _ref : function() {
      throw new Error('bond.cleanup must be specified if your test runner does not use afterEach or testDone');
    };
    return after(function() {
      var stubRestore, _i, _len;
      for (_i = 0, _len = allStubs.length; _i < _len; _i++) {
        stubRestore = allStubs[_i];
        stubRestore();
      }
      return allStubs = [];
    });
  };

  bond = function(obj, property) {
    var previous, registerRestore, restore, returnMethod, through, to;
    if (arguments.length === 0) {
      return createReturnSpy(function() {});
    }
    registerHooks();
    previous = obj[property];
    if (!(previous != null)) {
      throw new Error("Could not find property " + property + ".");
    }
    registerRestore = function() {
      return allStubs.push(restore);
    };
    restore = function() {
      return obj[property] = previous;
    };
    to = function(newValue) {
      registerRestore();
      obj[property] = newValue;
      return obj[property];
    };
    returnMethod = function(returnValue) {
      var returnValueFn;
      registerRestore();
      returnValueFn = function() {
        return returnValue;
      };
      obj[property] = createReturnSpy(returnValueFn, this);
      return obj[property];
    };
    through = function() {
      obj[property] = createThroughSpy(previous, this);
      return obj[property];
    };
    return {
      to: to,
      "return": returnMethod,
      through: through,
      restore: restore
    };
  };

  bond.version = '0.0.8';

  if (typeof window !== "undefined" && window !== null) {
    window.bond = bond;
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = bond;
  }

}).call(this);
