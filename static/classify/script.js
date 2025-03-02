// let currentLanguage = 'en';
let currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
const body = document.getElementById('body');
body.style.display = 'none'; // 初始隐藏页面主体内容

async function loadLanguage(lang) {
    try {
        const random = new Date().getTime();
        const files = [
            `./static/classify/lang_${lang}.json`,
            `./static/common/lang/lang_${lang}.json`, 
        ];
        const responses = await Promise.all(files.map(file => fetch(`${file}?${random}`)));
        const validResponses = await Promise.all(responses.map(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        }));
        const translations = Object.assign({}, ...validResponses);
        
        document.querySelectorAll("[data-key]").forEach(el => {
            const key = el.dataset.key;
            if (translations[key]) {
                if (el.tagName === "A") {
                    el.textContent = translations[key];
                } else {
                    el.innerHTML = translations[key];
                }
            }
        });

        const langButton = document.querySelector('.lang-switch');
        langButton.textContent = translations['lang_button'];

        const langOptions = document.querySelectorAll('.lang-dropdown ul li');
        langOptions[0].textContent = translations['lang_option_en'];
        langOptions[1].textContent = translations['lang_option_zh'];

        currentLanguage = lang;
        localStorage.setItem('selectedLanguage', lang);
    } catch (error) {
        console.error("Error loading language file:", error);
    } finally {
        body.style.display = 'block'; // 语言加载完成后显示页面主体内容
    }
}

function toggleDropdown() {
    const dropdown = document.querySelector('.lang-dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}
function toggleMoreDropdown() {
    const dropdown = document.querySelector('.dataset-dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}
window.addEventListener('load', () => {
    loadLanguage(currentLanguage);
});


function copyCitation() {
    const citationText = document.getElementById('citation-text').textContent || document.getElementById('citation-text').innerText;
    const copyBtn = document.getElementById('copy-btn');

    navigator.clipboard.writeText(citationText)
        .then(() => {
            // Change button text to "已复制"
            if ('zh' === currentLanguage) {
                copyBtn.textContent = '已复制';
            } else {
                copyBtn.textContent = 'Copied';
            }


            // Reset the button text after 2 seconds
            setTimeout(() => {
                if ('zh' === currentLanguage) {
                    copyBtn.textContent = '复制';
                } else {
                    copyBtn.textContent = 'Copy';
                }
            }, 2000);
        })
        .catch(err => {
            console.error('error:', err);
        });
}
