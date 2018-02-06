<template>
    <div>
        <slot></slot>
    </div>
</template>
<style scoped>

</style>

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
                this.queue.play().then(function () {
                    self.$emit('next')
                    self.$emit('stop')
                })
            }, pause: function () {
                this.queue.pause()
            }, resume: function () {
                this.queue.resume()
            }, restart: function () {
                 this.play()
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
                prefix: true,
                count: 1,
                clear: false,
                applyOnEnd: false,
                instant: false
            }, this.options)

            let instant = options.instant
            options.instant = false
            this.queue = new Queue(this.$el, initFrames, options)
            if (instant) {
                self.play()
            }

        }

    }
</script>