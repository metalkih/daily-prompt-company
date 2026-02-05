// i18n Configuration
const i18n = {
    currentLang: 'ko',
    translations: {},
    
    // Detect browser language
    detectLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.startsWith('ko') ? 'ko' : 'en';
    },
    
    // Load translations
    async loadTranslations(lang) {
        try {
            const response = await fetch(`locales/${lang}.json`);
            this.translations = await response.json();
            this.currentLang = lang;
            this.updatePage();
        } catch (error) {
            console.error('Failed to load translations:', error);
        }
    },
    
    // Get nested value from object
    getValue(obj, path) {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    },
    
    // Update page content
    updatePage() {
        // Update elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const value = this.getValue(this.translations, key);
            if (value) {
                if (value.includes('<br>')) {
                    element.innerHTML = value;
                } else {
                    element.textContent = value;
                }
            }
        });
        
        // Update lists (features)
        const featuresList = document.querySelector('.project-features');
        if (featuresList && this.translations.projects?.tesla?.features) {
            featuresList.innerHTML = this.translations.projects.tesla.features
                .map(feature => `<li>${feature}</li>`)
                .join('');
        }
        
        // Update footer
        const footer = document.querySelector('footer p');
        if (footer && this.translations.footer) {
            footer.textContent = this.translations.footer;
        }
        
        // Update html lang attribute
        document.documentElement.lang = this.currentLang;
    },
    
    // Switch language
    switchLanguage(lang) {
        this.loadTranslations(lang);
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const detectedLang = i18n.detectLanguage();
    i18n.loadTranslations(detectedLang);
});

// Scroll Animation
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

// Observe all elements with reveal class
document.querySelectorAll('.reveal').forEach((element) => {
    observer.observe(element);
});
