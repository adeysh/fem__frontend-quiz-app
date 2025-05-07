import { questionTemplate, quiz, quizCompleteTemplate, subjectHeader, quizzesObj, setUserChoiceLabel, getUserChoiceLabel, uiState, jsConfetti, getQuestionCount, setQuestionCount, incrementQuestionCount, getCurrentScore, setCurrentScore, incrementCurrentScore } from "./constants";

import { setupNextButton, disableChoices, appendIcon, keyboardClick, changeTextContent, setElementAttribute } from './utils';

export const loadNextPage = function (e) {

    if (getQuestionCount() !== 10) {
        const subject = quizzesObj[subjectHeader.dataset.subject];
        const clone = questionTemplate.content.cloneNode(true);
        const choicesForm = clone.getElementById("choices-form");

        choicesForm.addEventListener("click", checkAnswer, true);
        choicesForm.addEventListener("keyup", keyboardClick, true);

        const choiceInputs = clone.querySelectorAll('input[name="choices"]');
        const quizError = document.getElementById("quiz-error");

        for (const input of choiceInputs) {
            input.addEventListener("change", () => {
                // Fade out the error
                quizError.classList.add("hide");
            });
        }

        setUserChoiceLabel(undefined);

        const currentQuestion = clone.getElementById("current-question");
        changeTextContent(currentQuestion, `${getQuestionCount() + 1}`);

        const maxQuestions = clone.getElementById("max-questions");
        changeTextContent(maxQuestions, `${subject.questions.length}`);

        const currentScoreEl = clone.getElementById("current-score");
        changeTextContent(currentScoreEl, getCurrentScore())

        const question = clone.getElementById("question");
        changeTextContent(question, subject.questions[getQuestionCount()].question);

        const progress = clone.getElementById("progress");
        setElementAttribute(progress, "value", getQuestionCount() + 1);

        const options = clone.querySelectorAll(".quiz__choice-label");

        options.forEach((option, index) => {
            const subjectOption = subject.questions[getQuestionCount()].options[index];
            option.dataset.choice = subjectOption;

            const optionText = option.querySelector(".quiz__choice-option-text");
            changeTextContent(optionText, subjectOption);
        });

        quiz.replaceChildren(clone);
    } else {
        quizCompleted(e);
    }
};

const checkAnswer = function (e) {
    e.preventDefault();

    const choiceLabel = e.target.closest("label");
    const choiceTagName = e.target.tagName;

    if (choiceLabel) {
        const choiceInput = choiceLabel.querySelector("input[type='radio']");
        choiceInput.checked = true;
        setUserChoiceLabel(choiceLabel);
    } else if (choiceTagName === "BUTTON" && getUserChoiceLabel() == undefined) {
        e.preventDefault();

        const quizError = document.getElementById("quiz-error");
        quizError.classList.remove("hide");
    } else if (choiceTagName === "BUTTON") {
        e.preventDefault();

        const quizError = document.getElementById("quiz-error");
        quizError.classList.add("hide");

        const subject = subjectHeader.dataset.subject;
        const questionIndex = getQuestionCount();
        const currentQuestion = quizzesObj[subject].questions[questionIndex];
        const answer = currentQuestion.answer;

        const answerLabel = document.querySelector(`label[data-choice="${answer}"]`);
        const userChoiceLabel = getUserChoiceLabel();
        const userChoice = userChoiceLabel.dataset.choice;

        const button = e.target.closest("button");
        const isCorrect = (answer === userChoice);

        handleAnswerResult({ userChoiceLabel, answerLabel, isCorrect, button, e });

        incrementQuestionCount();
    }
};

function handleAnswerResult({ userChoiceLabel, answerLabel, isCorrect, button, e }) {
    if (isCorrect) {
        appendIcon(getUserChoiceLabel(), "/assets/images/icon-correct.svg", "checkmark icon");
        userChoiceLabel.classList.add("correct");
        incrementCurrentScore();

        const currentScoreEl = document.getElementById("current-score");
        changeTextContent(currentScoreEl, getCurrentScore());
    } else {
        appendIcon(userChoiceLabel, "/assets/images/icon-incorrect.svg", "wrong icon");
        appendIcon(answerLabel, "/assets/images/icon-correct.svg", "checkmark icon");
        userChoiceLabel.classList.add("incorrect");
    }

    disableChoices(userChoiceLabel.parentElement);

    changeTextContent(button, "Next Question");
    button.disabled = false;
    button.style.pointerEvents = "auto";
    button.focus();

    e.currentTarget.removeEventListener("click", checkAnswer, true);
    e.currentTarget.removeEventListener("keyup", keyboardClick, true);

    setupNextButton(button);
}

const playAgain = function (e) {
    quiz.replaceChildren(...uiState.currentPage);
    quiz.classList.replace("quiz--complete-template-layout", "quiz--intro-layout")

    subjectHeader.classList.add("hide");

    setQuestionCount(0);
    setCurrentScore(0);
};

const quizCompleted = function (e) {
    subjectHeader.classList.remove("hide");
    const clone = quizCompleteTemplate.content.cloneNode(true);

    const messageEl = clone.getElementById("message");
    const currentScore = getCurrentScore();
    let cheerWords = "";

    if (currentScore === 10) {
        cheerWords = "Perfect";

        jsConfetti.addConfetti({
            confettiRadius: 6,
            confettiNumber: 200,
        });

    } else if (currentScore >= 8) {
        cheerWords = "Great";
    } else if (currentScore >= 5) {
        cheerWords = "Good";
    } else {
        cheerWords = "Nice Try";
    }

    const message = `${cheerWords}! You scored...`;
    changeTextContent(messageEl, message);

    const finalScoreContainer = clone.getElementById("final-score-container");

    const subjectHeaderclone = subjectHeader.cloneNode(true);
    finalScoreContainer.prepend(subjectHeaderclone);

    const finalScore = clone.getElementById("final-score");
    changeTextContent(finalScore, `${getCurrentScore()}`);

    const maxFinalScore = clone.getElementById("max-final-score");
    changeTextContent(maxFinalScore, quizzesObj[subjectHeader.dataset.subject].questions.length);

    const playAgainBtn = clone.getElementById("play-again");
    playAgainBtn.addEventListener("click", playAgain);

    quiz.classList.replace("quiz--question-template-layout", "quiz--complete-template-layout");

    quiz.replaceChildren(clone);
};