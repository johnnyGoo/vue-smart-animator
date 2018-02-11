import Animation from './animation';
import Utility from './utility';
import Style from './style';


function clone(obj) {
    let nobj = {};
    for (let i in obj) {
        nobj[i] = obj[i];
    }
    return nobj
}


class Queue {
    constructor(dom, frames, options, extra) {


        this.dom = dom;


        if (frames.constructor === Array) {
            this.frames = frames;
        } else {
            this.frames = [frames];
        }

        this.options = {
            startFrom: 0,
            pauseAt: [],
            prefix: false,
            count: 1,
            clear: true,
            applyOnEnd: false,
            instant: false
        };

        if (options != null && options !== undefined) {
            if (typeof options === 'boolean') {
                this.options['instant'] = options;
            } else if (typeof options === 'number') {
                this.options['count'] = options;

                if (typeof extra === 'boolean') {
                    this.options['instant'] = extra;
                }
            } else {
                for (let i in options) {
                    if (i === 'pauseAt' && !(options.pauseAt.constructor === Array)) {
                        this.options[i] = [options[i]];
                    } else {
                        this.options[i] = options[i];
                    }
                }
            }
        }


        if (this.options.prefix) {
            this.prefixes = Utility.prefixes;
        } else {
            this.prefixes = [''];
        }


        this.__countRemainder = this.options.count - 1;

        this.init(this.options.instant)

        if (this.options.instant) {

            this.play();
        }

    }

    // Controllers

    init(nodelay) {


        this.__animation = this.makeAnimation(this.dom, nodelay);
        this.__animation_names = this.__animation.names;
        this.__superSet = this.makeSuperSet(this.dom, this.__animation_names);
    }

    play() {


        this.playAnimation(this.dom, this.__superSet);
        this.__eventHandler = this.handleAnimationEnd.bind(this);
        this.dom.addEventListener('animationend', this.__eventHandler);


    }

    clear() {
        this.animationEnded = 0;
        for (let i in this.__superSet) {
            if (this.options.prefix) {
                for (let k in this.prefixes) {
                    this.dom.style[this.prefixes[k] + 'animation-' + i] = null;
                }
            } else {

                this.dom.style['animation-' + i] = null;
            }
            this.dom.style['animation-play-state'] = null;
        }


        this.dom.removeEventListener('animationend', this.__eventHandler);
        this.__countRemainder = this.options.count - 1;
    }

    replay() {
        let dom = this.dom;
        let newDom = dom.cloneNode(true);
        dom.parentNode.replaceChild(newDom, dom);
        this.dom.removeEventListener('animationend', this.__eventHandler);
        this.dom = newDom;
        this.dom.addEventListener('animationend', this.__eventHandler);
    }

    pause() {

        this.pauseDom(this.dom);

    }

    resume() {

        this.resumeDom(this.dom);

    }


    // Assistants
    handleAnimationEnd(event) {
        let name = event.animationName;
        let index = name.substring(name.lastIndexOf('-') + 1);

        if (this.options.pauseAt.includes(parseInt(index))) {
            this.pauseDom(this.dom);
        }

        if (parseInt(index) === this.frames.length) {

            if (this.__countRemainder === -1) {
                this.replay();
            } else if (this.__countRemainder > 0) {
                this.__countRemainder--;
                this.replay();
            } else {
                if (this.options.applyOnEnd) {
                    this.applyOnEnd();
                }
                this.animationEnded++;


                if (this.options.callback) {
                    this.options.callback()
                }

                if (this.options.clear) {
                    this.clear();
                }

            }
        }
    }

    pauseDom(dom) {
        for (let i in this.prefixes) {
            dom.style[this.prefixes[i] + 'animation-play-state'] = 'paused';
        }
    }

    resumeDom(dom) {
        for (let i in this.prefixes) {
            dom.style[this.prefixes[i] + 'animation-play-state'] = 'running';
        }
    }

    applyOnEnd() {
        let lastFrame = this.newFrames[this.frames.length];

        for (let i in lastFrame) {
            this.dom.style[i] = lastFrame[i];
        }
    }


    makeAnimation(dom, nodelay) {
        let initial = {};
        let frames = [];
        let superSet = {};

        for (let i in this.frames) {
            frames.push(this.frames[i].styles);

            for (let j in frames[i]) {
                superSet[j] = true;
            }
        }

        // Make initial frame
        let originalStyle = window.getComputedStyle(dom);
        for (let i in superSet) {
            initial[i] = originalStyle[i];
        }

        frames.unshift(initial);

        let newFrames = [frames[0]];

        // Make new frames
        for (let i = 1; i < frames.length; ++i) {
            // let newFrame = JSON.parse(JSON.stringify(newFrames[i - 1]));
            let newFrame = clone(newFrames[i - 1])

            //console.log(newFrame)
            //
            let next = frames[i]
            for (let j in next) {
                newFrame[j] = next[j];
            }

            newFrames.push(newFrame);
        }

        this.newFrames = newFrames;

        return Animation.make(newFrames, this.prefixes, nodelay);
    }

    makeSuperSet(dom, animations) {
        let currentDelay = 0;

        // Init Superset
        let superSet = {};

        for (let i in this.frames) {
            for (let j in this.frames[i].options) {
                superSet[j] = '';
            }
        }

        superSet['name'] = '';
        superSet['duration'] = '';
        superSet['delay'] = '';

        // Start Generation
        for (let i = 0; i < this.frames.length; ++i) {
            if (i) {
                for (let j in superSet) {
                    superSet[j] += ',';
                }
            }

            let time = Utility.convertTimeToMs(this.frames[i].options.duration);
            let delay = Utility.convertTimeToMs(this.frames[i].options.delay);

            if (i < this.options.startFrom) {
                time = 0;
                delay = 0;
            }

            superSet['name'] += animations[i];
            superSet['duration'] += time + 'ms';
            superSet['delay'] += (currentDelay + delay) + 'ms';

            for (let j in superSet) {
                if (j != 'name' && j != 'duration' && j != 'delay') {
                    superSet[j] += this.frames[i].options[j] ? this.frames[i].options[j] : Style.getPropertyDefault(j);
                }
            }

            let count = this.frames[i].options['iteration-count'];

            currentDelay += time * parseInt(count ? count : 1) + delay;
        }

        return superSet;
    }

    playAnimation(dom, superSet) {
        for (let i in superSet) {
            for (let j in this.prefixes) {
                dom.style[this.prefixes[j] + 'animation-' + i] = superSet[i];
            }
        }

        if (this.options.pauseAt.includes(0)) {
            this.pauseDom(dom);
        }
    }
}

export default Queue;