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
        if (!response.ok) throw new Error("Failed to fetch content: " + response.statusText);
        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const fetchedFavicon = doc.querySelector('link[rel="icon"]');

        const newWindow = window.open('about:blank', '_blank');
        if (newWindow) {
            newWindow.document.open();
            newWindow.document.write(html);
            
            if (fetchedFavicon) {
                 const newFaviconLink = newWindow.document.createElement('link');
                 newFaviconLink.rel = 'icon';
                 newFaviconLink.href = fetchedFavicon.href;
                 newFaviconLink.type = fetchedFavicon.type || 'image/x-icon';
                 newWindow.document.head.appendChild(newFaviconLink);
            }
            
            newWindow.document.close();
        } else {
            console.error("Failed to open a new window. Please allow popups.");
            showTemporaryFeedback("orange", 3000); 
        }
    } catch (error) {
        console.error("Error loading secret content:", error);
        showTemporaryFeedback("red", 3000);
    }
}
