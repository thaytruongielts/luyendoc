document.addEventListener('DOMContentLoaded', () => {
    const transcriptElement = document.getElementById('transcript-text');
    const textContainer = document.getElementById('text-container');
    const playButton = document.getElementById('play-btn');
    const pauseButton = document.getElementById('pause-btn');
    const backgroundAudio = document.getElementById('background-audio');

    // Split text into words and wrap them in a span
    const text = transcriptElement.innerText;
    const words = text.split(/\s+/);
    const htmlWords = words.map(word => `<span class="word">${word}</span>`).join(' ');
    transcriptElement.innerHTML = htmlWords;

    const wordSpans = transcriptElement.querySelectorAll('.word');
    let currentWordIndex = 0;
    let playing = false;
    let timerId = null;

    // Simulate speech-to-text timing. Adjust this value for faster/slower reading.
    const delayPerWord = 180; // in milliseconds (approx. 330 words per minute)

    const highlightWord = () => {
        if (currentWordIndex < wordSpans.length) {
            // Remove highlight from previous word
            if (currentWordIndex > 0) {
                wordSpans[currentWordIndex - 1].classList.remove('highlight');
            }
            
            // Add highlight to current word
            wordSpans[currentWordIndex].classList.add('highlight');

            // Autoscroll logic
            const currentWord = wordSpans[currentWordIndex];
            const containerHeight = textContainer.clientHeight;
            const wordPosition = currentWord.offsetTop - textContainer.offsetTop;

            if (wordPosition > containerHeight - 100) { // Adjust threshold as needed
                textContainer.scrollTop = wordPosition - containerHeight / 2;
            }

            currentWordIndex++;
            timerId = setTimeout(highlightWord, delayPerWord);
        } else {
            // Finished reading
            stopReading();
        }
    };

    const startReading = () => {
        if (!playing) {
            playing = true;
            playButton.style.display = 'none';
            pauseButton.style.display = 'block';
            backgroundAudio.play();
            highlightWord();
        }
    };

    const pauseReading = () => {
        if (playing) {
            playing = false;
            playButton.style.display = 'block';
            pauseButton.style.display = 'none';
            clearTimeout(timerId);
            backgroundAudio.pause();
        }
    };

    const stopReading = () => {
        pauseReading();
        // Remove all highlights
        wordSpans.forEach(word => word.classList.remove('highlight'));
        currentWordIndex = 0;
        textContainer.scrollTop = 0; // Reset scroll position
    }

    playButton.addEventListener('click', startReading);
    pauseButton.addEventListener('click', pauseReading);
});