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
                instant: false //立即播放
            }

```
### Methods
```
play()
pause()
resume()
restart() 

```
### Event
```
play
stop
next

```

