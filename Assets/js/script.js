// --- VARIABLES GLOBALES ET DONNÉES ---
let siteData = {};

// --- INITIALISATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Remplissage de l'année
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Simulation de chargement JSON (On peut aussi utiliser fetch('data.json'))
    initParticles();
    requestAnimationFrame(animateParticles);
    lucide.createIcons();
    loadSiteData();
});
async function loadSiteData() {
    try {
        const response = await fetch('https://caelou.github.io/LZ/Assets/json/data.json');
        siteData = await response.json();
        renderContent();
    } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
    }
}
// --- RENDU DU CONTENU ---
function renderContent() {
    // Compétences
    document.getElementById('skills-container').innerHTML = siteData.competences.map(s => `
        <span class="px-6 py-2 bg-yellow-400/5 border border-yellow-400/20 text-yellow-400 rounded font-semibold hover:bg-yellow-400/10 hover:border-yellow-400 transition-all cursor-default">
            ${s}
        </span>`).join('');

    // Hackathons
    document.getElementById('hackathons-container').innerHTML = siteData.hackathons.map(h => `
        <span class="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded text-sm font-medium">
            ${h}
        </span>`).join('');

    // Expériences
    document.getElementById('exp-container').innerHTML = siteData.experiences.map(e => `
        <div class="relative pl-8 border-l-2 border-yellow-400">
            <div class="absolute -left-[9px] top-0 w-4 h-4 bg-yellow-400 rounded-full"></div>
            <div class="flex justify-between items-baseline mb-1">
                <span class="text-xl font-bold text-yellow-400">${e.poste}</span>
                <span class="text-sm text-gray-500 font-medium">${e.date}</span>
            </div>
            <span class="block italic text-white mb-4">${e.entreprise}</span>
            <p class="text-gray-400 leading-relaxed">${e.description}</p>
        </div>`).join('');

    // Projets
    document.getElementById('projects-container').innerHTML = siteData.projets.map(p => `
        <div class="bg-[#1a1a1a] rounded-xl overflow-hidden cursor-pointer border border-white/5 hover:border-yellow-400 transition-all hover:scale-[1.02]" onclick="openModal('${p.id}')">
            <div class="h-56 bg-cover bg-center relative" style="background-image:url('${p.img}')">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold text-yellow-400 mb-2">${p.titre}</h3>
                <p class="text-gray-400 text-sm">${p.resume}</p>
            </div>
        </div>`).join('');
}

// --- GESTION DU MODAL ---
function openModal(projectId) {
    const project = siteData.projets.find(p => p.id === projectId);
    document.getElementById('modal-body').innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div class="aspect-video w-full">
                <iframe src="https://www.youtube.com/embed/${project.youtubeId}" class="w-full h-full rounded-lg" frameborder="0" allowfullscreen></iframe>
            </div>
            <div class="space-y-6">
                <h1 class="text-5xl font-black">${project.titre}</h1>
                <p class="text-xl text-gray-400 leading-relaxed">${project.description}</p>
                <a href="${project.downloadUrl}" class="bg-yellow-400 text-black px-8 py-4 font-bold rounded uppercase text-sm inline-flex items-center gap-2 hover:bg-yellow-300 transition-colors">
                    Obtenir le projet <i data-lucide="download" class="w-4 h-4"></i>
                </a>
            </div>
        </div>`;
    document.getElementById('project-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
}

function closeModal() {
    document.getElementById('project-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// --- LOGIQUE PARTICULES ---
const canvas = document.getElementById('particles-js');
const ctx = canvas.getContext('2d');
let particles = [];

function initParticles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < 60; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            baseSize: Math.random() * 1.5 + 0.5,
            size: 0,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: (Math.random() - 0.5) * 0.4,
            opacity: 0,
            pulseSpeed: Math.random() * 0.02 + 0.01,
            pulseOffset: Math.random() * Math.PI * 2
        });
    }
}

function animateParticles(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFD700';
    particles.forEach(p => {
        const pulse = Math.sin(time * 0.001 * p.pulseSpeed * 100 + p.pulseOffset);
        p.size = p.baseSize * (1 + pulse * 0.5);
        p.opacity = (pulse + 1) / 2 * 0.4 + 0.1;
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.speedX; p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
    });
    requestAnimationFrame(animateParticles);
}

// --- LISTENERS ---
window.addEventListener('scroll', () => {
    const indicator = document.getElementById('scroll-indicator');
    if (window.scrollY > 50) {
        indicator.style.opacity = '0';
        indicator.style.pointerEvents = 'none';
        indicator.style.transform = 'translate(-50%, 20px)';
    } else {
        indicator.style.opacity = '0.5';
        indicator.style.pointerEvents = 'auto';
        indicator.style.transform = 'translate(-50%, 0)';
    }
});

window.addEventListener('resize', initParticles);