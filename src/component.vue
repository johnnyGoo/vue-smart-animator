<template>
    <div>
        <slot></slot>
    </div>
</template>


<script>
    function extend(obj) {
        let length = arguments.length;
        obj = Object(obj);
        if (length < 2 || obj == null) return obj;
        for (let index = 1; index < length; index++) {
            let source = arguments[index]
            for (let key in source) {
                obj[key] = source[key];
            }
        }
        return obj
    }

    import Frame from './frame';
    import Queue from './queue';


    // 注册
    export default {
        name: 'vue-smart-animator',
        // 声明 props
        props: {
            frames: {
                default: function () {
                    return []
                }
            },
            options: {
                default: function () {
                    return {
                    }
                }
            }
        },
        methods: {
            play: function () {
                let self = this;
                self.$emit('play')
                this.queue.play()
            }, pause: function () {
                this.queue.pause()
            }, resume: function () {
                this.queue.resume()
            }, clear: function () {
                this.queue.clear()
            },replay(){
                let self=this;
                this.queue.clear()
                setTimeout(function () {
                    self.play()
                })
            }
        },
        data: function () {
            return {queue: null}
        },
        mounted: function () {
            let self = this;
            let frames = this.frames
            let initFrames = []
            for (let i = 0; i < frames.length; i++) {
                initFrames.push(new Frame(frames[i].styles, extend({'duration': '.3s', 'fill-mode': 'forwards', 'timing-function': 'linear'},frames[i].configs)))
            }
            let options=extend({
                startFrom: 0,
                pauseAt: [],
                prefix: false,
                count: 1,
                clear: false,
                applyOnEnd: false,
                instant: false,callback:function () {
                    self.$emit('next')
                    self.$emit('stop')
                }
            }, this.options)

            let instant = options.instant

            this.queue = new Queue(this.$el, initFrames, options)
            if (instant) {
                self.$emit('play')
            }

        }

    }
</script>