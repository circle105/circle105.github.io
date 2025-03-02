let currentLanguage = 'zh';

async function loadLanguage(lang) {
    if (lang === currentLanguage) {
        return;
    }
    try {
        const random = new Date().getTime();
        const response = await fetch(`./assert/lang_${lang}.json?${random}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const translations = await response.json();

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

        // 更新语言按钮和下拉列表选项的文本
        const langButton = document.querySelector('.lang-switch');
        langButton.textContent = translations['lang_button'];

        const langOptions = document.querySelectorAll('.lang-dropdown ul li');
        langOptions[0].textContent = translations['lang_option_en'];
        langOptions[1].textContent = translations['lang_option_zh'];

        currentLanguage = lang;
    } catch (error) {
        console.error("Error loading language file:", error);
    }
}

function toggleDropdown() {
    const dropdown = document.querySelector('.lang-dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

window.addEventListener('load', () => {
    loadLanguage('zh');
});