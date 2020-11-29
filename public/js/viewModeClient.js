const editBtnLink = document.querySelector('#editBtnLink');
const logInUser = document.querySelector('#logInUser');

presModeBtn.onclick = () => {
  editMenu.style.display = 'none';
  slideDiv.style.margin = '1% 6% auto';
  slideDiv.style.width = '88%';
  slideDiv.style.height = '88%';
  editBtnLink.style.display = 'none';
};

editBtn.onclick = () => {
  if ((editMenu.style.display = 'flex')) {
    editBtnLink.style.display = 'block';
  }
  exitFullscreen();
};

logInUser.onclick = () => (location.href = 'login.html');

window.addEventListener('keydown', (e) => {
  if (e.key == 'ArrowLeft') {
    navigate(-1);
  } else if (e.key == 'ArrowRight') {
    navigate(1);
  }
  if (e.key == 'Escape') {
    if (editMenu.style.display === 'none') {
      exitFullscreen();
    }
  }
});

function exitFullscreen() {
  editMenu.style.display = 'flex';
  slideDiv.style.margin = 'auto 10% 4%';
  slideDiv.style.width = '80%';
  slideDiv.style.height = '80%';
}

function updatePresentationArray() {
  presentationObject = localStorage.getItem('presentations')
    ? JSON.parse(localStorage.getItem('presentations'))
    : false;

  if (
    !presentationObject ||
    !presentationObject.arr ||
    presentationObject == false
  ) {
    presentationArray = [{ title: 'empty' }];
    createPresList();
  } else if (presentationObject.arr.length == 0) {
    presentationArray = [{ title: 'empty' }];
    createPresList();
  } else if (presentationObject.arr.length > 0) {
    presentationArray = [];
    for (let i = 0; i < presentationObject.arr.length; i++) {
      presentationArray.unshift(presentationObject.arr[i]);
    }
    loadPresentationToView(presentationArray[0]);
    createPresList();
  } else {
  }
}

function activeSlide(n) {
  loadSlides((showIndex = n));
}
function navigate(num) {
  loadSlides((showIndex += num));
}

function createNavigationDots(numberOfslides) {
  let navDots = document.getElementById('navDots');
  navDots.innerHTML = '';
  for (let i = 0; i <= numberOfslides; i++) {
    let span = document.createElement('span');
    span.classList.add('dot');
    span.addEventListener('click', function (evt) {
      activeSlide(i);
    });
    navDots.appendChild(span);
  }
}

function loadPresentationToView(currentPres) {
  displayTitle.innerHTML = currentPres.title;
  createNavigationDots(currentPres.data.length);
  container.innerHTML = '';
  let titleDiv = document.createElement('div');
  titleDiv.innerHTML = `<h6>${currentPres.title}</h6>`;
  titleDiv.classList.add('slide');
  container.appendChild(titleDiv);
  for (let slide of currentPres.data) {
    let div = document.createElement('div');

    let html = '';
    let text = '';
    let img = '';
    let list = '';

    if (slide.text) {
      text = '<h6>' + slide.text + '</h6>';
    }
    if (slide.img) {
      img = '<img src=' + slide.img + ' >';
    }
    if (slide.list) {
      let innerOl = slide.list;
      list = '<ul>' + innerOl + '</ul>';
    }
    div.classList.add('slide');
    html = `${text}
                  ${img}
                  ${list}`;
    div.innerHTML = html;

    container.appendChild(div);
  }
  loadSlides(showIndex);
}

function loadSlides(num) {
  let slideshow = document.getElementsByClassName('slide');
  let dots = document.getElementsByClassName('dot');
  if (num >= slideshow.length) {
    showIndex = 0;
  }
  if (num < 0) {
    showIndex = slideshow.length - 1;
  }
  for (let i = 0; i < slideshow.length; i++) {
    slideshow[i].style.display = 'none';
  }
  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(' crntSlide', '');
  }
  slideshow[showIndex];

  slideshow[showIndex].style.display = 'flex';

  dots[showIndex].className += ' crntSlide';
}

function createPresList() {
  presList.innerHTML = '';
  if (presentationArray[0].length == 0 || !presentationArray[0].title) {
    displayTitle.innerHTML = 'empty';
  } else if (!presentationArray[0]) {
    displayTitle.innerHTML = 'Undefined';
  } else {
    displayTitle.innerHTML = presentationArray[0].title;
  }
  for (let part of presentationArray) {
    let p = document.createElement('p');
    p.id = part.presentationid;
    p.classList.add('presOption');
    p.title = part.title;
    p.innerHTML = part.title;
    p.id = part.presentationid;
    p.addEventListener('click', function () {
      displayTitle.innerHTML = p.title;
      for (let i = 0; i < presentationArray.length; i++) {
        if (p.id == presentationArray[i].presentationid) {
          let newPres = presentationArray.splice(i, 1);
          presentationArray.unshift(newPres[0]);
        }
      }
      loadPresentationToView(presentationArray[0]);
    });
    presList.appendChild(p);
  }
}

window.onload = function () {
  const body = {
    published: 'PUBLIC',
  };
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  fetch(`/public-list`, config)
    .then((resp) => {
      if (resp.status !== 200) {
        throw new Error('Could not Load presentations');
      }
      return resp.json();
    })
    .then((resp) => {
      const presentationObject = JSON.stringify(resp);
      localStorage.setItem('presentations', presentationObject);
      updatePresentationArray();
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};
