const express = require('express');
const app = express();
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
let currentQuestion = 0;

app.get('/', (req, res) => {
    currentQuestion = Number(req.query.questionId) ? Number(req.query.questionId) : currentQuestion;
    res.send(JSON.stringify(getQuestionsObject(currentQuestion)));
});

app.get('/restart', (req, res) => {
    currentQuestion = 0;
    res.redirect('/');
});

app.get('*', (req, res) => {
    res.redirect('/');
});

app.listen(3333, () => {
    console.log('Application listening on port 3333!');
});

function getQuestionsObject(index) {
    const question = data.questions.find((element) => {
        return element.number === index;
    });
    const nextQuestion = [];
    if (question.responses.length) {
        question.responses.forEach(element => {
            nextQuestion.push({
                text: element.text,
                nextQuestionId: element.nextQuestionNumber,
                nextQuestionUrl: `<a href=/?questionId=${element.nextQuestionNumber}>${element.text}</a><br>`
            });
        });
    } else {
        nextQuestion.push(`<a href=/restart>Restart</a><br>`);
    }
    return {
        index: question.index,
        text: question.text,
        nextQuestion: nextQuestion
    };
}



