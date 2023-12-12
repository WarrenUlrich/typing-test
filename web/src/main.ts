import TypingTest from "./typing_test.js";

let typingTest = await TypingTest.randomWordTest(10);

let wpmValue = document.getElementById('wpmValue') as HTMLElement;

const correctTextElement = document.getElementById('correctText') as HTMLElement;
const remainingTextElement = document.getElementById('remainingText') as HTMLElement;

remainingTextElement.textContent = typingTest.getOriginalText();

async function handleTyping(event: KeyboardEvent) {
    if (typingTest.done()) {
        if (event.key == "Enter") {
            typingTest = await TypingTest.randomWordTest(10);
            correctTextElement.innerHTML = '';
            remainingTextElement.textContent = typingTest.getOriginalText();
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
    if (wpm) {
        console.log("wpm: ", wpm);
        wpmValue.innerHTML = wpm.toString();
    }
}

document.addEventListener('keydown', handleTyping)