import { questionTemplate, quiz, quizState } from "./constants";

export const loadNextPage = function (e) {
    e.preventDefault();

    if (quizState.questionCount !== 10) {
        const clone = questionTemplate.content.cloneNode(true);
        quiz.replaceChildren(clone);
    }
}