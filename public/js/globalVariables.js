const shareBtn = document.getElementById('shareBtn');
let shareStatus = false;

const container = document.getElementById('container');
const addTxt = document.getElementById('addTxt');
const addImg = document.getElementById('addImg');
const displayImg = document.getElementById('displayImg');
const addList = document.getElementById('addList');
const createPresBtn = document.getElementById('createPres');
const savePresBtn = document.getElementById('savePres');
const deletePresBtn = document.querySelector('#deleteBtn');
const slideDiv = document.querySelector('#slideDiv');

const theme = slideDiv.className;
const themeOptions = document.querySelectorAll('.themeOption');

const presList = document.querySelector('#presList');
const editMenu = document.querySelector('.editMenu');
const presModeBtn = document.querySelector('#presentMode');
const displayTitle = document.querySelector('#presTitleDisplay');
const editBtn = document.querySelector('.editIcon');
const logoutUser = document.querySelector('#logoutUser');

const updatePasswordBtn = document.querySelector('#updatePassword');
const deleteUserBtn = document.querySelector('#deleteUser');
const deleteSlideBtn = document.querySelector('#deleteSlide');
const alertDiv = document.querySelector('.disableTotalScreen');
const alertDivButton = document.querySelector('.alertButton');
const alertDivText = document.querySelector('.alertText');
const xIcon = document.querySelector('#xIcon');

let disableDiv = document.querySelector('.containerChooseImg');
let imgoptions = document.querySelectorAll('.imgOpt');
let addImgBtn = document.querySelector('#addImgOk');
let showIndex = 0;
let userInputImgURL;

let accessData = localStorage.getItem('accessData')
  ? JSON.parse(localStorage.getItem('accessData'))
  : false;

let presentationObject = localStorage.getItem('presentations')
  ? JSON.parse(localStorage.getItem('presentations'))
  : false;

let presentationArray = [];

let defaultPresentation = {
  title: 'NewTitle',
  data: [{ text: 'Text 1' }],
  theme: 'Minimalist',
};
