// i18n Configuration
const i18n = {
    currentLang: 'ko',
    translations: {},
    fallbackTranslations: {
        hero: {
            title: "좋은 질문이 만드는<br>더 나은 모바일 서비스",
            subtitle: "'어떻게 하면 더 편할까?'라는 질문에 답하는 개발자들. 데일리 프롬프트가 당신의 아이디어를 완성합니다.",
            cta: "프로젝트 둘러보기"
        },
        projects: {
            tag: "Our Work",
            title: "Projects",
            tesla: {
                title: "Tesla DashCam Viewer",
                desc: "테슬라 오너를 위한 전문 대시캠 뷰어 솔루션. USB 연결만으로 차량의 모든 데이터를 시각화합니다.",
                features: [
                    "위치, 속도, 자율주행 유무 실시간 시각화",
                    "페달 조작 게이지 및 차량 세부 정보 제공",
                    "최대 6채널 영상 통합 및 합성 기능"
                ]
            }
        },
        footer: "© 2026 Daily Prompt. Powered by Innovation."
    },
    
    // Detect browser language
    detectLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.startsWith('ko') ? 'ko' : 'en';
    },
    
    // Load translations
    async loadTranslations(lang) {
        try {
            const response = await fetch(`locales/${lang}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.translations = await response.json();
            this.currentLang = lang;
            this.updatePage();
        } catch (error) {
            console.warn('Failed to load translations, using fallback:', error);
            // Use fallback translations
            this.translations = this.fallbackTranslations;
            this.currentLang = 'ko';
            this.updatePage();
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
                if (typeof value === 'string' && value.includes('<br>')) {
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

// Scroll Animation - Optimized for mobile
const observerOptions = {
    root: null,
    rootMargin: '50px 0px 50px 0px',  // Trigger earlier
    threshold: 0.05  // Lower threshold for faster trigger
};

const imageObserverOptions = {
    root: null,
    rootMargin: '100px 0px 100px 0px',  // Even earlier for images
    threshold: 0.01
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, imageObserverOptions);

// Observe elements
document.querySelectorAll('.reveal').forEach((element) => {
    observer.observe(element);
});

document.querySelectorAll('.reveal-image').forEach((element) => {
    imageObserver.observe(element);
});

// Smooth scroll for anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Check if device is likely desktop/tablet with mouse
const isDesktop = window.matchMedia("(min-width: 969px)").matches;

// Mouse movement parallax for hero background (Desktop only)
const hero = document.querySelector('.hero');
const heroBg = document.querySelector('.hero-bg');

if (hero && heroBg && isDesktop) {
    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const moveX = (clientX - centerX) / 25;
        const moveY = (clientY - centerY) / 25;
        
        heroBg.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
    });
}

// Project card hover 3D effect (Desktop only)
if (isDesktop) {
    document.querySelectorAll('.img-container').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
        });
    });
}
