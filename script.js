// Conversion function
function convertUnicodeToPreeti(unicodeText) {
    if (!unicodeText) return '';

    let text = unicodeText;

    // Handle Straight Single Quotes
    text = text.replace(/(^|\s)'/g, '$1…'); // Opening '
    text = text.replace(/'/g, 'Ú');         // Closing '
    
    // Handle Straight Double Quotes
    text = text.replace(/(^|\s)"/g, '$1æ'); // Opening "
    text = text.replace(/"/g, 'Æ');         // Closing "
    // -----------------------------------------
    //For punctuation and half sha mismathced solution
    text = text.replace(/:/g, 'M');
    text = text.replace(/\?/g, '<');


    // 1. Specific Multi-character & Phrase Exceptions
    text = text.replace(/अन्तर्राष्ट्रिय/g, 'cGt/fli6«o');
    text = text.replace(/वैज्ञानिक/g, 'j}1flgs');
    text = text.replace(/कम्प्युटर/g, 'sDKo\'6/');
    text = text.replace(/प्रविधि/g, 'k|ljlw');
    text = text.replace(/ज्ञान/g, '1fg');
    text = text.replace(/प्राप्त/g, 'k|fKt');
    text = text.replace(/श्रीमान्/g, '>Ldfg\\');
    text = text.replace(/श्रीमती/g, '>LdtL');
    text = text.replace(/रुपैयाँ/g, '?k}ofF');
    text = text.replace(/राष्ट्रिय/g, '/fli6«o');
    text = text.replace(/राष्ट्र/g, '/fi6«');
    text = text.replace(/छात्रवृत्ति/g, '5fqjelTt');
    text = text.replace(/द्रुत/g, 'b|\'t');

     // 4. Shift short 'ि' (Raswa Ikar) BEFORE target consonant(s)
    // We maintain the Halant (\u094D) here so the halfMap can still read it!
    text = text.replace(/([क-ह])\u094D([क-ह])\u094D([क-ह])ि/g, 'l$1\u094D$2\u094D$3');
    text = text.replace(/([क-ह])\u094D([क-ह])ि/g, 'l$1\u094D$2');
    text = text.replace(/([क-ह])ि/g, 'l$1');


    // 2. Pre-process Ligatures BEFORE Halant operations
    text = text.replace(/ङ\u094Dग/g, 'Ë');   // ङ्ग (Nga + Halant + Ga) -> Alt+0203
    text = text.replace(/ट\u094Dट/g, '§');   // ट्ट (Ta + Halant + Ta)  -> Alt+0167
    text = text.replace(/ठ\u094Dठ/g, '¶');   // ठ्ठ (Tha + Halant + Tha) -> Alt+0168
    text = text.replace(/ड\u094Dड/g, '•');   // ड्ड (Da + Halant + Da)   -> Alt+0169
    text = text.replace(/द\u094Dद/g, '¢');   // द्द (Da + Halant + Da)   -> Alt+0162
    text = text.replace(/द\u094Dय/g, 'B');   // द्य (Fixes विद्या)
    text = text.replace(/द\u094Dध/g, '4');   // द्ध 
    text = text.replace(/त\u094Dर/g, 'q');   // त्र (Fixes छात्र)
    text = text.replace(/ज\u094Dञ/g, '1');   // ज्ञ
    text = text.replace(/द\u094Dर/g, 'b|');  // द्र (Fixes द्रुत)
    text = text.replace(/श\u094Dर/g, '>');   // श्र
    text = text.replace(/क\u094Dर/g, 'qm');  // क्र
    text = text.replace(/क\u094Dष/g, 'If');  // क्ष
    text = text.replace(/द\u094Dव/g, 'å');  // क्ष
    text = text.replace(/त\u094Dत/g, 'Q');
    text = text.replace(/स्त/g, ':t');  // स + ् + त -> :t
    text = text.replace(/ष्ट/g, 'i6'); // ष + ् + ट -> i6
    text = text.replace(/ष्ठ/g, 'i7'); // ष + ् + ठ -> i7  




    // 3. Special Characters (Ru, Roo, Hri)
    text = text.replace(/रु/g, '?');
    text = text.replace(/र\u0941/g, '?');    // Explicit र + ु
    text = text.replace(/रू/g, '¿');
    text = text.replace(/र\u0942/g, '¿');    // Explicit र + ू
    text = text.replace(/हृ/g, 'Å');
    text = text.replace(/फ्र/g, 'k|m');



    // 5. Reph (र् + Consonant) 
    // \u0930\u094D is 'र्' (Ra + Halant)
    text = text.replace(/\u0930\u094D([क-ह])([ािीुूृेैोौंँः]*)/g, '$1$2{');

    // 6. Subscript R (्र) mapping
    // \u094D\u0930 is Subscript Ra (Halant + Ra)
    text = text.replace(/([क-ह])\u094D\u0930/g, '$1|');

    // 7. Halves Mapping
    // Explicitly targeting Consonant + Halant (\u094D) to prevent misfires
    const halfMap = {
        'क\u094D': 'S', 'ख\u094D': 'V', 'ग\u094D': 'U', 'घ\u094D': '3', 'ङ\u094D': 'ª',
        'च\u094D': 'R', 'छ\u094D': '5', 'ज\u094D': 'H', 'झ\u094D': 'I', 'ञ\u094D': '`',
        'ट\u094D': '6', 'ठ\u094D': '7', 'ड\u094D': '8', 'ढ\u094D': '9', 'ण\u094D': '0',
        'त\u094D': 'T', 'थ\u094D': 'Y', 'द\u094D': 'b\\', 'ध\u094D': 'W', 'न\u094D': 'G',
        'प\u094D': 'K', 'फ\u094D': 'km', 'ब\u094D': 'A', 'भ\u094D': 'E', 'म\u094D': 'D',
        'य\u094D': 'O', 'र\u094D': '{', 'ल\u094D': 'N', 'व\u094D': 'J', 'श\u094D': 'Z',
        'ष\u094D': 'i', 'स\u094D': ':', 'ह\u094D': 'X'


    };

    for (const [key, val] of Object.entries(halfMap)) {
        // NEGATIVE LOOKAHEAD: Match the half-letter only if it is NOT followed by space, punctuation, or end of string.
        const regex = new RegExp(key + '(?!(?:\\s|[.,!?।;:"\'()<>=_æçÆÇM\\-0-9०-९]|$))', 'g');
        text = text.replace(regex, val);
    }

    // 8. Single Character Mapping
    const map = {
        'अ': 'c', 'आ': 'cf', 'इ': 'O', 'ई': 'O{', 'उ': 'p', 'ऊ': 'pm',
        'ऋ': 'C', 'ए': 'P', 'ऐ': 'P{', 'ओ': 'cf]', 'औ': 'cf}',
        'क': 's', 'ख': 'v', 'ग': 'u', 'घ': '3', 'ङ': 'ª',
        'च': 'r', 'छ': '5', 'ज': 'h', 'झ': '´', 'ञ': '`',
        'ट': '6', 'ठ': '7', 'ड': '8', 'ढ': '9', 'ण': '0f',
        'त': 't', 'थ': 'y', 'द': 'b', 'ध': 'w', 'न': 'g',
        'प': 'k', 'फ': 'km', 'ब': 'a', 'भ': 'e', 'म': 'd',
        'य': 'o', 'र': '/', 'ल': 'n', 'व': 'j', 'श': 'z',
        'ष': 'if', 'स': ';', 'ह': 'x', 
        'ा': 'f','ि': 'l', 'ी': 'L', 'ु': '\'', 'ू': '"', // Fixed Vowels (' -> Raswa, m -> Dirgha)
        'ृ': '[', 'े': ']', 'ै': '}', 'ो': 'f]', 'ौ': 'f}',
        'ं': '+', 'ः': 'M', 'ँ': 'F', '।': ' .', '.': '=', '=': 'Ö', 'स्त': ':t', 'ष्ट': 'i6', 'ष्ठ': 'i7', '\u094D': '\\', 
        
        //  Numbers (Maps both Nepali & English input to Preeti)
        '०': ')', '१': '!', '२': '@', '३': '#', '४': '$',
        '५': '%', '६': '^', '७': '&', '८': '*', '९': '(',
                
        //quotes
        '‘': '…',  // Unicode Left Single Quote
        '’': 'Ú',  // Unicode Right Single Quote
        '“': 'æ',  // Unicode Left Double Quote
        '”': 'Æ',  // Unicode Right Double Quote
        '!': 'Û',
        //  Preeti Punctuation and arithmetic symbols.
        '-': '–',  
        '(': '-',  
        ')': '_',  
        ',': ',',
        '+': '±',
        '×': '×',
        '%': 'Ü',
        

       
       

        

        
        '‍': '', '‌': '' // Strip Zero-Width Joiners to prevent rendering bugs
    };

    let result = '';
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        result += map[char] !== undefined ? map[char] : char;
    }

    return result;
}

// Bind event listeners when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    const unicodeInput = document.getElementById('unicode-output');
    const preetiOutput = document.getElementById('preeti-output');
    const convertBtn = document.getElementById('convert-to-preeti-btn');
    const romanInput = document.getElementById('roman-input');
    const clearBtn = document.getElementById('clear-all-btn');
    const copyUnicodeBtn = document.getElementById('copy-unicode');
    const copyPreetiBtn = document.getElementById('copy-preeti');

    function updatePreetiOutput() {
        if (unicodeInput && preetiOutput) {
            preetiOutput.value = convertUnicodeToPreeti(unicodeInput.value);
        }
    }

    if (unicodeInput) unicodeInput.addEventListener('input', updatePreetiOutput);
    if (convertBtn) convertBtn.addEventListener('click', updatePreetiOutput);

    if (romanInput) {
        let timer;
        romanInput.addEventListener('input', () => {
            clearTimeout(timer);
            const val = romanInput.value.trim();
            if (!val) {
                if (unicodeInput) unicodeInput.value = '';
                if (preetiOutput) preetiOutput.value = '';
                return;
            }

timer = setTimeout(async () => {
    try {
        // Now pointing explicitly to your Netlify backend
        const backendUrl = "https://romanintonepali.netlify.app/.netlify/functions/convert";

        const res = await fetch(backendUrl, { 
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: val })
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        
        if (unicodeInput && data.result) {
            unicodeInput.value = data.result;
            updatePreetiOutput();
        }
        
    } catch (e) {
        console.error("Transliteration Error:", e);
    }
}, 1000);
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (romanInput) romanInput.value = '';
            if (unicodeInput) unicodeInput.value = '';
            if (preetiOutput) preetiOutput.value = '';
        });
    }

    if (copyUnicodeBtn && unicodeInput) {
        copyUnicodeBtn.addEventListener('click', () => navigator.clipboard.writeText(unicodeInput.value));
    }

    if (copyPreetiBtn && preetiOutput) {
        copyPreetiBtn.addEventListener('click', () => navigator.clipboard.writeText(preetiOutput.value));
    }

    updatePreetiOutput();
});
