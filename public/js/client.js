import {TextBox} from './spawningElement.js';

const btnAddTxt = document.getElementById('addTxt');

btnAddTxt.addEventListener('click', async evt => {

    let txt1 = new TextBox("text");
    txt1.spawnText(document.getElementById('slideDiv'));

})
