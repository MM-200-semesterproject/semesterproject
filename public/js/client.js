import {TextBox} from './spawningElement.js';

const btnAddTxt = document.getElementById('addTxt');

btnAddTxt.addEventListener('click', async evt => {

    let txt1 = new TextBox("text");
    txt1.spawnText(document.getElementById('slideDiv'));

})


let presMenuSelect = document.getElementById('crntPresentation');
let savePresBtn = document.getElementById('savePresBtn');

savePresBtn.addEventListener('click', presTitle => {
  //Code to check if title already exist, if so -> update presentation
  //if there is no title written in input -> do nothing
  //when presentation saved, add to list above and alert user "saved"
  let newPres = document.getElementById('inpPresName').value;

  let elm = document.createElement("option");
  elm.innerHTML = `${newPres}`;
  presMenuSelect.appendChild(elm);
});
// Dette skal kunne finne mouse position, men er obsolete.
/*const slideDiv = document.getElementById('slideDiv');
let userElm = document.getElementById('userText1'); //Will be variable activeElement after figuring out how to let this var be whatever user clicked

let active = false;
let pageX = 0;
let pageY = 0;

function getMousePos(evt) {
  pageX = evt.pageX;
  pageY = evt.pageY;
}
console.log(pageX + ', ' + pageY);

slideDiv.addEventListener('mousedown', dragStart, false);
slideDiv.addEventListener('mousemove', drag, false);
slideDiv.addEventListener('mouseup', dragEnd, false);*/
