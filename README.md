# vue-smart-animator
##### A Vue.js Component
### Usage
```
npm install vue-smart-animator --save
import VueSmartAnimator from 'vue-smart-animator'
```
```
npm run dev
npm run build
```


### Props:
```
frames:Array [frame,frame,...]
frame:{styles:Object,configs:Object}

styles CSS object for example
{ background: 'rgba(100,100,100,.5)', transform: 'translateX(100px) rotateZ(90deg)' }

configs default
{'duration': '.3s', 'fill-mode': 'forwards', 'timing-function': 'linear'}
properties:
delay,direction,duration,iteration-count,name,play-state,timing-function,fill-mode

options:Object

default:{
                startFrom: 0,//开始帧
                pauseAt: [],//暂停的帧 需要继续播放调用 resume
                prefix: true,//是否添加浏览器兼容前缀
                count: 1,//播放次数
                clear: false, //是否清除动画数据 
                applyOnEnd: false, // clear后停留在最后一帧 
                instant: false //立即播放  最好不要设置自动播放，
            }

注意：设置自动播放后动画关键帧CSS 会直接注入HTML，
如果非自动播放，将会等没有新CSS动画初始化后50毫秒注入HTML，移动端注入后动画才起作用（批量运行组件，模拟粒子效果等，建议不是自动播放）

```
### Methods
```
play() 播放
pause() 暂停
resume() 恢复
replay() 重新播放

```
### Event
```
play
stop
next

```

