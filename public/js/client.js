if (!accessData) {
  alertDiv.style.display = 'block';
} else {
  checkUser();
}

loadPresentationObject();

xIcon.onclick = () => {
  disableDiv.style.display = 'none';
};

alertDivButton.onclick = () => (location.href = 'login.html');

savePresBtn.addEventListener('click', savePresentationOnServer);

shareBtn.addEventListener('click', updateShareLink);
deleteSlideBtn.addEventListener('click', deleteSlide);

addTxt.addEventListener('click', function () {
  let newSlide = { text: 'Click here to edit title' };
  presentationArray[0].data.push(newSlide);
  console.log(presentationArray[0].data);
  savePresentation();
  loadPresentationToView(presentationArray[0]);
  activeSlide(presentationArray[0].data.length);
});

addImg.addEventListener('change', imgFileHandler, false);

addImgBtn.addEventListener('click', function () {
  disableDiv.style.display = 'none';
  if (!userInputImgURL) {
    return;
  }
  let newSlide = {
    text: 'Click here to edit title',
    img: userInputImgURL,
  };
  presentationArray[0].data.push(newSlide);
  savePresentation();
  loadPresentationToView(presentationArray[0]);
  activeSlide(presentationArray[0].data.length);
});

displayImg.onclick = () => {
  disableDiv.style.display = 'block';
};
imgoptions.forEach((item) => {
  item.onclick = () => {
    imgoptions.forEach((item) => {
      item.style.border = '2px solid #4e926300';
    });
    item.style.border = '2px solid #4e9263';
    userInputImgURL = item.getAttribute('src');
    console.log(userInputImgURL);
  };
});

addList.addEventListener('click', function () {
  let newSlide = { list: '<li>a</li><li>b</li><li>c</li>' };
  presentationArray[0].data.push(newSlide);
  savePresentation();
  loadPresentationToView(presentationArray[0]);
  activeSlide(presentationArray[0].data.length);
});

deleteUserBtn.addEventListener('click', function () {
  const insideAlertDiv = document.querySelector('.alert');
  const inputPassword = document.createElement('input');
  inputPassword.setAttribute('type', 'password');
  alertDiv.style.display = 'block';
  alertDivButton.textContent = 'CONFIRM';
  alertDivText.textContent = 'Please, enter your password to confirm.';

  insideAlertDiv.insertBefore(inputPassword, alertDivButton);

  alertDivButton.onclick = () => {
    const inputArray = [accessData.id, accessData.accesstoken];
    const body = {
      id: inputArray[0],
      password: inputPassword.value,
      accesstoken: inputArray[1],
    };

    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };

    fetch('/deleteUser', config)
      .then((resp) => {
        if (resp.status !== 200) {
          throw new Error('Incorrect access credentials.');
        }
        return resp.json();
      })
      .then((resp) => {
        location.href = '/';
        return resp;
      })
      .catch((err) => {
        alertDivText.textContent = '';
        alertDivText.textContent = err.message;
        alertDiv.style.display = 'block';
        return err;
      });
  };
});

updatePasswordBtn.addEventListener('click', function () {
  const insideAlertDiv = document.querySelector('.alert');
  const oldPassword = document.createElement('input');
  const newPassword = document.createElement('input');
  oldPassword.setAttribute('type', 'password');
  oldPassword.setAttribute('placeholder', 'Enter OLD password');
  newPassword.setAttribute('type', 'password');
  newPassword.setAttribute('placeholder', 'Enter NEW password');
  alertDiv.style.display = 'block';
  alertDivButton.textContent = 'CONFIRM';
  alertDivText.textContent =
    'Please enter your new and old password to confirm.';

  insideAlertDiv.insertBefore(oldPassword, alertDivButton);
  insideAlertDiv.insertBefore(newPassword, alertDivButton);

  alertDivButton.onclick = () => {
    const inputArray = [accessData.id, accessData.accesstoken];
    const body = {
      id: inputArray[0],
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    };
    console.log(body);
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };

    fetch('/updateUser', config)
      .then((resp) => {
        if (resp.status !== 200) {
          throw new Error(resp.statusText);
        }
        return resp.json();
      })
      .then((resp) => {
        location.href = '/';
        return resp;
      })
      .catch((err) => {
        alertDivText.textContent = err;
        alertDiv.style.display = 'block';
        return err;
      });
  };
});

createPresBtn.addEventListener('click', createPresentation);
deletePresBtn.addEventListener('click', deletePresentation);

presModeBtn.onclick = () => {
  editMenu.style.display = 'none';
  editBtn.style.display = 'block';
  slideDiv.style.margin = '1% 6% auto';
  slideDiv.style.width = '88%';
  slideDiv.style.height = '88%';
};

editBtn.onclick = () => {
  exitFullscreen();
};

logoutUser.onclick = () => (location.href = 'login.html');

window.addEventListener('keydown', (e) => {
  if (e.key == 'ArrowLeft') {
    navigate(-1);
  } else if (e.key == 'ArrowRight') {
    navigate(1);
  } else if (e.key == 'Escape') {
    if ((editMenu.style.display = 'none')) {
      exitFullscreen();
    }
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

function exitFullscreen() {
  editMenu.style.display = 'flex';
  editBtn.style.display = 'none';
  slideDiv.style.margin = 'auto 10% 4%';
  slideDiv.style.width = '80%';
  slideDiv.style.height = '80%';
}

function checkUser() {
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
      if (resp.status !== 200) {
        throw new Error('Incorrect access credentials. Try to log in again.');
      }
      return resp.json();
    })
    .then((resp) => {
      return resp;
    })
    .catch((err) => {
      alertDivText.textContent = '';
      alertDivText.textContent = err.message;
      alertDiv.style.display = 'block';
      return err;
    });
}

function createPresentation() {
  const inputArray = [
    accessData.id,
    accessData.accesstoken,
    defaultPresentation.title,
    defaultPresentation.data,
  ];
  const body = {
    id: inputArray[0],
    accesstoken: inputArray[1],
    title: inputArray[2],
    data: inputArray[3],
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
        throw new Error(
          'Could not create a presentation with current login credentials. Try to log in.'
        );
      }
      return resp.json();
    })
    .then((resp) => {
      loadPresentationObject();
      console.log('Presentation created');
      return resp;
    })
    .catch((err) => {
      alertDivText.textContent = '';
      alertDivText.textContent = err.message;
      alertDiv.style.display = 'block';
      return err;
    });
}

function deleteSlide() {
  if (showIndex != 0) {
    console.log(showIndex);

    presentationArray[0].data.splice(showIndex - 1, 1);
    loadPresentationToView(presentationArray[0]);
  }
}

function savePresentation() {
  const arrayOfAllTitles = document.querySelectorAll('.slide h6');
  const arrayOfAllLists = document.querySelectorAll('.slide ul');
  let slide = 0;

  arrayOfAllLists.forEach((ListFromSlide, index) => {
    for (let i = slide; i < presentationArray[0].data.length; i++) {
      if (presentationArray[0].data[i].list) {
        presentationArray[0].data[i].list = ListFromSlide.innerHTML;
        return (slide = i + 1);
      }
    }
  });

  slide = 0;

  arrayOfAllTitles.forEach((titleFromSlide, index) => {
    if (index < 1) {
      presentationArray[0].title = titleFromSlide.textContent;
      return;
    }
    for (let i = slide; i < presentationArray[0].data.length; i++) {
      if (presentationArray[0].data[i].text) {
        presentationArray[0].data[i].text = titleFromSlide.textContent;
        return (slide = i + 1);
      }
    }
  });

  displayTitle.textContent = presentationArray[0].title;
}

function savePresentationOnServer() {
  savePresentation();
  const inputArray = [
    accessData.id,
    accessData.accesstoken,
    presentationArray[0].title,
    presentationArray[0].data,
    shareStatus,
    theme,
    presentationArray[0].presentationid,
  ];
  const body = {
    id: inputArray[0],
    accesstoken: inputArray[1],
    title: inputArray[2],
    data: inputArray[3],
    share: inputArray[4],
    theme: inputArray[5],
    presentationid: inputArray[6],
  };
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  fetch('/update-presentation', config)
    .then((resp) => {
      if (resp.status !== 200) {
        console.log(resp);
        throw new Error('Could not save presentation.');
      }
      return resp.json();
    })
    .then((resp) => {
      console.log('Presentation save:', resp);
      presentationArray[0].published = resp.published;
      createPresList();
      return resp;
    })
    .catch((err) => {
      console.log('Could not save:', err);
      return err;
    });
}

function deletePresentation() {
  if (!presentationArray[0].presentationid) {
    console.log('Nothing to delete');
  } else {
    const inputArray = [
      accessData.id,
      accessData.accesstoken,
      presentationArray[0].presentationid,
    ];

    const body = {
      id: inputArray[0],
      accesstoken: inputArray[1],
      presentationid: inputArray[2],
    };

    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };

    fetch('/delete-presentation', config)
      .then((resp) => {
        if (resp.status !== 200) {
          throw new Error('Something went wrong.');
        }
        return resp.json();
      })
      .then((resp) => {
        loadPresentationObject();
        console.log('Presentation with id: ', resp.presentationid, ' deleted');

        return resp;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  }
}

function loadPresentationObject() {
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

  fetch('/load-presentations', config)
    .then((resp) => {
      if (resp.status !== 200) {
        console.log('Could not Load presentations');
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
}

function updateShareLink() {
  let shareLink = document.getElementById('shareLink');
  let shareUrl = null;
  let ref = null;

  if (!presentationArray[0].presentationid) {
    shareUrl = 'Could not share presentation';
    ref = '';
    shareStatus = false;
    shareBtn.innerHTML = `<img src="svg/lock.svg" title="Private" class="appIcon" />Share`;
    shareLink.style.display = 'block';
  } else if (shareStatus) {
    shareUrl = 'Presentation is "PRIVATE"';
    ref = '';
    shareStatus = false;
    shareBtn.innerHTML = `<img src="svg/lock.svg" title="Private" class="appIcon" />Share`;
    shareLink.style.display = 'none';
  } else if (!shareStatus) {
    shareUrl = `View public presentations`;
    ref = `viewMode.html`;
    shareStatus = true;
    shareBtn.innerHTML = `<img src="svg/unlock.svg" title="Public" class="appIcon" />Unshare`;
    shareLink.style.display = 'block';
  }
  shareLink.innerHTML = shareUrl;
  shareLink.href = ref;
  savePresentationOnServer();
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
    console.log(presentationObject.arr.length, 'in line207');
  } else if (presentationObject.arr.length > 0) {
    presentationArray = [];
    for (let i = 0; i < presentationObject.arr.length; i++) {
      presentationArray.unshift(presentationObject.arr[i]);
    }
    loadPresentationToView(presentationArray[0]);
    createPresList();
  } else {
    console.log(presentationObject);
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
  loadShareStatus(currentPres.published);
  displayTitle.innerHTML = currentPres.title;
  slideDiv.className = currentPres.theme;
  if (!currentPres.theme) {
    slideDiv.className = 'slideShowbodyDefault';
  }
  createNavigationDots(currentPres.data.length);
  container.innerHTML = '';
  let titleDiv = document.createElement('div');
  titleDiv.innerHTML = `<h6 contenteditable = true>${currentPres.title}</h6>`;
  titleDiv.classList.add('slide');
  container.appendChild(titleDiv);
  for (let slide of currentPres.data) {
    let div = document.createElement('div');

    let html = '';
    let text = '';
    let img = '';
    let list = '';

    if (slide.text) {
      text = '<h6 contenteditable=true >' + slide.text + '</h6>';
    }
    if (slide.img) {
      img = '<img src=' + slide.img + ' >';
    }
    if (slide.list) {
      let innerOl = slide.list;
      list = '<ul contenteditable=true >' + innerOl + '</ul>';
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

function loadShareStatus(published) {
  let shareLink = document.getElementById('shareLink');
  let shareUrl = null;
  let ref = null;
  if (published == 'PRIVATE') {
    shareUrl = 'Presentation is "PRIVATE"';
    ref = '';
    shareStatus = false;
    shareBtn.innerHTML = `<img src="svg/lock.svg" title="Private" class="appIcon" />Share`;
  } else if (published == 'PUBLIC') {
    shareUrl = `View other public presentations`;
    ref = `viewMode.html`;
    shareStatus = true;
    shareBtn.innerHTML = `<img src="svg/unlock.svg" title="Private" class="appIcon" />Unshare`;
  }
  shareLink.innerHTML = shareUrl;
  shareLink.href = ref;
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

function imgFileHandler(e) {
  let addImg = e.target.files[0];
  let reader = new FileReader();
  reader.onload = function (e) {
    let image = document.createElement('img');
    image.src = e.target.result;
    userInputImgURL = e.target.result;
  };

  reader.readAsDataURL(addImg);
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
      showIndex = 0;
    });

    presList.appendChild(p);
  }
}
