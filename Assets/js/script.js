/**
 * Lucas Zimmer Portfolio Logic
 */

// --- INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    // On commence par charger les données JSON
    loadPortfolioData();

    // Initialisations structurelles
    initIcons();
    initAnimations();
    initScrollEvents();
    updateYear();
});

// --- DATA LOADING ---

/**
 * Fetches data from data.json and triggers content injection
 */
async function loadPortfolioData() {
    try {
        const response = await fetch('https://caelou.github.io/LZ/Assets/json/data.json');
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const data = await response.ok ? await response.json() : null;

        // Si fetch échoue localement (CORS), on pourrait utiliser un fallback
        // Ici, on injecte les données récupérées
        if (data) {
            renderSkills(data.skills);
            renderProjects(data.games);
            renderExperiences(data.experiences);

            // Re-initialiser les icônes pour les nouveaux éléments injectés
            initIcons();
            // Re-déclencher l'observateur d'animations pour les nouveaux éléments
            initAnimations();
        }
    } catch (error) {
        console.error("Impossible de charger les données du portfolio :", error);
        // Optionnel : Afficher un message d'erreur sur l'UI
    }
}

// --- RENDERING FUNCTIONS ---

/**
 * Injects Skills into the DOM
 */
function renderSkills(skills) {
    const container = document.getElementById('skills-container');
    if (!container || !skills) return;

    container.innerHTML = skills.map(skill => `
        <div>
            <div class="flex justify-between mb-3">
                <span class="flex items-center gap-3 font-bold text-sm uppercase tracking-tighter text-white">
                    <i data-lucide="${skill.icon}" class="w-4 h-4 text-unity"></i> ${skill.name}
                </span>
                <span class="text-unity font-mono text-xs">${skill.level}%</span>
            </div>
            <div class="h-[2px] bg-white/10 w-full">
                <div class="h-full bg-unity" style="width: ${skill.level}%"></div>
            </div>
        </div>
    `).join('');
}

/**
 * Injects Projects into the DOM
 */
function renderProjects(games) {
    const grid = document.getElementById('projects-grid');
    if (!grid || !games) return;

    grid.innerHTML = games.map(game => `
        <div class="reveal group bg-card border border-white/5 overflow-hidden transition-all hover:border-unity/50">
            <div class="relative h-56 overflow-hidden">
                <img src="${game.image}" alt="${game.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                <div class="absolute top-4 right-4 bg-unity text-bg text-[10px] font-bold px-2 py-1 tracking-tighter">
                    ${game.category}
                </div>
            </div>
            <div class="p-8">
                <h3 class="text-xl font-bold mb-3 group-hover:text-unity transition-colors italic text-white">${game.title}</h3>
                <p class="text-slate-400 text-sm mb-6 leading-relaxed">${game.desc}</p>
                <a href="${game.link}" target="_blank" class="text-xs font-bold tracking-widest hover:text-unity flex items-center gap-2 text-white">
                    EXPLORER SUR ITCH.IO <i data-lucide="external-link" class="w-3 h-3"></i>
                </a>
            </div>
        </div>
    `).join('');
}

/**
 * Injects Experiences into the DOM
 */
function renderExperiences(experiences) {
    const container = document.getElementById('experience-container');
    if (!container || !experiences) return;

    // On garde la ligne verticale de la timeline
    container.innerHTML = `<div class="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-unity via-csharp to-transparent opacity-30 hidden md:block"></div>`;

    container.innerHTML += experiences.map((exp, idx) => {
        const isEven = idx % 2 === 0;
        return `
            <div class="reveal relative flex flex-col md:flex-row items-center mb-20 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}">
                <div class="hidden md:block absolute left-1/2 w-3 h-3 bg-bg border-2 border-unity rounded-full transform -translate-x-1/2 z-10 shadow-[0_0_15px_rgba(250,204,21,0.5)]"></div>
                <div class="w-full md:w-1/2 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'} pl-10 md:pl-0">
                    <span class="text-unity font-mono text-xs mb-2 block tracking-widest">${exp.period}</span>
                    <h3 class="text-2xl font-black mb-1 text-white">${exp.role}</h3>
                    <span class="text-white/50 font-bold text-sm uppercase mb-4 block">${exp.company}</span>
                    <p class="text-slate-400 text-sm leading-relaxed max-w-md ${isEven ? 'md:ml-auto' : ''}">${exp.desc}</p>
                </div>
                <div class="hidden md:block w-1/2"></div>
            </div>
        `;
    }).join('');
}

// --- UTILS ---

/**
 * Initializes Lucide icons
 */
function initIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Setup intersection observer for reveal animations
 */
function initAnimations() {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/**
 * Navbar scroll management
 */
function initScrollEvents() {
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (!nav) return;

        if (window.scrollY > 50) {
            nav.classList.add('glass', 'py-2');
            nav.classList.remove('py-4');
        } else {
            nav.classList.remove('glass', 'py-2');
            nav.classList.add('py-4');
        }
    });
}

/**
 * Dynamic year for footer
 */
function updateYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.innerText = new Date().getFullYear();
    }
}