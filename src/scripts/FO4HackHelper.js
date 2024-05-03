const words = []
let worldLn = -1
const invalidWords = []

let state = 'EnterWords'
let outputScreen, screenInput, matchesInput, doneBtn, submitBtn

const OUTPUTCONSTANTS = {
    EnterWordsOutput: 'Please enter each word for the hack.',
    GuessWordsOutput: 'Enter your guess in the first box, and the number of matches in the second.'
}

// onload scripts
window.addEventListener('load', async () => {
    outputScreen = document.getElementById('screen-out-display')
    screenInput = document.getElementById('word-input')
    matchesInput = document.getElementById('matches')
    doneBtn = document.getElementById('done')
    submitBtn = document.getElementById('submit')

    outputScreen.innerHTML = OUTPUTCONSTANTS.EnterWordsOutput

    screenInput.addEventListener('keypress', (event) => {
        if (screenInput.value != '' && event.key === 'Enter') {
            if (screenInput.value === '/best') screenInput.value = getBest()
            else if (screenInput.value === '/r' || matchesInput.value === '/r') handleReset()
            else if (screenInput.value === '/d' && state === 'EnterWords') handleDone()
            else handleSubmit()
        }
    })

    matchesInput.addEventListener('keypress', (event) => {
        if ((matchesInput.value === '/r' || screenInput.value === '/r') && event.key === 'Enter') handleReset()
        else if (matchesInput.value != '' && event.key === 'Enter' && screenInput.value != '') handleSubmit()
    })
})

// handlers
const handleReset = () => {
    state = 'EnterWords'
    words.length = 0
    invalidWords.length = 0
    worldLn = -1
    outputScreen.innerHTML = OUTPUTCONSTANTS.EnterWordsOutput
    screenInput.value = ''
    matchesInput.value = ''
    doneBtn.classList.remove('hidden')
    submitBtn.classList.remove('hidden')
    screenInput.classList.remove('hidden')
    matchesInput.classList.add('hidden')
    screenInput.placeholder = 'Enter a Word...'
}

const handleSubmit = () => {
    let word = screenInput.value

    if (state == 'EnterWords') {
        if (words.length === 0) {
            worldLn = word.length
        } else if (word.length != worldLn) {
            outputScreen.innerHTML = 'Length does not match the length of the rest of the words. Please try again.'
            screenInput.value = ''
            return
        } else if (words.includes(word)) {
            screenInput.value = ''
            outputScreen.innerHTML = OUTPUTCONSTANTS.EnterWordsOutput
            return
        }

        words.push(word)
        screenInput.value = ''
        outputScreen.innerHTML = OUTPUTCONSTANTS.EnterWordsOutput
    } else if (state === 'GuessWords' && matchesInput.value != '') {
        const matches = parseInt(matchesInput.value)

        if (!words.includes(word)) {
            outputScreen.innerHTML = `Entered word was not in the valid words list. Please try again: [${words}]`
            screenInput.value = ''
            matchesInput.value = ''
            return
        } else if (0 > matches || matches > worldLn) {
            outputScreen.innerHTML = `Entered value for matches was not valid. The number should be from 0 to ${worldLn}. Please try again: [${words}]`
            screenInput.value = ''
            matchesInput.value = ''
            return
        }

        checkGuess(word, matches)
        outputScreen.innerHTML = OUTPUTCONSTANTS.GuessWordsOutput + ` Valid guesses: [${words}]`
        screenInput.value = ''
        matchesInput.value = ''

        if (words.length <= 1) {
            submitBtn.classList.add('hidden')
            screenInput.classList.add('hidden')
            matchesInput.classList.add('hidden')

            if (words.length === 1) outputScreen.innerHTML = `The correct word is: ${words[0]}`
            else outputScreen.innerHTML = 'There is no correct answer to this hack!'
        }
    } else if (state === 'GuessWords' && word === '/best') {
        screenInput.value = getBest()
    }
}

const handleDone = () => {
    state = 'GuessWords'
    doneBtn.classList.add('hidden')
    matchesInput.classList.remove('hidden')
    screenInput.value = ''
    screenInput.placeholder = 'Enter Your Guess...'
    outputScreen.innerHTML = OUTPUTCONSTANTS.GuessWordsOutput + ` Valid guesses: [${words}]`
}

const checkGuess = (guess, matches) => {
    const t_words = []
    for (let i = 0; i < words.length; ++i) {
        if (checkWordMatches(words[i], guess) === matches) t_words.push(words[i])
        else invalidWords.push(words[i])
    }

    words.length = 0
    words.push(...t_words)
}

const checkWordMatches = (word, guess) => {
    let matches = 0
    for (let i = 0; i < word.length; ++i) {
        if (word[i] === guess[i]) ++matches
    }
    return matches
}

const getBest = () => {
    let bestGuess = ''
    let bestScore = -1

    for (const guess of words) {
        let score = 0
        for (const word of words) {
            score += checkWordMatches(word, guess)
        }

        if (score > bestScore) {
            bestGuess = guess
            bestScore = score
        }
    }

    return bestGuess
}