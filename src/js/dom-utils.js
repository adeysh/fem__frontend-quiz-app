import { questionTemplate, quiz, quizState, quizCompleteTemplate, subjectHeader, quizzesObj, setUserChoiceLabel, getUserChoiceLabel, uiState, jsConfetti } from "./constants";

let questionCount = quizState.questionCount;
let currentScore = quizState.currentScore;

export const loadNextPage = function (e) {
    console.log("loadnextpage");

    if (questionCount !== 10) {
        const subject = quizzesObj[subjectHeader.dataset.subject];

        const clone = questionTemplate.content.cloneNode(true);
        const choicesForm = clone.getElementById("choices-form");

        choicesForm.addEventListener("click", checkAnswer, true);

        const choiceInputs = clone.querySelectorAll('input[name="choices"]');
        const quizError = document.getElementById("quiz-error");
        console.log(choiceInputs, quizError);
        for (const input of choiceInputs) {
            input.addEventListener("change", () => {
                console.log(input, "change");
                // Fade out the error
                quizError.classList.add("hide");
            });
        }

        setUserChoiceLabel(undefined);

        const currentQuestion = clone.getElementById("current-question");
        changeTextContent(currentQuestion, `${questionCount + 1}`);

        const maxQuestions = clone.getElementById("max-questions");
        changeTextContent(maxQuestions, `${subject.questions.length}`);

        const currentScoreEl = clone.getElementById("current-score");
        changeTextContent(currentScoreEl, currentScore)

        const question = clone.getElementById("question");
        changeTextContent(question, subject.questions[questionCount].question);

        const progress = clone.getElementById("progress");
        setElementAttribute(progress, "value", questionCount + 1);

        const options = clone.querySelectorAll(".quiz__choice-label");

        options.forEach((option, index) => {
            const subjectOption = subject.questions[questionCount].options[index];
            option.dataset.choice = subjectOption;

            const optionText = option.querySelector(".quiz__choice-option-text");
            changeTextContent(optionText, subjectOption);
        });

        quiz.replaceChildren(clone);
    } else {
        quizCompleted(e);
    }
};

export const checkAnswer = function (e) {
    e.preventDefault();

    const choiceLabel = e.target.closest("label");
    const choiceTagName = e.target.tagName;

    if (choiceLabel) {
        const choiceInput = choiceLabel.querySelector("input[type='radio']");
        choiceInput.checked = true;
        setUserChoiceLabel(choiceLabel);
    } else if (choiceTagName === "BUTTON" && getUserChoiceLabel() == undefined) {
        console.log(getUserChoiceLabel());
        e.preventDefault();

        const quizError = document.getElementById("quiz-error");
        quizError.classList.remove("hide");
    } else if (choiceTagName === "BUTTON") {
        e.preventDefault();
        const quizError = document.getElementById("quiz-error");

        quizError.classList.add("hide");

        const answer = quizzesObj[subjectHeader.dataset.subject].questions[questionCount].answer;

        const answerLabel = document.querySelector(`label[data-choice="${answer}"]`);
        const userChoice = getUserChoiceLabel().dataset.choice;
        const userChoiceLabel = getUserChoiceLabel();
        // console.log(userChoiceLabel);

        if (answer === userChoice) {
            console.log("correct");


            const img = document.createElement("img");
            setElementAttribute(img, "src", "/assets/images/icon-correct.svg");
            setElementAttribute(img, "alt", "checkmark icon");
            getUserChoiceLabel().appendChild(img);
            userChoiceLabel.classList.add("correct");
            // console.log(userChoiceLabel);
            const choiceLabelEls = userChoiceLabel.parentElement.children;

            for (let choiceEl of choiceLabelEls) {
                choiceEl.disabled = true;
                choiceEl.style.pointerEvents = "none";
            }

            const button = e.target.closest("button");
            changeTextContent(button, "Next Question");
            button.disabled = false;
            button.style.pointerEvents = "auto";
            button.focus();
            // console.log(e.currentTarget);
            e.currentTarget.removeEventListener("click", checkAnswer, true);

            button.addEventListener("mouseup", loadNextPage);

            currentScore += 1;

            const currentScoreEl = document.getElementById("current-score");
            console.log(currentScoreEl, currentScore);
            changeTextContent(currentScoreEl, currentScore);
        } else if (answer !== userChoice) {
            console.log("incorrect");
            const imgIncorrect = document.createElement("img");
            setElementAttribute(imgIncorrect, "src", "/assets/images/icon-incorrect.svg");
            setElementAttribute(imgIncorrect, "alt", "wrong icon");
            userChoiceLabel.appendChild(imgIncorrect);

            const imgCorrect = document.createElement("img");
            setElementAttribute(imgCorrect, "src", "/assets/images/icon-correct.svg");
            setElementAttribute(imgCorrect, "alt", "checkmark icon");
            answerLabel.appendChild(imgCorrect);


            userChoiceLabel.classList.add("incorrect");

            const choiceLabelEls = userChoiceLabel.parentElement.children;

            for (let choiceEl of choiceLabelEls) {
                choiceEl.disabled = true;
                choiceEl.style.pointerEvents = "none";
            };


            changeTextContent(e.target, "Next Question");


            const button = e.target.closest("button");
            changeTextContent(button, "Next Question");
            button.disabled = false;
            button.style.pointerEvents = "auto";
            button.focus();
            e.currentTarget.removeEventListener("click", checkAnswer, true);


            button.addEventListener("mouseup", loadNextPage);
        }

        questionCount += 1;
    }
};

const playAgain = function (e) {
    console.log("play again");
    console.log(uiState.currentPage);
    quiz.replaceChildren(...uiState.currentPage);
    quiz.classList.replace("quiz--complete-template-layout", "quiz--intro-layout")

    subjectHeader.classList.add("hide");

    currentScore = 0;
    questionCount = 0;
};

export const quizCompleted = function (e) {
    console.log("quiz complete");
    subjectHeader.classList.remove("hide");
    const clone = quizCompleteTemplate.content.cloneNode(true);

    const messageEl = clone.getElementById("message");
    let cheerWords = "";

    if (currentScore === 10) {
        cheerWords = "Perfect";

        jsConfetti.addConfetti({
            confettiRadius: 6,
            confettiNumber: 200,
        });

    } else if (currentScore < 10 && currentScore >= 8) {
        cheerWords = "Great";
    } else if (currentScore < 8 && currentScore >= 5) {
        cheerWords = "Good";
    } else {
        cheerWords = "Nice Try";
    }

    let message = `${cheerWords}! You scored...`;
    changeTextContent(messageEl, message);

    const finalScoreContainer = clone.getElementById("final-score-container");

    const subjectHeaderclone = subjectHeader.cloneNode(true);
    finalScoreContainer.prepend(subjectHeaderclone);

    const finalScore = clone.getElementById("final-score");
    changeTextContent(finalScore, `${currentScore}`);

    const maxFinalScore = clone.getElementById("max-final-score");
    changeTextContent(maxFinalScore, quizzesObj[subjectHeader.dataset.subject].questions.length);

    const playAgainBtn = clone.getElementById("play-again");
    playAgainBtn.addEventListener("click", playAgain);

    quiz.classList.replace("quiz--question-template-layout", "quiz--complete-template-layout");

    quiz.replaceChildren(clone);
};

export const changeTextContent = (element, value) => {
    element.textContent = value;
};

export function setElementAttribute(element, attrName, attrValue) {
    element.setAttribute(attrName, attrValue);
}
