import { subjectsForm, subjectHeader, subjects, uiState, quizzesObj } from './constants';
import { changeTextContent, loadNextPage, setElementAttribute } from "./dom-utils";
import { fetchData } from './fetchData';

export const setupEventListeners = () => {
    // event listener for subject option clicks
    subjectsForm.addEventListener("click", (e) => {
        e.preventDefault();

        const label = e.target.closest("label");
        const value = label.dataset?.value;

        if (value != undefined) {
            // changing header content
            subjectHeader.classList.remove("hide");
            const headerImg = subjectHeader.children[0];
            const subjectImg = label.children[1].cloneNode(true);
            subjectHeader.replaceChild(subjectImg, headerImg);

            const headerText = subjectHeader.children[1];
            changeTextContent(headerText, subjects[value]);

            subjectHeader.dataset.subject = subjects[value];

            // changing page template and layout
            uiState.currentPage = [...quiz.children];
            quiz.classList.replace("quiz--intro-layout", "quiz--question-template-layout")
            loadNextPage(e);
        }
    }, true);

    // event listener on load of quiz
    window.addEventListener("load", async () => {
        await fetchData();
        Object.values(quizzesObj).forEach((quizObj, index) => {
            const span = subjectsForm.children[index].querySelector("span");
            changeTextContent(span, `${quizObj.title}`);

            const img = subjectsForm.children[index].querySelector("img");
            let iconPath = quizObj.icon;
            iconPath = iconPath.replace(".", "");
            setElementAttribute(img, "src", iconPath);
            setElementAttribute(img, "alt", quizObj.title);
        });
    });
};