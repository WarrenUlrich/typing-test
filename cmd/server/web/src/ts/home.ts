import TypingTest from "./typing_test.js";

let typingTest = TypingTest.randomWordTest(10);
const correctTextElement = document.getElementById('correctText') as HTMLElement;
const remainingTextElement = document.getElementById('remainingText') as HTMLElement;
const wpmElement = document.getElementById('wpmText') as HTMLElement;

remainingTextElement.textContent = typingTest.getOriginalText();

function handleTyping(event: KeyboardEvent) {
    if (typingTest.done()) {
        if (event.key == "Enter") {
            typingTest = TypingTest.randomWordTest(10);
            correctTextElement.innerHTML = '';
            remainingTextElement.textContent = typingTest.getOriginalText();
            wpmElement.textContent = "0";
        }

        return;
    }

    typingTest.handleInput(event);
    const typedText = typingTest.getTypedText();
    const originalText = typingTest.getOriginalText();

    let displayText = '';
    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === originalText[i]) {
            displayText += typedText[i];
        } else {
            displayText += `<span class="incorrect">${typedText[i]}</span>`;
        }
    }

    correctTextElement.innerHTML = displayText; // Use innerHTML since we're adding spans
    remainingTextElement.textContent = originalText.substring(typedText.length);

    let wpm = typingTest.calculateWpm();
    wpmElement.textContent = wpm ? wpm.toString() : "null";
}

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', handleTyping);
});