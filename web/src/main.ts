import TypingTest from "./typing_test.js";

let typingTest = await TypingTest.randomWordTest(10);
let wpmValue = document.getElementById('wpmValue') as HTMLElement;
const correctTextElement = document.getElementById('correctText') as HTMLElement;
const remainingTextElement = document.getElementById('remainingText') as HTMLElement;

remainingTextElement.textContent = typingTest.getOriginalText();

document.addEventListener('keydown', handleTyping);

async function handleTyping(event: KeyboardEvent) {
    if (typingTest.done()) {
        handleTestCompletion(event);
        return;
    }

    processInput(event);
}

function processInput(event: KeyboardEvent) {
    typingTest.handleInput(event);

    const typedText = typingTest.getTypedText();
    const originalText = typingTest.getOriginalText();

    updateDisplay(typedText, originalText);

    updateWpm(typingTest.calculateWpm());
}

function updateDisplay(typedText: string, originalText: string) {
    let displayText = '';

    for (let i = 0; i < typedText.length; i++) {
        displayText += typedText[i] === originalText[i]
            ? typedText[i]
            : `<span class="incorrect">${typedText[i]}</span>`;
    }

    correctTextElement.innerHTML = displayText; // Use innerHTML since we're adding spans
    remainingTextElement.textContent = originalText.substring(typedText.length);
}

async function handleTestCompletion(event: KeyboardEvent) {
    if (event.key == "Enter") {
        typingTest = await TypingTest.randomWordTest(10);
        correctTextElement.innerHTML = '';
        remainingTextElement.textContent = typingTest.getOriginalText();
    }
}

function updateWpm(wpm: number | null) {
    if (wpm) {
        wpmValue.innerHTML = wpm.toString();
    }
}