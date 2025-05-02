import { quizzesObj } from "./constants";

export async function fetchData() {
    const response = await fetch("data.json");
    const data = await response.json();
    const quizzes = data["quizzes"];

    for (const quiz of quizzes) {
        quizzesObj[quiz["title"]] = quiz;
    }
}