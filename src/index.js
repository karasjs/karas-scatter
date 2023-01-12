import karas from 'karas';
import { version } from '../package.json';

const {
  enums: {
    STYLE_KEY: {
      DISPLAY,
      VISIBILITY,
      TRANSLATE_X,
      TRANSLATE_Y,
      OPACITY,
      SCALE_X,
      SCALE_Y,
      ROTATE_Z,
    },
  },
  refresh: {
    level: {
      CACHE,
    },
    webgl: {
      drawTextureCache,
    },
  },
  util: {
    isNil,
    isFunction,
  },
  math: {
    geom: {
      d2r,
    },
    matrix: {
      identity,
      isE,
      multiply,
      multiplyTfo,
      tfoMultiply,
      multiplyTranslateX,
      multiplyTranslateY,
      multiplyRotateZ,
      multiplyScaleX,
      multiplyScaleY,
    },
  },
  mode: {
    CANVAS,
    WEBGL,
  },
  style: {
    css,
  },
  animate,
  Img,
  inject,
} = karas;

let uuid = 0;

class $ extends karas.Geom {
  render(renderMode, ctx, dx, dy) {
    let res = super.render(renderMode, ctx, dx, dy);
    let dataList = this.dataList;
    if(!dataList || !dataList.length) {
      return res;
    }
    let root = this.__root;
    if(renderMode !== root.__renderMode) {
      return res;
    }
    let { __x1: x1, __y1: y1, __computedStyle } = this;
    let op = __computedStyle[OPACITY];
    if(__computedStyle[DISPLAY] === 'none'
      || __computedStyle[VISIBILITY] === 'hidden'
      || op <= 0) {
      return res;
    }
    let globalAlpha;
    if(renderMode === CANVAS) {
      globalAlpha = ctx.globalAlpha;
    }
    let env = this.env;
    let me = this.domParent.matrixEvent;
    let cacheList = [], lastPage, cx = env.width * 0.5, cy = env.height * 0.5;
    dataList.forEach((item, i) => {
      if(item.source && item.percent !== undefined) {
        let opacity = op * item.opacity;
        if(opacity <= 0) {
          return;
        }
        let t = item.percent;
        let x = Math.pow(1 - t, 2) * item.x + 2 * t * (1 - t) * item.cx1 + Math.pow(t, 2) * item.tx;
        let y = Math.pow(1 - t, 2) * item.y + 2 * t * (1 - t) * item.cy1 + Math.pow(t, 2) * item.ty;
        let m = identity();
        let img = inject.IMG[item.url];
        let tfo = [x1 + dx + img.width * 0.5, y1 + dy + img.height * 0.5];
        // 移动一半使得图形中心为计算位置的原点，还有平移位置
        m = multiplyTranslateX(m, x - img.width * 0.5);
        m = multiplyTranslateY(m, y - img.height * 0.5);
        if(img.width !== item.width) {
          m = multiplyScaleX(m, item.width / img.width);
        }
        if(img.height !== item.height) {
          m = multiplyScaleY(m, item.height / img.height);
        }
        if(renderMode === CANVAS) {
          m = tfoMultiply(tfo[0], tfo[1], m);
          m = multiplyTfo(m, -tfo[0], -tfo[1]);
          if(!isE(me)) {
            m = multiply(me, m);
          }
          ctx.globalAlpha = opacity;
          // canvas处理方式不一样，render的dx和dy包含了total的偏移计算考虑，可以无感知
          ctx.setTransform(m[0], m[1], m[4], m[5], m[12], m[13]);
          ctx.drawImage(item.source, x1 + dx, y1 + dy);
        }
        else if(renderMode === WEBGL) {
          let cache = item.cache;
          if(!cache) {
            item.cache = true;
            Img.toWebglCache(ctx, root, item.url, x1 + dx, y1 + dy, function(res) {
              cache = item.cache = res;
              if(cache.count === 1) {
                let { ctx, width, height, x, y } = cache;
                ctx.drawImage(item.source, x, y, width, height);
                cache.update();
              }
            });
          }
          if(cache && cache !== true) {
            m = tfoMultiply(tfo[0], tfo[1], m);
            m = multiplyTfo(m, -tfo[0], -tfo[1]);
            if(!isE(me)) {
              m = multiply(me, m);
            }
            if(!cache.__available && cache.__enabled) {
              cache.__available = true;
            }
            if(cache.__available) {
              if(lastPage && lastPage !== cache.__page) {
                drawTextureCache(ctx, cacheList.splice(0), cx, cy, dx, dy);
              }
              lastPage = cache.__page;
              cacheList.push({ cache, opacity, matrix: m });
            }
          }
        }
      }
    });
    if(renderMode === CANVAS) {
      ctx.globalAlpha = globalAlpha;
    }
    else if(renderMode === WEBGL) {
      drawTextureCache(ctx, cacheList, cx, cy, dx, dy);
    }
  }
}

class Scatter extends karas.Component {
  constructor(props) {
    super(props);
    this.count = 0;
    this.time = 0;
    this.playbackRate = props.playbackRate || 1;
    this.interval = props.interval || 300;
    this.intervalNum = props.intervalNum || 1;
    this.num = props.num || 0;
    this.__duration = props.duration || 1000;
  }
  componentDidMount() {
    let { props, root: { renderMode } } = this;
    let { list = [], initNum = 0, delay = 0, duration = 1000, autoPlay } = props;
    let dataList = this.dataList = [];
    let i = 0, length = list.length;
    let lastTime = 0, count = 0;
    let fake = this.ref.fake;
    let currentTime = 0, maxTime = 0;
    let hasStart;
    let cb = this.cb = diff => {
      fake.dataList = null;
      diff *= this.playbackRate;
      currentTime += diff;
      fake.currentTime = currentTime;
      if(delay > 0) {
        delay -= diff;
      }
      if(delay <= 0) {
        diff += delay;
        this.time += diff;
        delay = 0;
      }
      // 如果有初始粒子
      if(initNum > 0) {
        lastTime = this.time;
        while(initNum-- > 0) {
          i++;
          i %= length;
          count++;
          let o = this.genItem(list[i], duration);
          maxTime = Math.max(maxTime, currentTime + o.duration);
          dataList.push(o);
        }
      }
      // 已有的每个粒子时间增加计算位置，结束的则消失
      for(let j = dataList.length - 1; j >= 0; j--) {
        let item = dataList[j];
        item.time += diff;
        if(item.time >= item.duration) {
          let remove = dataList.splice(j, 1);
          // webgl需释放纹理
          if(renderMode === WEBGL && remove.length) {
            remove.forEach(item => {
              item.cache && item.cache.release && item.cache.release();
            });
          }
        }
        else if(item.source) {
          let { time, duration, easing } = item;
          let percent = time / duration;
          if(easing) {
            percent = easing(percent);
          }
          item.percent = percent;
          hasStart = true;
        }
      }
      // 开始后每次都刷新，即便数据已空，要变成空白初始状态
      if(hasStart && currentTime >= delay) {
        fake.dataList = dataList;
        fake.refresh(CACHE);
        this.props.onFrame?.();
        this.emit('frame');
      }
      // 数量完了动画也执行完了停止
      if(count >= this.num && currentTime >= maxTime) {
        fake.removeFrameAnimate(cb);
        this.props.onFinish?.();
        this.emit('finish');
        return;
      }
      // 每隔interval开始生成这一阶段的粒子数据
      if(this.time >= lastTime + this.interval && count < this.num) {
        lastTime = this.time;
        for(let j = 0; j < this.intervalNum; j++) {
          i++;
          i %= length;
          count++;
          let o = this.genItem(list[i], duration);
          maxTime = Math.max(maxTime, currentTime + o.duration);
          dataList.push(o);
          if(count >= this.num) {
            break;
          }
        }
      }
    };
    if(autoPlay !== false) {
      fake.frameAnimate(cb);
    }
  }

  componentWillUnmount() {
    (this.dataList || []).forEach(item => {
      item.cache && item.cache.release && item.cache.release();
    });
  }

  genItem(item, dur) {
    let { width, height } = this;
    let o = {
      id: uuid++,
      time: 0,
      dur,
    };
    if(Array.isArray(item.url)) {
      let i = Math.floor(Math.random() * item.url.length);
      o.url = item.url[i];
    }
    else {
      o.url = item.url;
    }
    let x = 0, y = 0, tx = 0, ty = 0;
    if(Array.isArray(item.x)) {
      x = item.x[0] + Math.random() * (item.x[1] - item.x[0]);
      o.x = x * width;
    }
    else {
      x = item.x;
      o.x = x * width;
    }
    if(Array.isArray(item.y)) {
      y = item.y[0] + Math.random() * (item.y[1] - item.y[0]);
      o.y = y * height;
    }
    else {
      y = item.y;
      o.y = y * height;
    }
    if(Array.isArray(item.tx)) {
      tx = item.tx[0] + Math.random() * (item.tx[1] - item.tx[0]);
      o.tx = tx * width;
    }
    else if(isFunction(item.tx)) {
      tx = item.tx(x, y);
      o.tx = tx * width;
    }
    else {
      tx = item.tx;
      o.tx = item.tx * width;
    }
    if(Array.isArray(item.ty)) {
      ty = item.ty[0] + Math.random() * (item.ty[1] - item.ty[0]);
      o.ty = ty * width;
    }
    else if(isFunction(item.ty)) {
      ty = item.ty(o.x, o.y, o.tx);
      o.ty = ty * height;
    }
    else {
      ty = item.ty;
      o.ty = ty * height;
    }
    if(Array.isArray(item.cx1)) {
      o.cx1 = (item.cx1[0] + Math.random() * (item.cx1[1] - item.cx1[0])) * width;
    }
    else if(isFunction(item.cx1)) {
      o.cx1 = item.cx1(o.x, o.y, o.tx, o.ty);
    }
    else {
      o.cx1 = item.cx1 * height;
    }
    if(Array.isArray(item.cy1)) {
      o.cy1 = (item.cy1[0] + Math.random() * (item.cy1[1] - item.cy1[0])) * width;
    }
    else if(isFunction(item.cy1)) {
      o.cy1 = item.cy1(o.x, o.y, o.tx, o.ty);
    }
    else {
      o.cy1 = item.cy1 * height;
    }
    if(Array.isArray(item.duration)) {
      o.duration = (item.duration[0] + Math.random() * (item.duration[1] - item.duration[0]));
    }
    else {
      o.duration = item.duration || dur;
    }
    if(Array.isArray(item.width)) {
      o.width = item.width[0] + Math.random() * (item.width[1] - item.width[0]);
    }
    else if(!isNil(item.width)) {
      o.width = item.width;
    }
    if(Array.isArray(item.height)) {
      o.height = item.height[0] + Math.random() * (item.height[1] - item.height[0]);
    }
    else if(!isNil(item.height)) {
      o.height = item.height;
    }
    let opacity = 1;
    if(Array.isArray(item.opacity)) {
      opacity = item.opacity[0] + Math.random() * (item.opacity[1] - item.opacity[0]);
    }
    else if(item.opacity !== null && item.opacity !== undefined) {
      opacity = parseFloat(item.opacity);
    }
    o.opacity = opacity;
    if(item.easing) {
      o.easing = animate.easing.getEasing(item.easing);
    }
    if(o.url) {
      inject.measureImg(o.url, function(res) {
        if(res.success) {
          o.source = res.source;
          o.sourceWidth = res.width;
          o.sourceHeight = res.height;
          if(!(isNil(o.width) && isNil(o.height))) {
            if(isNil(o.width)) {
              o.width = res.width / res.height * o.height;
            }
            else if(isNil(o.height)) {
              o.height = o.width * res.height / res.width;
            }
          }
          else {
            o.width = res.width;
            o.height = res.height;
          }
        }
      });
    }
    return o;
  }

  render() {
    return <div>
      <$ ref="fake" style={{
        width: '100%',
        height: '100%',
        fill: 'none',
        stroke: 0,
      }}/>
    </div>;
  }



  pause() {
    this.ref.fake.removeFrameAnimate(this.cb);
  }

  resume() {
    this.ref.fake.frameAnimate(this.cb);
  }

  play() {
    this.count = 0;
    this.time = 0;
    this.ref.fake.removeFrameAnimate(this.cb);
    this.ref.fake.frameAnimate(this.cb);
  }

  get playbackRate() {
    return this.__playbackRate;
  }

  set playbackRate(v) {
    this.__playbackRate = parseFloat(v) || 1;
  }

  get interval() {
    return this.__interval;
  }

  get intervalNum() {
    return this.__intervalNum;
  }

  set intervalNum(v) {
    this.__intervalNum = parseInt(v) || 1;
  }

  set interval(v) {
    this.__interval = parseInt(v) || 300;
  }

  get num() {
    return this.__num;
  }

  set num(v) {
    if(v === Infinity || /infinity/i.test(v)) {
      this.__num = Infinity;
    }
    else {
      this.__num = parseInt(v) || 0;
    }
  }

  get duration() {
    return this.__duration;
  }
}

export default Scatter;
