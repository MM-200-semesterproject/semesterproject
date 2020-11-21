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
let savePresForm = document.getElementById('savePresForm');
savePresForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();

  let presTitle = document.getElementById('inpPresTitle').value;
  let body = {
    presentation: {
      title: presTitle,
      slides: slides,
    },
  };
  let config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  fetch('/editMode', config).then((resp) => {
    console.log(resp);
  });
});
