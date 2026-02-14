const romanInput = document.getElementById('roman-input');
const unicodeOutput = document.getElementById('unicode-output');
const preetiOutput = document.getElementById('preeti-output');
const convertToPreetiBtn = document.getElementById('convert-to-preeti-btn');
const micBtn = document.getElementById('mic-btn');
const voiceStatus = document.getElementById('voice-status');
const fontToggle = document.getElementById('font-toggle');

let typingTimer;

// Core conversion tool for Purna Biram
const fixBiram = (text) => text.replace(/\./g, '।');

// Path A: Automatic Romanized Conversion
romanInput.addEventListener('input', () => {
    clearTimeout(typingTimer);
    const text = fixBiram(romanInput.value);
    
    typingTimer = setTimeout(async () => {
        if (!text.trim()) {
            unicodeOutput.value = "";
            preetiOutput.value = "";
            return;
        }
        const unicode = await fetchUnicode(text);
        unicodeOutput.value = unicode;
        preetiOutput.value = unicodeToPreeti(unicode);
    }, 500);
});

// Path B: Manual Convert Button
convertToPreetiBtn.addEventListener('click', () => {
    if (unicodeOutput.value.trim()) {
        preetiOutput.value = unicodeToPreeti(unicodeOutput.value);
        romanInput.value = ""; // Clear input for focus
    } else {
        alert("Please provide Unicode text first.");
    }
});

// Font Preview Toggle
fontToggle.addEventListener('change', () => {
    preetiOutput.classList.toggle('preeti-font', fontToggle.checked);
});

async function fetchUnicode(text) {
    const words = text.split(/\s+/);
    const chunkSize = 10;
    let results = [];
    for (let i = 0; i < words.length; i += chunkSize) {
        const chunk = words.slice(i, i + chunkSize).join(' ');
        const url = `https://inputtools.google.com/request?text=${encodeURIComponent(chunk)}&itc=ne-t-i0-und&num=1`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            results.push(data[0] === "SUCCESS" ? data[1][0][1][0] : chunk);
        } catch (e) { results.push(chunk); }
    }
    return results.join(' ');
}

function unicodeToPreeti(unicodeText) {
    let t = fixBiram(unicodeText);
    // Reorder Ikar logic
    t = t.replace(/([\u0915-\u0939])\u093f/g, 'l$1'); 
    t = t.replace(/([\u0915-\u0939])\u094d([\u0915-\u0939])\u093f/g, 'l$1\u094d$2');

    const map = {
        'अ': 'cl', 'आ': 'cf', 'इ': 'O', 'ई': 'O{', 'उ': 'p', 'ऊ': 'pm', 'ए': 'P', 'ऐ': 'P{', 'ओ': 'cf]', 'औ': 'cf}',
        'क': 's', 'ख': 'v', 'ग': 'u', 'घ': '3', 'ङ': 'ª', 'च': 'r', 'छ': '5', 'ज': 'h', 'झ': 'h+', 'ञ': '`',
        'ट': '6', 'ठ': '7', 'ड': '8', 'ढ': '9', 'ण': '0', 'त': 't', 'थ': 'y', 'द': 'b', 'ध': 'w', 'न': 'g',
        'प': 'k', 'फ': 'km', 'ब': 'a', 'भ': 'e', 'म': 'd', 'य': 'o', 'र': '/', 'ल': 'n', 'व': 'j', 'श': 'z',
        'ष': 'if', 'स': ';', 'ह': 'x', 'ा': 'f', 'ि': 'l', 'ी': 'L', 'ु': 'u', 'ू': 'm', 'े': ']', 'ै': '}',
        'ो': 'f]', 'ौ': 'f}', 'ं': 'G', 'ः': 'H', '्': '।', '।': 'm', '०': '0', '१': '1', '२': '2', '३': '3', 
        '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9', 'ज्ञ': '1', 'त्र': 'q', 'क्ष': 'If'
    };
    Object.keys(map).forEach(key => { t = t.split(key).join(map[key]); });
    return t;
}

function setupCopy(btnId, targetId) {
    document.getElementById(btnId).onclick = () => {
        const el = document.getElementById(targetId);
        el.select();
        document.execCommand('copy');
        const btn = document.getElementById(btnId);
        btn.innerText = "✓ Copied!";
        setTimeout(() => btn.innerText = btnId.includes('preeti') ? "Copy for Preeti Font" : "Copy Unicode", 2000);
    };
}
setupCopy('copy-unicode', 'unicode-output');
setupCopy('copy-preeti', 'preeti-output');

// Voice Typing
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'ne-NP'; 
    recognition.continuous = true;
    recognition.interimResults = true;
    let isRecording = false;

    micBtn.onclick = () => { if (!isRecording) recognition.start(); else recognition.stop(); };
    recognition.onstart = () => {
        isRecording = true;
        micBtn.innerHTML = "🛑 Stop";
        micBtn.classList.add('recording');
        voiceStatus.innerText = "Listening...";
        voiceStatus.className = "status-active";
    };
    recognition.onresult = (event) => {
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) final += event.results[i][0].transcript;
        }
        if (final) {
            unicodeOutput.value += (unicodeOutput.value ? ' ' : '') + final;
            preetiOutput.value = unicodeToPreeti(unicodeOutput.value);
        }
    };
    recognition.onend = () => {
        isRecording = false;
        micBtn.innerHTML = "🎤 Start Voice Typing";
        micBtn.classList.remove('recording');
        voiceStatus.innerText = "Microphone off";
        voiceStatus.className = "status-inactive";
    };
} else {
    micBtn.style.display = "none";
    voiceStatus.innerText = "Voice typing not supported.";
}
