const DEFAULT_PASSWORD = "erer111";
const SECRET_CONTENT_URL = 'https://raw.githubusercontent.com/justqnoo/byzanlol/main/main.html';

let correctPassword = DEFAULT_PASSWORD;
let passwordCorrect = false;

const passwordInput = document.getElementById('passwordInput');
const hiddenIndicator = document.getElementById('hiddenIndicator');

setupEventListeners();
passwordInput.focus();

function setupEventListeners() {
    passwordInput.addEventListener('blur', () => {
        setTimeout(() => passwordInput.focus(), 10);
    });

    passwordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            checkPassword();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Shift' && e.location === 2) {
            checkPassword();
        }
    });
}

function checkPassword() {
    if (passwordInput.value === correctPassword) {
        hiddenIndicator.style.color = "green";
        hiddenIndicator.textContent = "";
        setTimeout(loadSecretContent, 1000);
    } else {
        showTemporaryFeedback("red", 2000);
        passwordInput.value = "";
        passwordInput.focus();
    }
}

function showTemporaryFeedback(color, duration) {
    hiddenIndicator.style.color = color;
    hiddenIndicator.textContent = "";
    setTimeout(() => {
        hiddenIndicator.style.color = "rgba(0,0,0,0.2)";
        hiddenIndicator.textContent = "";
    }, duration);
}

async function loadSecretContent() {
    try {
        const response = await fetch(SECRET_CONTENT_URL + '?' + Date.now());
        if (!response.ok) throw new Error("Failed: " + response.status);
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const fetchedFavicon = doc.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
        
        document.open();
        document.write(html);
        document.close();
        
        if (fetchedFavicon && window.location.href === document.referrer) {
            const newFavicon = document.createElement('link');
            newFavicon.rel = fetchedFavicon.rel;
            newFavicon.href = fetchedFavicon.href;
            if (fetchedFavicon.type) newFavicon.type = fetchedFavicon.type;
            document.head.appendChild(newFavicon);
        }
    } catch (error) {
        console.error("Error:", error);
        showTemporaryFeedback("red", 3000);
    }
}
