let questionItem = document.querySelectorAll('.question-block');
let questionDisplay = document.querySelector('#question-display');
let scoreDisplay = document.querySelector('#score-display');
let answerForm = document.querySelector('#answer-form');
let userAnswer = document.querySelector('#user-answer');
let statusMessage = document.querySelector('#status-message');
let overlay = document.querySelector('#overlay');
let hintsDisplay = document.querySelector('#hints-display');


overlay.style.display = 'none';
overlay.addEventListener('click', () => {
    statusMessage.innerText = 'Try answering the question first!';
})


let readJeopardyData = async () => {
    
    let rawJeopardyData = await fetch('/jeopardy.json');
    let data = await rawJeopardyData.json();
    
    let groupedData = _.groupBy(data, 'value');

    let answer = "";
    let points = "";
    let totalScore = 0;
    scoreDisplay.innerText = totalScore;

    // Assign random question and aswer to each button based on value
    questionItem.forEach(item => {
        item.addEventListener('click', () => {

            overlay.style.display = 'block';

            statusMessage.innerText = "";
            
            item.classList.add('selected');
            
            // console.log(`${groupedData[item.innerText].length} Questions Valued at ${item.innerText}`);
            
            randomQuestionObj = groupedData[item.innerText][Math.floor(Math.random() * groupedData[item.innerText].length)];
            
            question = randomQuestionObj['question'];
            answer = randomQuestionObj['answer'];
            
            // // for debugging
            // console.log('Question is: ' + question);
            // console.log('Answer is: ' + answer);
            
            questionDisplay.innerHTML = question;

            // get points, convert to number
            points = "";

            for (let i = 1; i < item.innerText.length; i++) {
                points += item.innerText[i];
            }
            
            // hints
            hint = '';
        
            for (i = 0; i < answer.length; i++){
                
                if (answer[i] === ' ') {
                    hint += ' ';

                } else if (i % 2 === 0){
                    hint += answer[i];
        
                } else {
                    hint += '<span style="color:red;">*</span>';
                }
            }
        })
    })

    
    // Check for valid answer
    answerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // console.log('You answered: ' + userAnswer.value);
        
        if (userAnswer.value === '' && answer !== ""){
            // console.log('Answer Field is Empty!');
            statusMessage.innerText = 'Please enter your answer!';
            
        } else if (answer !== "" && userAnswer.value.toUpperCase() === answer.toUpperCase()) {
            overlay.style.display = 'none';

            statusMessage.innerText = "";
            // console.log('Right Answer! You get: $' + points);
            questionDisplay.innerHTML = 'Correct!';
            question = "";
            answer = "";
            userAnswer.value = "";
            extra.innerHTML = "";
            
            totalScore += Number(points);
            scoreDisplay.innerText = totalScore;
            
        } else if(userAnswer.value.toUpperCase() === 'YO NO SE') {
            extra.innerHTML = 'Hint: ' + hint;
            userAnswer.value = "";

            totalScore -= 50;
            scoreDisplay.innerText = totalScore;

        } else if (answer === "") {
            statusMessage.innerText = 'Select a question first!';
            userAnswer.value = "";

        } else {
            overlay.style.display = 'none';

            questionDisplay.innerHTML = `Wrong! The answer is: ${answer}`;
            question = "";
            answer = "";
            userAnswer.value = "";
            statusMessage.innerText = "";
            extra.innerHTML = "";

            totalScore -= Number(points);
            scoreDisplay.innerText = totalScore;
        }
    })
}

readJeopardyData();