!function(){
  "use strict";

  // Detect correct global context (browser or Node-like env)
  var e = "undefined" == typeof global ? self : global;

  // If require() doesn't exist, initialize a small module loader
  if ("function" != typeof e.require) {

    // Module definitions will be stored here
    var t = {},
        r = {},     // Module cache
        n = {},     // Aliases
        o = {}.hasOwnProperty,
        a = /^\.\.?(\/|$)/;

    // Resolve relative module paths
    var i = function(base, path) {
      var part, resolved = [],
          segments = (a.test(path) ? base + "/" + path : path).split("/");

      for (var k = 0; k < segments.length; k++) {
        part = segments[k];
        if (part === "..") resolved.pop();
        else if (part !== "." && part !== "") resolved.push(part);
      }
      return resolved.join("/");
    };

    // Returns directory of a path
    var u = function(path) {
      return path.split("/").slice(0, -1).join("/");
    };

    // Helper to inject local require with correct base path
    var c = function(base) {
      return function(request) {
        var name = i(u(base), request);
        return e.require(name, base);
      }
    };

    // Load module and execute factory
    var l = function(id, factory) {
      var hot = m && m.createHot(id),
          moduleObj = { id:id, exports:{}, hot:hot };

      r[id] = moduleObj;
      factory(moduleObj.exports, c(id), moduleObj);
      return moduleObj.exports;
    };

    // Follow aliases recursively
    var s = function(name) {
      var target = n[name];
      return target && name !== target ? s(target) : name;
    };

    // Resolve full module path
    var f = function(from, request) {
      return s(i(u(from), request));
    };

    // Main custom require()
    var p = function(name, requester) {
      if (requester == null) requester = "/";

      var resolved = s(name);

      if (o.call(r, resolved)) return r[resolved].exports;
      if (o.call(t, resolved)) return l(resolved, t[resolved]);

      throw new Error("Cannot find module '" + name + "' from '" + requester + "'");
    };

    // Allow alias creation: require.alias("a","b")
    p.alias = function(from, to) { n[to] = from; };

    // Store file extensions & index.js fallback
    var d = /\.[^.\/]+$/,
        y = /\/index(\.[^\/]+)?$/,
        h = function(name) {
          if (d.test(name)) {
            var noExt = name.replace(d, "");
            if (o.call(n, noExt)) {
              if (n[noExt].replace(d,"") !== noExt + "/index") n[noExt] = name;
            }
          }
          if (y.test(name)) {
            var base = name.replace(y, "");
            if (!o.call(n, base)) n[base] = name;
          }
        };

    // Register modules with their factory functions
    p.register = p.define = function(name, factory) {
      if (name && typeof name === "object") {
        for (var key in name) if (o.call(name, key)) p.register(key, name[key]);
      } else {
        t[name] = factory;
        delete r[name];
        h(name);
      }
    };

    // List all registered modules
    p.list = function() {
      var list = [];
      for (var key in t) if (o.call(t, key)) list.push(key);
      return list;
    };

    // Enable HMR (Hot Module Reload) if available
    var m = e._hmr && new e._hmr(f, p, t, r);

    p._cache = r;
    p.hmr = m && m.wrap;
    p.brunch = !0;

    e.require = p;
  }
}(),

/* -----------------------------
   REACT COMPONENT: App.jsx
-------------------------------- */
function() {
  ("undefined" == typeof window ? this : window);

  require.register("components/App.jsx", function(e, t, r) {

    // Standard React imports
    var React = t("react");
    var Speedometer = t("./Speedometer");

    // Main App component rendering the Speedometer
    class App extends React.Component {
      render() {
        return React.createElement(
          "main",
          { className: "Main" },
          React.createElement(Speedometer.default, null)
        );
      }
    }

    e.default = App;
  }),

  /* -----------------------------
     REACT COMPONENT: Speedometer
  -------------------------------- */
  require.register("components/Speedometer.jsx", function(e, t, r) {

    var React = t("react");
    var Store = t("./Store.js");
    var SwitchButton = t("react-switch-button");

    // Main Speedometer Class Component
    class Speedometer extends React.Component {

      constructor(props) {
        super(props);
        // Initial speedometer state
        this.state = {
          speed: 0,
          accuracy: 10,
          unit: true,  // true = km/h, false = mph
          geoStatus: false
        };
      }

      componentDidMount() {
        // Use geolocation if available
        if (navigator.geolocation) {
          navigator.geolocation.watchPosition(
            pos => this._onPosition(pos),
            err => this._onErrorPosition(err),
            { enableHighAccuracy:true }
          );
        }
      }

      render() {
        // Convert speed and calculate gauge needle angle
        var speed = this._setSpeed();
        var geoStatus = this.state.geoStatus ? "on" : "off";
        var accuracy = Math.min(this.state.accuracy, 50);

        // Gauge angle calculations
        var angleLimit = 180,
            factor1 = 1.5,
            factor2 = 0.4,
            angle = 0;

        if (speed < angleLimit)
          angle = (speed % angleLimit) * factor1;
        else
          angle = angleLimit * factor1 + (speed - angleLimit) * factor2;

        angle = Math.min(angle, 340);

        return React.createElement(
          "div",
          { className: "Speedometer" },

          /* Speed display and unit switcher */
          React.createElement(
            "div",
            { className: "Speedometer-speed" },

            React.createElement(
              "div",
              { className: "Speedometer-status" },

              // Accuracy pulse circle
              React.createElement("div", {
                className: "Speedometer-accuracy",
                style: { transform: "scale(" + accuracy / 40 + ")" }
              }),

              // GPS active/inactive LED
              React.createElement("div", {
                className: "Speedometer-led Speedometer-led--" + geoStatus
              })
            ),

            speed,

            // Unit switch (km/h <-> mph)
            React.createElement(SwitchButton.default, {
              theme: "Speedometer-unit",
              name: "switch-units",
              label: "mph",
              labelRight: "km/h",
              checked: this.state.unit ? "checked" : "",
              onChange: e => this._onSwitch(e)
            })
          ),

          // Speedometer arrow gauge
          React.createElement(
            "div",
            { className: "Speedometer-speedo" },
            React.createElement("div", {
              className: "Speedometer-arrow",
              style: { transform: "rotate(" + angle + "deg)" }
            })
          )
        );
      }

      // GPS position success handler
      _onPosition(e) {
        this.setState({
          speed: e.coords.speed,
          accuracy: e.coords.accuracy,
          geoStatus: true
        });
      }

      // GPS error handler
      _onErrorPosition(e) {
        this.setState({ geoStatus: false });
      }

      // Unit switch toggler
      _onSwitch(e) {
        this.setState({ unit: e.currentTarget.checked });
      }

      // Convert raw speed (m/s) to km/h or mph
      _setSpeed() {
        var speed = this.state.speed;

        if (speed == null || this.state.accuracy >= 30) return 0;

        speed *= 3.6;           // convert m/s → km/h
        if (!this.state.unit)   // convert km/h → mph
          speed /= 1.609344;

        return parseFloat(speed).toFixed(0);
      }
    }

    Speedometer.displayName = "Speedometer";

    // Wrap with localStorage state persistence (Store.js)
    e.default = Store.default(Speedometer, ["unit"]);
  }),

  /* -----------------------------
     LOCAL STORAGE WRAPPER (HOC)
  -------------------------------- */
  require.register("components/Store.js", function(e, t, r) {

    var local = localStorage;

    // Check if localStorage works (e.g., fails in private mode)
    if (local) {
      var test = "react-localstorage.hoc.test-key";
      try {
        localStorage.setItem(test, "foo");
        localStorage.removeItem(test);
      } catch (err) {
        local = false;
      }
    }

    // Store HOC implementation
    var WrapWithLocalStorage = function(Component, keys) {

      // If no localStorage, return component unchanged
      if (!local) return Component;

      var name = Component.displayName;

      // New component that extends original component
      class LocalStorageComponent extends Component {
        constructor() {
          super();
          this.keys = keys; // which state keys to store
        }

        // Load saved state before mount
        componentWillMount() {
          var saved = localStorage.getItem(name);
          if (saved) this.setState(JSON.parse(saved));
        }

        // Save updated state
        componentWillUpdate(nextProps, nextState) {
          localStorage.setItem(
            name,
            JSON.stringify(this._filterKeys(nextState))
          );
        }

        // Keep only selected keys
        _filterKeys(state) {
          if (this.keys) {
            var filtered = {};
            this.keys.map(k => filtered[k] = state[k]);
            return filtered;
          }
          return state;
        }
      }

      LocalStorageComponent.displayName = name;
      return LocalStorageComponent;
    };

    e.default = WrapWithLocalStorage;
  }),

  /* -----------------------------
     App initializer
  -------------------------------- */
  require.register("initialize.js", function(e, t, r) {

    var ReactDOM = t("react-dom");
    var React = t("react");
    var App = t("components/App");

    // Render App into #app container
    document.addEventListener("DOMContentLoaded", function() {
      ReactDOM.default.render(
        React.default.createElement(App.default, null),
        document.querySelector("#app")
      );
    });

    // Register service worker if available
    "serviceWorker" in navigator &&
      navigator.serviceWorker.register("sw.js");
  }),

  require.register("___globals___", function(e, t, r){})
}(),
require("___globals___");
