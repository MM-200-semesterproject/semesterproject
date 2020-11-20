import { TextBox } from './spawningElement.js';

const btnAddTxt = document.getElementById('addTxt');

btnAddTxt.addEventListener('click', async (evt) => {
  let txt1 = new TextBox('text');
  txt1.spawnText(document.getElementById('slideDiv'));
});

let presMenuSelect = document.getElementById('crntPresentation');
let savePresBtn = document.getElementById('savePresBtn');

/*savePresBtn.addEventListener('click', presTitle => {
  //Code to check if title already exist, if so -> update presentation
  //if there is no title written in input -> do nothing
  //when presentation saved, add to list above and alert user "saved"
  let newPres = document.getElementById('inpPresName').value;

  let elm = document.createElement("option");
  elm.innerHTML = `${newPres}`;
  presMenuSelect.appendChild(elm);

  getPresList();

});*/

let presentations = [];
let savePresForm = document.getElementById('createPres');
savePresForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();

  let url = 'https://moreslides.herokuapp.com/presentation';

  let fdata = new FormData(savePresForm);
  console.log(fdata);

  let cfg = {
    method: 'POST',
    body: fdata,
  };

  let response = await fetch(url, cfg).then((data) => {
    response.json();
    console.log(data);
  });
});
