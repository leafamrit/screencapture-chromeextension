(() => {
  var e = {
      76866: function (e) {
        e.exports = (function (e) {
          function t(n) {
            if (r[n]) return r[n].exports;
            var i = (r[n] = { exports: {}, id: n, loaded: !1 });
            return (
              e[n].call(i.exports, i, i.exports, t), (i.loaded = !0), i.exports
            );
          }
          var r = {};
          return (t.m = e), (t.c = r), (t.p = ""), t(0);
        })([
          function (e, t, r) {
            var n,
              i,
              o = {}.hasOwnProperty,
              s =
                [].indexOf ||
                function (e) {
                  for (var t = 0, r = this.length; t < r; t++)
                    if (t in this && this[t] === e) return t;
                  return -1;
                };
            (n = r(1).EventEmitter),
              r(2),
              (i = (function (e) {
                function t(e) {
                  var t, n, i;
                  for (n in ((this.running = !1),
                  (this.options = {}),
                  (this.frames = []),
                  (this.groups = new Map()),
                  (this.freeWorkers = []),
                  (this.activeWorkers = []),
                  this.setOptions(e),
                  r))
                    (i = r[n]), null == (t = this.options)[n] && (t[n] = i);
                }
                var r, n;
                return (
                  (function (e, t) {
                    function r() {
                      this.constructor = e;
                    }
                    for (var n in t) o.call(t, n) && (e[n] = t[n]);
                    (r.prototype = t.prototype),
                      (e.prototype = new r()),
                      (e.__super__ = t.prototype);
                  })(t, e),
                  (r = {
                    workerScript: "gif.worker.js",
                    workers: 2,
                    repeat: 0,
                    background: "#fff",
                    quality: 10,
                    width: null,
                    height: null,
                    transparent: null,
                    debug: !1,
                  }),
                  (n = { delay: 500, copy: !1 }),
                  (t.prototype.setOption = function (e, t) {
                    if (
                      ((this.options[e] = t),
                      null != this._canvas && ("width" === e || "height" === e))
                    )
                      return (this._canvas[e] = t);
                  }),
                  (t.prototype.setOptions = function (e) {
                    var t, r, n;
                    for (t in ((r = []), e))
                      o.call(e, t) &&
                        ((n = e[t]), r.push(this.setOption(t, n)));
                    return r;
                  }),
                  (t.prototype.addFrame = function (e, t) {
                    var r, i, o;
                    for (o in (null == t && (t = {}),
                    ((r = {}).transparent = this.options.transparent),
                    n))
                      r[o] = t[o] || n[o];
                    if (
                      (null == this.options.width &&
                        this.setOption("width", e.width),
                      null == this.options.height &&
                        this.setOption("height", e.height),
                      "undefined" != typeof ImageData &&
                        null !== ImageData &&
                        e instanceof ImageData)
                    )
                      r.data = e.data;
                    else if (
                      ("undefined" != typeof CanvasRenderingContext2D &&
                        null !== CanvasRenderingContext2D &&
                        e instanceof CanvasRenderingContext2D) ||
                      ("undefined" != typeof WebGLRenderingContext &&
                        null !== WebGLRenderingContext &&
                        e instanceof WebGLRenderingContext)
                    )
                      t.copy
                        ? (r.data = this.getContextData(e))
                        : (r.context = e);
                    else {
                      if (null == e.childNodes)
                        throw new Error("Invalid image");
                      t.copy ? (r.data = this.getImageData(e)) : (r.image = e);
                    }
                    return (
                      (i = this.frames.length) > 0 &&
                        r.data &&
                        (this.groups.has(r.data)
                          ? this.groups.get(r.data).push(i)
                          : this.groups.set(r.data, [i])),
                      this.frames.push(r)
                    );
                  }),
                  (t.prototype.render = function () {
                    var e, t, r;
                    if (this.running) throw new Error("Already running");
                    if (
                      null == this.options.width ||
                      null == this.options.height
                    )
                      throw new Error(
                        "Width and height must be set prior to rendering"
                      );
                    if (
                      ((this.running = !0),
                      (this.nextFrame = 0),
                      (this.finishedFrames = 0),
                      (this.imageParts = function () {
                        var e, t, r;
                        for (
                          r = [], e = 0, t = this.frames.length;
                          0 <= t ? e < t : e > t;
                          0 <= t ? ++e : --e
                        )
                          r.push(null);
                        return r;
                      }.call(this)),
                      (t = this.spawnWorkers()),
                      !0 === this.options.globalPalette)
                    )
                      this.renderNextFrame();
                    else
                      for (
                        e = 0, r = t;
                        0 <= r ? e < r : e > r;
                        0 <= r ? ++e : --e
                      )
                        this.renderNextFrame();
                    return this.emit("start"), this.emit("progress", 0);
                  }),
                  (t.prototype.abort = function () {
                    for (var e; null != (e = this.activeWorkers.shift()); )
                      this.log("killing active worker"), e.terminate();
                    return (this.running = !1), this.emit("abort");
                  }),
                  (t.prototype.spawnWorkers = function () {
                    var e, t, r;
                    return (
                      (e = Math.min(this.options.workers, this.frames.length)),
                      function () {
                        r = [];
                        for (
                          var n = (t = this.freeWorkers.length);
                          t <= e ? n < e : n > e;
                          t <= e ? n++ : n--
                        )
                          r.push(n);
                        return r;
                      }
                        .apply(this)
                        .forEach(
                          (function (e) {
                            return function (t) {
                              var r;
                              return (
                                e.log("spawning worker " + t),
                                ((r = new Worker(
                                  e.options.workerScript
                                )).onmessage = function (t) {
                                  return (
                                    e.activeWorkers.splice(
                                      e.activeWorkers.indexOf(r),
                                      1
                                    ),
                                    e.freeWorkers.push(r),
                                    e.frameFinished(t.data, !1)
                                  );
                                }),
                                e.freeWorkers.push(r)
                              );
                            };
                          })(this)
                        ),
                      e
                    );
                  }),
                  (t.prototype.frameFinished = function (e, t) {
                    var r, n, i, o;
                    if (
                      (this.finishedFrames++,
                      t
                        ? ((r = this.frames.indexOf(e)),
                          (n = this.groups.get(e.data)[0]),
                          this.log(
                            "frame " +
                              (r + 1) +
                              " is duplicate of " +
                              n +
                              " - " +
                              this.activeWorkers.length +
                              " active"
                          ),
                          (this.imageParts[r] = { indexOfFirstInGroup: n }))
                        : (this.log(
                            "frame " +
                              (e.index + 1) +
                              " finished - " +
                              this.activeWorkers.length +
                              " active"
                          ),
                          this.emit(
                            "progress",
                            this.finishedFrames / this.frames.length
                          ),
                          (this.imageParts[e.index] = e)),
                      !0 === this.options.globalPalette &&
                        !t &&
                        ((this.options.globalPalette = e.globalPalette),
                        this.log("global palette analyzed"),
                        this.frames.length > 2))
                    )
                      for (
                        i = 1, o = this.freeWorkers.length;
                        1 <= o ? i < o : i > o;
                        1 <= o ? ++i : --i
                      )
                        this.renderNextFrame();
                    return s.call(this.imageParts, null) >= 0
                      ? this.renderNextFrame()
                      : this.finishRendering();
                  }),
                  (t.prototype.finishRendering = function () {
                    var e,
                      t,
                      r,
                      n,
                      i,
                      o,
                      s,
                      a,
                      c,
                      u,
                      h,
                      l,
                      f,
                      d,
                      p,
                      g,
                      m,
                      v,
                      b,
                      w;
                    for (
                      i = o = 0, u = (m = this.imageParts).length;
                      o < u;
                      i = ++o
                    )
                      (t = m[i]).indexOfFirstInGroup &&
                        (this.imageParts[i] =
                          this.imageParts[t.indexOfFirstInGroup]);
                    for (
                      c = 0, s = 0, h = (v = this.imageParts).length;
                      s < h;
                      s++
                    )
                      c += ((t = v[s]).data.length - 1) * t.pageSize + t.cursor;
                    for (
                      c += t.pageSize - t.cursor,
                        this.log(
                          "rendering finished - filesize " +
                            Math.round(c / 1e3) +
                            "kb"
                        ),
                        e = new Uint8Array(c),
                        p = 0,
                        a = 0,
                        l = (b = this.imageParts).length;
                      a < l;
                      a++
                    )
                      for (
                        r = d = 0, f = (w = (t = b[a]).data).length;
                        d < f;
                        r = ++d
                      )
                        (g = w[r]),
                          e.set(g, p),
                          (p +=
                            r === t.data.length - 1 ? t.cursor : t.pageSize);
                    return (
                      (n = new Blob([e], { type: "image/gif" })),
                      this.emit("finished", n, e)
                    );
                  }),
                  (t.prototype.renderNextFrame = function () {
                    var e, t, r, n;
                    if (0 === this.freeWorkers.length)
                      throw new Error("No free workers");
                    if (!(this.nextFrame >= this.frames.length))
                      return (
                        (e = this.frames[this.nextFrame++]),
                        (t = this.frames.indexOf(e)) > 0 &&
                        this.groups.has(e.data) &&
                        this.groups.get(e.data)[0] !== t
                          ? void setTimeout(
                              (function (t) {
                                return function () {
                                  return t.frameFinished(e, !0);
                                };
                              })(this),
                              0
                            )
                          : ((n = this.freeWorkers.shift()),
                            (r = this.getTask(e)),
                            this.log(
                              "starting frame " +
                                (r.index + 1) +
                                " of " +
                                this.frames.length
                            ),
                            this.activeWorkers.push(n),
                            n.postMessage(r))
                      );
                  }),
                  (t.prototype.getContextData = function (e) {
                    return e.getImageData(
                      0,
                      0,
                      this.options.width,
                      this.options.height
                    ).data;
                  }),
                  (t.prototype.getImageData = function (e) {
                    var t;
                    return (
                      null == this._canvas &&
                        ((this._canvas = document.createElement("canvas")),
                        (this._canvas.width = this.options.width),
                        (this._canvas.height = this.options.height)),
                      ((t = this._canvas.getContext("2d")).setFill =
                        this.options.background),
                      t.fillRect(0, 0, this.options.width, this.options.height),
                      t.drawImage(e, 0, 0),
                      this.getContextData(t)
                    );
                  }),
                  (t.prototype.getTask = function (e) {
                    var t, r;
                    if (
                      ((r = {
                        index: (t = this.frames.indexOf(e)),
                        last: t === this.frames.length - 1,
                        delay: e.delay,
                        transparent: e.transparent,
                        width: this.options.width,
                        height: this.options.height,
                        quality: this.options.quality,
                        dither: this.options.dither,
                        globalPalette: this.options.globalPalette,
                        repeat: this.options.repeat,
                        canTransfer: !0,
                      }),
                      null != e.data)
                    )
                      r.data = e.data;
                    else if (null != e.context)
                      r.data = this.getContextData(e.context);
                    else {
                      if (null == e.image) throw new Error("Invalid frame");
                      r.data = this.getImageData(e.image);
                    }
                    return r;
                  }),
                  (t.prototype.log = function (e) {
                    if (this.options.debug) return console.log(e);
                  }),
                  t
                );
              })(n)),
              (e.exports = i);
          },
          function (e, t) {
            function r() {
              (this._events = this._events || {}),
                (this._maxListeners = this._maxListeners || void 0);
            }
            function n(e) {
              return "function" == typeof e;
            }
            function i(e) {
              return "object" == typeof e && null !== e;
            }
            function o(e) {
              return void 0 === e;
            }
            (e.exports = r),
              (r.EventEmitter = r),
              (r.prototype._events = void 0),
              (r.prototype._maxListeners = void 0),
              (r.defaultMaxListeners = 10),
              (r.prototype.setMaxListeners = function (e) {
                if (
                  !(function (e) {
                    return "number" == typeof e;
                  })(e) ||
                  e < 0 ||
                  isNaN(e)
                )
                  throw TypeError("n must be a positive number");
                return (this._maxListeners = e), this;
              }),
              (r.prototype.emit = function (e) {
                var t, r, s, a, c, u;
                if (
                  (this._events || (this._events = {}),
                  "error" === e &&
                    (!this._events.error ||
                      (i(this._events.error) && !this._events.error.length)))
                ) {
                  if ((t = arguments[1]) instanceof Error) throw t;
                  var h = new Error(
                    'Uncaught, unspecified "error" event. (' + t + ")"
                  );
                  throw ((h.context = t), h);
                }
                if (o((r = this._events[e]))) return !1;
                if (n(r))
                  switch (arguments.length) {
                    case 1:
                      r.call(this);
                      break;
                    case 2:
                      r.call(this, arguments[1]);
                      break;
                    case 3:
                      r.call(this, arguments[1], arguments[2]);
                      break;
                    default:
                      (a = Array.prototype.slice.call(arguments, 1)),
                        r.apply(this, a);
                  }
                else if (i(r))
                  for (
                    a = Array.prototype.slice.call(arguments, 1),
                      s = (u = r.slice()).length,
                      c = 0;
                    c < s;
                    c++
                  )
                    u[c].apply(this, a);
                return !0;
              }),
              (r.prototype.addListener = function (e, t) {
                var s;
                if (!n(t)) throw TypeError("listener must be a function");
                return (
                  this._events || (this._events = {}),
                  this._events.newListener &&
                    this.emit("newListener", e, n(t.listener) ? t.listener : t),
                  this._events[e]
                    ? i(this._events[e])
                      ? this._events[e].push(t)
                      : (this._events[e] = [this._events[e], t])
                    : (this._events[e] = t),
                  i(this._events[e]) &&
                    !this._events[e].warned &&
                    (s = o(this._maxListeners)
                      ? r.defaultMaxListeners
                      : this._maxListeners) &&
                    s > 0 &&
                    this._events[e].length > s &&
                    ((this._events[e].warned = !0),
                    console.error(
                      "(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",
                      this._events[e].length
                    ),
                    "function" == typeof console.trace && console.trace()),
                  this
                );
              }),
              (r.prototype.on = r.prototype.addListener),
              (r.prototype.once = function (e, t) {
                function r() {
                  this.removeListener(e, r),
                    i || ((i = !0), t.apply(this, arguments));
                }
                if (!n(t)) throw TypeError("listener must be a function");
                var i = !1;
                return (r.listener = t), this.on(e, r), this;
              }),
              (r.prototype.removeListener = function (e, t) {
                var r, o, s, a;
                if (!n(t)) throw TypeError("listener must be a function");
                if (!this._events || !this._events[e]) return this;
                if (
                  ((s = (r = this._events[e]).length),
                  (o = -1),
                  r === t || (n(r.listener) && r.listener === t))
                )
                  delete this._events[e],
                    this._events.removeListener &&
                      this.emit("removeListener", e, t);
                else if (i(r)) {
                  for (a = s; a-- > 0; )
                    if (r[a] === t || (r[a].listener && r[a].listener === t)) {
                      o = a;
                      break;
                    }
                  if (o < 0) return this;
                  1 === r.length
                    ? ((r.length = 0), delete this._events[e])
                    : r.splice(o, 1),
                    this._events.removeListener &&
                      this.emit("removeListener", e, t);
                }
                return this;
              }),
              (r.prototype.removeAllListeners = function (e) {
                var t, r;
                if (!this._events) return this;
                if (!this._events.removeListener)
                  return (
                    0 === arguments.length
                      ? (this._events = {})
                      : this._events[e] && delete this._events[e],
                    this
                  );
                if (0 === arguments.length) {
                  for (t in this._events)
                    "removeListener" !== t && this.removeAllListeners(t);
                  return (
                    this.removeAllListeners("removeListener"),
                    (this._events = {}),
                    this
                  );
                }
                if (n((r = this._events[e]))) this.removeListener(e, r);
                else if (r)
                  for (; r.length; ) this.removeListener(e, r[r.length - 1]);
                return delete this._events[e], this;
              }),
              (r.prototype.listeners = function (e) {
                return this._events && this._events[e]
                  ? n(this._events[e])
                    ? [this._events[e]]
                    : this._events[e].slice()
                  : [];
              }),
              (r.prototype.listenerCount = function (e) {
                if (this._events) {
                  var t = this._events[e];
                  if (n(t)) return 1;
                  if (t) return t.length;
                }
                return 0;
              }),
              (r.listenerCount = function (e, t) {
                return e.listenerCount(t);
              });
          },
          function (e, t) {
            var r, n, i, o, s;
            (s = navigator.userAgent.toLowerCase()),
              (o = navigator.platform.toLowerCase()),
              (i =
                "ie" ===
                  (r = s.match(
                    /(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/
                  ) || [null, "unknown", 0])[1] && document.documentMode),
              ((n = {
                name: "version" === r[1] ? r[3] : r[1],
                version:
                  i || parseFloat("opera" === r[1] && r[4] ? r[4] : r[2]),
                platform: {
                  name: s.match(/ip(?:ad|od|hone)/)
                    ? "ios"
                    : (s.match(/(?:webos|android)/) ||
                        o.match(/mac|win|linux/) || ["other"])[0],
                },
              })[n.name] = !0),
              (n[n.name + parseInt(n.version, 10)] = !0),
              (n.platform[n.platform.name] = !0),
              (e.exports = n);
          },
        ]);
      },
      18552: (e, t, r) => {
        var n = r(10852)(r(55639), "DataView");
        e.exports = n;
      },
      1989: (e, t, r) => {
        var n = r(51789),
          i = r(80401),
          o = r(57667),
          s = r(21327),
          a = r(81866);
        function c(e) {
          var t = -1,
            r = null == e ? 0 : e.length;
          for (this.clear(); ++t < r; ) {
            var n = e[t];
            this.set(n[0], n[1]);
          }
        }
        (c.prototype.clear = n),
          (c.prototype.delete = i),
          (c.prototype.get = o),
          (c.prototype.has = s),
          (c.prototype.set = a),
          (e.exports = c);
      },
      38407: (e, t, r) => {
        var n = r(27040),
          i = r(14125),
          o = r(82117),
          s = r(67518),
          a = r(54705);
        function c(e) {
          var t = -1,
            r = null == e ? 0 : e.length;
          for (this.clear(); ++t < r; ) {
            var n = e[t];
            this.set(n[0], n[1]);
          }
        }
        (c.prototype.clear = n),
          (c.prototype.delete = i),
          (c.prototype.get = o),
          (c.prototype.has = s),
          (c.prototype.set = a),
          (e.exports = c);
      },
      57071: (e, t, r) => {
        var n = r(10852)(r(55639), "Map");
        e.exports = n;
      },
      83369: (e, t, r) => {
        var n = r(24785),
          i = r(11285),
          o = r(96e3),
          s = r(49916),
          a = r(95265);
        function c(e) {
          var t = -1,
            r = null == e ? 0 : e.length;
          for (this.clear(); ++t < r; ) {
            var n = e[t];
            this.set(n[0], n[1]);
          }
        }
        (c.prototype.clear = n),
          (c.prototype.delete = i),
          (c.prototype.get = o),
          (c.prototype.has = s),
          (c.prototype.set = a),
          (e.exports = c);
      },
      53818: (e, t, r) => {
        var n = r(10852)(r(55639), "Promise");
        e.exports = n;
      },
      58525: (e, t, r) => {
        var n = r(10852)(r(55639), "Set");
        e.exports = n;
      },
      46384: (e, t, r) => {
        var n = r(38407),
          i = r(37465),
          o = r(63779),
          s = r(67599),
          a = r(44758),
          c = r(34309);
        function u(e) {
          var t = (this.__data__ = new n(e));
          this.size = t.size;
        }
        (u.prototype.clear = i),
          (u.prototype.delete = o),
          (u.prototype.get = s),
          (u.prototype.has = a),
          (u.prototype.set = c),
          (e.exports = u);
      },
      62705: (e, t, r) => {
        var n = r(55639).Symbol;
        e.exports = n;
      },
      11149: (e, t, r) => {
        var n = r(55639).Uint8Array;
        e.exports = n;
      },
      70577: (e, t, r) => {
        var n = r(10852)(r(55639), "WeakMap");
        e.exports = n;
      },
      77412: (e) => {
        e.exports = function (e, t) {
          for (
            var r = -1, n = null == e ? 0 : e.length;
            ++r < n && !1 !== t(e[r], r, e);

          );
          return e;
        };
      },
      34963: (e) => {
        e.exports = function (e, t) {
          for (
            var r = -1, n = null == e ? 0 : e.length, i = 0, o = [];
            ++r < n;

          ) {
            var s = e[r];
            t(s, r, e) && (o[i++] = s);
          }
          return o;
        };
      },
      14636: (e, t, r) => {
        var n = r(22545),
          i = r(35694),
          o = r(1469),
          s = r(44144),
          a = r(65776),
          c = r(36719),
          u = Object.prototype.hasOwnProperty;
        e.exports = function (e, t) {
          var r = o(e),
            h = !r && i(e),
            l = !r && !h && s(e),
            f = !r && !h && !l && c(e),
            d = r || h || l || f,
            p = d ? n(e.length, String) : [],
            g = p.length;
          for (var m in e)
            (!t && !u.call(e, m)) ||
              (d &&
                ("length" == m ||
                  (l && ("offset" == m || "parent" == m)) ||
                  (f &&
                    ("buffer" == m ||
                      "byteLength" == m ||
                      "byteOffset" == m)) ||
                  a(m, g))) ||
              p.push(m);
          return p;
        };
      },
      29932: (e) => {
        e.exports = function (e, t) {
          for (
            var r = -1, n = null == e ? 0 : e.length, i = Array(n);
            ++r < n;

          )
            i[r] = t(e[r], r, e);
          return i;
        };
      },
      62488: (e) => {
        e.exports = function (e, t) {
          for (var r = -1, n = t.length, i = e.length; ++r < n; )
            e[i + r] = t[r];
          return e;
        };
      },
      34865: (e, t, r) => {
        var n = r(89465),
          i = r(77813),
          o = Object.prototype.hasOwnProperty;
        e.exports = function (e, t, r) {
          var s = e[t];
          (o.call(e, t) && i(s, r) && (void 0 !== r || t in e)) || n(e, t, r);
        };
      },
      18470: (e, t, r) => {
        var n = r(77813);
        e.exports = function (e, t) {
          for (var r = e.length; r--; ) if (n(e[r][0], t)) return r;
          return -1;
        };
      },
      44037: (e, t, r) => {
        var n = r(98363),
          i = r(3674);
        e.exports = function (e, t) {
          return e && n(t, i(t), e);
        };
      },
      63886: (e, t, r) => {
        var n = r(98363),
          i = r(81704);
        e.exports = function (e, t) {
          return e && n(t, i(t), e);
        };
      },
      89465: (e, t, r) => {
        var n = r(38777);
        e.exports = function (e, t, r) {
          "__proto__" == t && n
            ? n(e, t, {
                configurable: !0,
                enumerable: !0,
                value: r,
                writable: !0,
              })
            : (e[t] = r);
        };
      },
      85990: (e, t, r) => {
        var n = r(46384),
          i = r(77412),
          o = r(34865),
          s = r(44037),
          a = r(63886),
          c = r(64626),
          u = r(278),
          h = r(18805),
          l = r(1911),
          f = r(58234),
          d = r(46904),
          p = r(64160),
          g = r(43824),
          m = r(29148),
          v = r(38517),
          b = r(1469),
          w = r(44144),
          y = r(56688),
          x = r(13218),
          _ = r(72928),
          j = r(3674),
          O = "[object Arguments]",
          S = "[object Function]",
          A = "[object Object]",
          k = {};
        (k[O] =
          k["[object Array]"] =
          k["[object ArrayBuffer]"] =
          k["[object DataView]"] =
          k["[object Boolean]"] =
          k["[object Date]"] =
          k["[object Float32Array]"] =
          k["[object Float64Array]"] =
          k["[object Int8Array]"] =
          k["[object Int16Array]"] =
          k["[object Int32Array]"] =
          k["[object Map]"] =
          k["[object Number]"] =
          k[A] =
          k["[object RegExp]"] =
          k["[object Set]"] =
          k["[object String]"] =
          k["[object Symbol]"] =
          k["[object Uint8Array]"] =
          k["[object Uint8ClampedArray]"] =
          k["[object Uint16Array]"] =
          k["[object Uint32Array]"] =
            !0),
          (k["[object Error]"] = k[S] = k["[object WeakMap]"] = !1),
          (e.exports = function e(t, r, E, C, P, M) {
            var I,
              R = 1 & r,
              L = 2 & r,
              D = 4 & r;
            if ((E && (I = P ? E(t, C, P, M) : E(t)), void 0 !== I)) return I;
            if (!x(t)) return t;
            var F = b(t);
            if (F) {
              if (((I = g(t)), !R)) return u(t, I);
            } else {
              var T = p(t),
                U = T == S || "[object GeneratorFunction]" == T;
              if (w(t)) return c(t, R);
              if (T == A || T == O || (U && !P)) {
                if (((I = L || U ? {} : v(t)), !R))
                  return L ? l(t, a(I, t)) : h(t, s(I, t));
              } else {
                if (!k[T]) return P ? t : {};
                I = m(t, T, R);
              }
            }
            M || (M = new n());
            var W = M.get(t);
            if (W) return W;
            if ((M.set(t, I), _(t)))
              return (
                t.forEach(function (n) {
                  I.add(e(n, r, E, n, t, M));
                }),
                I
              );
            if (y(t))
              return (
                t.forEach(function (n, i) {
                  I.set(i, e(n, r, E, i, t, M));
                }),
                I
              );
            var z = D ? (L ? d : f) : L ? keysIn : j,
              $ = F ? void 0 : z(t);
            return (
              i($ || t, function (n, i) {
                $ && (n = t[(i = n)]), o(I, i, e(n, r, E, i, t, M));
              }),
              I
            );
          });
      },
      3118: (e, t, r) => {
        var n = r(13218),
          i = Object.create,
          o = (function () {
            function e() {}
            return function (t) {
              if (!n(t)) return {};
              if (i) return i(t);
              e.prototype = t;
              var r = new e();
              return (e.prototype = void 0), r;
            };
          })();
        e.exports = o;
      },
      68866: (e, t, r) => {
        var n = r(62488),
          i = r(1469);
        e.exports = function (e, t, r) {
          var o = t(e);
          return i(e) ? o : n(o, r(e));
        };
      },
      44239: (e, t, r) => {
        var n = r(62705),
          i = r(89607),
          o = r(2333),
          s = n ? n.toStringTag : void 0;
        e.exports = function (e) {
          return null == e
            ? void 0 === e
              ? "[object Undefined]"
              : "[object Null]"
            : s && s in Object(e)
            ? i(e)
            : o(e);
        };
      },
      9454: (e, t, r) => {
        var n = r(44239),
          i = r(37005);
        e.exports = function (e) {
          return i(e) && "[object Arguments]" == n(e);
        };
      },
      25588: (e, t, r) => {
        var n = r(64160),
          i = r(37005);
        e.exports = function (e) {
          return i(e) && "[object Map]" == n(e);
        };
      },
      28458: (e, t, r) => {
        var n = r(23560),
          i = r(15346),
          o = r(13218),
          s = r(80346),
          a = /^\[object .+?Constructor\]$/,
          c = Function.prototype,
          u = Object.prototype,
          h = c.toString,
          l = u.hasOwnProperty,
          f = RegExp(
            "^" +
              h
                .call(l)
                .replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")
                .replace(
                  /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
                  "$1.*?"
                ) +
              "$"
          );
        e.exports = function (e) {
          return !(!o(e) || i(e)) && (n(e) ? f : a).test(s(e));
        };
      },
      29221: (e, t, r) => {
        var n = r(64160),
          i = r(37005);
        e.exports = function (e) {
          return i(e) && "[object Set]" == n(e);
        };
      },
      38749: (e, t, r) => {
        var n = r(44239),
          i = r(41780),
          o = r(37005),
          s = {};
        (s["[object Float32Array]"] =
          s["[object Float64Array]"] =
          s["[object Int8Array]"] =
          s["[object Int16Array]"] =
          s["[object Int32Array]"] =
          s["[object Uint8Array]"] =
          s["[object Uint8ClampedArray]"] =
          s["[object Uint16Array]"] =
          s["[object Uint32Array]"] =
            !0),
          (s["[object Arguments]"] =
            s["[object Array]"] =
            s["[object ArrayBuffer]"] =
            s["[object Boolean]"] =
            s["[object DataView]"] =
            s["[object Date]"] =
            s["[object Error]"] =
            s["[object Function]"] =
            s["[object Map]"] =
            s["[object Number]"] =
            s["[object Object]"] =
            s["[object RegExp]"] =
            s["[object Set]"] =
            s["[object String]"] =
            s["[object WeakMap]"] =
              !1),
          (e.exports = function (e) {
            return o(e) && i(e.length) && !!s[n(e)];
          });
      },
      280: (e, t, r) => {
        var n = r(25726),
          i = r(86916),
          o = Object.prototype.hasOwnProperty;
        e.exports = function (e) {
          if (!n(e)) return i(e);
          var t = [];
          for (var r in Object(e))
            o.call(e, r) && "constructor" != r && t.push(r);
          return t;
        };
      },
      10313: (e, t, r) => {
        var n = r(13218),
          i = r(25726),
          o = r(33498),
          s = Object.prototype.hasOwnProperty;
        e.exports = function (e) {
          if (!n(e)) return o(e);
          var t = i(e),
            r = [];
          for (var a in e)
            ("constructor" != a || (!t && s.call(e, a))) && r.push(a);
          return r;
        };
      },
      10611: (e, t, r) => {
        var n = r(34865),
          i = r(71811),
          o = r(65776),
          s = r(13218),
          a = r(40327);
        e.exports = function (e, t, r, c) {
          if (!s(e)) return e;
          for (
            var u = -1, h = (t = i(t, e)).length, l = h - 1, f = e;
            null != f && ++u < h;

          ) {
            var d = a(t[u]),
              p = r;
            if (u != l) {
              var g = f[d];
              void 0 === (p = c ? c(g, d, f) : void 0) &&
                (p = s(g) ? g : o(t[u + 1]) ? [] : {});
            }
            n(f, d, p), (f = f[d]);
          }
          return e;
        };
      },
      22545: (e) => {
        e.exports = function (e, t) {
          for (var r = -1, n = Array(e); ++r < e; ) n[r] = t(r);
          return n;
        };
      },
      80531: (e, t, r) => {
        var n = r(62705),
          i = r(29932),
          o = r(1469),
          s = r(33448),
          a = n ? n.prototype : void 0,
          c = a ? a.toString : void 0;
        e.exports = function e(t) {
          if ("string" == typeof t) return t;
          if (o(t)) return i(t, e) + "";
          if (s(t)) return c ? c.call(t) : "";
          var r = t + "";
          return "0" == r && 1 / t == -1 / 0 ? "-0" : r;
        };
      },
      7518: (e) => {
        e.exports = function (e) {
          return function (t) {
            return e(t);
          };
        };
      },
      71811: (e, t, r) => {
        var n = r(1469),
          i = r(15403),
          o = r(55514),
          s = r(79833);
        e.exports = function (e, t) {
          return n(e) ? e : i(e, t) ? [e] : o(s(e));
        };
      },
      74318: (e, t, r) => {
        var n = r(11149);
        e.exports = function (e) {
          var t = new e.constructor(e.byteLength);
          return new n(t).set(new n(e)), t;
        };
      },
      64626: (e, t, r) => {
        e = r.nmd(e);
        var n = r(55639),
          i = t && !t.nodeType && t,
          o = i && e && !e.nodeType && e,
          s = o && o.exports === i ? n.Buffer : void 0,
          a = s ? s.allocUnsafe : void 0;
        e.exports = function (e, t) {
          if (t) return e.slice();
          var r = e.length,
            n = a ? a(r) : new e.constructor(r);
          return e.copy(n), n;
        };
      },
      57157: (e, t, r) => {
        var n = r(74318);
        e.exports = function (e, t) {
          var r = t ? n(e.buffer) : e.buffer;
          return new e.constructor(r, e.byteOffset, e.byteLength);
        };
      },
      93147: (e) => {
        var t = /\w*$/;
        e.exports = function (e) {
          var r = new e.constructor(e.source, t.exec(e));
          return (r.lastIndex = e.lastIndex), r;
        };
      },
      40419: (e, t, r) => {
        var n = r(62705),
          i = n ? n.prototype : void 0,
          o = i ? i.valueOf : void 0;
        e.exports = function (e) {
          return o ? Object(o.call(e)) : {};
        };
      },
      77133: (e, t, r) => {
        var n = r(74318);
        e.exports = function (e, t) {
          var r = t ? n(e.buffer) : e.buffer;
          return new e.constructor(r, e.byteOffset, e.length);
        };
      },
      278: (e) => {
        e.exports = function (e, t) {
          var r = -1,
            n = e.length;
          for (t || (t = Array(n)); ++r < n; ) t[r] = e[r];
          return t;
        };
      },
      98363: (e, t, r) => {
        var n = r(34865),
          i = r(89465);
        e.exports = function (e, t, r, o) {
          var s = !r;
          r || (r = {});
          for (var a = -1, c = t.length; ++a < c; ) {
            var u = t[a],
              h = o ? o(r[u], e[u], u, r, e) : void 0;
            void 0 === h && (h = e[u]), s ? i(r, u, h) : n(r, u, h);
          }
          return r;
        };
      },
      18805: (e, t, r) => {
        var n = r(98363),
          i = r(99551);
        e.exports = function (e, t) {
          return n(e, i(e), t);
        };
      },
      1911: (e, t, r) => {
        var n = r(98363),
          i = r(51442);
        e.exports = function (e, t) {
          return n(e, i(e), t);
        };
      },
      14429: (e, t, r) => {
        var n = r(55639)["__core-js_shared__"];
        e.exports = n;
      },
      38777: (e, t, r) => {
        var n = r(10852),
          i = (function () {
            try {
              var e = n(Object, "defineProperty");
              return e({}, "", {}), e;
            } catch (e) {}
          })();
        e.exports = i;
      },
      31957: (e, t, r) => {
        var n = "object" == typeof r.g && r.g && r.g.Object === Object && r.g;
        e.exports = n;
      },
      58234: (e, t, r) => {
        var n = r(68866),
          i = r(99551),
          o = r(3674);
        e.exports = function (e) {
          return n(e, o, i);
        };
      },
      46904: (e, t, r) => {
        var n = r(68866),
          i = r(51442),
          o = r(81704);
        e.exports = function (e) {
          return n(e, o, i);
        };
      },
      45050: (e, t, r) => {
        var n = r(37019);
        e.exports = function (e, t) {
          var r = e.__data__;
          return n(t) ? r["string" == typeof t ? "string" : "hash"] : r.map;
        };
      },
      10852: (e, t, r) => {
        var n = r(28458),
          i = r(47801);
        e.exports = function (e, t) {
          var r = i(e, t);
          return n(r) ? r : void 0;
        };
      },
      85924: (e, t, r) => {
        var n = r(5569)(Object.getPrototypeOf, Object);
        e.exports = n;
      },
      89607: (e, t, r) => {
        var n = r(62705),
          i = Object.prototype,
          o = i.hasOwnProperty,
          s = i.toString,
          a = n ? n.toStringTag : void 0;
        e.exports = function (e) {
          var t = o.call(e, a),
            r = e[a];
          try {
            e[a] = void 0;
            var n = !0;
          } catch (e) {}
          var i = s.call(e);
          return n && (t ? (e[a] = r) : delete e[a]), i;
        };
      },
      99551: (e, t, r) => {
        var n = r(34963),
          i = r(70479),
          o = Object.prototype.propertyIsEnumerable,
          s = Object.getOwnPropertySymbols,
          a = s
            ? function (e) {
                return null == e
                  ? []
                  : ((e = Object(e)),
                    n(s(e), function (t) {
                      return o.call(e, t);
                    }));
              }
            : i;
        e.exports = a;
      },
      51442: (e, t, r) => {
        var n = r(62488),
          i = r(85924),
          o = r(99551),
          s = r(70479),
          a = Object.getOwnPropertySymbols
            ? function (e) {
                for (var t = []; e; ) n(t, o(e)), (e = i(e));
                return t;
              }
            : s;
        e.exports = a;
      },
      64160: (e, t, r) => {
        var n = r(18552),
          i = r(57071),
          o = r(53818),
          s = r(58525),
          a = r(70577),
          c = r(44239),
          u = r(80346),
          h = "[object Map]",
          l = "[object Promise]",
          f = "[object Set]",
          d = "[object WeakMap]",
          p = "[object DataView]",
          g = u(n),
          m = u(i),
          v = u(o),
          b = u(s),
          w = u(a),
          y = c;
        ((n && y(new n(new ArrayBuffer(1))) != p) ||
          (i && y(new i()) != h) ||
          (o && y(o.resolve()) != l) ||
          (s && y(new s()) != f) ||
          (a && y(new a()) != d)) &&
          (y = function (e) {
            var t = c(e),
              r = "[object Object]" == t ? e.constructor : void 0,
              n = r ? u(r) : "";
            if (n)
              switch (n) {
                case g:
                  return p;
                case m:
                  return h;
                case v:
                  return l;
                case b:
                  return f;
                case w:
                  return d;
              }
            return t;
          }),
          (e.exports = y);
      },
      47801: (e) => {
        e.exports = function (e, t) {
          return null == e ? void 0 : e[t];
        };
      },
      51789: (e, t, r) => {
        var n = r(94536);
        e.exports = function () {
          (this.__data__ = n ? n(null) : {}), (this.size = 0);
        };
      },
      80401: (e) => {
        e.exports = function (e) {
          var t = this.has(e) && delete this.__data__[e];
          return (this.size -= t ? 1 : 0), t;
        };
      },
      57667: (e, t, r) => {
        var n = r(94536),
          i = Object.prototype.hasOwnProperty;
        e.exports = function (e) {
          var t = this.__data__;
          if (n) {
            var r = t[e];
            return "__lodash_hash_undefined__" === r ? void 0 : r;
          }
          return i.call(t, e) ? t[e] : void 0;
        };
      },
      21327: (e, t, r) => {
        var n = r(94536),
          i = Object.prototype.hasOwnProperty;
        e.exports = function (e) {
          var t = this.__data__;
          return n ? void 0 !== t[e] : i.call(t, e);
        };
      },
      81866: (e, t, r) => {
        var n = r(94536);
        e.exports = function (e, t) {
          var r = this.__data__;
          return (
            (this.size += this.has(e) ? 0 : 1),
            (r[e] = n && void 0 === t ? "__lodash_hash_undefined__" : t),
            this
          );
        };
      },
      43824: (e) => {
        var t = Object.prototype.hasOwnProperty;
        e.exports = function (e) {
          var r = e.length,
            n = new e.constructor(r);
          return (
            r &&
              "string" == typeof e[0] &&
              t.call(e, "index") &&
              ((n.index = e.index), (n.input = e.input)),
            n
          );
        };
      },
      29148: (e, t, r) => {
        var n = r(74318),
          i = r(57157),
          o = r(93147),
          s = r(40419),
          a = r(77133);
        e.exports = function (e, t, r) {
          var c = e.constructor;
          switch (t) {
            case "[object ArrayBuffer]":
              return n(e);
            case "[object Boolean]":
            case "[object Date]":
              return new c(+e);
            case "[object DataView]":
              return i(e, r);
            case "[object Float32Array]":
            case "[object Float64Array]":
            case "[object Int8Array]":
            case "[object Int16Array]":
            case "[object Int32Array]":
            case "[object Uint8Array]":
            case "[object Uint8ClampedArray]":
            case "[object Uint16Array]":
            case "[object Uint32Array]":
              return a(e, r);
            case "[object Map]":
            case "[object Set]":
              return new c();
            case "[object Number]":
            case "[object String]":
              return new c(e);
            case "[object RegExp]":
              return o(e);
            case "[object Symbol]":
              return s(e);
          }
        };
      },
      38517: (e, t, r) => {
        var n = r(3118),
          i = r(85924),
          o = r(25726);
        e.exports = function (e) {
          return "function" != typeof e.constructor || o(e) ? {} : n(i(e));
        };
      },
      65776: (e) => {
        var t = /^(?:0|[1-9]\d*)$/;
        e.exports = function (e, r) {
          var n = typeof e;
          return (
            !!(r = null == r ? 9007199254740991 : r) &&
            ("number" == n || ("symbol" != n && t.test(e))) &&
            e > -1 &&
            e % 1 == 0 &&
            e < r
          );
        };
      },
      15403: (e, t, r) => {
        var n = r(1469),
          i = r(33448),
          o = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
          s = /^\w*$/;
        e.exports = function (e, t) {
          if (n(e)) return !1;
          var r = typeof e;
          return (
            !(
              "number" != r &&
              "symbol" != r &&
              "boolean" != r &&
              null != e &&
              !i(e)
            ) ||
            s.test(e) ||
            !o.test(e) ||
            (null != t && e in Object(t))
          );
        };
      },
      37019: (e) => {
        e.exports = function (e) {
          var t = typeof e;
          return "string" == t ||
            "number" == t ||
            "symbol" == t ||
            "boolean" == t
            ? "__proto__" !== e
            : null === e;
        };
      },
      15346: (e, t, r) => {
        var n,
          i = r(14429),
          o = (n = /[^.]+$/.exec((i && i.keys && i.keys.IE_PROTO) || ""))
            ? "Symbol(src)_1." + n
            : "";
        e.exports = function (e) {
          return !!o && o in e;
        };
      },
      25726: (e) => {
        var t = Object.prototype;
        e.exports = function (e) {
          var r = e && e.constructor;
          return e === (("function" == typeof r && r.prototype) || t);
        };
      },
      27040: (e) => {
        e.exports = function () {
          (this.__data__ = []), (this.size = 0);
        };
      },
      14125: (e, t, r) => {
        var n = r(18470),
          i = Array.prototype.splice;
        e.exports = function (e) {
          var t = this.__data__,
            r = n(t, e);
          return !(
            r < 0 ||
            (r == t.length - 1 ? t.pop() : i.call(t, r, 1), --this.size, 0)
          );
        };
      },
      82117: (e, t, r) => {
        var n = r(18470);
        e.exports = function (e) {
          var t = this.__data__,
            r = n(t, e);
          return r < 0 ? void 0 : t[r][1];
        };
      },
      67518: (e, t, r) => {
        var n = r(18470);
        e.exports = function (e) {
          return n(this.__data__, e) > -1;
        };
      },
      54705: (e, t, r) => {
        var n = r(18470);
        e.exports = function (e, t) {
          var r = this.__data__,
            i = n(r, e);
          return i < 0 ? (++this.size, r.push([e, t])) : (r[i][1] = t), this;
        };
      },
      24785: (e, t, r) => {
        var n = r(1989),
          i = r(38407),
          o = r(57071);
        e.exports = function () {
          (this.size = 0),
            (this.__data__ = {
              hash: new n(),
              map: new (o || i)(),
              string: new n(),
            });
        };
      },
      11285: (e, t, r) => {
        var n = r(45050);
        e.exports = function (e) {
          var t = n(this, e).delete(e);
          return (this.size -= t ? 1 : 0), t;
        };
      },
      96e3: (e, t, r) => {
        var n = r(45050);
        e.exports = function (e) {
          return n(this, e).get(e);
        };
      },
      49916: (e, t, r) => {
        var n = r(45050);
        e.exports = function (e) {
          return n(this, e).has(e);
        };
      },
      95265: (e, t, r) => {
        var n = r(45050);
        e.exports = function (e, t) {
          var r = n(this, e),
            i = r.size;
          return r.set(e, t), (this.size += r.size == i ? 0 : 1), this;
        };
      },
      24523: (e, t, r) => {
        var n = r(88306);
        e.exports = function (e) {
          var t = n(e, function (e) {
              return 500 === r.size && r.clear(), e;
            }),
            r = t.cache;
          return t;
        };
      },
      94536: (e, t, r) => {
        var n = r(10852)(Object, "create");
        e.exports = n;
      },
      86916: (e, t, r) => {
        var n = r(5569)(Object.keys, Object);
        e.exports = n;
      },
      33498: (e) => {
        e.exports = function (e) {
          var t = [];
          if (null != e) for (var r in Object(e)) t.push(r);
          return t;
        };
      },
      31167: (e, t, r) => {
        e = r.nmd(e);
        var n = r(31957),
          i = t && !t.nodeType && t,
          o = i && e && !e.nodeType && e,
          s = o && o.exports === i && n.process,
          a = (function () {
            try {
              return (
                (o && o.require && o.require("util").types) ||
                (s && s.binding && s.binding("util"))
              );
            } catch (e) {}
          })();
        e.exports = a;
      },
      2333: (e) => {
        var t = Object.prototype.toString;
        e.exports = function (e) {
          return t.call(e);
        };
      },
      5569: (e) => {
        e.exports = function (e, t) {
          return function (r) {
            return e(t(r));
          };
        };
      },
      55639: (e, t, r) => {
        var n = r(31957),
          i = "object" == typeof self && self && self.Object === Object && self,
          o = n || i || Function("return this")();
        e.exports = o;
      },
      37465: (e, t, r) => {
        var n = r(38407);
        e.exports = function () {
          (this.__data__ = new n()), (this.size = 0);
        };
      },
      63779: (e) => {
        e.exports = function (e) {
          var t = this.__data__,
            r = t.delete(e);
          return (this.size = t.size), r;
        };
      },
      67599: (e) => {
        e.exports = function (e) {
          return this.__data__.get(e);
        };
      },
      44758: (e) => {
        e.exports = function (e) {
          return this.__data__.has(e);
        };
      },
      34309: (e, t, r) => {
        var n = r(38407),
          i = r(57071),
          o = r(83369);
        e.exports = function (e, t) {
          var r = this.__data__;
          if (r instanceof n) {
            var s = r.__data__;
            if (!i || s.length < 199)
              return s.push([e, t]), (this.size = ++r.size), this;
            r = this.__data__ = new o(s);
          }
          return r.set(e, t), (this.size = r.size), this;
        };
      },
      55514: (e, t, r) => {
        var n = r(24523),
          i =
            /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
          o = /\\(\\)?/g,
          s = n(function (e) {
            var t = [];
            return (
              46 === e.charCodeAt(0) && t.push(""),
              e.replace(i, function (e, r, n, i) {
                t.push(n ? i.replace(o, "$1") : r || e);
              }),
              t
            );
          });
        e.exports = s;
      },
      40327: (e, t, r) => {
        var n = r(33448);
        e.exports = function (e) {
          if ("string" == typeof e || n(e)) return e;
          var t = e + "";
          return "0" == t && 1 / e == -1 / 0 ? "-0" : t;
        };
      },
      80346: (e) => {
        var t = Function.prototype.toString;
        e.exports = function (e) {
          if (null != e) {
            try {
              return t.call(e);
            } catch (e) {}
            try {
              return e + "";
            } catch (e) {}
          }
          return "";
        };
      },
      50361: (e, t, r) => {
        var n = r(85990);
        e.exports = function (e) {
          return n(e, 5);
        };
      },
      77813: (e) => {
        e.exports = function (e, t) {
          return e === t || (e != e && t != t);
        };
      },
      35694: (e, t, r) => {
        var n = r(9454),
          i = r(37005),
          o = Object.prototype,
          s = o.hasOwnProperty,
          a = o.propertyIsEnumerable,
          c = n(
            (function () {
              return arguments;
            })()
          )
            ? n
            : function (e) {
                return i(e) && s.call(e, "callee") && !a.call(e, "callee");
              };
        e.exports = c;
      },
      1469: (e) => {
        var t = Array.isArray;
        e.exports = t;
      },
      98612: (e, t, r) => {
        var n = r(23560),
          i = r(41780);
        e.exports = function (e) {
          return null != e && i(e.length) && !n(e);
        };
      },
      44144: (e, t, r) => {
        e = r.nmd(e);
        var n = r(55639),
          i = r(95062),
          o = t && !t.nodeType && t,
          s = o && e && !e.nodeType && e,
          a = s && s.exports === o ? n.Buffer : void 0,
          c = (a ? a.isBuffer : void 0) || i;
        e.exports = c;
      },
      23560: (e, t, r) => {
        var n = r(44239),
          i = r(13218);
        e.exports = function (e) {
          if (!i(e)) return !1;
          var t = n(e);
          return (
            "[object Function]" == t ||
            "[object GeneratorFunction]" == t ||
            "[object AsyncFunction]" == t ||
            "[object Proxy]" == t
          );
        };
      },
      41780: (e) => {
        e.exports = function (e) {
          return (
            "number" == typeof e &&
            e > -1 &&
            e % 1 == 0 &&
            e <= 9007199254740991
          );
        };
      },
      56688: (e, t, r) => {
        var n = r(25588),
          i = r(7518),
          o = r(31167),
          s = o && o.isMap,
          a = s ? i(s) : n;
        e.exports = a;
      },
      13218: (e) => {
        e.exports = function (e) {
          var t = typeof e;
          return null != e && ("object" == t || "function" == t);
        };
      },
      37005: (e) => {
        e.exports = function (e) {
          return null != e && "object" == typeof e;
        };
      },
      72928: (e, t, r) => {
        var n = r(29221),
          i = r(7518),
          o = r(31167),
          s = o && o.isSet,
          a = s ? i(s) : n;
        e.exports = a;
      },
      33448: (e, t, r) => {
        var n = r(44239),
          i = r(37005);
        e.exports = function (e) {
          return "symbol" == typeof e || (i(e) && "[object Symbol]" == n(e));
        };
      },
      36719: (e, t, r) => {
        var n = r(38749),
          i = r(7518),
          o = r(31167),
          s = o && o.isTypedArray,
          a = s ? i(s) : n;
        e.exports = a;
      },
      3674: (e, t, r) => {
        var n = r(14636),
          i = r(280),
          o = r(98612);
        e.exports = function (e) {
          return o(e) ? n(e) : i(e);
        };
      },
      81704: (e, t, r) => {
        var n = r(14636),
          i = r(10313),
          o = r(98612);
        e.exports = function (e) {
          return o(e) ? n(e, !0) : i(e);
        };
      },
      88306: (e, t, r) => {
        var n = r(83369);
        function i(e, t) {
          if ("function" != typeof e || (null != t && "function" != typeof t))
            throw new TypeError("Expected a function");
          var r = function () {
            var n = arguments,
              i = t ? t.apply(this, n) : n[0],
              o = r.cache;
            if (o.has(i)) return o.get(i);
            var s = e.apply(this, n);
            return (r.cache = o.set(i, s) || o), s;
          };
          return (r.cache = new (i.Cache || n)()), r;
        }
        (i.Cache = n), (e.exports = i);
      },
      36968: (e, t, r) => {
        var n = r(10611);
        e.exports = function (e, t, r) {
          return null == e ? e : n(e, t, r);
        };
      },
      70479: (e) => {
        e.exports = function () {
          return [];
        };
      },
      95062: (e) => {
        e.exports = function () {
          return !1;
        };
      },
      79833: (e, t, r) => {
        var n = r(80531);
        e.exports = function (e) {
          return null == e ? "" : n(e);
        };
      },
      73955: (e, t, r) => {
        var n = r(79833),
          i = 0;
        e.exports = function (e) {
          var t = ++i;
          return n(e) + t;
        };
      },
      20477: (e) => {
        "use strict";
        e.exports = function (e, t, r, n) {
          var i = self || window;
          try {
            try {
              var o;
              try {
                o = new i.Blob([e]);
              } catch (t) {
                (o = new (i.BlobBuilder ||
                  i.WebKitBlobBuilder ||
                  i.MozBlobBuilder ||
                  i.MSBlobBuilder)()).append(e),
                  (o = o.getBlob());
              }
              var s = i.URL || i.webkitURL,
                a = s.createObjectURL(o),
                c = new i[t](a, r);
              return s.revokeObjectURL(a), c;
            } catch (n) {
              return new i[t](
                "data:application/javascript,".concat(encodeURIComponent(e)),
                r
              );
            }
          } catch (e) {
            if (!n) throw Error("Inline worker is not supported");
            return new i[t](n, r);
          }
        };
      },
    },
    t = {};
  function r(n) {
    var i = t[n];
    if (void 0 !== i) return i.exports;
    var o = (t[n] = { id: n, loaded: !1, exports: {} });
    return e[n].call(o.exports, o, o.exports, r), (o.loaded = !0), o.exports;
  }
  (r.n = (e) => {
    var t = e && e.__esModule ? () => e.default : () => e;
    return r.d(t, { a: t }), t;
  }),
    (r.d = (e, t) => {
      for (var n in t)
        r.o(t, n) &&
          !r.o(e, n) &&
          Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
    }),
    (r.g = (function () {
      if ("object" == typeof globalThis) return globalThis;
      try {
        return this || new Function("return this")();
      } catch (e) {
        if ("object" == typeof window) return window;
      }
    })()),
    (r.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
    (r.nmd = (e) => ((e.paths = []), e.children || (e.children = []), e)),
    (() => {
      var e;
      r.g.importScripts && (e = r.g.location + "");
      var t = r.g.document;
      if (!e && t && (t.currentScript && (e = t.currentScript.src), !e)) {
        var n = t.getElementsByTagName("script");
        n.length && (e = n[n.length - 1].src);
      }
      if (!e)
        throw new Error(
          "Automatic publicPath is not supported in this browser"
        );
      (e = e
        .replace(/#.*$/, "")
        .replace(/\?.*$/, "")
        .replace(/\/[^\/]+$/, "/")),
        (r.p = e + "../");
    })(),
    (() => {
      "use strict";
      function e(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e);
          t &&
            (n = n.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            r.push.apply(r, n);
        }
        return r;
      }
      function t(t) {
        for (var r = 1; r < arguments.length; r++) {
          var i = null != arguments[r] ? arguments[r] : {};
          r % 2
            ? e(Object(i), !0).forEach(function (e) {
                n(t, e, i[e]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(i))
            : e(Object(i)).forEach(function (e) {
                Object.defineProperty(
                  t,
                  e,
                  Object.getOwnPropertyDescriptor(i, e)
                );
              });
        }
        return t;
      }
      function n(e, t, r) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = r),
          e
        );
      }
      const i = chrome.runtime.getManifest(),
        o = (null == i || i.version, null == i || i.short_name, "saveAs"),
        s = "fileAccess",
        a = "quality",
        c = "screenshotsTaken",
        u = "recordingsTaken",
        h = "skipFullscreenInfoModal",
        l = "colorScheme",
        f = "chrome-capture_yyyy-mm-dd.gif",
        d = "editor",
        p = "normal",
        g = "record_tab",
        m = "screenshot",
        v = "full_webpage_screenshot",
        b = "open_snipping_tool",
        w = "record_desktop",
        y = "#3f51b5";
      var x, _, j, O;
      !(function (e) {
        (e.PURCHASED = "purchased"),
          (e.REFUNDED = "refunded"),
          (e.INITIAL = "initial");
      })(x || (x = {})),
        (function (e) {
          (e.DOWNLOAD = "download"), (e.GOOGLE_DRIVE = "googleDrive");
        })(_ || (_ = {})),
        (function (e) {
          (e.DOWNLOADS = "downloads"),
            (e.DOWNLOADS_SUBFOLDER = "downloadsSubfolder"),
            (e.MANUAL_SELECT = "manualSelect");
        })(j || (j = {})),
        (function (e) {
          (e.WEBM = "webm"), (e.GIF = "gif"), (e.BOTH = "both");
        })(O || (O = {}));
      const S = {
          fillColor: "red",
          fontFamily: "Helvetica",
          drawSize: 5,
          playbackSpeed: p,
          frameSelectorOpen: !0,
          premiumOptionsOpen: !1,
          compressGif: !1,
          saveBy: _.DOWNLOAD,
          isUploadedFilePublic: !0,
        },
        A = t(
          t(
            {},
            {
              showCursor: !1,
              showClickIndicator: !1,
              enableDrawing: !1,
              frames: 10,
              maxLength: 12,
            }
          ),
          {},
          {
            [o]: O.GIF,
            saveAsScreenshot: "png",
            downloadFilename: f,
            [s]: d,
            [a]: 8,
            cursorColor: y,
            cursorSize: 12,
            clickIndicatorColor: y,
            clickIndicatorSize: 40,
            drawingColor: y,
            drawingSize: 12,
            recorderLogic: "normal",
            [c]: 0,
            [u]: 0,
            editor: S,
            requestRatingThreshold: 10,
            disableRequestRating: !1,
            [h]: !1,
            maxRecordingDimensionSize: 1e3,
            [l]: "light",
            rating: null,
            hasSeenMaxTimeRecordingInfo: !1,
            defaultBrowserAction: "popup",
            enableNotifications: !1,
            downloadsSubfolderName: "captures/$date",
            saveLocation: j.DOWNLOADS,
          }
        );
      var k;
      !(function (e) {
        (e.INITIAL = "initial"),
          (e.SUCCESS = "success"),
          (e.ERROR = "error"),
          (e.PENDING = "pending");
      })(k || (k = {}));
      var E = r(36968),
        C = r.n(E),
        P = r(50361),
        M = r.n(P);
      function I(e, t) {
        var r;
        window.chrome.runtime.sendMessage({
          analyticsSettingChanged: { name: e, value: t },
        }),
          (r = ({ settings: r = A }) => {
            window.chrome.storage.sync.set({ settings: C()(M()(r), e, t) });
          }),
          window.chrome.storage.sync.get("settings", r);
      }
      function R(e, t, r) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = r),
          e
        );
      }
      const L = class {
        constructor(e = null, t = null) {
          R(this, "onSettingsUpdated", null),
            R(this, "settings", A),
            R(this, "setup", async (e, t) => {
              (this.onSettingsUpdated = e), this.setSettings({ settings: A });
              const r = await (async function () {
                return new Promise((e) => {
                  window.chrome.storage.sync.get(
                    "settings",
                    ({ settings: t }) => e(t || A)
                  );
                });
              })();
              this.setSettings({ settings: r }),
                t && t(r),
                this.onChangeListener();
            }),
            R(this, "setSettings", ({ settings: e }) => {
              null != e &&
                ((this.settings = e),
                this.onSettingsUpdated && this.onSettingsUpdated(e));
            }),
            R(this, "stopListener", () => {
              chrome.storage.onChanged.removeListener(this.setSettings),
                (this.onSettingsUpdated = null);
            }),
            this.setup(e, t);
        }
        onChangeListener() {
          window.chrome.storage.onChanged.addListener((e) => {
            e.settings && this.setSettings({ settings: e.settings.newValue });
          });
        }
      };
      let D = !1;
      const F = new L();
      function T(e) {
        const { settings: t } = F,
          r = window._gaq || [];
        if (e.captureImage) r.push(["_trackEvent", "screenshot", "clicked"]);
        else if ("recording" === e.name)
          r.push(["_trackEvent", `recording ${t.saveAs}`, "clicked"]);
        else if (e.openOptions)
          r.push(["_trackEvent", "opened options", "clicked"]);
        else if (e.analyticsStartedChromeCapture)
          r.push(["_set", "page", e.host]),
            r.push(["_set", "title", e.title]),
            D && r.push(["_setVar", "purchased"]),
            r.push(["_setCustomVar", 1, s, t.fileAccess]),
            r.push(["_setCustomVar", 2, a, `quality: ${t.quality}`]),
            r.push([
              "_setCustomVar",
              3,
              "purchased",
              D ? "purchased" : "not purchased",
            ]),
            r.push(["_trackPageview"]),
            r.push(["_trackEvent", "started chrome capture", "clicked"]);
        else if (e.analyticsOpenedPurchase)
          r.push(["_trackEvent", "opened purchase", "clicked"]);
        else if (e.analyticsPurchaseSuccessful)
          r.push(["_trackEvent", "purchase successful", "clicked"]), (D = !0);
        else if (e.analyticsPurchaseFailed)
          r.push(["_trackEvent", "purchase failed", "clicked"]);
        else if (e.analyticsWillRate)
          r.push([
            "_trackEvent",
            `rating request: ${e.analyticsWillRate}`,
            "clicked",
          ]);
        else if (e.analyticsRatingThresholdReached)
          r.push([
            "_trackEvent",
            "rating request threshold reached",
            "clicked",
          ]);
        else if (e.noFramesFoundOnWindowError)
          r.push(["_trackEvent", "no frames found on window", "clicked"]);
        else if (e.noFramesFoundOnFirstTryWindowError)
          r.push(["_trackEvent", "editor no frames - first try", "clicked"]);
        else if (e.editorActionChanged)
          r.push([
            "_trackEvent",
            `editor action selected: ${e.editorActionChanged}`,
            "clicked",
          ]);
        else if (e.analyticsFrameSelectorAction)
          r.push([
            "_trackEvent",
            "editor frame selector action occured",
            e.analyticsFrameSelectorAction,
          ]);
        else if (e.analyticsSettingChanged)
          r.push([
            "_trackEvent",
            `setting changed: ${e.analyticsSettingChanged.name}`,
            String(e.analyticsSettingChanged.value),
          ]);
        else if (e.analyticsFullWebpageCaptureNotSupported)
          r.push([
            "_trackEvent",
            "fullwebpage capture not supported for site",
            String(e.analyticsFullWebpageCaptureNotSupported.url),
          ]);
        else if (e.analyticsFullWebpageScreenshot)
          r.push([
            "_trackEvent",
            "fullwebpage screenshot",
            String(e.analyticsFullWebpageScreenshot.url),
          ]);
        else if (e.analyticsOpenedSnippingTool)
          r.push(["_trackEvent", "opened snipping tool", String(e.url)]);
        else if (e.analyticsOpenedPopup)
          r.push(["_trackEvent", "opened popup", String(e.url)]);
        else if (e.command) {
          var n;
          r.push([
            "_trackEvent",
            `command: ${e.command}`,
            String(null === (n = e.tab) || void 0 === n ? void 0 : n.url),
          ]);
        }
      }
      !(async function (e) {
        ((e) => {
          e = !!e;
        })(
          await (async function () {
            return new Promise((e) => {
              window.chrome.storage.local.get(
                "purchased",
                ({ purchased: t }) => {
                  e(t);
                }
              );
            });
          })()
        );
      })();
      var U = r(73955),
        W = r.n(U);
      const z =
        !(
          "undefined" != typeof WorkerGlobalScope &&
          self instanceof WorkerGlobalScope
        ) && new L();
      function $(e, t, r = 1, n = !1, i = !1) {
        const o = Math.round(1e3 * (r + Number.EPSILON)) / 1e3,
          s = Math.round(t.x * o),
          a = Math.round(t.y * o);
        let c = Math.floor((t.x2 - t.x) * o),
          u = Math.floor((t.y2 - t.y) * o);
        const { restrictedWidth: h = c, restrictedHeight: l = u } = i
            ? {}
            : B(c, u, n),
          f = document.createElement("canvas");
        return (
          (f.width = c),
          (f.height = u),
          f.getContext("2d").drawImage(e, s, a, c, u, 0, 0, h, l),
          f
        );
      }
      function q(e, t = !1) {
        const r = document.createElement("canvas"),
          { restrictedWidth: n, restrictedHeight: i } = B(e.width, e.height, t);
        return (
          (r.width = n),
          (r.height = i),
          r.getContext("2d").drawImage(e, 0, 0, e.width, e.height, 0, 0, n, i),
          r
        );
      }
      async function N(e) {
        return new Promise((t, r) => {
          let n = new Image();
          (n.onload = () => t(n)), (n.onerror = r), (n.src = e);
        });
      }
      function H(e, t) {
        return new Promise((r, n) => {
          N(e).then((e) => r(q(e, t)));
        });
      }
      function B(e, t, r = !0) {
        let n = e,
          i = t;
        const { maxRecordingDimensionSize: o } = z.settings;
        if ("no-limit" !== o && (e > o || t > o) && r) {
          const r = Math.max(e, t),
            s = Number(o) / r;
          (n = Math.floor(e * s)), (i = Math.floor(t * s));
        }
        return { restrictedWidth: n, restrictedHeight: i };
      }
      const G = new L();
      function Q(e, t, r = "") {
        var n = document.createElement("a");
        (n.download = `${t}${r}`), (n.href = e), n.click();
      }
      async function V(e, t, r = "", n = !0, i = !1) {
        const { downloadsSubfolderName: o } = G.settings;
        return new Promise((s) => {
          chrome.downloads.download(
            { filename: n ? K(o, t, r) : `${t}${r}`, url: e, saveAs: i },
            (n) => {
              void 0 === n && Q(e, t, r), s(!0);
            }
          );
        });
      }
      function K(e, t, r = "") {
        const n = (function (e) {
          return e.replace("$date", Y());
        })(e);
        return `${n}/${t.replace(/[^\w\s-]/gi, "-")}${r}`.replace(
          new RegExp("//*", "g"),
          "/"
        );
      }
      function Y() {
        const e = new Date();
        return `${e.getFullYear()}-${e.getMonth()}-${e.getDate()}`;
      }
      async function J(e, t = !1) {
        const r = Y(),
          n = (function () {
            const e = new Date();
            return `${e.getHours()}-${e.getMinutes()}-${e.getSeconds()}`;
          })();
        switch (e) {
          case "yyyy-mm-dd_hh-mm-ss.gif":
            return `${r}_${n}`;
          case f:
            return `chrome-capture-${r}`;
        }
        const { name: i, title: o } = await (async () => {
          if (t) return { name: "desktop-capture", title: "desktop-capture" };
          const e = await (async function () {
            if (
              (await X("tabs")) ||
              (await (async function (e) {
                return new Promise((e, t) => {
                  chrome.permissions.request({ permissions: ["tabs"] }, (t) =>
                    e(!!t)
                  );
                });
              })())
            )
              return await (async function () {
                return new Promise((e, t) => {
                  chrome.tabs.query(
                    { active: !0, currentWindow: !0 },
                    function (t) {
                      e(t[0]);
                    }
                  );
                });
              })();
          })();
          if (e) {
            const t = new URL(e.url).hostname;
            return {
              name: t.substring(0, t.lastIndexOf(".")).replace(/\./g, "-"),
              title: e.title
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-")
                .toLowerCase(),
            };
          }
          return { name: "website-capture", title: "website-capture" };
        })();
        switch (e) {
          case "website-name.gif":
            return i.substring(0, 30) || "chrome-capture";
          case "website-label.gif":
            return o.substring(0, 30) || "chrome-capture";
          case "website-name_yyyy-mm-dd.gif":
            return `${i.substring(0, 20)}_${r}`;
          case "website-label_yyyy-mm-dd.gif":
            return `${o.substring(0, 20)}_${r}`;
          default:
            return `chrome-capture-${r}`;
        }
      }
      async function X(e) {
        return new Promise((t, r) => {
          chrome.permissions.contains({ permissions: [e] }, (e) => t(!!e));
        });
      }
      async function Z(e, t, r, n, i) {
        switch (G.settings.fileAccess) {
          case "download":
            await (async function (
              e,
              t = "chrome-capture",
              r = "",
              n = G.settings.saveLocation
            ) {
              try {
                if (n === j.DOWNLOADS_SUBFOLDER) await V(e, t, r, !0);
                else if (n === j.MANUAL_SELECT)
                  try {
                    await (async function (e, t, r = "") {
                      window.showSaveFilePicker || Q(e, t, r);
                      const n = await (function (e, t = "") {
                          var r, n;
                          const i = {
                            suggestedName: `${e}${t}`,
                            types: [
                              {
                                description: "Capture Files",
                                accept: {
                                  "image/gif": [".gif"],
                                  "image/jpeg": [".jpeg", ".jpg"],
                                  "image/png": [".png"],
                                  "video/webm": [".webm"],
                                },
                              },
                            ],
                          };
                          return null ===
                            (r = (n = window).showSaveFilePicker) ||
                            void 0 === r
                            ? void 0
                            : r.call(n, i);
                        })(t, r),
                        i = await n.createWritable();
                      await i.write(await fetch(e).then((e) => e.blob())),
                        i.close();
                    })(e, t, r);
                  } catch (n) {
                    "AbortError" === n.name
                      ? await Q(e, t, r)
                      : await V(e, t, r, !1, !0);
                  }
                else await Q(e, t, r);
              } catch (n) {
                await Q(e, t, r);
              }
            })(e, t, r),
              e && window.URL.revokeObjectURL(e);
            break;
          case d:
            var o = window.open("layout/editor.html");
            (o.frame = n), (o.filename = t), e && window.URL.revokeObjectURL(e);
            break;
          default:
            i
              ? (function (e) {
                  window.open("").document.write(e.outerHTML);
                })(i)
              : window.chrome.tabs.create({ url: e });
        }
      }
      const ee = async (e, t, r) => {
        const n = document.createElement("canvas"),
          i = t,
          o = r;
        return (
          (n.width = i),
          (n.height = o),
          n.getContext("2d").drawImage(e, 0, 0, i, o),
          n
        );
      };
      async function te(e, t, r, n, i) {
        const o = r
          ? await ((s = e.data),
            (a = r),
            void 0,
            !1,
            !0,
            new Promise((e, t) => {
              N(s).then((t) => e($(t, a, undefined, false, true)));
            }))
          : await H(e.data);
        var s, a;
        return t
          ? await (async (e, t, r = t.width, n = t.height) => {
              const i = await ee(t, r, n);
              return i.getContext("2d").drawImage(e, 0, 0, r, n), i;
            })(t, o, n, i)
          : n && i
          ? ee(o, n, i)
          : o;
      }
      const re = (e, t, r) =>
          r
            ? ne(r, t)
            : 1e3 / ((e, t) => Math.min(t !== p ? e * Number(t) : e, 50))(e, t),
        ne = (e, t) => Math.max(t !== p ? e / Number(t) : e, 20),
        ie = "ic_48",
        oe = "ic_screenshot_48",
        se = new L();
      function ae(e = "ic_48", t = se.settings.colorScheme) {
        const r = "dark" === t;
        window.chrome.browserAction.setIcon({
          path: `./images${r ? "/dark" : ""}/${e}.png`,
        });
      }
      function ce(e) {
        window.chrome.browserAction.setBadgeBackgroundColor({ color: "red" }),
          window.chrome.browserAction.setBadgeText({ text: `${e}` });
      }
      const { chrome: ue } = window,
        he = new L();
      async function le(e) {
        const { settings: t } = he;
        ae(oe),
          I(c, t.screenshotsTaken + 1),
          ue.tabs.captureVisibleTab(
            null,
            { quality: 100, format: t.saveAsScreenshot },
            async function (r) {
              if (r) {
                const n = await N(r),
                  i = e.fullscreen ? q(n) : $(n, e.position, e.z || 1);
                Z(
                  i.toDataURL(`image/${t.saveAsScreenshot}`),
                  await J(t.downloadFilename),
                  `.${t.saveAsScreenshot}`,
                  i
                );
              } else
                alert(
                  ("unable_to_capture_website_alert",
                  chrome.i18n.getMessage(
                    "unable_to_capture_website_alert",
                    undefined
                  ))
                );
              ae(ie);
            }
          );
      }
      const { chrome: fe } = window;
      function de(e, t, r = !0, n) {
        fe.tabs.executeScript(null, { file: e }, (e) => {
          void 0 === e
            ? (r && alert(fe.i18n.getMessage("alert_text")), n && n())
            : t && t();
        });
      }
      function pe(e, t, r) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = r),
          e
        );
      }
      r(76866);
      var ge = r(20477),
        me = r.n(ge);
      function ve() {
        return me()(
          '(()=>{var e={470:e=>{"use strict";function n(e){if("string"!=typeof e)throw new TypeError("Path must be a string. Received "+JSON.stringify(e))}function t(e,n){for(var t,r="",i=0,o=-1,a=0,f=0;f<=e.length;++f){if(f<e.length)t=e.charCodeAt(f);else{if(47===t)break;t=47}if(47===t){if(o===f-1||1===a);else if(o!==f-1&&2===a){if(r.length<2||2!==i||46!==r.charCodeAt(r.length-1)||46!==r.charCodeAt(r.length-2))if(r.length>2){var s=r.lastIndexOf("/");if(s!==r.length-1){-1===s?(r="",i=0):i=(r=r.slice(0,s)).length-1-r.lastIndexOf("/"),o=f,a=0;continue}}else if(2===r.length||1===r.length){r="",i=0,o=f,a=0;continue}n&&(r.length>0?r+="/..":r="..",i=2)}else r.length>0?r+="/"+e.slice(o+1,f):r=e.slice(o+1,f),i=f-o-1;o=f,a=0}else 46===t&&-1!==a?++a:a=-1}return r}var r={resolve:function(){for(var e,r="",i=!1,o=arguments.length-1;o>=-1&&!i;o--){var a;o>=0?a=arguments[o]:(void 0===e&&(e=process.cwd()),a=e),n(a),0!==a.length&&(r=a+"/"+r,i=47===a.charCodeAt(0))}return r=t(r,!i),i?r.length>0?"/"+r:"/":r.length>0?r:"."},normalize:function(e){if(n(e),0===e.length)return".";var r=47===e.charCodeAt(0),i=47===e.charCodeAt(e.length-1);return 0!==(e=t(e,!r)).length||r||(e="."),e.length>0&&i&&(e+="/"),r?"/"+e:e},isAbsolute:function(e){return n(e),e.length>0&&47===e.charCodeAt(0)},join:function(){if(0===arguments.length)return".";for(var e,t=0;t<arguments.length;++t){var i=arguments[t];n(i),i.length>0&&(void 0===e?e=i:e+="/"+i)}return void 0===e?".":r.normalize(e)},relative:function(e,t){if(n(e),n(t),e===t)return"";if((e=r.resolve(e))===(t=r.resolve(t)))return"";for(var i=1;i<e.length&&47===e.charCodeAt(i);++i);for(var o=e.length,a=o-i,f=1;f<t.length&&47===t.charCodeAt(f);++f);for(var s=t.length-f,u=a<s?a:s,c=-1,l=0;l<=u;++l){if(l===u){if(s>u){if(47===t.charCodeAt(f+l))return t.slice(f+l+1);if(0===l)return t.slice(f+l)}else a>u&&(47===e.charCodeAt(i+l)?c=l:0===l&&(c=0));break}var h=e.charCodeAt(i+l);if(h!==t.charCodeAt(f+l))break;47===h&&(c=l)}var p="";for(l=i+c+1;l<=o;++l)l!==o&&47!==e.charCodeAt(l)||(0===p.length?p+="..":p+="/..");return p.length>0?p+t.slice(f+c):(f+=c,47===t.charCodeAt(f)&&++f,t.slice(f))},_makeLong:function(e){return e},dirname:function(e){if(n(e),0===e.length)return".";for(var t=e.charCodeAt(0),r=47===t,i=-1,o=!0,a=e.length-1;a>=1;--a)if(47===(t=e.charCodeAt(a))){if(!o){i=a;break}}else o=!1;return-1===i?r?"/":".":r&&1===i?"//":e.slice(0,i)},basename:function(e,t){if(void 0!==t&&"string"!=typeof t)throw new TypeError(\'"ext" argument must be a string\');n(e);var r,i=0,o=-1,a=!0;if(void 0!==t&&t.length>0&&t.length<=e.length){if(t.length===e.length&&t===e)return"";var f=t.length-1,s=-1;for(r=e.length-1;r>=0;--r){var u=e.charCodeAt(r);if(47===u){if(!a){i=r+1;break}}else-1===s&&(a=!1,s=r+1),f>=0&&(u===t.charCodeAt(f)?-1==--f&&(o=r):(f=-1,o=s))}return i===o?o=s:-1===o&&(o=e.length),e.slice(i,o)}for(r=e.length-1;r>=0;--r)if(47===e.charCodeAt(r)){if(!a){i=r+1;break}}else-1===o&&(a=!1,o=r+1);return-1===o?"":e.slice(i,o)},extname:function(e){n(e);for(var t=-1,r=0,i=-1,o=!0,a=0,f=e.length-1;f>=0;--f){var s=e.charCodeAt(f);if(47!==s)-1===i&&(o=!1,i=f+1),46===s?-1===t?t=f:1!==a&&(a=1):-1!==t&&(a=-1);else if(!o){r=f+1;break}}return-1===t||-1===i||0===a||1===a&&t===i-1&&t===r+1?"":e.slice(t,i)},format:function(e){if(null===e||"object"!=typeof e)throw new TypeError(\'The "pathObject" argument must be of type Object. Received type \'+typeof e);return function(e,n){var t=n.dir||n.root,r=n.base||(n.name||"")+(n.ext||"");return t?t===n.root?t+r:t+"/"+r:r}(0,e)},parse:function(e){n(e);var t={root:"",dir:"",base:"",ext:"",name:""};if(0===e.length)return t;var r,i=e.charCodeAt(0),o=47===i;o?(t.root="/",r=1):r=0;for(var a=-1,f=0,s=-1,u=!0,c=e.length-1,l=0;c>=r;--c)if(47!==(i=e.charCodeAt(c)))-1===s&&(u=!1,s=c+1),46===i?-1===a?a=c:1!==l&&(l=1):-1!==a&&(l=-1);else if(!u){f=c+1;break}return-1===a||-1===s||0===l||1===l&&a===s-1&&a===f+1?-1!==s&&(t.base=t.name=0===f&&o?e.slice(1,s):e.slice(f,s)):(0===f&&o?(t.name=e.slice(1,a),t.base=e.slice(1,s)):(t.name=e.slice(f,a),t.base=e.slice(f,s)),t.ext=e.slice(a,s)),f>0?t.dir=e.slice(0,f-1):o&&(t.dir="/"),t},sep:"/",delimiter:":",win32:null,posix:null};r.posix=r,e.exports=r},2:()=>{}},n={};function t(r){var i=n[r];if(void 0!==i)return i.exports;var o=n[r]={exports:{}};return e[r](o,o.exports,t),o.exports}(()=>{"use strict";var e;const n=(e=(e="undefined"!=typeof document&&document.currentScript?document.currentScript.src:void 0)||"/index.js",function(n){var r,i;(n=void 0!==(n=n||{})?n:{}).ready=new Promise((function(e,n){r=e,i=n}));var o,a={};for(o in n)n.hasOwnProperty(o)&&(a[o]=n[o]);var f=[],s=function(e,n){throw n},u=!1,c=!1,l=!1,h=!1;u="object"==typeof window,c="function"==typeof importScripts,l="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node,h=!u&&!l&&!c;var p,d,m,g,v="";function y(e){return n.locateFile?n.locateFile(e,v):v+e}l?(v=c?t(470).dirname(v)+"/":"//",p=function(e,n){return m||(m=t(2)),g||(g=t(470)),e=g.normalize(e),m.readFileSync(e,n?null:"utf8")},d=function(e){var n=p(e,!0);return n.buffer||(n=new Uint8Array(n)),S(n.buffer),n},process.argv.length>1&&process.argv[1].replace(/\\\\/g,"/"),f=process.argv.slice(2),process.on("uncaughtException",(function(e){if(!(e instanceof Ce))throw e})),process.on("unhandledRejection",$),s=function(e){process.exit(e)},n.inspect=function(){return"[Emscripten Module object]"}):h?("undefined"!=typeof read&&(p=function(e){return read(e)}),d=function(e){var n;return"function"==typeof readbuffer?new Uint8Array(readbuffer(e)):(S("object"==typeof(n=read(e,"binary"))),n)},"undefined"!=typeof scriptArgs?f=scriptArgs:void 0!==arguments&&(f=arguments),"function"==typeof quit&&(s=function(e){quit(e)}),"undefined"!=typeof print&&("undefined"==typeof console&&(console={}),console.log=print,console.warn=console.error="undefined"!=typeof printErr?printErr:print)):(u||c)&&(c?v=self.location.href:document.currentScript&&(v=document.currentScript.src),e&&(v=e),v=0!==v.indexOf("blob:")?v.substr(0,v.lastIndexOf("/")+1):"",p=function(e){var n=new XMLHttpRequest;return n.open("GET",e,!1),n.send(null),n.responseText},c&&(d=function(e){var n=new XMLHttpRequest;return n.open("GET",e,!1),n.responseType="arraybuffer",n.send(null),new Uint8Array(n.response)}));var b=n.print||console.log.bind(console),w=n.printErr||console.warn.bind(console);for(o in a)a.hasOwnProperty(o)&&(n[o]=a[o]);a=null,n.arguments&&(f=n.arguments),n.thisProgram&&n.thisProgram,n.quit&&(s=n.quit);var _,A,x,C,R=function(e){};n.wasmBinary&&(_=n.wasmBinary),n.noExitRuntime&&(A=n.noExitRuntime),"object"!=typeof WebAssembly&&$("no native wasm support detected");var E=!1;function S(e,n){e||$("Assertion failed: "+n)}var k="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0;function I(e,n,t){for(var r=n+t,i=n;e[i]&&!(i>=r);)++i;if(i-n>16&&e.subarray&&k)return k.decode(e.subarray(n,i));for(var o="";n<i;){var a=e[n++];if(128&a){var f=63&e[n++];if(192!=(224&a)){var s=63&e[n++];if((a=224==(240&a)?(15&a)<<12|f<<6|s:(7&a)<<18|f<<12|s<<6|63&e[n++])<65536)o+=String.fromCharCode(a);else{var u=a-65536;o+=String.fromCharCode(55296|u>>10,56320|1023&u)}}else o+=String.fromCharCode((31&a)<<6|f)}else o+=String.fromCharCode(a)}return o}function j(e,n){return e?I(W,e,n):""}"undefined"!=typeof TextDecoder&&new TextDecoder("utf-16le");var T,W,P,U=65536;function M(e,n){return e%n>0&&(e+=n-e%n),e}function O(e){T=e,n.HEAP8=new Int8Array(e),n.HEAP16=new Int16Array(e),n.HEAP32=P=new Int32Array(e),n.HEAPU8=W=new Uint8Array(e),n.HEAPU16=new Uint16Array(e),n.HEAPU32=new Uint32Array(e),n.HEAPF32=new Float32Array(e),n.HEAPF64=new Float64Array(e)}var H=n.INITIAL_MEMORY||16777216;(x=n.wasmMemory?n.wasmMemory:new WebAssembly.Memory({initial:H/U,maximum:2147483648/U}))&&(T=x.buffer),H=T.byteLength,O(T);var L=[],F=[],D=[],q=[];function z(){if(n.preRun)for("function"==typeof n.preRun&&(n.preRun=[n.preRun]);n.preRun.length;)X(n.preRun.shift());ue(L)}function B(){ue(F)}function G(){ue(D)}function N(){if(n.postRun)for("function"==typeof n.postRun&&(n.postRun=[n.postRun]);n.postRun.length;)J(n.postRun.shift());ue(q)}function X(e){L.unshift(e)}function J(e){q.unshift(e)}var Y=0,K=null,Q=null;function V(e){Y++,n.monitorRunDependencies&&n.monitorRunDependencies(Y)}function Z(e){if(Y--,n.monitorRunDependencies&&n.monitorRunDependencies(Y),0==Y&&(null!==K&&(clearInterval(K),K=null),Q)){var t=Q;Q=null,t()}}function $(e){n.onAbort&&n.onAbort(e),w(e+=""),E=!0,e="abort("+e+"). Build with -s ASSERTIONS=1 for more info.";var t=new WebAssembly.RuntimeError(e);throw i(t),t}function ee(e,n){return String.prototype.startsWith?e.startsWith(n):0===e.indexOf(n)}n.preloadedImages={},n.preloadedAudios={};var ne="data:application/octet-stream;base64,";function te(e){return ee(e,ne)}var re="file://";function ie(e){return ee(e,re)}var oe="encoder.wasm";function ae(){try{if(_)return new Uint8Array(_);if(d)return d(oe);throw"both async and sync fetching of the wasm failed"}catch(e){$(e)}}function fe(){return _||!u&&!c||"function"!=typeof fetch||ie(oe)?Promise.resolve().then(ae):fetch(oe,{credentials:"same-origin"}).then((function(e){if(!e.ok)throw"failed to load wasm binary file at \'"+oe+"\'";return e.arrayBuffer()})).catch((function(){return ae()}))}function se(){var e={env:Ae,wasi_snapshot_preview1:Ae};function t(e,t){var r=e.exports;n.asm=r,C=n.asm.__indirect_function_table,Z()}function r(e){t(e.instance)}function i(n){return fe().then((function(n){return WebAssembly.instantiate(n,e)})).then(n,(function(e){w("failed to asynchronously prepare wasm: "+e),$(e)}))}if(V(),n.instantiateWasm)try{return n.instantiateWasm(e,t)}catch(e){return w("Module.instantiateWasm callback failed with error: "+e),!1}return function(){if(_||"function"!=typeof WebAssembly.instantiateStreaming||te(oe)||ie(oe)||"function"!=typeof fetch)return i(r);fetch(oe,{credentials:"same-origin"}).then((function(n){return WebAssembly.instantiateStreaming(n,e).then(r,(function(e){return w("wasm streaming compile failed: "+e),w("falling back to ArrayBuffer instantiation"),i(r)}))}))}(),{}}function ue(e){for(;e.length>0;){var t=e.shift();if("function"!=typeof t){var r=t.func;"number"==typeof r?void 0===t.arg?C.get(r)():C.get(r)(t.arg):r(void 0===t.arg?null:t.arg)}else t(n)}}function ce(e,n,t,r){$("Assertion failed: "+j(e)+", at: "+[n?j(n):"unknown filename",t,r?j(r):"unknown function"])}function le(e,n,t){W.copyWithin(e,n,n+t)}function he(){return W.length}function pe(e){try{return x.grow(e-T.byteLength+65535>>>16),O(x.buffer),1}catch(e){}}function de(e){e>>>=0;var n=he(),t=2147483648;if(e>t)return!1;for(var r=1;r<=4;r*=2){var i=n*(1+.2/r);if(i=Math.min(i,e+100663296),pe(Math.min(t,M(Math.max(16777216,e,i),65536))))return!0}return!1}function me(e){Ee(e)}te(oe)||(oe=y(oe));var ge={mappings:{},buffers:[null,[],[]],printChar:function(e,n){var t=ge.buffers[e];0===n||10===n?((1===e?b:w)(I(t,0)),t.length=0):t.push(n)},varargs:void 0,get:function(){return ge.varargs+=4,P[ge.varargs-4>>2]},getStr:function(e){return j(e)},get64:function(e,n){return e}};function ve(e){return 0}function ye(e,n,t,r,i){}function be(e,n,t,r){for(var i=0,o=0;o<t;o++){for(var a=P[n+8*o>>2],f=P[n+(8*o+4)>>2],s=0;s<f;s++)ge.printChar(e,W[a+s]);i+=f}return P[r>>2]=i,0}function we(e){R(0|e)}F.push({func:function(){xe()}});var _e,Ae={__assert_fail:ce,emscripten_memcpy_big:le,emscripten_resize_heap:de,exit:me,fd_close:ve,fd_seek:ye,fd_write:be,memory:x,setTempRet0:we},xe=(se(),n.___wasm_call_ctors=function(){return(xe=n.___wasm_call_ctors=n.asm.__wasm_call_ctors).apply(null,arguments)});function Ce(e){this.name="ExitStatus",this.message="Program terminated with exit("+e+")",this.status=e}function Re(e){function t(){_e||(_e=!0,n.calledRun=!0,E||(B(),G(),r(n),n.onRuntimeInitialized&&n.onRuntimeInitialized(),N()))}e=e||f,Y>0||(z(),Y>0||(n.setStatus?(n.setStatus("Running..."),setTimeout((function(){setTimeout((function(){n.setStatus("")}),1),t()}),1)):t()))}function Ee(e,t){t&&A&&0===e||(A||(n.onExit&&n.onExit(e),E=!0),s(e,new Ce(e)))}if(n._encoder_new=function(){return(n._encoder_new=n.asm.encoder_new).apply(null,arguments)},n._encoder_add_frame=function(){return(n._encoder_add_frame=n.asm.encoder_add_frame).apply(null,arguments)},n._free=function(){return(n._free=n.asm.free).apply(null,arguments)},n._encoder_finish=function(){return(n._encoder_finish=n.asm.encoder_finish).apply(null,arguments)},n.___errno_location=function(){return(n.___errno_location=n.asm.__errno_location).apply(null,arguments)},n._malloc=function(){return(n._malloc=n.asm.malloc).apply(null,arguments)},n.stackSave=function(){return(n.stackSave=n.asm.stackSave).apply(null,arguments)},n.stackRestore=function(){return(n.stackRestore=n.asm.stackRestore).apply(null,arguments)},n.stackAlloc=function(){return(n.stackAlloc=n.asm.stackAlloc).apply(null,arguments)},n.dynCall_jiji=function(){return(n.dynCall_jiji=n.asm.dynCall_jiji).apply(null,arguments)},Q=function e(){_e||Re(),_e||(Q=e)},n.run=Re,n.preInit)for("function"==typeof n.preInit&&(n.preInit=[n.preInit]);n.preInit.length>0;)n.preInit.pop()();return A=!0,Re(),n.ready});let r,i,o=!1;const a=[];let f;function s(){if(!o)return;let e;for(;e=a.shift();){const n=e.width*e.height,t=i._malloc(e.paletteLength+n);new Uint8Array(i.HEAPU8.buffer,t,e.paletteLength+n).set(new Uint8Array(e.buffer)),i._encoder_add_frame(f,e.top,e.left,e.width,e.height,t,e.delay/10,e.paletteLength),i._free(t)}}var u;self.onmessage=async e=>{self.onmessage=e=>{"finish"===e.data?function(){if(!f)return;const e=function(e,n){var t,r=i.asm.__indirect_function_table;if(!u){u=new WeakMap;for(var o=0;o<r.length;o++){var a=r.get(o);a&&u.set(a,o)}}if(u.has(e))return u.get(e);if(c.length)t=c.pop();else{t=r.length;try{r.grow(1)}catch(e){if(!(e instanceof RangeError))throw e;throw"Unable to grow wasm table. Set ALLOW_TABLE_GROWTH."}}try{r.set(t,e)}catch(n){if(!(n instanceof TypeError))throw n;var f=function(e,n){if("function"==typeof WebAssembly.Function){for(var t={i:"i32",j:"i64",f:"f32",d:"f64"},r={parameters:[],results:"v"==n[0]?[]:[t[n[0]]]},i=1;i<n.length;++i)r.parameters.push(t[n[i]]);return new WebAssembly.Function(r,e)}var o=[1,0,1,96],a=n.slice(0,1),f=n.slice(1),s={i:127,j:126,f:125,d:124};for(o.push(f.length),i=0;i<f.length;++i)o.push(s[f[i]]);"v"==a?o.push(0):o=o.concat([1,s[a]]),o[1]=o.length-2;var u=new Uint8Array([0,97,115,109,1,0,0,0].concat(o,[2,7,1,1,101,1,102,0,0,7,5,1,1,102,0,0])),c=new WebAssembly.Module(u);return new WebAssembly.Instance(c,{e:{f:e}}).exports.f}(e,"vii");r.set(t,f)}return u.set(e,t),t}(((e,n)=>{const t=new Uint8Array(n);t.set(new Uint8Array(i.HEAPU8.buffer,e,n)),self.postMessage(t.buffer,{transfer:[t.buffer]})}));i._encoder_finish(f,e),f=void 0}():(a.push(e.data),s())},r=e.data,i=await n({locateFile:(e,n)=>r.wasmFileLocation}),f=i._encoder_new(r.width,r.height),o=!0,s()};var c=[]})()})();',
          "Worker",
          void 0,
          r.p + "encoder.worker/bundle.worker.js"
        );
      }
      function be() {
        return me()(
          '(()=>{var t={625:function(t){(function(){function i(t){if(t=t||{},this.method=t.method||2,this.colors=t.colors||256,this.initColors=t.initColors||4096,this.initDist=t.initDist||.01,this.distIncr=t.distIncr||.005,this.hueGroups=t.hueGroups||10,this.satGroups=t.satGroups||10,this.lumGroups=t.lumGroups||10,this.minHueCols=t.minHueCols||0,this.hueStats=this.minHueCols?new r(this.hueGroups,this.minHueCols):null,this.boxSize=t.boxSize||[64,64],this.boxPxls=t.boxPxls||2,this.palLocked=!1,this.dithKern=t.dithKern||null,this.dithSerp=t.dithSerp||!1,this.dithDelta=t.dithDelta||0,this.histogram={},this.idxrgb=t.palette?t.palette.slice(0):[],this.idxi32=[],this.i32idx={},this.i32rgb={},this.useCache=!1!==t.useCache,this.cacheFreq=t.cacheFreq||10,this.reIndex=t.reIndex||0==this.idxrgb.length,this.colorDist="manhattan"==t.colorDist?u:o,this.idxrgb.length>0){var i=this;this.idxrgb.forEach((function(t,r){var e=(255<<24|t[2]<<16|t[1]<<8|t[0])>>>0;i.idxi32[r]=e,i.i32idx[e]=r,i.i32rgb[e]=t}))}}function r(t,i){this.numGroups=t,this.minCols=i,this.stats={};for(var r=-1;r<t;r++)this.stats[r]={num:0,cols:[]};this.groupsFull=0}i.prototype.sample=function(t,i){if(this.palLocked)throw"Cannot sample additional images, palette already assembled.";var r=g(t,i);switch(this.method){case 1:this.colorStats1D(r.buf32);break;case 2:this.colorStats2D(r.buf32,r.width)}},i.prototype.reduce=function(t,i,r,e){if(this.palLocked||this.buildPal(),r=r||this.dithKern,e=void 0!==e?e:this.dithSerp,i=i||1,r)var s=this.dither(t,r,e);else for(var n=g(t).buf32,h=n.length,a=(s=new Uint32Array(h),0);a<h;a++){var o=n[a];s[a]=this.nearestColor(o)}if(1==i)return new Uint8Array(s.buffer);if(2==i){var u=[];for(h=s.length,a=0;a<h;a++)o=s[a],u[a]=this.i32idx[o];return u}},i.prototype.dither=function(t,i,r){var e={FloydSteinberg:[[7/16,1,0],[3/16,-1,1],[5/16,0,1],[1/16,1,1]],FalseFloydSteinberg:[[3/8,1,0],[3/8,0,1],[2/8,1,1]],Stucki:[[8/42,1,0],[4/42,2,0],[2/42,-2,1],[4/42,-1,1],[8/42,0,1],[4/42,1,1],[2/42,2,1],[1/42,-2,2],[2/42,-1,2],[4/42,0,2],[2/42,1,2],[1/42,2,2]],Atkinson:[[1/8,1,0],[1/8,2,0],[1/8,-1,1],[1/8,0,1],[1/8,1,1],[1/8,0,2]],Jarvis:[[7/48,1,0],[5/48,2,0],[3/48,-2,1],[5/48,-1,1],[7/48,0,1],[5/48,1,1],[3/48,2,1],[1/48,-2,2],[3/48,-1,2],[5/48,0,2],[3/48,1,2],[1/48,2,2]],Burkes:[[.25,1,0],[4/32,2,0],[2/32,-2,1],[4/32,-1,1],[.25,0,1],[4/32,1,1],[2/32,2,1]],Sierra:[[5/32,1,0],[3/32,2,0],[2/32,-2,1],[4/32,-1,1],[5/32,0,1],[4/32,1,1],[2/32,2,1],[2/32,-1,2],[3/32,0,2],[2/32,1,2]],TwoSierra:[[.25,1,0],[3/16,2,0],[1/16,-2,1],[2/16,-1,1],[3/16,0,1],[2/16,1,1],[1/16,2,1]],SierraLite:[[.5,1,0],[1/4,-1,1],[1/4,0,1]]};if(!i||!e[i])throw"Unknown dithering kernel: "+i;for(var s=e[i],n=g(t),h=n.buf32,a=n.width,o=n.height,u=(h.length,r?-1:1),c=0;c<o;c++){r&&(u*=-1);for(var l=c*a,f=1==u?0:a-1,d=1==u?a:0;f!==d;f+=u){var p=l+f,x=h[p],b=255&x,v=(65280&x)>>8,m=(16711680&x)>>16,y=this.nearestColor(x),w=255&y,S=(65280&y)>>8,C=(16711680&y)>>16;if(h[p]=255<<24|C<<16|S<<8|w,!(this.dithDelta&&this.colorDist([b,v,m],[w,S,C])<this.dithDelta))for(var O=b-w,P=v-S,D=m-C,j=1==u?0:s.length-1,k=1==u?s.length:0;j!==k;j+=u){var A=s[j][1]*u,M=s[j][2],I=M*a;if(A+f>=0&&A+f<a&&M+c>=0&&M+c<o){var U=s[j][0],F=p+(I+A),G=255&h[F],E=(65280&h[F])>>8,H=(16711680&h[F])>>16,q=Math.max(0,Math.min(255,G+O*U)),L=Math.max(0,Math.min(255,E+P*U)),z=Math.max(0,Math.min(255,H+D*U));h[F]=255<<24|z<<16|L<<8|q}}}}return h},i.prototype.buildPal=function(t){if(!(this.palLocked||this.idxrgb.length>0&&this.idxrgb.length<=this.colors)){var i=this.histogram,r=function(t,i){var r=[];for(var e in t)r.push(e);return p.call(r,(function(i,r){return t[r]-t[i]}))}(i);if(0==r.length)throw"Nothing has been sampled, palette cannot be built.";switch(this.method){case 1:for(var e=this.initColors,s=i[r[e-1]],n=r.slice(0,e),h=e,a=r.length;h<a&&i[r[h]]==s;)n.push(r[h++]);this.hueStats&&this.hueStats.inject(n);break;case 2:n=r}n=n.map((function(t){return+t})),this.reducePal(n),!t&&this.reIndex&&this.sortPal(),this.useCache&&this.cacheHistogram(n),this.palLocked=!0}},i.prototype.palette=function(t,i){return this.buildPal(i),t?this.idxrgb:new Uint8Array(new Uint32Array(this.idxi32).buffer)},i.prototype.prunePal=function(t){for(var i,r=0;r<this.idxrgb.length;r++)t[r]||(i=this.idxi32[r],this.idxrgb[r]=null,this.idxi32[r]=null,delete this.i32idx[i]);if(this.reIndex){for(var e=[],s=[],n={},h=(r=0,0);r<this.idxrgb.length;r++)this.idxrgb[r]&&(i=this.idxi32[r],e[h]=this.idxrgb[r],n[i]=h,s[h]=i,h++);this.idxrgb=e,this.idxi32=s,this.i32idx=n}},i.prototype.reducePal=function(t){if(this.idxrgb.length>this.colors){for(var i,r=t.length,e={},s=0,n=!1,h=0;h<r;h++)s!=this.colors||n||(this.prunePal(e),n=!0),i=this.nearestIndex(t[h]),s<this.colors&&!e[i]&&(e[i]=!0,s++);n||(this.prunePal(e),n=!0)}else{var a=t.map((function(t){return[255&t,(65280&t)>>8,(16711680&t)>>16]})),o=r=a.length,u=this.initDist;if(o>this.colors){for(;o>this.colors;){var c=[];for(h=0;h<r;h++){var l=a[h];if(t[h],l)for(var f=h+1;f<r;f++){var d=a[f],g=t[f];if(d){var x=this.colorDist(l,d);x<u&&(c.push([f,d,g,x]),delete a[f],o--)}}}u+=o>3*this.colors?this.initDist:this.distIncr}if(o<this.colors){p.call(c,(function(t,i){return i[3]-t[3]}));for(var b=0;o<this.colors;)a[c[b][0]]=c[b][1],o++,b++}}for(r=a.length,h=0;h<r;h++)a[h]&&(this.idxrgb.push(a[h]),this.idxi32.push(t[h]),this.i32idx[t[h]]=this.idxi32.length-1,this.i32rgb[t[h]]=a[h])}},i.prototype.colorStats1D=function(t){for(var i,r=this.histogram,e=t.length,s=0;s<e;s++)(4278190080&(i=t[s]))>>24!=0&&(this.hueStats&&this.hueStats.check(i),i in r?r[i]++:r[i]=1)},i.prototype.colorStats2D=function(t,i){var r=this.boxSize[0],e=this.boxSize[1],s=r*e,n=function(t,i,r,e){for(var s=t%r,n=i%e,h=t-s,a=i-n,o=[],u=0;u<i;u+=e)for(var c=0;c<t;c+=r)o.push({x:c,y:u,w:c==h?s:r,h:u==a?n:e});return o}(i,t.length/i,r,e),h=this.histogram,a=this;n.forEach((function(r){var e,n=Math.max(Math.round(r.w*r.h/s)*a.boxPxls,2),o={};!function(t,i,r){var e=t,s=e.y*i+e.x,n=(e.y+e.h-1)*i+(e.x+e.w-1),h=0,a=i-e.w+1,o=s;do{r.call(this,o),o+=++h%e.w==0?a:1}while(o<=n)}(r,i,(function(i){(4278190080&(e=t[i]))>>24!=0&&(a.hueStats&&a.hueStats.check(e),e in h?h[e]++:e in o?++o[e]>=n&&(h[e]=o[e]):o[e]=1)}))})),this.hueStats&&this.hueStats.inject(h)},i.prototype.sortPal=function(){var t=this;this.idxi32.sort((function(i,r){var e=t.i32idx[i],s=t.i32idx[r],n=t.idxrgb[e],h=t.idxrgb[s],a=c(n[0],n[1],n[2]),o=c(h[0],h[1],h[2]),u=n[0]==n[1]&&n[1]==n[2]?-1:l(a.h,t.hueGroups),f=(h[0]==h[1]&&h[1]==h[2]?-1:l(o.h,t.hueGroups))-u;if(f)return-f;var d=+o.l.toFixed(2)-+a.l.toFixed(2);if(d)return-d;var p=+o.s.toFixed(2)-+a.s.toFixed(2);return p?-p:void 0})),this.idxi32.forEach((function(i,r){t.idxrgb[r]=t.i32rgb[i],t.i32idx[i]=r}))},i.prototype.nearestColor=function(t){var i=this.nearestIndex(t);return null===i?0:this.idxi32[i]},i.prototype.nearestIndex=function(t){if((4278190080&t)>>24==0)return null;if(this.useCache&&""+t in this.i32idx)return this.i32idx[t];for(var i,r=1e3,e=[255&t,(65280&t)>>8,(16711680&t)>>16],s=this.idxrgb.length,n=0;n<s;n++)if(this.idxrgb[n]){var h=this.colorDist(e,this.idxrgb[n]);h<r&&(r=h,i=n)}return i},i.prototype.cacheHistogram=function(t){for(var i=0,r=t[i];i<t.length&&this.histogram[r]>=this.cacheFreq;r=t[i++])this.i32idx[r]=this.nearestIndex(r)},r.prototype.check=function(t){this.groupsFull==this.numGroups+1&&(this.check=function(){});var i=255&t,r=(65280&t)>>8,e=(16711680&t)>>16,s=i==r&&r==e?-1:l(c(i,r,e).h,this.numGroups),n=this.stats[s],h=this.minCols;n.num++,n.num>h||(n.num==h&&this.groupsFull++,n.num<=h&&this.stats[s].cols.push(t))},r.prototype.inject=function(t){for(var i=-1;i<this.numGroups;i++)if(this.stats[i].num<=this.minCols)switch(f(t)){case"Array":this.stats[i].cols.forEach((function(i){-1==t.indexOf(i)&&t.push(i)}));break;case"Object":this.stats[i].cols.forEach((function(i){t[i]?t[i]++:t[i]=1}))}};var e=.2126,s=.7152,n=.0722;function h(t,i,r){return Math.sqrt(e*t*t+s*i*i+n*r*r)}var a=Math.sqrt(65025);function o(t,i){var r=i[0]-t[0],h=i[1]-t[1],o=i[2]-t[2];return Math.sqrt(e*r*r+s*h*h+n*o*o)/a}function u(t,i){var r=Math.abs(i[0]-t[0]),h=Math.abs(i[1]-t[1]),a=Math.abs(i[2]-t[2]);return(e*r+s*h+n*a)/254.99999999999997}function c(t,i,r){var e,s,n,a,o;if(t/=255,i/=255,r/=255,(e=Math.max(t,i,r))==(s=Math.min(t,i,r)))n=a=0;else{switch(o=e-s,a=(e+s)/2>.5?o/(2-e-s):o/(e+s),e){case t:n=(i-r)/o+(i<r?6:0);break;case i:n=(r-t)/o+2;break;case r:n=(t-i)/o+4}n/=6}return{h:n,s:a,l:h(t,i,r)}}function l(t,i){var r=1/i,e=r/2;if(t>=1-e||t<=e)return 0;for(var s=1;s<i;s++){var n=s*r;if(t>=n-e&&t<=n+e)return s}}function f(t){return Object.prototype.toString.call(t).slice(8,-1)}var d,p="xyzvwtursopqmnklhijfgdeabc"==(d="abcdefghijklmnopqrstuvwxyz").split("").sort((function(t,i){return~~(d.indexOf(i)/2.3)-~~(d.indexOf(t)/2.3)})).join("")?Array.prototype.sort:function(t){var i=f(this[0]);if("Number"==i||"String"==i){for(var r,e={},s=this.length,n=0;n<s;n++)r=this[n],e[r]||0===e[r]||(e[r]=n);return this.sort((function(i,r){return t(i,r)||e[i]-e[r]}))}return e=this.map((function(t){return t})),this.sort((function(i,r){return t(i,r)||e.indexOf(i)-e.indexOf(r)}))};function g(t,i){var r,e,s,n,h,a;switch(f(t)){case"HTMLImageElement":(r=document.createElement("canvas")).width=t.naturalWidth,r.height=t.naturalHeight,(e=r.getContext("2d")).drawImage(t,0,0);case"Canvas":case"HTMLCanvasElement":r=r||t,e=e||r.getContext("2d");case"CanvasRenderingContext2D":e=e||t,r=r||e.canvas,s=e.getImageData(0,0,r.width,r.height);case"ImageData":i=(s=s||t).width,n="CanvasPixelArray"==f(s.data)?new Uint8Array(s.data):s.data;case"Array":case"CanvasPixelArray":n=n||new Uint8Array(t);case"Uint8Array":case"Uint8ClampedArray":n=n||t,h=new Uint32Array(n.buffer);case"Uint32Array":h=h||t,n=n||new Uint8Array(h.buffer),i=i||h.length,a=h.length/i}return{can:r,ctx:e,imgd:s,buf8:n,buf32:h,width:i,height:a}}this.RgbQuant=i,t.exports&&(t.exports=i)}).call(this)}},i={};function r(e){var s=i[e];if(void 0!==s)return s.exports;var n=i[e]={exports:{}};return t[e].call(n.exports,n,n.exports,r),n.exports}r.n=t=>{var i=t&&t.__esModule?()=>t.default:()=>t;return r.d(i,{a:i}),i},r.d=(t,i)=>{for(var e in i)r.o(i,e)&&!r.o(t,e)&&Object.defineProperty(t,e,{enumerable:!0,get:i[e]})},r.o=(t,i)=>Object.prototype.hasOwnProperty.call(t,i),(()=>{"use strict";var t=r(625),i=r.n(t);function e(t,i){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var e=Object.getOwnPropertySymbols(t);i&&(e=e.filter((function(i){return Object.getOwnPropertyDescriptor(t,i).enumerable}))),r.push.apply(r,e)}return r}function s(t){for(var i=1;i<arguments.length;i++){var r=null!=arguments[i]?arguments[i]:{};i%2?e(Object(r),!0).forEach((function(i){n(t,i,r[i])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):e(Object(r)).forEach((function(i){Object.defineProperty(t,i,Object.getOwnPropertyDescriptor(r,i))}))}return t}function n(t,i,r){return i in t?Object.defineProperty(t,i,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[i]=r,t}let h={colors:256,method:2,boxSize:[64,64],boxPxls:2,initColors:4096,minHueCols:0,dithKern:null,dithDelta:0,dithSerp:!0,palette:[],reIndex:!1,useCache:!0,cacheFreq:10,colorDist:"manhattan"};function a(t,r,e,n){const a=r<64||e<64?1:2,o=new(i())(s(s({},h),{},{method:a}));o.sample(t,r);const u=o.palette(),c=o.reduce(t,2,n);return{data:new Uint8Array(c),palette:u}}let o=[],u={dithKern:null};self.onmessage=t=>{self.onmessage=({data:t})=>function(t){for(t&&o.push(t);t=o.pop();){const i=new Uint8Array(t.buffer),{palette:r,data:e}=a(i,t.width,t.height,u.dithKern),s=t.width*t.height,n=r.length,h=new ArrayBuffer(n+s),o=new Uint8Array(h);o.set(r),o.set(e,n),self.postMessage({paletteLength:n,buffer:h},{transfer:[h]})}}(t),u={...u,...t.data}}})()})();',
          "Worker",
          void 0,
          r.p + "quantizer.worker/bundle.worker.js"
        );
      }
      function we(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e);
          t &&
            (n = n.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            r.push.apply(r, n);
        }
        return r;
      }
      function ye(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? we(Object(r), !0).forEach(function (t) {
                xe(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : we(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function xe(e, t, r) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = r),
          e
        );
      }
      class _e {
        constructor(e) {
          xe(this, "listeners", new Map()),
            xe(this, "previousBuffer", void 0),
            xe(this, "frames", []),
            xe(this, "quantizers", []),
            xe(this, "framesSentToQuantize", 0),
            xe(this, "framesQuantized", 0),
            xe(this, "framesSentToEncode", 0),
            xe(this, "totalFrames", void 0),
            xe(this, "busyQuantizers", 0),
            xe(this, "encoder", new ve()),
            xe(this, "abort", () => {
              this.dispose();
            }),
            xe(this, "dispose", () => {
              if (this.quantizers) {
                this.encoder.terminate(), this.disposeWriter();
                for (const { worker: e, dispose: t } of this.quantizers)
                  e.terminate(), t();
                (this.quantizers = void 0), (this.frames = void 0);
              }
            }),
            (this.opts = e),
            this.encoder.postMessage(e);
          const t = (e) => this._onWriterMessage(e);
          this.encoder.addEventListener("message", t),
            (this.disposeWriter = () =>
              this.encoder.removeEventListener("message", t));
          const r = navigator.hardwareConcurrency
            ? Math.floor(0.8 * navigator.hardwareConcurrency)
            : 4;
          for (let e = 0; e < r; e++) {
            const t = new be();
            t.postMessage(this.opts);
            const r = (t) => this._onQuantizerMessage(e, t);
            t.addEventListener("message", r);
            const n = () => t.removeEventListener("message", r);
            this.quantizers.push({
              worker: t,
              busy: !1,
              frameIndex: void 0,
              dispose: n,
            });
          }
        }
        addFrame(e, t) {
          if (!this.quantizers || void 0 !== this.totalFrames) return;
          let r = e.data.buffer;
          if (this.previousBuffer) {
            const e = (function (e, t, r) {
              const n = new Uint32Array(e),
                i = new Uint32Array(t);
              let o,
                s,
                a = r + 1,
                c = -1;
              for (let e = 0; e < n.length; e++)
                if (n[e] !== i[e]) {
                  const t = Math.floor(e / r),
                    n = e % r;
                  void 0 === o && (o = t),
                    (s = t),
                    (a = Math.min(a, n)),
                    (c = Math.max(c, n));
                }
              if (void 0 !== o)
                return { top: o, left: a, width: c - a + 1, height: s - o + 1 };
            })(r, this.previousBuffer, this.opts.width);
            if (e) {
              const n = (function (e, t, r) {
                const n = new ArrayBuffer(4 * t.width * t.height),
                  i = new Uint32Array(n),
                  o = new Uint32Array(e);
                for (let e = 0; e < t.height; e++)
                  for (let n = 0; n < t.width; n++)
                    i[n + e * t.width] = o[t.left + n + (t.top + e) * r];
                return n;
              })(r, e, this.opts.width);
              this.frames.push(
                ye(
                  ye({}, e),
                  {},
                  { delay: t, buffer: n, paletteLength: void 0, quantized: !1 }
                )
              );
            } else this.frames[this.frames.length - 1].delay += t;
          } else
            this.frames.push({
              delay: t,
              buffer: r,
              top: 0,
              left: 0,
              width: this.opts.width,
              height: this.opts.height,
              paletteLength: void 0,
              quantized: !1,
            });
          (this.previousBuffer = r), this._work();
        }
        _work() {
          if (this.quantizers)
            for (
              ;
              this.framesSentToQuantize <
                (void 0 === this.totalFrames
                  ? this.frames.length - 1
                  : this.totalFrames) &&
              this.busyQuantizers < this.quantizers.length;

            ) {
              const e = this.framesSentToQuantize++,
                t = this.frames[e],
                r = this.quantizers[this.quantizers.findIndex((e) => !e.busy)];
              (r.busy = !0),
                (r.frameIndex = e),
                r.worker.postMessage(t, { transfer: [t.buffer] }),
                this.busyQuantizers++;
            }
        }
        _onQuantizerMessage(e, t) {
          if (!this.quantizers) return;
          const r = this.quantizers[e];
          (r.busy = !1), this.busyQuantizers--, this.framesQuantized++;
          const n = this.frames[r.frameIndex];
          for (
            n.buffer = t.data.buffer,
              n.paletteLength = t.data.paletteLength,
              n.quantized = !0;
            (void 0 === this.totalFrames ||
              this.framesSentToEncode < this.totalFrames) &&
            this.frames[this.framesSentToEncode].quantized;

          ) {
            const e = this.framesSentToEncode++,
              t = this.frames[e];
            this.encoder.postMessage(t, { transfer: [t.buffer] }),
              (this.frames[e] = void 0);
          }
          this.framesSentToEncode === this.totalFrames &&
            this.encoder.postMessage("finish", { transfer: [] }),
            void 0 !== this.totalFrames &&
              this._emit("progress", this.framesQuantized / this.totalFrames),
            this._work();
        }
        _onWriterMessage(e) {
          const t = new Blob([e.data], { type: "image/gif" });
          this._emit("finished", t), this.dispose();
        }
        render() {
          this.quantizers &&
            ((this.totalFrames = this.frames.length), this._work());
        }
        on(e, t) {
          let r = this.listeners.get(e);
          return (
            r || ((r = []), this.listeners.set(e, r)),
            r.push(t),
            () => r.splice(r.indexOf(t), 1)
          );
        }
        once(e, t) {
          const r = this.on(e, (e) => {
            t(e), r();
          });
        }
        _emit(e, t) {
          const r = this.listeners.get(e) || [];
          for (const e of r) e(t);
        }
      }
      function je(e, t, r) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = r),
          e
        );
      }
      function Oe(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e);
          t &&
            (n = n.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            r.push.apply(r, n);
        }
        return r;
      }
      function Se(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? Oe(Object(r), !0).forEach(function (t) {
                Ae(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : Oe(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function Ae(e, t, r) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = r),
          e
        );
      }
      const { chrome: ke } = window,
        Ee = "PROCESSING_NOTIFICATION",
        Ce = "RECORDING_STARTED_NOTIFICATION",
        Pe = { iconUrl: "./images/ic_48.png" },
        Me = Se(
          Se({}, Pe),
          {},
          {
            type: "progress",
            title: "Processing...",
            message: "",
            contextMessage: "Hold tight",
          }
        ),
        Ie = Se(
          Se({}, Pe),
          {},
          {
            requireInteraction: !0,
            type: "basic",
            title: "Please try on another url.",
            message:
              "Google does not allow extensions to run in the web store and new tab pages.",
            contextMessage: "(╯°□°）╯︵ ┻━┻",
          }
        ),
        Re = Se(
          Se({}, Pe),
          {},
          {
            type: "basic",
            title: "Recording started",
            message: "",
            contextMessage: "",
            silent: !0,
          }
        ),
        Le = { [Ee]: Me, USAGE_BLOCKED_NOTIFICATION: Ie, [Ce]: Re };
      async function De(e) {
        (await X("notifications")) &&
          (ke.notifications.create(e, Le[e]), setTimeout(() => Fe(e), 2e3));
      }
      function Fe(e) {
        ke.notifications.clear(e);
      }
      function Te(e, t, r) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = r),
          e
        );
      }
      const { chrome: Ue } = window;
      new L();
      const We = "dist/fullscreenOverlay/bundle.js";
      function ze(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e);
          t &&
            (n = n.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            r.push.apply(r, n);
        }
        return r;
      }
      function $e(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? ze(Object(r), !0).forEach(function (t) {
                qe(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : ze(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function qe(e, t, r) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = r),
          e
        );
      }
      function Ne(e) {
        return new (class {
          constructor(e) {
            Te(this, "frames", []),
              Te(this, "fullscreen", !1),
              Te(this, "isDesktopRecording", !1),
              Te(
                this,
                "badgeTimer",
                new (class {
                  constructor() {
                    je(this, "currentDurationSeconds", 0),
                      je(this, "startTime", null),
                      je(this, "timerIntervalId", null),
                      je(this, "getRecordedDurationInSeconds", () => {
                        let e = 0;
                        return (
                          this.startTime &&
                            (e +=
                              (new Date().getTime() - this.startTime) / 1e3),
                          this.currentDurationSeconds &&
                            (e += this.currentDurationSeconds),
                          e
                        );
                      }),
                      je(this, "stopTimer", () => {
                        ce(""),
                          this.timerIntervalId &&
                            (clearTimeout(this.timerIntervalId),
                            (this.timerIntervalId = null));
                      });
                  }
                  startTimer() {
                    this.stopTimer(),
                      (this.startTime = new Date().getTime()),
                      (this.timerIntervalId = setInterval(() => {
                        ce(
                          (function (e = 0) {
                            let t = Math.floor(e / 3600),
                              r = Math.floor((e - 3600 * t) / 60);
                            return t > 0
                              ? t + "h"
                              : r >= 10
                              ? r + "m"
                              : new Date(1e3 * e).toISOString().substr(15, 4);
                          })(this.getRecordedDurationInSeconds())
                        );
                      }, 1e3));
                  }
                })()
              ),
              Te(this, "videoElement", document.createElement("video")),
              Te(this, "recordingComplete", () => {
                (this.frames = null), delete this.frames;
              }),
              Te(this, "endStream", () => {
                this.stream &&
                  (this.stream.getTracks().forEach((e) => {
                    e.stop();
                  }),
                  (this.stream = null));
              }),
              (this.settings = e);
          }
          onPosition(e) {
            if (this.videoWidth) {
              const t = this.fullscreen
                ? (function (e, t, r) {
                    const n = document.createElement("canvas"),
                      i = e.videoWidth,
                      o = e.videoHeight,
                      s = i / t,
                      a = o / r,
                      c = Math.min(s, a);
                    (t = Math.round(t * c) - 1), (r = Math.round(r * c) - 1);
                    const u = Math.round((i - t) / 2),
                      h = Math.round((o - r) / 2),
                      { restrictedWidth: l, restrictedHeight: f } = B(
                        t || e.videoWidth,
                        r || e.videoHeight
                      );
                    return (
                      (n.width = l),
                      (n.height = f),
                      n.getContext("2d").drawImage(e, u, h, t, r, 0, 0, l, f),
                      n
                    );
                  })(
                    this.videoElement,
                    this.isDesktopRecording ? this.videoWidth : e.width,
                    this.isDesktopRecording ? this.videoHeight : e.height
                  )
                : (function (e, t, r, n) {
                    const i = document.createElement("canvas"),
                      o = e.videoWidth,
                      s = e.videoHeight,
                      a = o / r,
                      c = s / n,
                      u = Math.min(a, c);
                    (r = Math.round(r * u)), (n = Math.round(n * u));
                    const h = Math.floor((o - r) / 2),
                      l = Math.floor((s - n) / 2);
                    (t.x2 = Math.floor(t.x2 * u + h)),
                      (t.x = Math.ceil(t.x * u + h)),
                      (t.y = Math.ceil(t.y * u + l)),
                      (t.y2 = Math.floor(t.y2 * u + l));
                    const f = Math.floor(t.x2 - t.x) - 1,
                      d = Math.floor(t.y2 - t.y) - 1,
                      { restrictedWidth: p, restrictedHeight: g } = B(f, d);
                    return (
                      (i.width = p),
                      (i.height = g),
                      i
                        .getContext("2d")
                        .drawImage(e, t.x, t.y, f, d, 0, 0, p, g),
                      i
                    );
                  })(this.videoElement, e.position, e.width, e.height);
              this.frames.push(
                ((e, t = 0, r) => ({
                  index: t,
                  duration: 1e3 / Number(this.settings.frames),
                  id: W()(),
                  data: e.toDataURL("image/jpeg"),
                  width: e.width,
                  height: e.height,
                }))(t, this.frames.length)
              );
            }
          }
          async onStartRecording(e) {
            (this.fullscreen = e.fullscreen || !1),
              (this.isDesktopRecording = e.isDesktopRecording || !1);
            try {
              this.stream = await He(
                e.isDesktopRecording,
                !1,
                !1,
                e.width,
                e.height
              );
            } catch (e) {
              return;
            }
            try {
              this.videoElement.srcObject = this.stream;
            } catch (e) {
              this.videoElement.src = window.URL.createObjectURL(this.stream);
            }
            return (
              this.badgeTimer.startTimer(),
              this.videoElement.addEventListener("canplay", function () {
                this.play();
              }),
              this.videoElement.addEventListener("loadedmetadata", () => {
                (this.videoWidth = this.videoElement.videoWidth),
                  (this.videoHeight = this.videoElement.videoHeight);
              }),
              this.stream
            );
          }
          async onEndRecording(e = {}) {
            try {
              this.endStream(),
                URL.revokeObjectURL(this.videoElement.src),
                (this.videoElement.src = ""),
                (this.videoElement.srcObject = null),
                (this.videoElement = void 0),
                this.badgeTimer.stopTimer();
              const t = await J(
                this.settings.downloadFilename,
                this.isDesktopRecording
              );
              if (this.settings.fileAccess == d) {
                const r = window.open("layout/editor.html");
                (r.recordedFrames = this.frames),
                  (r.filename = t),
                  (r.maxTimeReached = !0 === e.maxTimeReached);
              } else
                this.settings.saveAs === O.WEBM
                  ? (this.settings.enableNotifications && De(Ee),
                    (async function (
                      e,
                      t,
                      r,
                      n,
                      i,
                      o,
                      s = "chrome-capture",
                      a = Z
                    ) {
                      try {
                        const c = new window.Whammy.Video(void 0, 0.9);
                        for (const s of e) {
                          const e = await te(s, t, r, i, o);
                          c.add(e, s.duration || 1e3 / n);
                        }
                        a(URL.createObjectURL(c.compile()), s, ".webm");
                      } catch (e) {
                        console.error(`Error: ${e}.`);
                      }
                    })(
                      this.frames,
                      void 0,
                      void 0,
                      Number(this.settings.frames),
                      this.frames[0].width,
                      this.frames[0].height,
                      t
                    ),
                    this.recordingComplete())
                  : this.settings.saveAs === O.GIF &&
                    (this.settings.enableNotifications && De(Ee),
                    new (class {
                      constructor(e) {
                        var t;
                        pe(this, "update", (e) => {
                          this.port && this.port.postMessage({ progress: e });
                        }),
                          pe(this, "complete", () => {
                            this.port &&
                              (this.port.postMessage({ complete: !0 }),
                              this.port.disconnect());
                          }),
                          (t = (t) => {
                            t.onDisconnect.addListener(() => {
                              this.port = null;
                            }),
                              (this.port = t),
                              e && e(this);
                          }),
                          fe.tabs.query(
                            { active: !0, currentWindow: !0 },
                            (e) => {
                              const r = fe.tabs.connect(e[0].id, {
                                name: "progress",
                              });
                              t(r);
                            }
                          );
                      }
                    })(async (e) => {
                      (async function ({
                        frames: e,
                        fabricCanvas: t,
                        imageCropPosition: r,
                        framesPerSecond: n,
                        progressUpdater: i,
                        width: o,
                        height: s,
                        filename: a = "chrome-capture",
                        dither: c = "FloydSteinberg",
                        playbackSpeed: u,
                        quality: h,
                      }) {
                        const { result: l } = (function ({
                            frames: e,
                            fabricCanvas: t,
                            imageCropPosition: r,
                            playbackSpeed: n,
                            progressUpdater: i,
                            width: o,
                            height: s,
                            framesPerSecond: a = 1,
                            dither: c = "FloydSteinberg",
                          }) {
                            let u = new _e({
                              width: o,
                              height: s,
                              wasmFileLocation: window.chrome.runtime.getURL(
                                "libs/gif/encoder.wasm"
                              ),
                              dithKern: "none" === c ? null : c,
                            });
                            return {
                              result: new Promise(async (c, h) => {
                                try {
                                  for (let c = 0; c < e.length; c++) {
                                    const h = await te(e[c], t, r, o, s),
                                      l = h.getContext("2d"),
                                      f = re(a, n, e[c].duration);
                                    console.log(a, n, e[c].duration, f),
                                      u.addFrame(
                                        l.getImageData(0, 0, h.width, h.height),
                                        f
                                      ),
                                      i && i.update((c / e.length) * 0.1);
                                  }
                                  u.on("finished", function (e) {
                                    i && i.complete(), (u = null), c(e);
                                  }),
                                    i &&
                                      u.on("progress", (e) =>
                                        i.update(0.9 * e + 0.1)
                                      ),
                                    u.render();
                                } catch (e) {
                                  console.error(`Error: ${e}.`),
                                    alert(
                                      `An Error has occured while processing the GIF, if this reoccurs please send this to the support section of the extension web store: ${e}.`
                                    ),
                                    h();
                                }
                              }),
                              abort: u.abort,
                            };
                          })({
                            frames: e,
                            fabricCanvas: t,
                            imageCropPosition: r,
                            playbackSpeed: u,
                            framesPerSecond: n,
                            progressUpdater: i,
                            width: o,
                            height: s,
                            dither: c,
                            quality: h,
                          }),
                          f = await l;
                        Z(URL.createObjectURL(f), a, ".gif");
                      })({
                        frames: this.frames,
                        framesPerSecond: Number(this.settings.frames),
                        progressUpdater: e,
                        width: this.frames[0].width,
                        height: this.frames[0].height,
                        filename: t,
                      }),
                        this.recordingComplete();
                    }));
              I(u, this.settings.recordingsTaken + 1);
            } catch (e) {
              console.log("failed to save recording: " + e);
            }
          }
        })(e);
      }
      async function He(e = !1, t = !1, r = !1, n, i) {
        return new Promise(async (o, s) => {
          e
            ? window.chrome.desktopCapture.chooseDesktopMedia(
                ["screen", "window", "audio"],
                async (e) => {
                  e || s();
                  const t = {
                    audio: {
                      mandatory: {
                        chromeMediaSource: "desktop",
                        chromeMediaSourceId: e,
                      },
                    },
                    video: {
                      mandatory: $e(
                        $e(
                          {
                            chromeMediaSource: "desktop",
                            chromeMediaSourceId: e,
                          },
                          n && i && { maxWidth: n, maxHeight: i }
                        ),
                        r && { maxWidth: 4096, maxHeight: 2160 }
                      ),
                    },
                  };
                  try {
                    const e = await navigator.mediaDevices.getUserMedia(t);
                    o(e);
                  } catch (e) {
                    s(e);
                  }
                }
              )
            : window.chrome.tabCapture.capture(
                {
                  video: !0,
                  audio: t,
                  videoConstraints: {
                    mandatory: $e(
                      $e(
                        { maxFrameRate: 30, chromeMediaSource: "tab" },
                        n && i && { maxWidth: n, maxHeight: i }
                      ),
                      r && { maxWidth: 4096, maxHeight: 2160 }
                    ),
                  },
                },
                (e) => {
                  if (!e)
                    return (
                      console.error(
                        `Error starting tab capture: ${window.chrome.runtime.lastError.message}`
                      ),
                      alert(
                        `Recording failed - you may have disabled a Chrome setting allowing this extension to work or another extension may be conflicting, if you still have issues please send to the support section as much info as possible and the following error: ${window.chrome.runtime.lastError.message}`
                      ),
                      void s(window.chrome.runtime.lastError.message)
                    );
                  if (t) {
                    const t = document.createElement("audio");
                    (t.srcObject = e),
                      t.play(),
                      e.getTracks()[0].addEventListener("ended", () => {
                        t.pause();
                      });
                  }
                  o(e);
                }
              );
        });
      }
      const { chrome: Be } = window,
        Ge = new L(),
        Qe = new L();
      function Ve(e, t, r) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = r),
          e
        );
      }
      let Ke, Ye, Je, Xe;
      function Ze(e, t, r, n = !1) {
        return (
          Ke
            ? Ke.stopRecording()
            : ((Ke = new et(t, r, n)), Ke.startRecording(e)),
          !!Ke
        );
      }
      class et {
        constructor(e, t, r) {
          Ve(this, "timer", void 0),
            Ve(this, "recorder", void 0),
            Ve(this, "stopTimer", void 0),
            Ve(this, "width", void 0),
            Ve(this, "height", void 0),
            Ve(this, "startRecording", async (e) => {
              de(We, void 0, !1);
              const { frames: t, maxLength: r } = e;
              this.recorder = Ne(e);
              const n = await this.recorder.onStartRecording({
                fullscreen: !0,
                width: this.width,
                height: this.height,
                isDesktopRecording: this.isDesktopRecording,
              });
              var i;
              n
                ? ("no-limit" !== r &&
                    (this.stopTimer = setTimeout(
                      () => this.stopRecording(!0),
                      1e3 * r
                    )),
                  null === (i = n.getVideoTracks()[0]) ||
                    void 0 === i ||
                    i.addEventListener("ended", this.stopRecording),
                  !this.isDesktopRecording && e.enableNotifications && De(Ce),
                  (this.timer = setInterval(this.takeFrame, 1e3 / t)),
                  this.recorder.onPosition({
                    fullscreen: !0,
                    width: this.width,
                    height: this.height,
                  }))
                : ((this.recorder = void 0), this.stopRecording());
            }),
            Ve(this, "takeFrame", () => {
              this.recorder.onPosition({
                fullscreen: !0,
                width: this.width,
                height: this.height,
              });
            }),
            Ve(this, "stopRecording", (e = !1) => {
              de(We, void 0, !1),
                this.timer && clearInterval(this.timer),
                this.stopTimer && clearTimeout(this.stopTimer),
                this.recorder &&
                  this.recorder.onEndRecording({ maxTimeReached: e }),
                (this.recorder = void 0),
                (this.timer = void 0),
                (this.stopTimer = void 0),
                (Ke = void 0),
                Fe(Ce);
            }),
            (this.width = e),
            (this.height = t),
            (this.isDesktopRecording = r);
        }
      }
      function tt(e, t, r) {
        e === m
          ? le({ fullscreen: !0 })
          : e === v
          ? de("dist/fullWebpage/bundle.js")
          : e === g
          ? Ze(t, null == r ? void 0 : r.width, null == r ? void 0 : r.height)
          : e === b
          ? de("dist/croppingtool/bundle.js")
          : e === w
          ? Ze(t, window.screen.width, window.screen.height, !0)
          : "desktop_screenshot" === e &&
            (async function () {
              if (MediaStreamTrackProcessor)
                try {
                  const { settings: e } = Qe,
                    t = await He(!0, !1, !0);
                  ae(oe), I(c, e.screenshotsTaken + 1);
                  const r = t.getVideoTracks()[0],
                    n = new MediaStreamTrackProcessor({
                      track: r,
                    }).readable.getReader(),
                    i = (await n.read()).value,
                    o = document.createElement("canvas");
                  (o.width = i.displayWidth),
                    (o.height = i.displayHeight),
                    o.getContext("2d").drawImage(i, 0, 0);
                  const s = o.toDataURL(`image/${e.saveAsScreenshot}`);
                  Z(
                    s,
                    await J(e.downloadFilename),
                    `.${e.saveAsScreenshot}`,
                    o,
                    await N(s)
                  ),
                    ae(ie),
                    i.close(),
                    t.getTracks().forEach((e) => {
                      e.stop();
                    });
                } catch (e) {
                  ae(ie);
                }
              else
                alert(
                  "It appears you are using an old browser version. Please update your browser to use this feature."
                );
            })();
      }
      const { chrome: rt } = window,
        nt = new L(null, (e) => {
          ae(ie, e.colorScheme);
        });
      rt.runtime.setUninstallURL(
        "https://docs.google.com/forms/d/e/1FAIpQLSdY350e6cRsVPRIzvqtrSqi6NOzrv__ZVzN_gu-FDlik09imQ/viewform?usp=sf_link"
      ),
        (function (e) {
          window.chrome.commands.onCommand.addListener((t) => {
            return (
              (r = { command: t }),
              (n = (r, n) => {
                !(function (e, t, r, n) {
                  null != r ||
                    (e !== m && e !== v && e !== b && e !== g) ||
                    (Ke
                      ? Ze(t, n.width, n.height)
                      : t.skipFullscreenInfoModal
                      ? tt(e, t, n)
                      : (function (e) {
                          function t(r) {
                            r.confirmationDialogClose &&
                              window.chrome.runtime.onMessage.removeListener(t),
                              r.continueWithAction && setTimeout(e, 500);
                          }
                          window.chrome.runtime.onMessage.addListener(t),
                            de(
                              "dist/fullscreenInfoModal/bundle.js",
                              void 0,
                              !1,
                              function () {
                                window.chrome.runtime.onMessage.removeListener(
                                  t
                                ),
                                  e();
                              }
                            );
                        })(() => tt(e, t, n)));
                })(t, e.settings, r, n);
              }),
              void fe.tabs.query({ active: !0, currentWindow: !0 }, (e) => {
                fe.tabs.sendMessage(e[0].id, r, (t) => n(t, e[0]));
              })
            );
            var r, n;
          });
        })(nt),
        (function (e) {
          window.chrome.contextMenus.onClicked.addListener(function (t, r) {
            tt(t.menuItemId, e.settings, r);
          }),
            window.chrome.contextMenus.create({
              id: b,
              title: "Open/close cropping tool",
              contexts: ["all"],
            }),
            window.chrome.contextMenus.create({
              id: m,
              title: "Visible area screenshot",
              contexts: ["all"],
            }),
            window.chrome.contextMenus.create({
              id: v,
              title: "Full webpage screenshot (beta)",
              contexts: ["all"],
            }),
            window.chrome.contextMenus.create({
              id: g,
              title: "Start/stop full tab recording",
              contexts: ["all"],
            }),
            window.chrome.contextMenus.create({
              id: w,
              title: "Start/stop desktop recording",
              contexts: ["all"],
            });
        })(nt),
        (function () {
          const e = window._gaq || [];
          e.push(["_setAccount", "UA-128587906-1"]),
            e.push(["_gat._anonymizeIp"]),
            window.chrome.runtime.onMessage.addListener(T),
            window.chrome.runtime.onConnect.addListener(T);
        })(),
        rt.runtime.onMessage.addListener(function (e, t, r) {
          null != e.captureImage && le(e),
            !0 === e.openOptions && rt.runtime.openOptionsPage(),
            !0 === e.openShortcuts &&
              rt.tabs.create({ url: "chrome://extensions/shortcuts" }),
            !0 === e.skipFullscreenInfoModal && I(h, !0),
            null != e.colorScheme &&
              e.colorScheme !== nt.settings.colorScheme &&
              (I(l, e.colorScheme), ae(ie, e.colorScheme)),
            e.command && tt(e.command, nt.settings, t.tab || e.tab);
        }),
        rt.runtime.onConnect.addListener(function (e) {
          if (((Xe = e), "recording" === e.name)) {
            Ye = Ne(nt.settings);
            const t = (t) => {
              Ye || e.disconnect(),
                t.position
                  ? Ye.onPosition(t)
                  : t.startRecording
                  ? Ye.onStartRecording(t)
                  : t.endRecording &&
                    (e.disconnect(),
                    Ye.onEndRecording(t),
                    (Ye = void 0),
                    (Xe = void 0));
            };
            e.onMessage.addListener(t);
          } else if ("full_webpage_screenshot" === e.name) {
            Je = new (class {
              constructor() {
                var e, t;
                (t = []),
                  (e = "images") in this
                    ? Object.defineProperty(this, e, {
                        value: t,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                      })
                    : (this[e] = t),
                  ae(oe);
              }
              async takeScreenshot(e, t) {
                await new Promise((e) => setTimeout(e, 500)),
                  Be.tabs.captureVisibleTab(
                    null,
                    { quality: 100 },
                    async (e) => {
                      const r = await N(e);
                      this.images.push(r), t();
                    }
                  );
              }
              async endCapture(e) {
                const { settings: t } = Ge;
                if ((ae(ie), I(c, t.screenshotsTaken + 1), e)) {
                  const { remainingCapture: t, devicePixelRatio: r = 1 } = e,
                    n = this.images[this.images.length - 1],
                    i = $(n, {
                      x: 0,
                      y: n.height - t * r,
                      x2: n.width,
                      y2: n.height,
                    });
                  this.images[this.images.length - 1] = await N(i.toDataURL());
                }
                const r = (function (e) {
                  const t = document.createElement("canvas");
                  return (
                    (t.width = e[0].width),
                    (t.height = e.reduce((e, t) => e + t.height, 0)),
                    e.forEach((r, n) => {
                      t.getContext("2d").drawImage(r, 0, e[0].height * n);
                    }),
                    t
                  );
                })(this.images).toDataURL(`image/${t.saveAsScreenshot}`);
                Z(
                  r,
                  await J(t.downloadFilename),
                  `.${t.saveAsScreenshot}`,
                  await H(r)
                ),
                  (this.images = null);
              }
            })();
            const t = (t) => {
              Je || e.disconnect(),
                t.takeScreenshot
                  ? Je.takeScreenshot(t, () => {
                      e.postMessage({ captureNext: !0 });
                    })
                  : t.endCapture &&
                    (Je.endCapture(t),
                    e.disconnect(),
                    (Je = void 0),
                    (Xe = void 0));
            };
            e.onMessage.addListener(t);
          }
        }),
        (window.stopAllCaptures = function () {
          let e = !1;
          return (
            void 0 !== Ke && (Ze(), (e = !0)),
            Ye && (Ye.onEndRecording(), (Ye = void 0), (e = !0)),
            Je && (Je.endCapture(), (Je = void 0), (e = !0)),
            e && Xe && (Xe.disconnect(), (Xe = void 0)),
            e
          );
        });
    })();
})();
