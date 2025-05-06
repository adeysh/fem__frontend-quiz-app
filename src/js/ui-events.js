import { subjectsForm, subjectHeader, subjects, uiState, quizzesObj, toggleSwitchLabel, toggleSwitchInput, quiz } from './constants';
import { changeTextContent, loadNextPage, setElementAttribute } from "./dom-utils";
import { fetchData } from './fetchData';

export const setupEventListeners = () => {
    // event listener for subject option clicks
    subjectsForm.addEventListener("click", (e) => {

        const label = e.target.closest("label");
        if (!label) return;

        e.preventDefault();
        const value = label.dataset?.value;
        if (value === undefined) return;

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

    subjectsForm.addEventListener("keydown", (e) => {
        if (e.key == " " || e.key == "Enter") {
            e.target.click();
        }
    });

    // event listener on load of quiz
    window.addEventListener("load", async () => {
        try {
            await fetchData();
            const subjectLabels = subjectsForm.querySelectorAll("label");

            subjectLabels.forEach((label, index) => {
                const quizObj = Object.values(quizzesObj)[index];

                const span = label.querySelector("span");
                changeTextContent(span, quizObj.title);

                const img = label.querySelector("img");
                const iconPath = quizObj.icon.replace(".", "");
                setElementAttribute(img, "src", iconPath);
                setElementAttribute(img, "alt", quizObj.title);
            });
        } catch (err) {
            console.error("Failed to load quiz data", err);
        }
    });

    // event listener for toggle option clicks
    toggleSwitchLabel.addEventListener("click", (e) => {
        e.preventDefault();
        toggleTheme();
    });

    toggleSwitchLabel.addEventListener("keydown", (e) => {
        console.log(e.key);
        if (e.key == " " || e.key == "Enter") {
            toggleTheme();
        }
    });
};

const toggleTheme = () => {
    toggleSwitchInput.checked = !toggleSwitchInput.checked;
    document.documentElement.classList.toggle("light-mode");
}