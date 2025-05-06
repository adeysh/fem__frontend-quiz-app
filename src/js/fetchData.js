import { quizzesObj } from "./constants";

export async function fetchData() {
    try {
        const response = await fetch("data.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const quizzes = data["quizzes"];

        quizzes.forEach((quiz) => {
            const title = quiz.title;
            if (title) {
                quizzesObj[title] = quiz;
            } else {
                console.warn("Quiz without a title found:", quiz);
            }
        });

    } catch (error) {
        console.error("Failed to fetch quiz data:", error);
    }
}