import {TextBox} from './spawningElement.js';

const btnAddTxt = document.getElementById('addTxt');

btnAddTxt.addEventListener('click', async evt => {

    console.log('btn funker');

    let txt1 = new TextBox("Text");
    txt1.spawnText(document.getElementById('slideDiv'));

})
