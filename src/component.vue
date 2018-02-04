<template>
    <div>
        <slot></slot>
    </div>
</template>
<style scoped>

</style>

<script>
    import {Frame, Queue} from 'animatorjs';
    // 注册
    export default {
        name: 'vue-smart-animator',
        // 声明 props
        props: {
            frames: {default: function () {
                    return []
                }},
            options: {
                default:function() {
                    return {
                        startFrom: 0,
                        pauseAt: [],
                        prefix: false,
                        count: 1,
                        clear: true,
                        applyOnEnd: true,
                        instant: false
                    }
                }
            }
        },
        methods: {
            play: function () {
                let self=this;

                this.queue.play().then(function () {
                    self.$emit('next')

                })
            }, pause: function () {
                this.queue.pause()
            }, resume: function () {
                this.queue.resume()
            }, restart: function () {
                this.queue.restart()
            }
        },
        data: function () {
            return {queue: null}
        },
        mounted: function () {
            let self=this;
            let frames=this.frames
            let initFrames=[]
            for(let i=0;i<frames.length;i++){
                initFrames.push(new Frame(frames[i].styles,frames[i].configs))
            }
            this.queue = new Queue(this.$el, initFrames, this.options)
            if(this.queue.promise){
                this.queue.promise.then(function () {
                    self.$emit('next')
                })
            }

        }

    }
</script>