export const subjectsForm = document.getElementById("subjects-form");
export const subjectOptions = document.querySelectorAll(".quiz__subject-input");
export const subjectHeader = document.getElementById("subject-header");
export const quiz = document.getElementById("quiz");

export const questionTemplate = document.getElementById("question-template");

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
};