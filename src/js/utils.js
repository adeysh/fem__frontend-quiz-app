import { loadNextPage } from './dom-utils';

export function setupNextButton(button) {
    button.addEventListener("mouseup", loadNextPage);

    button.addEventListener("keydown", (e) => {
        if (e.key == " " || e.key == "Enter") {
            loadNextPage(e);
        }
    });
}

export function disableChoices(choiceContainer) {
    for (let choiceEl of choiceContainer.children) {
        choiceEl.disabled = true;
        choiceEl.style.pointerEvents = "none";
    };
}

export function appendIcon(label, src, alt) {
    const img = document.createElement("img");
    setElementAttribute(img, "src", src);
    setElementAttribute(img, "alt", alt);
    label.appendChild(img);
}

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