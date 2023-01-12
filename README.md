# karas-scatter
Scatter component for karas.

---
karas抛洒组件。

[![NPM version](https://img.shields.io/npm/v/karas-scatter.svg)](https://npmjs.org/package/karas-scatter)

## Install
```
npm install karas
npm install karas-scatter
```

## Usage

```jsx
import Scatter from 'karas-scatter';

karas.render(
  <canvas width="720" height="720">
    <Scatter
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 500,
        height: 500,
        translateX: '-50%',
        translateY: '-50%',
        background: '#000',
      }}
      list={[
        {
          url: [
            'https://mdn.alipayobjects.com/huamei_p2sgyr/afts/img/A*y6ZsRI04KsIAAAAAAAAAAAAADgKIAQ/original',
            'https://mdn.alipayobjects.com/huamei_p2sgyr/afts/img/A*ZEx_TZF1s3AAAAAAAAAAAAAADgKIAQ/original',
            'https://mdn.alipayobjects.com/huamei_p2sgyr/afts/img/A*upCgTKWuogoAAAAAAAAAAAAADgKIAQ/original',
            'https://mdn.alipayobjects.com/huamei_p2sgyr/afts/img/A*rb6nT4m2szAAAAAAAAAAAAAADgKIAQ/original',
            'https://mdn.alipayobjects.com/huamei_p2sgyr/afts/img/A*E0PJTphJ948AAAAAAAAAAAAADgKIAQ/original',
            'https://mdn.alipayobjects.com/huamei_p2sgyr/afts/img/A*0Ar7T7rAriUAAAAAAAAAAAAADgKIAQ/original',
          ],
          x: [0.4, 0.6],
          y: [0, 0.1],
          tx: function(x, y) {
            if(x < 0.5) {
              return Math.random() * 0.5;
            }
            else {
              return Math.random() * 0.5 + 0.5;
            }
          },
          ty: 1,
          cx1: function(x, y, tx, ty) {
            let c = (x + tx) * 0.5;
            let l = tx - x;
            return c + Math.random() * l * 0.5;
          },
          cy1: function(x, y, tx, ty) {
            let l = ty - y;
            return y - Math.random() * l * 0.5;
          },
          opacity: [0.2, 1],
          width: [20, 30],
          duration: 1000,
          easing: 'easeOut',
        },
      ]}
      interval={1}
      intervalNum={1}
      num={Infinity}
      delay={100}
      duration={5000}
    />
  </canvas>
);
```

### props
* onFrame 每帧触发
* onFinish 播放完触发
* animation 粒子整体动画，位移、缩放、选择、透明度可用
* duration 上面选项的时间

### method
* pause() 暂停
* resume() 恢复
* play() 从头播放

### get/set
* playbackRate 播放速率
* interval 发射间隔
* intervalNum 每轮发射数量
* num 总粒子数量

### event
* frame 每次刷新后触发
* finish 完成触发

# License
[MIT License]
