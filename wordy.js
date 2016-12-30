'use strict';

function download(url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('error', reject);
        xhr.addEventListener('load', () => resolve(xhr.response));
        xhr.open('GET', url);
        xhr.send(null);
    });
}

const main = Promise.coroutine(function* () {
    document.body.style.margin = '0';
    document.body.parentNode.style.height = '100%';
    document.body.style.height = '100%';
    document.body.style.overflow = 'hidden';

    const SCREENW = document.body.clientWidth;
    const SCREENH = document.body.clientHeight;

    const canvas = document.createElement('canvas');
    canvas.width = SCREENW;
    canvas.height = SCREENH;
    document.body.appendChild(canvas);

    const input = document.createElement('input');
    input.style.position = 'absolute';
    input.style.top = '0px';
    input.style.left = '0px';
    document.body.appendChild(input);

    const ctx = canvas.getContext('2d');

    const wordList = yield download('words.txt');

    console.log(wordList);

    const words = wordList.split('\n');

    const renderWords = Promise.coroutine(function* (prefix, sentinel) {
        let n = 0;
        for (let word of words) {
            if (sentinel.value) {
                break;
            }

            if (!prefix.test(word)) {
                continue;
            }

            const wordSize = ctx.measureText(word);
            ctx.fillText(word, Math.random() * SCREENW, 10 + Math.random() * (SCREENH - 20));

            if (n++ === 100) {
                yield Promise.delay(50);
                n = 0;
            }
        }
    });

    const currentEvent = new Box(null);

    input.addEventListener('change', function () {
        if (currentEvent.value !== null) {
            currentEvent.value.value = true;
        }
        currentEvent.value = new Box(false);
        ctx.clearRect(0, 0, SCREENW, SCREENH);
        renderWords(new RegExp(input.value, 'i'), currentEvent.value);
    });
});

class Box {
    constructor(value) {
        this.value = value;
    }
}

window.addEventListener('load', main);
