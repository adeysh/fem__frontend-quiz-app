// DOM Elements
export const subjectsForm = document.getElementById("subjects-form");
export const subjectOptions = document.querySelectorAll(".quiz__subject-input");
export const subjectHeader = document.getElementById("subject-header");
export const quiz = document.getElementById("quiz");

export const questionTemplate = document.getElementById("question-template");
export const quizCompleteTemplate = document.getElementById("quiz-complete-template");

export const toggleSwitchLabel = document.getElementById("switch-label");
export const toggleSwitchInput = document.getElementById("toggle-switch");

// JSConfetti instance (singleton)
import JSConfetti from 'js-confetti';
export const jsConfetti = new JSConfetti();

// App State
export const uiState = {
    currentPage: [],
};

export const subjects = Object.freeze({
    html: "HTML",
    css: "CSS",
    js: "JavaScript",
    a11y: "Accessibility",
});

export const quizState = {
    questionCount: 0,
    currentScore: 0,
};

export const getQuestionCount = () => quizState.questionCount;
export const setQuestionCount = (count) => quizState.questionCount = count;
export const incrementQuestionCount = () => quizState.questionCount += 1;

export const getCurrentScore = () => quizState.currentScore;
export const setCurrentScore = (score) => quizState.currentScore = score;
export const incrementCurrentScore = () => quizState.currentScore += 1;

export const quizzesObj = {};

// User choice label - encapsulated with getter/setter
export let userChoiceLabel = null;

export function setUserChoiceLabel(label) {
    userChoiceLabel = label;
}

export function getUserChoiceLabel() {
    return userChoiceLabel;
}
