const wordList = await fetch('/words')
            .then(response => response.json())
            .then(data => data as Array<string>);

export default class TypingTest {
    private originalText: string;
    private startTime: Date | null;
    private endTime: Date | null;
    private typedText: string;

    constructor(text: string) {
        this.originalText = text;
        this.startTime = null;
        this.endTime = null;
        this.typedText = '';
    }

    handleInput(event: KeyboardEvent): boolean {
        // Start the timer when the first key is pressed
        if (this.startTime === null) {
            this.startTime = new Date();
        }

        if (event.key === 'Backspace') {
            this.typedText = this.typedText.slice(0, -1);
        } else {
            this.typedText += event.key;
        }

        if (this.done())
            this.endTime = new Date();

        return true;
    }

    reset(): void {
        this.startTime = null;
        this.endTime = null;
        this.typedText = "";
    }

    getOriginalText(): string {
        return this.originalText;
    }

    getTypedText(): string {
        return this.typedText;
    }

    calculateWpm(): number | null {
        if (!this.startTime || !this.endTime) {
            return null;
        }

        const durationInMinutes = (this.endTime.getTime() - this.startTime.getTime()) / 60000;
        const wordCount = this.typedText.split(' ').length;

        return wordCount / durationInMinutes;
    }

    done(): boolean {
        return this.typedText == this.originalText;
    }

    getAccuracy(): number | null {
        if (!this.typedText) {
            return null;
        }

        let errorCount = 0;
        const typedWords = this.typedText.split(' ');
        const originalWords = this.originalText.split(' ');

        typedWords.forEach((word, index) => {
            if (word !== originalWords[index]) {
                errorCount++;
            }
        });

        return ((typedWords.length - errorCount) / typedWords.length) * 100;
    }

    static async randomWordTest(size: number): Promise<TypingTest> {
        let result = "";
        for (let i = 0; i < size; i++) {
            result += wordList[Math.floor(Math.random() * wordList.length)];
            if (i < size - 1)
                result += ' ';
        }

        return new TypingTest(result);
    }
}