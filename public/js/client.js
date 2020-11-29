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

savePresBtn.addEventListener('click', savePresentationOnServer);
shareBtn.addEventListener('click', updateShareLink);
deleteSlideBtn.addEventListener('click', deleteSlide);
createPresBtn.addEventListener('click', createPresentation);
deletePresBtn.addEventListener('click', deletePresentation);

addTxt.addEventListener('click', function () {
  let newSlide = { text: 'Click here to edit title' };
  presentationArray[0].data.push(newSlide);
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
