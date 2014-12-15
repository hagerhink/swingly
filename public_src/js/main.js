/*global require, module, console*/
'use strict';

var $ = require('jquery');

$(document).ready(function(){
	//If you need any functionality, this is a good place to put it
});

document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    console.log(e.keyCode);

    if (e.keyCode == '67') {
        $('html').toggleClass('highlight-components');
    }
    else if (e.keyCode == '71') {
        $('body').toggleClass('grayscale');
    }
}