//Classes ----------------------------
class Presentation {
  constructor(title, slides, theme) {
    this.title = title;
    this.slides = slides;
    this.theme = theme;
  }
}

let firstPresentationArr = [
  { text: 'Title 1' },
  { text: 'Title 2' },
  { img: 'Bilder/eggBilde.jpg' },
  { list: [1, 2, 3, 4, 5] },
];

//Global var---------------------
presentation = new Presentation('MyTitle', firstPresentationArr);

let container = document.getElementById('container');
let showIndex = 1;

let addTxt = document.getElementById('addTxt');
let addImg = document.getElementById('addImg');
let addList = document.getElementById('addList');

let createPresBtn = document.getElementById('createPres');
let slideDiv = document.querySelector('#slideDiv');
let themeOptions = document.querySelectorAll('.themeOption');
let presList = document.querySelectorAll('.selectOption');

const alertDiv = document.querySelector('.disableTotalScreen');
const alertDivButton = document.querySelector('.alertButton');
const alertDivText = document.querySelector('.alertText');
let accessData = localStorage.getItem('accessData')
  ? JSON.parse(localStorage.getItem('accessData'))
  : false;

let body = null;

//---------------------Funksjoner----------------
window.addEventListener('keydown', (e) => {
  if (e.key == 'ArrowLeft') {
    navigate(-1);
  } else if (e.key == 'ArrowRight') {
    navigate(1);
  }
});

themeOptions.forEach((element) => {
  element.onclick = (e) => {
    if (e.target.id === 'default') {
      slideDiv.className = 'slideShowbodyDefault';
    } else if (e.target.id === 'sakura') {
      slideDiv.className = 'slideShowbodySakura';
    } else if (e.target.id === 'geometric') {
      slideDiv.className = 'slideShowbodyGeometric';
    }
  };
});

presList.forEach((element) => {
  //an element will be <p id="presentationID">presentation.title</P>
  element.onclick = (e) => {
    //Code to fetch the presentation connected to this title and load these slides
    //also add this as the current text on this button
    console.log(e.target);
    let chosenPresId = presentation.id;
    let chosenPresTitle = presentation.title;

    let displayTitle = document.querySelector('#presTitleDisplay');

    displayTitle.innerHTML = 0; //This will be a condition using e.target.id === to chosenPresId and will return this press title
  };
});

//funksjoner
alertDivButton.onclick = () => (location.href = 'login.html');

if (!accessData) {
  alertDiv.style.display = 'block';
} else {
  const inputArray = [accessData.id, accessData.accesstoken];
  const body = {
    id: inputArray[0],
    accesstoken: inputArray[1],
  };

  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
  fetch('/login', config)
    .then((resp) => {
      console.log(config.body.username, config.body.password);
      if (resp.status !== 200) {
        throw new Error('Incorrect access credentials. Try to log in again.');
      }
      return resp.json();
    })
    .then((resp) => {
      console.log('User verified');

      return resp;
    })
    .catch((err) => {
      alertDivText.textContent = '';
      alertDivText.textContent = err.message;
      alertDiv.style.display = 'block';
      return err;
    });
}

//loadpres and put arr in localstorage in presentationArray;

createPresBtn.addEventListener('click', function () {
  const inputArray = [
    accessData.id,
    accessData.accesstoken,
    presentation.title,
    presentation.slides,
  ];
  const body = {
    id: inputArray[0],
    accesstoken: inputArray[1],
    title: inputArray[2],
    slides: inputArray[3],
  };
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  fetch('/create-presentation', config)
    .then((resp) => {
      if (resp.status !== 200) {
        throw new Error('COULD NOT CREATE');
      }
      return resp.json();
    })
    .then((resp) => {
      console.log('Presentation created');
      return resp;
    })
    .catch((err) => {
      alertDivText.textContent = '';
      alertDivText.textContent = err.message;
      alertDiv.style.display = 'block';
      return err;
    });
});

//---------------------Funksjoner--------------------------

function activeSlide(n) {
  loadSlides((showIndex = n));
}
function navigate(num) {
  loadSlides((showIndex += num));
}

function createNavigationDots() {
  let navDots = document.getElementById('navDots');
  navDots.innerHTML = '';
  for (let i = 1; i <= presentation.slides.length; i++) {
    let span = document.createElement('span');
    span.classList.add('dot');
    span.addEventListener('click', function (evt) {
      activeSlide(i);
    });
    navDots.appendChild(span);
  }
}
// usikker på denne --------------------------------------------------------------
function loadPresentation(arr) {
  container.innerHTML = '';
  for (let slide of arr) {
    let div = document.createElement('div');

    let html = '';
    let text = '';
    let img = '';
    let list = '';

    if (slide.text) {
      text = '<h6>' + slide.text + '</h6>';
    }
    //----------mulig at deete skal endres
    // if (slide.img) {
    // img = '<img src=' + slide.img + ' >';
    //  }
    if (slide.list) {
      let innerOl = '';
      for (let element of slide.list) {
        let listElement = '<li>' + element + '</li>';
        innerOl += listElement;
      }
      list = '<ul>' + innerOl + '</ul>';
    }
    div.classList.add('slide');
    html = `${text}
              ${img}
              ${list}`;
    div.innerHTML = html;

    container.appendChild(div);
  }
}
//------------------------------------------------------den jeg er usikker på slutter her-------
function loadSlides(num) {
  let slideshow = document.getElementsByClassName('slide');
  let dots = document.getElementsByClassName('dot');
  if (num > slideshow.length) {
    showIndex = 1;
  }
  if (num < 1) {
    showIndex = slideshow.length;
  }
  for (let i = 0; i < slideshow.length; i++) {
    slideshow[i].style.display = 'none';
  }
  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(' crntSlide', '');
  }
  slideshow[showIndex - 1].style.display = 'block';
  dots[showIndex - 1].className += ' crntSlide';
}
//-------------knapper-------------
addTxt.addEventListener('click', function () {
  let newSlide = { text: 'Test1' };
  presentation.slides.push(newSlide);
  loadPresentation(presentation.slides);
  createNavigationDots();
  activeSlide(presentation.slides.length);
});
//-----------her skal den til Image stå---
addList.addEventListener('click', function () {
  let newSlide = { list: ['a', 'b', 'c', 'd', 'e'] };
  presentation.slides.push(newSlide);
  loadPresentation(presentation.slides);
  createNavigationDots();
  activeSlide(presentation.slides.length);
});

//Called on window load -------------------------
loadPresentation(presentation.slides);
loadSlides(showIndex);
