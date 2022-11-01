// DOM variables 
const imageAndScoreContainer = document.querySelector('.imgAndSelectionDiv');
const imageAndScoreDiv = document.querySelector('.imgAndSelectionDiv');
const imageDiv = document.querySelector('.imgDiv');
const selectionButton = document.querySelector('button');
const dogSelectionDropDown = document.querySelector('.dogSelection');

//getting the breeds for the options
function getBreed() {
    fetch('https://dog.ceo/api/breeds/list/all')
    .then(res => res.json())
    .then(data => {
        const breedObject = data.message;
        const breedList = Object.keys(breedObject);

        breedList.forEach(breed => {
            const breedOption = document.createElement('option');
            const uppercaseBreed = breed.charAt(0).toUpperCase() + breed.slice(1);
            breedOption.appendChild(document.createTextNode(uppercaseBreed));
            dogSelectionDropDown.appendChild(breedOption);
        })
    })
}
getBreed();

// Make the breeds searchable using JQuery
$(function(){
    $(".dogSelection").select2();
}); 

// add the image to the DOM
var currentDogBreed = [
    {
        breed: 'test'
    }
];

function getImage() {
    fetch('https://dog.ceo/api/breeds/image/random')
    .then(res => res.json())
    .then(data => {
        imageDiv.innerHTML = `<img src="${data.message}"/>`
        const URL = data.message;
        console.log(URL);

        // getting the breed of the dog in the photo
        const dogBreedStart = URL.slice(30);
        const dogBreed = dogBreedStart.slice(0, dogBreedStart.indexOf('/'));

        let arrayToString = dogBreed.toString();
        const uppercaseBreed = arrayToString.charAt(0).toUpperCase() + arrayToString.slice(1);

        if (arrayToString.includes('-')) {
            var mainDogBreed = uppercaseBreed.slice(0, uppercaseBreed.indexOf('-'));
            currentDogBreed.shift();
            currentDogBreed.push(mainDogBreed);
        } else {
            currentDogBreed.shift();
            currentDogBreed.push(uppercaseBreed);
        }
    })
};
getImage();

// progress bar code
const progressBarLabelDiv = document.querySelector('.progressbarlabels');
for (let i = 0; i < 10; i++) {
    const progressBarLabel = document.createElement('p');
    const progressNumber = [i] * 10;
    const percentage = (progressNumber + '%'); 
    progressBarLabel.appendChild(document.createTextNode(percentage));
    progressBarLabelDiv.appendChild(progressBarLabel);
};

// Progress bar function
let progressBarNonPercentage = 0;
function progressBar() {
    const progressBar = document.querySelector('.progressbar');
    let progressBarDivision = progressBarNonPercentage * 10;
    let progressBarLength = progressBarDivision + '%';
    progressBar.style.width = progressBarLength;
};
progressBar();

// Click button to see if the breed is correct
let numberofTurns = 0;
const currentScore = document.querySelector('.currentScore');
let currentScoreNumber = 0;

currentScore.appendChild(document.createTextNode(currentScoreNumber));

selectionButton.addEventListener('click', checkBreed);
function checkBreed() {

    if (currentDogBreed.includes(dogSelectionDropDown.selectedOptions[0].value)) {
        numberofTurns++;

        currentScoreNumber++;
        currentScore.innerHTML = `${currentScoreNumber}`; 
        getImage();

        //progress bar
        progressBarNonPercentage++;
        progressBar();

    } else {
        numberofTurns++;
        getImage();

        //progress page
        progressBarNonPercentage++;
        progressBar();
    }

    if (numberofTurns === 10) {
        imageAndScoreContainer.style.display = 'block';
        selectionButton.remove();
        imageAndScoreDiv.innerHTML = `
        <div class="endGameDiv">
            <h3 class="EndHeader">Thanks for playing!</h3><br>
            <p class="EndScore">Your score is ${currentScoreNumber}/10</p>
            <button class="playAgainButton" onclick="window.location.reload()">Play Again!</button>
        </div>
        `;

        const playAgainButton = document.querySelector('.playAgainButton');
        playAgainButton.style.height = '3em';
    }
};
