export const subjectsForm = document.getElementById("subjects-form");
export const subjectOptions = document.querySelectorAll(".quiz__subject-input");
export const subjectHeader = document.getElementById("subject-header");
export const quiz = document.getElementById("quiz");

export const questionTemplate = document.getElementById("question-template");

export const quizCompleteTemplate = document.getElementById("quiz-complete-template");

export const toggleSwitchLabel = document.getElementById("switch-label");

import JSConfetti from 'js-confetti';
export const jsConfetti = new JSConfetti();

export const uiState = {
    currentPage: [],
};

export const subjects = {
    html: "HTML",
    css: "CSS",
    js: "JavaScript",
    a11y: "Accessibility",
}

export const quizState = {
    questionCount: 0,
    currentScore: 0,
};

export const quizzesObj = {};

export let userChoiceLabel;

export function setUserChoiceLabel(label) {
    userChoiceLabel = label;
}

export function getUserChoiceLabel() {
    return userChoiceLabel;
}
