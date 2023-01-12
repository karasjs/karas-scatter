(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('karas')) :
  typeof define === 'function' && define.amd ? define(['karas'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Scatter = factory(global.karas));
})(this, (function (karas) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var karas__default = /*#__PURE__*/_interopDefaultLegacy(karas);

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    Object.defineProperty(subClass, "prototype", {
      writable: false
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }
  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
    return _setPrototypeOf(o, p);
  }
  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }
    return object;
  }
  function _get() {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get.bind();
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);
        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);
        if (desc.get) {
          return desc.get.call(arguments.length < 3 ? target : receiver);
        }
        return desc.value;
      };
    }
    return _get.apply(this, arguments);
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  var _karas$enums$STYLE_KE = karas__default["default"].enums.STYLE_KEY,
    DISPLAY = _karas$enums$STYLE_KE.DISPLAY,
    VISIBILITY = _karas$enums$STYLE_KE.VISIBILITY;
    _karas$enums$STYLE_KE.TRANSLATE_X;
    _karas$enums$STYLE_KE.TRANSLATE_Y;
    var OPACITY = _karas$enums$STYLE_KE.OPACITY;
    _karas$enums$STYLE_KE.SCALE_X;
    _karas$enums$STYLE_KE.SCALE_Y;
    _karas$enums$STYLE_KE.ROTATE_Z;
    var _karas$refresh = karas__default["default"].refresh,
    CACHE = _karas$refresh.level.CACHE,
    drawTextureCache = _karas$refresh.webgl.drawTextureCache,
    _karas$util = karas__default["default"].util,
    isNil = _karas$util.isNil,
    isFunction = _karas$util.isFunction,
    _karas$math = karas__default["default"].math;
    _karas$math.geom.d2r;
    var _karas$math$matrix = _karas$math.matrix,
    identity = _karas$math$matrix.identity,
    isE = _karas$math$matrix.isE,
    multiply = _karas$math$matrix.multiply,
    multiplyTfo = _karas$math$matrix.multiplyTfo,
    tfoMultiply = _karas$math$matrix.tfoMultiply,
    multiplyTranslateX = _karas$math$matrix.multiplyTranslateX,
    multiplyTranslateY = _karas$math$matrix.multiplyTranslateY;
    _karas$math$matrix.multiplyRotateZ;
    var multiplyScaleX = _karas$math$matrix.multiplyScaleX,
    multiplyScaleY = _karas$math$matrix.multiplyScaleY,
    _karas$mode = karas__default["default"].mode,
    CANVAS = _karas$mode.CANVAS,
    WEBGL = _karas$mode.WEBGL;
    karas__default["default"].style.css;
    var animate = karas__default["default"].animate,
    Img = karas__default["default"].Img,
    inject = karas__default["default"].inject;
  var uuid = 0;
  var $ = /*#__PURE__*/function (_karas$Geom) {
    _inherits($, _karas$Geom);
    function $() {
      return _karas$Geom.apply(this, arguments) || this;
    }
    _createClass($, [{
      key: "render",
      value: function render(renderMode, ctx, dx, dy) {
        var res = _get(_getPrototypeOf($.prototype), "render", this).call(this, renderMode, ctx, dx, dy);
        var dataList = this.dataList;
        if (!dataList || !dataList.length) {
          return res;
        }
        var root = this.__root;
        if (renderMode !== root.__renderMode) {
          return res;
        }
        var x1 = this.__x1,
          y1 = this.__y1,
          __computedStyle = this.__computedStyle;
        var op = __computedStyle[OPACITY];
        if (__computedStyle[DISPLAY] === 'none' || __computedStyle[VISIBILITY] === 'hidden' || op <= 0) {
          return res;
        }
        var globalAlpha;
        if (renderMode === CANVAS) {
          globalAlpha = ctx.globalAlpha;
        }
        var env = this.env;
        var me = this.domParent.matrixEvent;
        var cacheList = [],
          lastPage,
          cx = env.width * 0.5,
          cy = env.height * 0.5;
        dataList.forEach(function (item, i) {
          if (item.source && item.percent !== undefined) {
            var opacity = op * item.opacity;
            if (opacity <= 0) {
              return;
            }
            var t = item.percent;
            var x = Math.pow(1 - t, 2) * item.x + 2 * t * (1 - t) * item.cx1 + Math.pow(t, 2) * item.tx;
            var y = Math.pow(1 - t, 2) * item.y + 2 * t * (1 - t) * item.cy1 + Math.pow(t, 2) * item.ty;
            var m = identity();
            var img = inject.IMG[item.url];
            var tfo = [x1 + dx + img.width * 0.5, y1 + dy + img.height * 0.5];
            // 移动一半使得图形中心为计算位置的原点，还有平移位置
            m = multiplyTranslateX(m, x - img.width * 0.5);
            m = multiplyTranslateY(m, y - img.height * 0.5);
            if (img.width !== item.width) {
              m = multiplyScaleX(m, item.width / img.width);
            }
            if (img.height !== item.height) {
              m = multiplyScaleY(m, item.height / img.height);
            }
            if (renderMode === CANVAS) {
              m = tfoMultiply(tfo[0], tfo[1], m);
              m = multiplyTfo(m, -tfo[0], -tfo[1]);
              if (!isE(me)) {
                m = multiply(me, m);
              }
              ctx.globalAlpha = opacity;
              // canvas处理方式不一样，render的dx和dy包含了total的偏移计算考虑，可以无感知
              ctx.setTransform(m[0], m[1], m[4], m[5], m[12], m[13]);
              ctx.drawImage(item.source, x1 + dx, y1 + dy);
            } else if (renderMode === WEBGL) {
              var cache = item.cache;
              if (!cache) {
                item.cache = true;
                Img.toWebglCache(ctx, root, item.url, x1 + dx, y1 + dy, function (res) {
                  cache = item.cache = res;
                  if (cache.count === 1) {
                    var _cache = cache,
                      _ctx = _cache.ctx,
                      width = _cache.width,
                      height = _cache.height,
                      _x = _cache.x,
                      _y = _cache.y;
                    _ctx.drawImage(item.source, _x, _y, width, height);
                    cache.update();
                  }
                });
              }
              if (cache && cache !== true) {
                m = tfoMultiply(tfo[0], tfo[1], m);
                m = multiplyTfo(m, -tfo[0], -tfo[1]);
                if (!isE(me)) {
                  m = multiply(me, m);
                }
                if (!cache.__available && cache.__enabled) {
                  cache.__available = true;
                }
                if (cache.__available) {
                  if (lastPage && lastPage !== cache.__page) {
                    drawTextureCache(ctx, cacheList.splice(0), cx, cy, dx, dy);
                  }
                  lastPage = cache.__page;
                  cacheList.push({
                    cache: cache,
                    opacity: opacity,
                    matrix: m
                  });
                }
              }
            }
          }
        });
        if (renderMode === CANVAS) {
          ctx.globalAlpha = globalAlpha;
        } else if (renderMode === WEBGL) {
          drawTextureCache(ctx, cacheList, cx, cy, dx, dy);
        }
      }
    }]);
    return $;
  }(karas__default["default"].Geom);
  var Scatter = /*#__PURE__*/function (_karas$Component) {
    _inherits(Scatter, _karas$Component);
    function Scatter(props) {
      var _this;
      _this = _karas$Component.call(this, props) || this;
      _this.count = 0;
      _this.time = 0;
      _this.playbackRate = props.playbackRate || 1;
      _this.interval = props.interval || 300;
      _this.intervalNum = props.intervalNum || 1;
      _this.num = props.num || 0;
      _this.__duration = props.duration || 1000;
      return _this;
    }
    _createClass(Scatter, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this2 = this;
        var props = this.props,
          renderMode = this.root.renderMode;
        var _props$list = props.list,
          list = _props$list === void 0 ? [] : _props$list,
          _props$initNum = props.initNum,
          initNum = _props$initNum === void 0 ? 0 : _props$initNum,
          _props$delay = props.delay,
          delay = _props$delay === void 0 ? 0 : _props$delay,
          _props$duration = props.duration,
          duration = _props$duration === void 0 ? 1000 : _props$duration,
          autoPlay = props.autoPlay;
        var dataList = this.dataList = [];
        var i = 0,
          length = list.length;
        var lastTime = 0,
          count = 0;
        var fake = this.ref.fake;
        var currentTime = 0,
          maxTime = 0;
        var hasStart;
        var cb = this.cb = function (diff) {
          fake.dataList = null;
          diff *= _this2.playbackRate;
          currentTime += diff;
          fake.currentTime = currentTime;
          if (delay > 0) {
            delay -= diff;
          }
          if (delay <= 0) {
            diff += delay;
            _this2.time += diff;
            delay = 0;
          }
          // 如果有初始粒子
          if (initNum > 0) {
            lastTime = _this2.time;
            while (initNum-- > 0) {
              i++;
              i %= length;
              count++;
              var o = _this2.genItem(list[i], duration);
              maxTime = Math.max(maxTime, currentTime + o.duration);
              dataList.push(o);
            }
          }
          // 已有的每个粒子时间增加计算位置，结束的则消失
          for (var j = dataList.length - 1; j >= 0; j--) {
            var item = dataList[j];
            item.time += diff;
            if (item.time >= item.duration) {
              var remove = dataList.splice(j, 1);
              // webgl需释放纹理
              if (renderMode === WEBGL && remove.length) {
                remove.forEach(function (item) {
                  item.cache && item.cache.release && item.cache.release();
                });
              }
            } else if (item.source) {
              var time = item.time,
                _duration = item.duration,
                easing = item.easing;
              var percent = time / _duration;
              if (easing) {
                percent = easing(percent);
              }
              item.percent = percent;
              hasStart = true;
            }
          }
          // 开始后每次都刷新，即便数据已空，要变成空白初始状态
          if (hasStart && currentTime >= delay) {
            var _this2$props$onFrame, _this2$props;
            fake.dataList = dataList;
            fake.refresh(CACHE);
            (_this2$props$onFrame = (_this2$props = _this2.props).onFrame) === null || _this2$props$onFrame === void 0 ? void 0 : _this2$props$onFrame.call(_this2$props);
            _this2.emit('frame');
          }
          // 数量完了动画也执行完了停止
          if (count >= _this2.num && currentTime >= maxTime) {
            var _this2$props$onFinish, _this2$props2;
            fake.removeFrameAnimate(cb);
            (_this2$props$onFinish = (_this2$props2 = _this2.props).onFinish) === null || _this2$props$onFinish === void 0 ? void 0 : _this2$props$onFinish.call(_this2$props2);
            _this2.emit('finish');
            return;
          }
          // 每隔interval开始生成这一阶段的粒子数据
          if (_this2.time >= lastTime + _this2.interval && count < _this2.num) {
            lastTime = _this2.time;
            for (var _j = 0; _j < _this2.intervalNum; _j++) {
              i++;
              i %= length;
              count++;
              var _o = _this2.genItem(list[i], duration);
              maxTime = Math.max(maxTime, currentTime + _o.duration);
              dataList.push(_o);
              if (count >= _this2.num) {
                break;
              }
            }
          }
        };
        if (autoPlay !== false) {
          fake.frameAnimate(cb);
        }
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        (this.dataList || []).forEach(function (item) {
          item.cache && item.cache.release && item.cache.release();
        });
      }
    }, {
      key: "genItem",
      value: function genItem(item, dur) {
        var width = this.width,
          height = this.height;
        var o = {
          id: uuid++,
          time: 0,
          dur: dur
        };
        if (Array.isArray(item.url)) {
          var i = Math.floor(Math.random() * item.url.length);
          o.url = item.url[i];
        } else {
          o.url = item.url;
        }
        var x = 0,
          y = 0,
          tx = 0,
          ty = 0;
        if (Array.isArray(item.x)) {
          x = item.x[0] + Math.random() * (item.x[1] - item.x[0]);
          o.x = x * width;
        } else {
          x = item.x;
          o.x = x * width;
        }
        if (Array.isArray(item.y)) {
          y = item.y[0] + Math.random() * (item.y[1] - item.y[0]);
          o.y = y * height;
        } else {
          y = item.y;
          o.y = y * height;
        }
        if (Array.isArray(item.tx)) {
          tx = item.tx[0] + Math.random() * (item.tx[1] - item.tx[0]);
          o.tx = tx * width;
        } else if (isFunction(item.tx)) {
          tx = item.tx(x, y);
          o.tx = tx * width;
        } else {
          tx = item.tx;
          o.tx = item.tx * width;
        }
        if (Array.isArray(item.ty)) {
          ty = item.ty[0] + Math.random() * (item.ty[1] - item.ty[0]);
          o.ty = ty * width;
        } else if (isFunction(item.ty)) {
          ty = item.ty(o.x, o.y, o.tx);
          o.ty = ty * height;
        } else {
          ty = item.ty;
          o.ty = ty * height;
        }
        if (Array.isArray(item.cx1)) {
          o.cx1 = (item.cx1[0] + Math.random() * (item.cx1[1] - item.cx1[0])) * width;
        } else if (isFunction(item.cx1)) {
          o.cx1 = item.cx1(o.x, o.y, o.tx, o.ty);
        } else {
          o.cx1 = item.cx1 * height;
        }
        if (Array.isArray(item.cy1)) {
          o.cy1 = (item.cy1[0] + Math.random() * (item.cy1[1] - item.cy1[0])) * width;
        } else if (isFunction(item.cy1)) {
          o.cy1 = item.cy1(o.x, o.y, o.tx, o.ty);
        } else {
          o.cy1 = item.cy1 * height;
        }
        if (Array.isArray(item.duration)) {
          o.duration = item.duration[0] + Math.random() * (item.duration[1] - item.duration[0]);
        } else {
          o.duration = item.duration || dur;
        }
        if (Array.isArray(item.width)) {
          o.width = item.width[0] + Math.random() * (item.width[1] - item.width[0]);
        } else if (!isNil(item.width)) {
          o.width = item.width;
        }
        if (Array.isArray(item.height)) {
          o.height = item.height[0] + Math.random() * (item.height[1] - item.height[0]);
        } else if (!isNil(item.height)) {
          o.height = item.height;
        }
        var opacity = 1;
        if (Array.isArray(item.opacity)) {
          opacity = item.opacity[0] + Math.random() * (item.opacity[1] - item.opacity[0]);
        } else if (item.opacity !== null && item.opacity !== undefined) {
          opacity = parseFloat(item.opacity);
        }
        o.opacity = opacity;
        if (item.easing) {
          o.easing = animate.easing.getEasing(item.easing);
        }
        if (o.url) {
          inject.measureImg(o.url, function (res) {
            if (res.success) {
              o.source = res.source;
              o.sourceWidth = res.width;
              o.sourceHeight = res.height;
              if (!(isNil(o.width) && isNil(o.height))) {
                if (isNil(o.width)) {
                  o.width = res.width / res.height * o.height;
                } else if (isNil(o.height)) {
                  o.height = o.width * res.height / res.width;
                }
              } else {
                o.width = res.width;
                o.height = res.height;
              }
            }
          });
        }
        return o;
      }
    }, {
      key: "render",
      value: function render() {
        return karas__default["default"].createElement("div", null, karas__default["default"].createElement($, {
          ref: "fake",
          style: {
            width: '100%',
            height: '100%',
            fill: 'none',
            stroke: 0
          }
        }));
      }
    }, {
      key: "pause",
      value: function pause() {
        this.ref.fake.removeFrameAnimate(this.cb);
      }
    }, {
      key: "resume",
      value: function resume() {
        this.ref.fake.frameAnimate(this.cb);
      }
    }, {
      key: "play",
      value: function play() {
        this.count = 0;
        this.time = 0;
        this.ref.fake.removeFrameAnimate(this.cb);
        this.ref.fake.frameAnimate(this.cb);
      }
    }, {
      key: "playbackRate",
      get: function get() {
        return this.__playbackRate;
      },
      set: function set(v) {
        this.__playbackRate = parseFloat(v) || 1;
      }
    }, {
      key: "interval",
      get: function get() {
        return this.__interval;
      },
      set: function set(v) {
        this.__interval = parseInt(v) || 300;
      }
    }, {
      key: "intervalNum",
      get: function get() {
        return this.__intervalNum;
      },
      set: function set(v) {
        this.__intervalNum = parseInt(v) || 1;
      }
    }, {
      key: "num",
      get: function get() {
        return this.__num;
      },
      set: function set(v) {
        if (v === Infinity || /infinity/i.test(v)) {
          this.__num = Infinity;
        } else {
          this.__num = parseInt(v) || 0;
        }
      }
    }, {
      key: "duration",
      get: function get() {
        return this.__duration;
      }
    }]);
    return Scatter;
  }(karas__default["default"].Component);

  return Scatter;

}));
//# sourceMappingURL=index.js.map
