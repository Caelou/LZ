// --- LOGIQUE PARTICULES (Identique) ---
const canvas = document.getElementById('particles-js');
const ctx = canvas.getContext('2d');
let particles = [];
let siteData = {}; // Sera rempli par le JSON

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
            speedX: Math.random() * 0.4 - 0.2,
            speedY: Math.random() * 0.4 - 0.2,
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

// --- CHARGEMENT DES DONNÉES JSON ---
async function loadSiteData() {
    try {
        const response = await fetch('https://caelou.github.io/LZ/Assets/json/data1.json');
        siteData = await response.json();
        renderContent();
    } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
    }
}

// --- RENDU DYNAMIQUE ---
function renderContent() {
    // Date automatique
    document.getElementById('year').textContent = new Date().getFullYear();

    // Compétences
    document.getElementById('skills-container').innerHTML = siteData.competences
        .map(s => `<span class="skill-tag">${s}</span>`).join('');

    // Hackathons
    document.getElementById('hackathons-container').innerHTML = siteData.hackathons
        .map(h => `<span class="skill-tag" style="opacity: 0.8;">${h}</span>`).join('');

    // Expériences
    document.getElementById('exp-container').innerHTML = siteData.experiences
        .map(e => `
            <div class="exp-item">
                <div class="exp-header">
                    <span class="exp-title">${e.poste}</span>
                    <span class="exp-date">${e.date}</span>
                </div>
                <span class="exp-company">${e.entreprise}</span>
                <p style="color:var(--text-muted);">${e.description}</p>
            </div>`).join('');

    // Projets
    document.getElementById('projects-container').innerHTML = siteData.projets
        .map(p => `
            <div class="project-card" onclick="openModal('${p.id}')">
                <div class="project-img" style="background-image:url('${p.img}')"></div>
                <div class="project-info">
                    <h3>${p.titre}</h3>
                    <p>${p.resume}</p>
                </div>
            </div>`).join('');

    lucide.createIcons();
}

// --- GESTION MODALE ---
function openModal(projectId) {
    const project = siteData.projets.find(p => p.id === projectId);
    if (!project) return;

    document.getElementById('modal-body').innerHTML = `
        <div class="modal-content">
            <div class="modal-visuals">
                <iframe src="https://www.youtube.com/embed/v=${project.youtubeId}" frameborder="0" allowfullscreen></iframe>
            </div>
            <div class="modal-text">
                <h1>${project.titre}</h1>
                <p class="modal-description">${project.description}</p>
                <a href="${project.downloadUrl}" class="btn">Obtenir le projet <i data-lucide="download"></i></a>
            </div>
        </div>`;
    document.getElementById('project-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
}

function closeModal() {
    document.getElementById('project-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// --- INITIALISATION ---
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    requestAnimationFrame(animateParticles);
    loadSiteData(); // Charge le JSON
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

window.addEventListener('resize', initParticles);