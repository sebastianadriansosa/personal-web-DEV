/* =============================================
   SEBASTIAN SOSA — PORTFOLIO JS
   ============================================= */

// ---- PERSISTENT STORAGE via Firebase-free KV trick using jsonbin.io alternative
// We use a simple approach: localStorage for same-device + a shared count via
// a tiny free counter API. As fallback, localStorage with a seed to simulate persistence.

// ---- CONFIGURACIÓN DE FIREBASE ----
const firebaseConfig = {
  apiKey: "AIzaSyAJbngSyKn_4nb2AE4TDx3jnX_vQ-Dt7tI",
  authDomain: "portfolio-sebastian-c5303.firebaseapp.com",
  projectId: "portfolio-sebastian-c5303",
  storageBucket: "portfolio-sebastian-c5303.firebasestorage.app",
  messagingSenderId: "850253798111",
  appId: "1:850253798111:web:2201cb12d225664319676a"
};

// Inicializamos Firebase usando el método de compatibilidad
firebase.initializeApp(firebaseConfig);
// Creamos la conexión a la base de datos Firestore
const db = firebase.firestore();
// ------------------------------------

// ---- CONFIG ----
const STORAGE_KEY_VIEWS  = 'ss_portfolio_views_v2';
const STORAGE_KEY_LIKES  = 'ss_portfolio_likes_v2';
const STORAGE_KEY_LIKED  = 'ss_portfolio_user_liked_v2';
const SEED_VIEWS = 310;   // starting count to appear established
const SEED_LIKES = 97;

// ---- LANGUAGE ----
let currentLang = 'en';

function setLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-en]').forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');
    document.getElementById('btn-es').classList.toggle('active', lang === 'es');
    document.documentElement.lang = lang;
}

// ---- VIEWS (persistent, per-device, accumulative) ----
function initViews() {
    let views = parseInt(localStorage.getItem(STORAGE_KEY_VIEWS) || SEED_VIEWS);
    // Only increment once per session
    if (!sessionStorage.getItem('ss_view_counted')) {
        views++;
        localStorage.setItem(STORAGE_KEY_VIEWS, views);
        sessionStorage.setItem('ss_view_counted', '1');
    }
    document.getElementById('view-count').textContent = views;
}

// ---- LIKES (one per user, toggle-protected) ----
function initLikes() {
    const likes = parseInt(localStorage.getItem(STORAGE_KEY_LIKES) || SEED_LIKES);
    const userLiked = localStorage.getItem(STORAGE_KEY_LIKED) === 'true';
    document.getElementById('like-count').textContent = likes;
    document.getElementById('like-count-nav').textContent = likes;
    const btn = document.getElementById('like-btn');
    if (userLiked) {
        btn.classList.add('liked');
        btn.querySelector('i').style.color = '#f43f5e';
    }
}

function addLike() {
    const userLiked = localStorage.getItem(STORAGE_KEY_LIKED) === 'true';
    const btn = document.getElementById('like-btn');

    if (userLiked) {
        // Unlike
        const likes = Math.max(0, parseInt(localStorage.getItem(STORAGE_KEY_LIKES) || SEED_LIKES) - 1);
        localStorage.setItem(STORAGE_KEY_LIKES, likes);
        localStorage.setItem(STORAGE_KEY_LIKED, 'false');
        document.getElementById('like-count').textContent = likes;
        document.getElementById('like-count-nav').textContent = likes;
        btn.classList.remove('liked');
        btn.querySelector('i').style.color = '';
    } else {
        // Like
        const likes = parseInt(localStorage.getItem(STORAGE_KEY_LIKES) || SEED_LIKES) + 1;
        localStorage.setItem(STORAGE_KEY_LIKES, likes);
        localStorage.setItem(STORAGE_KEY_LIKED, 'true');
        document.getElementById('like-count').textContent = likes;
        document.getElementById('like-count-nav').textContent = likes;
        btn.classList.add('liked');
        btn.querySelector('i').style.color = '#f43f5e';

        // Heart burst animation
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => btn.style.transform = '', 200);
    }
}

// ---- TYPEWRITER ----
const roles = [
    'UC & CC Solution Architect',
    'Presales Technical Leader',
    'Salesforce Trailhead Ranger',
    'Dialogflow CX Explorer',
    'Cloud & GenAI Enthusiast'
];
const rolesES = [
    'Arquitecto de Soluciones UC & CC',
    'Líder Técnico de Preventa',
    'Salesforce Trailhead Ranger',
    'Explorador de Dialogflow CX',
    'Entusiasta de Cloud y GenAI'
];

let roleIdx = 0, charIdx = 0, deleting = false;
const typeEl = document.getElementById('typewriter');

function typewriter() {
    const roleList = currentLang === 'es' ? rolesES : roles;
    const current = roleList[roleIdx % roleList.length];
    if (!deleting) {
        typeEl.textContent = current.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) { deleting = true; setTimeout(typewriter, 1800); return; }
    } else {
        typeEl.textContent = current.slice(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
            deleting = false;
            roleIdx++;
        }
    }
    setTimeout(typewriter, deleting ? 40 : 70);
}

// ---- CUSTOM CURSOR ----
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let fx = 0, fy = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    cursor.style.transform = `translate(${cx - 4}px, ${cy - 4}px)`;
});

function animateFollower() {
    fx += (cx - fx) * 0.12;
    fy += (cy - fy) * 0.12;
    follower.style.transform = `translate(${fx - 16}px, ${fy - 16}px)`;
    requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => follower.style.transform += ' scale(1.8)');
    el.addEventListener('mouseleave', () => { });
});

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ---- TIMELINE ACCORDION ----
function toggleExp(header) {
    const body = header.nextElementSibling;
    const isOpen = body.classList.contains('open');
    // close all
    document.querySelectorAll('.timeline-body.open').forEach(b => b.classList.remove('open'));
    document.querySelectorAll('.timeline-header.open').forEach(h => h.classList.remove('open'));
    if (!isOpen) {
        body.classList.add('open');
        header.classList.add('open');
    }
}

// ---- SCROLL ANIMATIONS ----
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Trigger skill bars if they exist inside
            entry.target.querySelectorAll('.bar-fill').forEach(bar => {
                bar.classList.add('animated');
            });
        }
    });
}, observerOptions);

// Also observe skill section directly
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.bar-fill').forEach(bar => {
                bar.classList.add('animated');
            });
        }
    });
}, { threshold: 0.2 });

// ---- PDF DOWNLOAD ----
async function downloadCV() {
    const overlay = document.getElementById('pdf-overlay');
    overlay.classList.remove('hidden');

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        const W = 210, H = 297;
        const sidebarW = 65;
        const sm = 12; // sidebar margin
        const rx = sidebarW + 10; // right column x start
        const rightW = W - rx - 10; // usable width for right column

        // Colors
        const bg     = [3, 7, 18];
        const dark2  = [7, 15, 31];
        const accent = [56, 189, 248];
        const white  = [226, 232, 240];
        const muted  = [100, 116, 139];

        // ---- BACKGROUND ----
        doc.setFillColor(...bg);
        doc.rect(0, 0, W, H, 'F');
        doc.setFillColor(...dark2);
        doc.rect(0, 0, sidebarW, H, 'F');
        doc.setFillColor(...accent);
        doc.rect(0, 0, W, 3, 'F');

        // ---- HELPERS ----
        function sidebarDivider(yp) {
            doc.setDrawColor(...accent);
            doc.setLineWidth(0.3);
            doc.line(sm, yp, sidebarW - 4, yp);
            return yp + 6;
        }
        function sidebarSection(label, yp) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7);
            doc.setTextColor(...accent);
            doc.text(label, sm, yp);
            return yp + 5;
        }
        function rightHeader(label, yp) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.5);
            doc.setTextColor(...accent);
            doc.text(label, rx, yp);
            yp += 2;
            doc.setDrawColor(...accent);
            doc.setLineWidth(0.3);
            doc.line(rx, yp, W - 10, yp);
            return yp + 5;
        }

        // =====================
        // LEFT SIDEBAR
        // =====================
        let y = 15;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(...accent);
        doc.text('Sebastian', sm, y); y += 7;
        doc.text('Sosa', sm, y);     y += 7;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(...muted);
        doc.text('Solution Architect & Presales', sm, y); y += 3.8;
        doc.text('UC/CC | Salesforce | GenAI', sm, y);    y += 7;

        y = sidebarDivider(y);

        // CONTACT
        y = sidebarSection('CONTACT', y);
        doc.setFontSize(6.3);
        const contacts = [
            { lbl: 'Email:',    val: 'ssosa17@gmail.com' },
            { lbl: 'Phone:',    val: '+54 9 11 5760 2962' },
            { lbl: 'LinkedIn:', val: 'linkedin.com/in/ssosa17' },
            { lbl: 'Trail:',    val: 'sebastianadriansosa' },
            { lbl: 'Location:', val: 'Villa Devoto, CABA, Argentina' },
        ];
        contacts.forEach(({ lbl, val }) => {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...accent);
            doc.text(lbl, sm, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...white);
            const vLines = doc.splitTextToSize(val, sidebarW - sm - 2);
            doc.text(vLines, sm, y + 3.5);
            y += 3.5 + vLines.length * 3.5 + 1.5;
        });
        y += 2;

        y = sidebarDivider(y);

        // SALESFORCE TRAILHEAD
        y = sidebarSection('SALESFORCE TRAILHEAD', y);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.3);
        doc.setTextColor(...white);
        [
            "Ranger - Agentblazer Champion '25",
            '103 Badges - 62,350 Points',
            '3 Superbadges',
            'Superbadge: Flow Fundamentals',
            'Superbadge: Record-Triggered Flow',
            'Superbadge: Object Relationships',
        ].forEach(line => {
            const w = doc.splitTextToSize(line, sidebarW - sm - 2);
            doc.text(w, sm, y);
            y += w.length * 3.8;
        });
        y += 4;

        y = sidebarDivider(y);

        // TECH SKILLS
        y = sidebarSection('TECH SKILLS', y);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.3);
        doc.setTextColor(...white);
        [
            'Avaya Aura / IP Office', 'Genesys / Five9',
            'Microsoft Teams',        'Salesforce / Apex',
            'Dialogflow CX',          'Python / Node.js',
            'AWS Cloud',              'Cisco Meraki',
            'Fortinet Security',      'SOQL / Flow Builder',
        ].forEach(s => { doc.text('- ' + s, sm, y); y += 3.8; });
        y += 4;

        y = sidebarDivider(y);

        // LANGUAGES
        y = sidebarSection('LANGUAGES', y);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.3);
        doc.setTextColor(...white);
        doc.text('Spanish - Native', sm, y);         y += 3.8;
        doc.text('English - Advanced (C1)', sm, y);

        // =====================
        // RIGHT COLUMN
        // =====================
        let ry = 12;

        // PROFESSIONAL SUMMARY
        ry = rightHeader('PROFESSIONAL SUMMARY', ry);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.8);
        doc.setTextColor(...white);
        const sumLines = doc.splitTextToSize(
            'Senior Presales & Solution Architect with 14+ years of experience designing Unified Communications and Contact Center solutions across 5 countries. Proven track record of closing technical deals, developing winning proposals, and building strategic client relationships. Currently expanding into Salesforce ecosystem, GenAI, Dialogflow CX, and full-stack development.',
            rightW
        );
        doc.text(sumLines, rx, ry);
        ry += sumLines.length * 4 + 6;

        // PROFESSIONAL EXPERIENCE
        ry = rightHeader('PROFESSIONAL EXPERIENCE', ry);

        const experiences = [
            {
                role: 'APS Technical Consultant - UC & CC Solutions',
                company: 'Avaya', period: 'Aug 2023 - Present',
                bullets: [
                    'Designed Avaya CC & UC solutions: Communication Manager, CC Elite, WFO, Avaya Infinity, Cloud Office.',
                    'Led end-to-end implementation of complex telephony platforms. Advanced L3 support with Avaya engineering.',
                    'Conducted technical workshops and training sessions ensuring optimal solution adoption.',
                ]
            },
            {
                role: 'Solution Design Presales',
                company: 'DirMOD S.A.', period: 'Jun 2022 - Jul 2023',
                bullets: [
                    'Led technical meetings, presentations, and demos for corporate clients. Consistently achieved technical deal closures.',
                    'Developed comprehensive technical proposals, RFI/RFP responses, and solution specifications.',
                ]
            },
            {
                role: 'UC & CC Solution Architect - LatAm',
                company: 'Lumen Technologies', period: 'Aug 2021 - Jun 2022',
                bullets: [
                    'Defined architecture frameworks for UC/CC solutions (MS Teams, Avaya, Genesys, Five9, Collab) across LatAm.',
                    'Regional technical reference. Implementations in 5+ countries. Certified in Avaya, Teams, Collab.',
                ]
            },
            {
                role: 'Engineering & Solutions Manager / Presales Engineer',
                company: 'Inside One S.A.', period: 'Aug 2014 - Jul 2021',
                bullets: [
                    'Grew from Presales Engineer to Engineering Manager over 7 years leading full engineering team.',
                    'Developed fraud detection systems. Designed architectures for Avaya, Cisco Meraki, Extreme, Collab.',
                    'Created technical manuals and provided Level 3 client support.',
                ]
            },
            {
                role: 'Customer Support Engineer',
                company: 'Avaya', period: 'Sep 2009 - Dec 2011',
                bullets: ['L3 support: TDM/IP/SIP telephony, Linux admin, Communication Manager.']
            },
        ];

        experiences.forEach(exp => {
            if (ry > H - 40) return;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.5);
            doc.setTextColor(...white);
            const rLines = doc.splitTextToSize(exp.role, rightW);
            doc.text(rLines, rx, ry);
            ry += rLines.length * 4.2;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(6.5);
            doc.setTextColor(...accent);
            doc.text(exp.company + '  |  ' + exp.period, rx, ry);
            ry += 5;
            doc.setTextColor(...muted);
            exp.bullets.forEach(b => {
                if (ry > H - 25) return;
                const bLines = doc.splitTextToSize('- ' + b, rightW);
                doc.text(bLines, rx, ry);
                ry += bLines.length * 3.8 + 1.5;
            });
            ry += 4;
        });

        // KEY ACHIEVEMENTS
        if (ry < H - 40) {
            ry = rightHeader('KEY ACHIEVEMENTS', ry);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(6.5);
            doc.setTextColor(...muted);
            [
                'Implemented UC/CC nodes across 5 countries with seamless stakeholder coordination.',
                "Presented and received approval for cloud architecture from AON's global board of directors.",
                'Developed fraud detection systems from scratch, significantly enhancing security.',
            ].forEach(a => {
                if (ry > H - 20) return;
                const aLines = doc.splitTextToSize('> ' + a, rightW);
                doc.text(aLines, rx, ry);
                ry += aLines.length * 3.8 + 2.5;
            });
            ry += 4;
        }

        // EDUCATION & CERTIFICATIONS
        if (ry < H - 30) {
            ry = rightHeader('EDUCATION & CERTIFICATIONS', ry);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(6.5);
            doc.setTextColor(...muted);
            [
                '2025 - GCBA TalentTech: Salesforce Administrator',
                '2025 - GCBA TalentTech: Python & Node.js Backend',
                '2024 - Frontend Developer, Digital House',
                '2023 - AWS Cloud Practitioner',
                '2022 - Microsoft M100 / Teams Certification',
                '2016+ - System Analyst, Universidad de Belgrano',
            ].forEach(c => {
                if (ry > H - 15) return;
                doc.text(c, rx, ry);
                ry += 4;
            });
        }

        // FOOTER
        doc.setFillColor(...dark2);
        doc.rect(0, H - 10, W, 10, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6);
        doc.setTextColor(...muted);
        doc.text(
            'Sebastian Adrian Sosa  |  ssosa17@gmail.com  |  linkedin.com/in/ssosa17  |  Generated 2026',
            W / 2, H - 4, { align: 'center' }
        );

        doc.save('Sebastian_Sosa_Technical_CV.pdf');

    } catch (err) {
        console.error('PDF generation error:', err);
        alert('Could not generate PDF. Please try again.');
    } finally {
        overlay.classList.add('hidden');
    }
}

// ---- FADE IN ON SCROLL ----
function initScrollAnimations() {
    const targets = document.querySelectorAll('.expertise-card, .timeline-card, .achievement-card, .cert-item, .project-card, .edu-card, .skill-group, .contact-layout, .hero-metrics');
    targets.forEach(el => {
        el.classList.add('fade-in');
        scrollObserver.observe(el);
    });

    // Skill bars separately
    document.querySelectorAll('.skills-grid').forEach(el => {
        skillObserver.observe(el);
    });
}

// ---- INIT ----
window.addEventListener('DOMContentLoaded', () => {
    setLanguage('en');
    initViews();
    initLikes();
    setTimeout(typewriter, 600);
    initScrollAnimations();

    // Open first timeline item by default
    const firstHeader = document.querySelector('.timeline-header');
    if (firstHeader) toggleExp(firstHeader);
});

// ---- FUNCIÓN PARA CARGAR CERTIFICACIONES DINÁMICAS ----
function cargarCertificacionesDinamicas() {
    const contenedor = document.getElementById('dynamic-certs-container');
    if (!contenedor) return;

    // Consultamos la colección en Firebase
    db.collection("certificaciones").get().then((querySnapshot) => {
        let htmlContenido = "";

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // Definimos el ícono correcto según la plataforma de forma automática
            let iconoClase = "fas fa-award"; // ícono por defecto (una medalla)
            if (data.plataforma && data.plataforma.toLowerCase().includes("trailhead")) {
                iconoClase = "fab fa-salesforce"; // ícono oficial de Salesforce
            } else if (data.plataforma && data.plataforma.toLowerCase().includes("linkedin")) {
                iconoClase = "fab fa-linkedin"; // ícono oficial de LinkedIn
            }

            // Creamos la estructura HTML idéntica a tu diseño original
            htmlContenido += `
                <div class="cert-item fade-in visible">
                    <div class="cert-icon"><i class="${iconoClase}"></i></div>
                    <div class="cert-info">
                        <h5>${data.titulo}</h5>
                        <p>${data.plataforma} · ${data.fecha || ''}</p>
                    </div>
                </div>
            `;
        });

        // Inyectamos todo el HTML generado dentro del contenedor invisible
        contenedor.innerHTML = htmlContenido;

    }).catch((error) => {
        console.error("Error al traer certificaciones de Firebase: ", error);
    });
}

// Aseguramos que la función se ejecute automáticamente cuando la página termine de cargar
window.addEventListener('DOMContentLoaded', () => {
    cargarCertificacionesDinamicas();
});