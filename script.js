class WordGame {
    constructor() {
        this.wordList = [];
        this.loadWordList();
        this.initializeEventListeners();
    }

    async loadWordList() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt');
            const text = await response.text();
            this.wordList = text.split('\n').map(word => word.trim().toLowerCase())
                               .filter(word => word.length >= 3);
        } catch (error) {
            console.error('Error loading word list:', error);
            alert('Error loading word list. Please try again later.');
        }
    }

    initializeEventListeners() {
        const input = document.getElementById('letterInput');
        const button = document.getElementById('findWords');

        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.toLowerCase().replace(/[^a-z]/g, '');
        });

        button.addEventListener('click', () => this.findWords());
    }

    findWords() {
        const letters = document.getElementById('letterInput').value.toLowerCase();
        if (!letters) {
            alert('Please enter some letters');
            return;
        }

        const letterCount = this.getLetterCount(letters);
        const possibleWords = this.wordList.filter(word => this.canMakeWord(word, letterCount));
        this.displayWords(possibleWords);
    }

    getLetterCount(str) {
        return str.split('').reduce((acc, letter) => {
            acc[letter] = (acc[letter] || 0) + 1;
            return acc;
        }, {});
    }

    canMakeWord(word, letterCount) {
        const wordLetterCount = this.getLetterCount(word);
        return Object.entries(wordLetterCount).every(([letter, count]) => 
            (letterCount[letter] || 0) >= count);
    }

    displayWords(words) {
        const wordList = document.getElementById('wordList');
        if (words.length === 0) {
            wordList.innerHTML = '<span>No words found</span>';
            return;
        }

        // Group words by length
        const wordsByLength = words.reduce((acc, word) => {
            const len = word.length;
            if (!acc[len]) acc[len] = [];
            acc[len].push(word);
            return acc;
        }, {});

        // Create rows of words, sorted by length (shortest to longest) and alphabetically within each row
        const rows = Object.entries(wordsByLength)
            .sort(([len1], [len2]) => parseInt(len1) - parseInt(len2))
            .map(([length, wordsOfLength]) => {
                const sortedWords = wordsOfLength.sort((a, b) => a.localeCompare(b));
                return `<div class="word-row">
                    <div class="length-label">${length} letters (${wordsOfLength.length} words):</div>
                    <div class="words">${sortedWords.map(word => `<span>${word}</span>`).join('')}</div>
                </div>`;
            });

        wordList.innerHTML = rows.join('');
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new WordGame();
});