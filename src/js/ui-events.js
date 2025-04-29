import { subjectsForm, subjectHeader, subjects, uiState } from './constants';
import { loadNextPage } from "./dom-utils";

export const setupEventListeners = () => {
    // event listener for subject option clicks
    subjectsForm.addEventListener("click", (e) => {
        e.preventDefault();

        const label = e.target.closest("label");
        const value = label.dataset?.value;

        if (value != undefined) {
            // changing header image
            subjectHeader.classList.toggle("hide", true);
            const headerImg = subjectHeader.children[0];
            const subjectImg = label.children[1].cloneNode(true);
            subjectHeader.replaceChild(subjectImg, headerImg);

            // changing header text
            const headerText = subjectHeader.children[1];
            headerText.textContent = subjects[value];

            // setting data-subject 
            subjectHeader.dataset.subject = subjects[value];

            // setting current page as quiz starting page
            uiState.currentPage = [...quiz.children];
            quiz.classList.replace("quiz--intro-layout", "quiz--question-template-layout")
            loadNextPage(e);
        }
    }, true);
};