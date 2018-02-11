import Utility from './utility';

let Animation = {__css:'',__iv:0};

Animation.__checkHtml=function() {
	if(Animation.__css!==''){
        let style = document.createElement('style');
        style.innerHTML = Animation.__css;
        Animation.__css='';
        style.class="foo";
        document.getElementsByTagName('head')[0].appendChild(style);
        return style;
	}
}


Animation.make = (frames, prefixes,nodelay) => {
	let names = [];
	let html = '';

	let namePrefix = 'atr-' + Utility.generateId();
	for(let i = 0; i < frames.length - 1; ++ i) {
		names.push(namePrefix + '-' + (i + 1));
		html += Animation.makeFromTwoFrames(frames[i], frames[i + 1], names[i], prefixes);
	}

    Animation.__css+=html;

clearTimeout(Animation.__iv)

if(nodelay){
   Animation.__checkHtml()
}else{
	Animation.__iv=setTimeout(function () {
        Animation.__checkHtml()
    },50)
}





	return { names: names };
};

Animation.makeFromTwoFrames = (f1, f2, name, prefixes) => {
	let keyFrames = '';
	
	for(let i in prefixes) {
		keyFrames += '@' + prefixes[i] + 'keyframes ' + name + ' {';
		keyFrames += '0%';
		keyFrames += '{' + Utility.frameToString(f1) + '}';
		keyFrames += '100%';
		keyFrames += '{' + Utility.frameToString(f2) + '}';
		keyFrames += '}';
	}

	return keyFrames;
};

export default Animation;