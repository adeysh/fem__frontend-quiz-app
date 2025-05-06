import { questionTemplate, quiz, quizCompleteTemplate, subjectHeader, quizzesObj, setUserChoiceLabel, getUserChoiceLabel, uiState, jsConfetti, getQuestionCount, setQuestionCount, incrementQuestionCount, getCurrentScore, setCurrentScore, incrementCurrentScore } from "./constants";

export const loadNextPage = function (e) {
    console.log("loadnextpage");

    if (getQuestionCount() !== 10) {
        const subject = quizzesObj[subjectHeader.dataset.subject];

        const clone = questionTemplate.content.cloneNode(true);
        const choicesForm = clone.getElementById("choices-form");

        choicesForm.addEventListener("click", checkAnswer, true);
        choicesForm.addEventListener("keyup", keyboardClick, true);

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

        const answer = quizzesObj[subjectHeader.dataset.subject].questions[getQuestionCount()].answer;

        const answerLabel = document.querySelector(`label[data-choice="${answer}"]`);
        const userChoice = getUserChoiceLabel().dataset.choice;
        const userChoiceLabel = getUserChoiceLabel();
        // console.log(userChoiceLabel);

        if (answer === userChoice) {
            console.log("correct");

            appendIcon(getUserChoiceLabel(), "/assets/images/icon-correct.svg", "checkmark icon");

            userChoiceLabel.classList.add("correct");
            disableChoices(userChoiceLabel.parentElement);

            const button = e.target.closest("button");
            changeTextContent(button, "Next Question");
            button.disabled = false;
            button.style.pointerEvents = "auto";
            button.focus();
            // console.log(e.currentTarget);
            e.currentTarget.removeEventListener("click", checkAnswer, true);
            e.currentTarget.removeEventListener("keyup", keyboardClick, true);

            setupNextButton(button);

            incrementCurrentScore();

            const currentScoreEl = document.getElementById("current-score");
            console.log(currentScoreEl, getCurrentScore());
            changeTextContent(currentScoreEl, getCurrentScore());
        } else if (answer !== userChoice) {
            console.log("incorrect");
            appendIcon(userChoiceLabel, "/assets/images/icon-incorrect.svg", "wrong icon");
            appendIcon(answerLabel, "/assets/images/icon-correct.svg", "checkmark icon");


            userChoiceLabel.classList.add("incorrect");

            disableChoices(userChoiceLabel.parentElement);


            changeTextContent(e.target, "Next Question");


            const button = e.target.closest("button");
            changeTextContent(button, "Next Question");
            button.disabled = false;
            button.style.pointerEvents = "auto";
            button.focus();
            e.currentTarget.removeEventListener("click", checkAnswer, true);
            e.currentTarget.removeEventListener("keyup", keyboardClick, true);

            setupNextButton(button);
        }

        incrementQuestionCount();
    }
};

function setupNextButton(button) {
    button.addEventListener("mouseup", loadNextPage);

    button.addEventListener("keydown", (e) => {
        if (e.key == " " || e.key == "Enter") {
            loadNextPage(e);
        }
    });
}

function disableChoices(choiceContainer) {
    for (let choiceEl of choiceContainer.children) {
        choiceEl.disabled = true;
        choiceEl.style.pointerEvents = "none";
    };
}

function appendIcon(label, src, alt) {
    const img = document.createElement("img");
    setElementAttribute(img, "src", src);
    setElementAttribute(img, "alt", alt);
    label.appendChild(img);
}

const playAgain = function (e) {
    console.log("play again");
    console.log(uiState.currentPage);
    quiz.replaceChildren(...uiState.currentPage);
    quiz.classList.replace("quiz--complete-template-layout", "quiz--intro-layout")

    subjectHeader.classList.add("hide");

    setQuestionCount(0);
    setCurrentScore(0);
};

export const quizCompleted = function (e) {
    console.log("quiz complete");
    subjectHeader.classList.remove("hide");
    const clone = quizCompleteTemplate.content.cloneNode(true);

    const messageEl = clone.getElementById("message");
    let cheerWords = "";

    if (getCurrentScore() === 10) {
        cheerWords = "Perfect";

        jsConfetti.addConfetti({
            confettiRadius: 6,
            confettiNumber: 200,
        });

    } else if (getCurrentScore() < 10 && getCurrentScore() >= 8) {
        cheerWords = "Great";
    } else if (getCurrentScore() < 8 && getCurrentScore() >= 5) {
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
    changeTextContent(finalScore, `${getCurrentScore()}`);

    const maxFinalScore = clone.getElementById("max-final-score");
    changeTextContent(maxFinalScore, quizzesObj[subjectHeader.dataset.subject].questions.length);

    const playAgainBtn = clone.getElementById("play-again");
    playAgainBtn.addEventListener("click", playAgain);

    quiz.classList.replace("quiz--question-template-layout", "quiz--complete-template-layout");

    quiz.replaceChildren(clone);
};

export function keyboardClick(e) {
    if (e.key == " " || e.key == "Enter") {
        if (e.target.tagName == "LABEL") {
            const input = e.currentTarget.querySelector("input");
            input.checked = !input.checked;
            e.target.click();
        }
        if (e.target.tagName == "BUTTON") {
            e.target.click();
        }
    }
}

export const changeTextContent = (element, value) => {
    element.textContent = value;
};

export function setElementAttribute(element, attrName, attrValue) {
    element.setAttribute(attrName, attrValue);
}
