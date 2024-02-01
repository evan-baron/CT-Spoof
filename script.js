const radio = document.getElementsByClassName('radio-button');
const prompts = document.getElementsByClassName('prompt-radio-container');
const assessee = document.getElementById('assessee-in');
const assessor = document.getElementById('assessor-in');
const feedbackArr = [];
const gradient = [
    [
        0,
        [255, 64, 76]
    ],
    [
        20,
        [255, 64, 76]
    ],
    [
        40,
        [255, 201, 0]
    ],
    [
        60,
        [90, 215, 0]
    ],
    [
        100,
        [0, 230, 233]
    ]
];
const graphColor = [];
const scoreResults = [
    {
        //averagescore between 1 and 1.5
        scorefloor: 1,
        scoreceiling: 1.5,
        evaluation: 'Very Poor Score',
        nextstep:
        [
            'Why did we even hire you?', 'You call yourself a salesrep?', 'Needs 1-on-1 with HR', 'We\'ll expect your resignation by EOD today', 'My disappointment is immeasurable and my day is ruined. Thanks'
        ]
    },
    {
        //averagescore between 1.5 and 2
        scorefloor: 1.5,
        scoreceiling: 2,
        evaluation: 'Well Below Average Score',
        nextstep:
        [
            'Needs 1-on-1 with HR', 'The only thing that could have made the call worse is if your camera was on', 'You\'re being put on a performance plan', 'Expect a call from Micah about this', 'You\'re being sent back to training', 'You did bad and you should feel bad'
        ]
    },
    {
        //averagescore between 2 and 2.5
        scorefloor: 2,
        scoreceiling: 2.5,
        evaluation: 'Below Average Score',
        nextstep:
        [
            'Needs 1-on-1 with HR', 'Lots to improve on if you want a future at this company', 'You\'re being sent back to training', 'Do better', 'You embarass me, you embarass yourself', 'You owe it to your team to do better', 'You performed as expected, pathetically'
        ]
    },
    {
        //averagescore between 2.5 and 3
        scorefloor: 2.5,
        scoreceiling: 3,
        evaluation: 'Average Score',
        nextstep:
        [
            'You did your job... What do you want, a reward? Get back to work', 'Going to need to improve on some things if you want to be a top performer', 'We don\'t pay you to be average, do better'
        ]
    }, 
    {
        //averagescore exactly 3
        scorefloor: 3,
        scoreceiling: 3.05,
        evaluation: 'Good Score',
        nextstep:
        [
            'You did your job... What do you want, a reward? Get back to work', 'This is what we pay you to do, you\'re not special', 'We might have missed some things, we\'ll have to review the scores again...', 'Don\'t let the score get to your head, you still have a lot to improve on'
        ]
    },
    {
        //averagescore between 3 and 4
        scorefloor: 3.05,
        scoreceiling: 4,
        evaluation: 'Suspiciously Good Score',
        nextstep:
        [
            'Clearly we missed some things, we\'re going to have to review the scores again...', 'Something is off, no one gets above a 3', 'Only Toren gets scores higher than 3 and you\'re not Toren, this is a fluke', 'If you want a future at this company, you\'re going to have to stop kissing ass'
        ]
    },
    {
        //averagescore above 4
        scorefloor: 4,
        scoreceiling: 5.05,
        evaluation: 'Impossibly Good Score',
        nextstep:
        [
            'It is <i>evident<i> that you have cheated to get this score, 1-on-1 with HR immediately'
        ]
    }
];
const missed = [];
const meets = [];
const exceeds = [];
let averageScore = 0;
let averageScorePercent = 0;
let ratio = 0;

Object.values(radio).forEach(item => item.addEventListener('click', highlight));

Object.values(prompts).forEach(item => item.children[0].addEventListener('blur', clearValue));

// no-color highlight:
// function highlight () {

//     //looping through the five possible radio buttons
//     for (let i=1; i<6; i++) {

//         //checking which of the five radio buttons is clicked
//         if (this.classList.contains("rb-"+i)) {

//             const siblings = Object.values(this.parentElement.children);
//             const rowInputText = Object.values(this.parentElement.parentElement.children)[0].value;

//             //checking if active and input has text in it
//             if (!this.classList.contains("active") && rowInputText != '') {

//                 //removing active status from bubbles
//                 for (let j=1; j<6; j++) {
//                     siblings.forEach(item => (item.classList.remove("active")));
//                     siblings.forEach(item => (item.setAttribute('radio', false)));
//                 }

//                 //adding active status to bubble
//                 this.classList.add("active")
//                 this.setAttribute('radio', true);
//                 this.parentElement.setAttribute('radio', true);

//             }
//         }
//     }
// };

//UNCOMMENT THIS IF YOU WANT COLORFUL ACTIVE BUBBLES
function highlight () {

    //looping through the five possible radio buttons
    for (let i=1; i<6; i++) {

        //checking which of the five radio buttons is clicked
        if (this.classList.contains("rb-"+i)) {

            const siblings = Object.values(this.parentElement.children);
            const rowInputText = Object.values(this.parentElement.parentElement.children)[0].value;

            //checking if active and input has text in it
            if (!this.classList.contains("rb-"+i+"-active") && rowInputText != '') {

                //removing active status from bubbles
                for (let j=1; j<6; j++) {
                    siblings.forEach(item => (item.classList.remove("rb-"+j+"-active")));
                    siblings.forEach(item => (item.setAttribute('radio', false)));
                }

                //adding active status to bubble
                this.classList.add("rb-"+i+"-active")
                this.setAttribute('radio', true);
                this.parentElement.setAttribute('radio', true);

            }
        }
    }
};

function clearValue () {
    for (let i=0; i<prompts.length; i++) {
        if (prompts[i].children[0].value == '') {
            for (let j=0; j<5; j++) {
                prompts[i].children[1].children[j].classList.remove("rb-"+(j+1)+"-active");
                prompts[i].children[1].children[j].setAttribute('radio', false);
                prompts[i].children[1].setAttribute('radio', false);
            }
        }
    }
};

function generateReport() {

    //clears feedback array to start fresh
    feedbackArr.splice(0, feedbackArr.length);

    //clears averageScore
    averageScore = 0;

    //clears graphColor
    graphColor.splice(0, graphColor.length);

    //clears ratio
    ratio = 0;

    //clears missed meets exceeds
    missed.splice(0, missed.length);
    meets.splice(0, meets.length);
    exceeds.splice(0, exceeds.length);

    //removes score data
    const parentMissed = document.getElementById('missed-section');
    while (parentMissed.firstChild) {
        parentMissed.firstChild.remove();
    }
    parentMissed.innerHTML = 'Missed & Below Expectations';

    const parentMeets = document.getElementById('meets-section');
    while (parentMeets.firstChild) {
        parentMeets.firstChild.remove();
    }
    parentMeets.innerHTML = 'Meets Expectations';

    const parentExceeds = document.getElementById('exceeds-section');
    while (parentExceeds.firstChild) {
        parentExceeds.firstChild.remove();
    }
    parentExceeds.innerHTML = 'Exceeds & Far Exceeds Expectations';

    //tests if assessee and assessor filled out
    if (assessor.value == '') {
        if (assessee.value == '') {
            alert("You must input an Assessee!");
            assessee.focus();
            return
        } else {
            alert("You must input an Assessor!");
            assessor.focus();
            return
        }
    } else {
        if (assessee.value == '') {
            alert("You must input an Assessee!");
            assessee.focus();
            return
        } 
    }

    //validating if no feedback inputs filled out but assessee and assessor are filled out
    const tempArr = [];
    for (let i=1; i<11; i++) {
        if (!document.getElementById('input-prompt'+i).value == '') {
            tempArr.push(document.getElementById('input-prompt'+i).value)
        }
        console.log(tempArr)
    }
    if (!assessor.value == '' && !assessee.value == '' && tempArr.length == '') {
        alert("You must fill out at least one piece of feedback!")
        document.getElementById('input-prompt1').focus()
        return
    }

    //push feedback into array
    for (let i=1; i<11; i++) {
        if (document.getElementById('input-prompt'+i).value != '' && hasRating(document.getElementById('input-prompt'+i)) == true) {
            let feedbackData = {
                    feedback: document.getElementById('input-prompt'+i).value,
                    rating: getRating(document.getElementById('input-prompt'+i))
                }
            feedbackArr.push(feedbackData);
        } else if (document.getElementById('input-prompt'+i).value != '' && hasRating(document.getElementById('input-prompt'+i)) == false) {
            alert('Your feedback is missing a rating!');
            feedbackArr.splice(0, feedbackArr.length);
            document.getElementById('input-prompt'+i).focus();
            break;
        }
    }

    //test if feedback
    if (!feedbackArr.length == '') {
        document.getElementById('input-form').style.display = 'none'
        document.getElementById('report-card').style.display = 'flex'
        document.getElementById('button-container').style.display = 'flex'
    }

    //setting assessee name
    document.getElementById('assessee-out').innerHTML = assessee.value;

    //setting assessor name
    document.getElementById('assessor-out').innerHTML = 'Assessed by '+assessor.value;

    //setting the score
    for (let i=0; i<feedbackArr.length; i++) {
        averageScore += ((feedbackArr[i].rating)/feedbackArr.length);
    }
    averageScore = Math.round(10*averageScore)/10;
    averageScorePercent = averageScore/5;
    document.getElementById('average-score').innerHTML = averageScore;

    //move graph bar mask
    document.getElementById('graph-bar-2').style.transform = `rotate(${180+(360*averageScore/5)}deg)`
    if (averageScore == 5) {
        document.getElementById('graph-bar-1').style.display = 'none';
        document.getElementById('graph-bar-2').style.display = 'none';
    }

    //color selector
    for (let i=1; i<gradient.length; i++) {
        if (gradient[i-1][0] < averageScorePercent*100 && averageScorePercent*100 <= gradient[i][0]) {
            ratio = ((averageScorePercent*100) - gradient[i-1][0])/(gradient[i][0]-gradient[i-1][0]);
            let r = Math.floor(ratio*(gradient[i][1][0]-gradient[i-1][1][0]) + gradient[i-1][1][0]);
            let g = Math.floor(ratio*(gradient[i][1][1]-gradient[i-1][1][1]) + gradient[i-1][1][1]);
            let b = Math.floor(ratio*(gradient[i][1][2]-gradient[i-1][1][2]) + gradient[i-1][1][2]);
            graphColor.push(r);
            graphColor.push(g);
            graphColor.push(b);
        }
    }

    //set colors
    document.getElementById('average-score').style.color = 'rgb('+graphColor.join(", ")+')'

    //setting pie graph ratios
    document.getElementById('graph').style.background = `conic-gradient(rgb(${graphColor.join(', ')}) ${100*averageScore/5}%, rgba(68, 75, 90, 100) 0)`;

    //setting the results and next steps
    for (let i=0; i<scoreResults.length; i++) {
        if (scoreResults[i].scorefloor <= averageScore && averageScore < scoreResults[i].scoreceiling) {
            document.getElementById('result').innerHTML = scoreResults[i].evaluation;
            document.getElementById('next-step').innerHTML = scoreResults[i].nextstep[Math.floor(Math.random()*scoreResults[i].nextstep.length)];
        }
    }

    //categorizes feedback
    for (let i=0; i<feedbackArr.length; i++) {
        if (feedbackArr[i].rating == '1' || feedbackArr[i].rating == '2') {
            missed.push(feedbackArr[i]);
        } else if (feedbackArr[i].rating == '3') {
            meets.push(feedbackArr[i]);
        } else {
            exceeds.push(feedbackArr[i]);
        }
    }

    //sorts feedback arrays
    missed.sort(function(a, b) {
        return parseInt(a.rating) - parseInt(b.rating)
    })

    meets.sort(function(a, b) {
        return parseInt(a.rating) - parseInt(b.rating)
    })

    exceeds.sort(function(a, b) {
        return parseInt(a.rating) - parseInt(b.rating)
    })

    //creates score section data
    //missed data
    for (let i=0; i<missed.length; i++) {
        const lineDiv = document.createElement('div')
        lineDiv.setAttribute('class', 'line-container')
        lineDiv.setAttribute('id', 'missed-line'+i)
        document.getElementById('missed-section').appendChild(lineDiv)
        
        const circleDiv = document.createElement('div')
        circleDiv.setAttribute('class','score-circle circle'+missed[i].rating)
        document.getElementById('missed-line'+i).appendChild(circleDiv)

        const promptDiv = document.createElement('div')
        promptDiv.setAttribute('class', 'prompt')
        document.getElementById('missed-line'+i).appendChild(promptDiv)
        
        document.getElementById('missed-line'+i).children[0].innerHTML = missed[i].rating
        document.getElementById('missed-line'+i).children[1].innerHTML = missed[i].feedback
    }

    //meets data
    for (let i=0; i<meets.length; i++) {
        const lineDiv = document.createElement('div')
        lineDiv.setAttribute('class', 'line-container')
        lineDiv.setAttribute('id', 'meets-line'+i)
        document.getElementById('meets-section').appendChild(lineDiv)
        
        const circleDiv = document.createElement('div')
        circleDiv.setAttribute('class','score-circle circle'+meets[i].rating)
        document.getElementById('meets-line'+i).appendChild(circleDiv)

        const promptDiv = document.createElement('div')
        promptDiv.setAttribute('class', 'prompt')
        document.getElementById('meets-line'+i).appendChild(promptDiv)
        
        document.getElementById('meets-line'+i).children[0].innerHTML = meets[i].rating
        document.getElementById('meets-line'+i).children[1].innerHTML = meets[i].feedback
    }

    //exceeds data
    for (let i=0; i<exceeds.length; i++) {
        const lineDiv = document.createElement('div')
        lineDiv.setAttribute('class', 'line-container')
        lineDiv.setAttribute('id', 'exceeds-line'+i)
        document.getElementById('exceeds-section').appendChild(lineDiv)
        
        const circleDiv = document.createElement('div')
        circleDiv.setAttribute('class','score-circle circle'+exceeds[i].rating)
        document.getElementById('exceeds-line'+i).appendChild(circleDiv)

        const promptDiv = document.createElement('div')
        promptDiv.setAttribute('class', 'prompt')
        document.getElementById('exceeds-line'+i).appendChild(promptDiv)
        
        document.getElementById('exceeds-line'+i).children[0].innerHTML = exceeds[i].rating
        document.getElementById('exceeds-line'+i).children[1].innerHTML = exceeds[i].feedback
    }

    //shows score sections
    if (missed.length == '') {
        document.getElementById('missed-section').style.display = 'none';
    } else {
        document.getElementById('missed-section').style.display = 'block';
    }

    if (meets.length == '') {
        document.getElementById('meets-section').style.display = 'none';
    } else {
        document.getElementById('meets-section').style.display = 'block';
    }
    
    if (exceeds.length == '') {
        document.getElementById('exceeds-section').style.display = 'none';
    } else {
        document.getElementById('exceeds-section').style.display = 'block';
    }

    window.scrollTo(0, 0);

};

//function to check which row(s) has a rating 
function hasRating(param) {
    if (param.parentElement.children[1].getAttribute('radio') == 'true') {
        return true;
    } else {
        return false;
    }
};

//finds the value of the active radio button
function getRating(param) {
    for (let i=0; i<5; i++) {
        if (param.parentElement.children[1].children[i].getAttribute('radio') == 'true') {
            return param.parentElement.children[1].children[i].getAttribute('value');
        }
    }
};

//go back
function goBack() {
    document.getElementById('input-form').style.display = 'flex'
    document.getElementById('report-card').style.display = 'none'
    document.getElementById('button-container').style.display = 'none'
}

function newReport() {
    location.reload();
}