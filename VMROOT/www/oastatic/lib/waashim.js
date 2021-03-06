(function e(t, n, o) {
    function i(a, s) {
        if (!n[a]) {
            if (!t[a]) {
                var c = typeof require == "function" && require;
                if (!s && c) return c(a, !0);
                if (r) return r(a, !0);
                var u = new Error("Cannot find module '" + a + "'");
                throw u.code = "MODULE_NOT_FOUND", u
            }
            var f = n[a] = {
                exports: {}
            };
            t[a][0].call(f.exports, function(e) {
                var n = t[a][1][e];
                return i(n ? n : e)
            }, f, f.exports, e, t, n, o)
        }
        return n[a].exports
    }
    var r = typeof require == "function" && require;
    for (var a = 0; a < o.length; a++) i(o[a]);
    return i
})({
    1: [function(e, t, n) {
        t.exports = e("./lib/install")(Infinity)
    }, {
        "./lib/install": 6
    }],
    2: [function(e, t, n) {
        (function(e) {
            "use strict";
            Object.defineProperty(n, "__esModule", {
                value: true
            });
            n.install = i;
            var t = e.AnalyserNode;

            function o() {
                if (t.prototype.hasOwnProperty("getFloatTimeDomainData")) {
                    return
                }
                var e = new Uint8Array(2048);
                t.prototype.getFloatTimeDomainData = function(t) {
                    this.getByteTimeDomainData(e);
                    for (var n = 0, o = t.length; n < o; n++) {
                        t[n] = (e[n] - 128) * .0078125
                    }
                }
            }

            function i() {
                o()
            }
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {}],
    3: [function(e, t, n) {
        (function(e) {
            "use strict";
            Object.defineProperty(n, "__esModule", {
                value: true
            });
            n.install = r;
            var t = e.AudioBuffer;

            function o() {
                if (t.prototype.hasOwnProperty("copyFromChannel")) {
                    return
                }
                t.prototype.copyFromChannel = function(e, t, n) {
                    var o = this.getChannelData(t | 0).subarray(n | 0);
                    e.set(o.subarray(0, Math.min(o.length, e.length)))
                }
            }

            function i() {
                if (t.prototype.hasOwnProperty("copyToChannel")) {
                    return
                }
                t.prototype.copyToChannel = function(e, t, n) {
                    var o = e.subarray(0, Math.min(e.length, this.length - (n | 0)));
                    this.getChannelData(t | 0).set(o, n | 0)
                }
            }

            function r() {
                o();
                i()
            }
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {}],
    4: [function(e, t, n) {
        (function(t) {
            "use strict";
            Object.defineProperty(n, "__esModule", {
                value: true
            });
            var o = function() {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var o = t[n];
                        o.enumerable = o.enumerable || false;
                        o.configurable = true;
                        if ("value" in o) o.writable = true;
                        Object.defineProperty(e, o.key, o)
                    }
                }
                return function(t, n, o) {
                    if (n) e(t.prototype, n);
                    if (o) e(t, o);
                    return t
                }
            }();
            var i = function x(e, t, n) {
                var o = true;
                e: while (o) {
                    var i = e,
                        r = t,
                        a = n;
                    s = c = u = undefined;
                    o = false;
                    if (i === null) i = Function.prototype;
                    var s = Object.getOwnPropertyDescriptor(i, r);
                    if (s === undefined) {
                        var c = Object.getPrototypeOf(i);
                        if (c === null) {
                            return undefined
                        } else {
                            e = c;
                            t = r;
                            n = a;
                            o = true;
                            continue e
                        }
                    } else if ("value" in s) {
                        return s.value
                    } else {
                        var u = s.get;
                        if (u === undefined) {
                            return undefined
                        }
                        return u.call(a)
                    }
                }
            };
            n.install = C;

            function r(e, t) {
                if (!(e instanceof t)) {
                    throw new TypeError("Cannot call a class as a function")
                }
            }

            function a(e, t) {
                if (typeof t !== "function" && t !== null) {
                    throw new TypeError("Super expression must either be null or a function, not " + typeof t)
                }
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                });
                if (t) e.__proto__ = t
            }
            var s = t.AudioContext;
            var c = t.OfflineAudioContext;
            var u = t.AudioNode;
            var f = t.EventTarget || t.Object.constructor;

            function l() {}

            function d(e, t) {
                e.prototype = Object.create(t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                })
            }

            function h() {
                if (t.AudioContext !== s) {
                    return
                }

                function e(e) {
                    this._ = {};
                    this._.audioContext = e;
                    this._.destination = e.destination;
                    this._.state = "";
                    this._.currentTime = 0;
                    this._.sampleRate = e.sampleRate;
                    this._.onstatechange = null
                }
                d(e, f);
                Object.defineProperties(e.prototype, {
                    destination: {
                        get: function h() {
                            return this._.destination
                        }
                    },
                    sampleRate: {
                        get: function p() {
                            return this._.sampleRate
                        }
                    },
                    currentTime: {
                        get: function y() {
                            return this._.currentTime || this._.audioContext.currentTime
                        }
                    },
                    listener: {
                        get: function _() {
                            return this._.audioContext.listener
                        }
                    },
                    state: {
                        get: function v() {
                            return this._.state
                        }
                    },
                    onstatechange: {
                        set: function g(e) {
                            if (typeof e === "function") {
                                this._.onstatechange = e
                            }
                        },
                        get: function m() {
                            return this._.onstatechange
                        }
                    }
                });
                var n = function(e) {
                    function t() {
                        r(this, t);
                        i(Object.getPrototypeOf(t.prototype), "constructor", this).call(this, new s);
                        this._.state = "running";
                        if (!s.prototype.hasOwnProperty("suspend")) {
                            this._.destination = this._.audioContext.createGain();
                            this._.destination.connect(this._.audioContext.destination);
                            this._.destination.connect = function() {
                                this._.audioContext.destination.connect.apply(this._.audioContext.destination, arguments)
                            };
                            this._.destination.disconnect = function() {
                                this._.audioContext.destination.connect.apply(this._.audioContext.destination, arguments)
                            };
                            this._.destination.channelCountMode = "explicit"
                        }
                    }
                    a(t, e);
                    return t
                }(e);
                n.prototype.suspend = function() {
                    var e = this;
                    if (this._.state === "closed") {
                        return Promise.reject(new Error("cannot suspend a closed AudioContext"))
                    }

                    function n() {
                        this._.state = "suspended";
                        this._.currentTime = this._.audioContext.currentTime
                    }
                    var o = undefined;
                    if (typeof this._.audioContext === "function") {
                        o = this._.audioContext.suspend();
                        o.then(function() {
                            n.call(e)
                        })
                    } else {
                        u.prototype.disconnect.call(this._.destination);
                        o = Promise.resolve();
                        o.then(function() {
                            n.call(e);
                            var o = new t.Event("statechange");
                            if (typeof e._.onstatechange === "function") {
                                e._.onstatechange(o)
                            }
                            e.dispatchEvent(o)
                        })
                    }
                    return o
                };
                n.prototype.resume = function() {
                    var e = this;
                    if (this._.state === "closed") {
                        return Promise.reject(new Error("cannot resume a closed AudioContext"))
                    }

                    function n() {
                        this._.state = "running";
                        this._.currentTime = 0
                    }
                    var o = undefined;
                    if (typeof this._.audioContext.resume === "function") {
                        o = this._.audioContext.resume();
                        o.then(function() {
                            n.call(e)
                        })
                    } else {
                        u.prototype.connect.call(this._.destination, this._.audioContext.destination);
                        o = Promise.resolve();
                        o.then(function() {
                            n.call(e);
                            var o = new t.Event("statechange");
                            if (typeof e._.onstatechange === "function") {
                                e._.onstatechange(o)
                            }
                            e.dispatchEvent(o)
                        })
                    }
                    return o
                };
                n.prototype.close = function() {
                    var e = this;
                    if (this._.state === "closed") {
                        return Promise.reject(new Error("Cannot close a context that is being closed or has already been closed."))
                    }

                    function n() {
                        this._.state = "closed";
                        this._.currentTime = Infinity;
                        this._.sampleRate = 0
                    }
                    var o = undefined;
                    if (typeof this._.audioContext.close === "function") {
                        o = this._.audioContext.close();
                        o.then(function() {
                            n.call(e)
                        })
                    } else {
                        if (typeof this._.audioContext.suspend === "function") {
                            this._.audioContext.suspend()
                        } else {
                            u.prototype.disconnect.call(this._.destination)
                        }
                        o = Promise.resolve();
                        o.then(function() {
                            n.call(e);
                            var o = new t.Event("statechange");
                            if (typeof e._.onstatechange === "function") {
                                e._.onstatechange(o)
                            }
                            e.dispatchEvent(o)
                        })
                    }
                    return o
                };
                ["addEventListener", "removeEventListener", "dispatchEvent", "createBuffer"].forEach(function(e) {
                    n.prototype[e] = function() {
                        return this._.audioContext[e].apply(this._.audioContext, arguments)
                    }
                });
                ["decodeAudioData", "createBufferSource", "createMediaElementSource", "createMediaStreamSource", "createMediaStreamDestination", "createAudioWorker", "createScriptProcessor", "createAnalyser", "createGain", "createDelay", "createBiquadFilter", "createWaveShaper", "createPanner", "createStereoPanner", "createConvolver", "createChannelSplitter", "createChannelMerger", "createDynamicsCompressor", "createOscillator", "createPeriodicWave"].forEach(function(e) {
                    n.prototype[e] = function() {
                        if (this._.state === "closed") {
                            throw new Error("Failed to execute '" + e + "' on 'AudioContext': AudioContext has been closed")
                        }
                        return this._.audioContext[e].apply(this._.audioContext, arguments)
                    }
                });
                var l = function(e) {
                    function t(e, n, o) {
                        r(this, t);
                        i(Object.getPrototypeOf(t.prototype), "constructor", this).call(this, new c(e, n, o));
                        this._.state = "suspended"
                    }
                    a(t, e);
                    o(t, [{
                        key: "oncomplete",
                        set: function n(e) {
                            this._.audioContext.oncomplete = e
                        },
                        get: function s() {
                            return this._.audioContext.oncomplete
                        }
                    }]);
                    return t
                }(e);
                ["addEventListener", "removeEventListener", "dispatchEvent", "createBuffer", "decodeAudioData", "createBufferSource", "createMediaElementSource", "createMediaStreamSource", "createMediaStreamDestination", "createAudioWorker", "createScriptProcessor", "createAnalyser", "createGain", "createDelay", "createBiquadFilter", "createWaveShaper", "createPanner", "createStereoPanner", "createConvolver", "createChannelSplitter", "createChannelMerger", "createDynamicsCompressor", "createOscillator", "createPeriodicWave"].forEach(function(e) {
                    l.prototype[e] = function() {
                        return this._.audioContext[e].apply(this._.audioContext, arguments)
                    }
                });
                l.prototype.startRendering = function() {
                    var e = this;
                    if (this._.state !== "suspended") {
                        return Promise.reject(new Error("cannot call startRendering more than once"))
                    }
                    this._.state = "running";
                    var n = this._.audioContext.startRendering();
                    n.then(function() {
                        e._.state = "closed";
                        var n = new t.Event("statechange");
                        if (typeof e._.onstatechange === "function") {
                            e._.onstatechange(n)
                        }
                        e.dispatchEvent(n)
                    });
                    return n
                };
                l.prototype.suspend = function() {
                    if (typeof this._.audioContext.suspend === "function") {
                        return this._.audioContext.suspend()
                    }
                    return Promise.reject(new Error("cannot suspend an OfflineAudioContext"))
                };
                l.prototype.resume = function() {
                    if (typeof this._.audioContext.resume === "function") {
                        return this._.audioContext.resume()
                    }
                    return Promise.reject(new Error("cannot resume an OfflineAudioContext"))
                };
                l.prototype.close = function() {
                    if (typeof this._.audioContext.close === "function") {
                        return this._.audioContext.close()
                    }
                    return Promise.reject(new Error("cannot close an OfflineAudioContext"))
                };
                t.AudioContext = n;
                t.OfflineAudioContext = l
            }

            function p() {}

            function y() {
                if (s.prototype.hasOwnProperty("createStereoPanner")) {
                    return
                }
                var t = e("stereo-panner-node");
                s.prototype.createStereoPanner = function() {
                    return new t(this)
                }
            }

            function _() {
                var e = new c(1, 1, 44100);
                var t = false;
                try {
                    var n = new Uint32Array([1179011410, 48, 1163280727, 544501094, 16, 131073, 44100, 176400, 1048580, 1635017060, 8, 0, 0, 0, 0]).buffer;
                    t = !!e.decodeAudioData(n, l)
                } catch (o) {
                    l(o)
                }
                if (t) {
                    return
                }
                var i = s.prototype.decodeAudioData;
                s.prototype.decodeAudioData = function(e, t, n) {
                    var o = this;
                    var r = new Promise(function(t, n) {
                        return i.call(o, e, t, n)
                    });
                    r.then(t, n);
                    return r
                };
                s.prototype.decodeAudioData.original = i
            }

            function v() {
                if (s.prototype.hasOwnProperty("close")) {
                    return
                }
                h()
            }

            function g() {
                if (s.prototype.hasOwnProperty("resume")) {
                    return
                }
                h()
            }

            function m() {
                if (s.prototype.hasOwnProperty("suspend")) {
                    return
                }
                h()
            }

            function w() {
                var e = new c(1, 1, 44100);
                var t = false;
                try {
                    t = !!e.startRendering()
                } catch (n) {
                    l(n)
                }
                if (t) {
                    return
                }
                var o = c.prototype.startRendering;
                c.prototype.startRendering = function() {
                    var e = this;
                    return new Promise(function(t) {
                        var n = e.oncomplete;
                        e.oncomplete = function(o) {
                            t(o.renderedBuffer);
                            if (typeof n === "function") {
                                n.call(e, o)
                            }
                        };
                        o.call(e)
                    })
                };
                c.prototype.startRendering.original = o
            }

            function C(e) {
                p();
                y();
                _();
                w();
                if (e !== 0) {
                    v();
                    g();
                    m()
                }
            }
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {
        "stereo-panner-node": 9
    }],
    5: [function(e, t, n) {
        (function(e) {
            "use strict";
            Object.defineProperty(n, "__esModule", {
                value: true
            });
            n.install = l;
            var t = e.OfflineAudioContext;
            var o = e.AudioNode;
            var i = o.prototype.connect;
            var r = o.prototype.disconnect;

            function a(e, t) {
                for (var n = 0, o = e.length; n < o; n++) {
                    if (e[n] !== t[n]) {
                        return false
                    }
                }
                return true
            }

            function s(e) {
                for (var t = 0, n = e.numberOfOutputs; t < n; t++) {
                    r.call(e, t)
                }
                e._shim$connections = []
            }

            function c(e, t) {
                r.call(e, t);
                e._shim$connections = e._shim$connections.filter(function(e) {
                    return e[1] !== t
                })
            }

            function u(e, t) {
                var n = [];
                var o = false;
                e._shim$connections.forEach(function(e) {
                    o = o || t[0] === e[0];
                    if (!a(t, e)) {
                        n.push(e)
                    }
                });
                if (!o) {
                    throw new Error("Failed to execute 'disconnect' on 'AudioNode': the given destination is not connected.")
                }
                s(e);
                n.forEach(function(t) {
                    i.call(e, t[0], t[1], t[2])
                });
                e._shim$connections = n
            }

            function f() {
                var e = new t(1, 1, 44100);
                var n = false;
                try {
                    e.createGain().disconnect(e.destination)
                } catch (a) {
                    n = true
                }
                if (n) {
                    return
                }
                o.prototype.disconnect = function() {
                    this._shim$connections = this._shim$connections || [];
                    for (var e = arguments.length, t = Array(e), n = 0; n < e; n++) {
                        t[n] = arguments[n]
                    }
                    if (t.length === 0) {
                        s(this)
                    } else if (t.length === 1 && typeof t[0] === "number") {
                        c(this, t[0])
                    } else {
                        u(this, t)
                    }
                };
                o.prototype.disconnect.original = r;
                o.prototype.connect = function(e) {
                    var t = arguments[1] === undefined ? 0 : arguments[1];
                    var n = arguments[2] === undefined ? 0 : arguments[2];
                    var r = undefined;
                    this._shim$connections = this._shim$connections || [];
                    if (e instanceof o) {
                        i.call(this, e, t, n);
                        r = n
                    } else {
                        i.call(this, e, t);
                        r = 0
                    }
                    this._shim$connections.push([e, t, r])
                };
                o.prototype.connect.original = i
            }

            function l(e) {
                if (e !== 0) {
                    f()
                }
            }
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {}],
    6: [function(e, t, n) {
        (function(o) {
            "use strict";
            Object.defineProperty(n, "__esModule", {
                value: true
            });
            n["default"] = i;

            function i() {
                var t = arguments[0] === undefined ? Infinity : arguments[0];
                if (!o.hasOwnProperty("AudioContext") && o.hasOwnProperty("webkitAudioContext")) {
                    o.AudioContext = o.webkitAudioContext
                }
                if (!o.hasOwnProperty("OfflineAudioContext") && o.hasOwnProperty("webkitOfflineAudioContext")) {
                    o.OfflineAudioContext = o.webkitOfflineAudioContext
                }
                if (!o.AudioContext) {
                    return
                }
                e("./AnalyserNode").install(t);
                e("./AudioBuffer").install(t);
                e("./AudioNode").install(t);
                e("./AudioContext").install(t)
            }
            t.exports = n["default"]
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {
        "./AnalyserNode": 2,
        "./AudioBuffer": 3,
        "./AudioContext": 4,
        "./AudioNode": 5
    }],
    7: [function(e, t, n) {
        var o = 4096;
        var i = new Float32Array(o);
        var r = new Float32Array(o);
        (function() {
            var e;
            for (e = 0; e < o; e++) {
                i[e] = Math.cos(e / o * Math.PI * .5);
                r[e] = Math.sin(e / o * Math.PI * .5)
            }
        })();
        t.exports = {
            L: i,
            R: r
        }
    }, {}],
    8: [function(e, t, n) {
        (function(n) {
            var o = e("./curve");

            function i(e) {
                this.audioContext = e;
                this.inlet = e.createChannelSplitter(2);
                this._pan = e.createGain();
                this.pan = this._pan.gain;
                this._wsL = e.createWaveShaper();
                this._wsR = e.createWaveShaper();
                this._L = e.createGain();
                this._R = e.createGain();
                this.outlet = e.createChannelMerger(2);
                this.inlet.channelCount = 2;
                this.inlet.channelCountMode = "explicit";
                this._pan.gain.value = 0;
                this._wsL.curve = o.L;
                this._wsR.curve = o.R;
                this._L.gain.value = 0;
                this._R.gain.value = 0;
                this.inlet.connect(this._L, 0);
                this.inlet.connect(this._R, 1);
                this._L.connect(this.outlet, 0, 0);
                this._R.connect(this.outlet, 0, 1);
                this._pan.connect(this._wsL);
                this._pan.connect(this._wsR);
                this._wsL.connect(this._L.gain);
                this._wsR.connect(this._R.gain);
                this._isConnected = false;
                this._dc1buffer = null;
                this._dc1 = null
            }
            i.prototype.connect = function(e) {
                var t = this.audioContext;
                if (!this._isConnected) {
                    this._isConnected = true;
                    this._dc1buffer = t.createBuffer(1, 2, t.sampleRate);
                    this._dc1buffer.getChannelData(0).set([1, 1]);
                    this._dc1 = t.createBufferSource();
                    this._dc1.buffer = this._dc1buffer;
                    this._dc1.loop = true;
                    this._dc1.start(t.currentTime);
                    this._dc1.connect(this._pan)
                }
                n.AudioNode.prototype.connect.call(this.outlet, e)
            };
            i.prototype.disconnect = function() {
                var e = this.audioContext;
                if (this._isConnected) {
                    this._isConnected = false;
                    this._dc1.stop(e.currentTime);
                    this._dc1.disconnect();
                    this._dc1 = null;
                    this._dc1buffer = null
                }
                n.AudioNode.prototype.disconnect.call(this.outlet)
            };
            t.exports = i
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {
        "./curve": 7
    }],
    9: [function(e, t, n) {
        (function(n) {
            var o = e("./stereo-panner-impl");
            var i = n.AudioContext || n.webkitAudioContext;

            function r(e) {
                var t = new o(e);
                Object.defineProperties(t.inlet, {
                    pan: {
                        value: t.pan,
                        enumerable: true
                    },
                    connect: {
                        value: function(e) {
                            return t.connect(e)
                        }
                    },
                    disconnect: {
                        value: function() {
                            return t.disconnect()
                        }
                    }
                });
                return t.inlet
            }
            r.polyfill = function() {
                if (!i || i.prototype.hasOwnProperty("createStereoPanner")) {
                    return
                }
                i.prototype.createStereoPanner = function() {
                    return new r(this)
                }
            };
            t.exports = r
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {
        "./stereo-panner-impl": 8
    }]
}, {}, [1]);
