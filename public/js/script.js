(function () {
    const defaultSite = {
        name: 'Bylaba Projects',
        email: 'bylabaprojects@gmail.com',
        github: 'https://github.com/Fravha',
        linkedin: 'https://www.linkedin.com/in/franciscobailaba/',
        year: '2026'
    };
    let data = { site: defaultSite, projects: [] };
    const body = document.body;
    const rootPath = body.dataset.root || '.';
    const pageType = body.dataset.page || 'home';

    const icons = {
        light: `
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 4V2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M12 22v-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="m4.93 4.93 1.41 1.41" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="m17.66 17.66 1.41 1.41" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M2 12h2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M20 12h2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="m4.93 19.07 1.41-1.41" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="m17.66 6.34 1.41-1.41" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/>
            </svg>
        `,
        dark: `
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20.5 14.6A7.8 7.8 0 0 1 9.4 3.5 8.8 8.8 0 1 0 20.5 14.6Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
        `
    };

    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
            return;
        }

        callback();
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function asArray(value) {
        return Array.isArray(value) ? value.filter((item) => item !== null && item !== undefined && item !== '') : [];
    }

    function isPlainObject(value) {
        return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
    }

    function hasObjectValues(value) {
        return isPlainObject(value) && Object.values(value).some((item) => item !== null && item !== undefined && item !== '');
    }

    function formatBoolean(value) {
        return value ? 'Sí' : 'No';
    }

    function clampProgress(value) {
        const progress = Number(value);

        if (!Number.isFinite(progress)) {
            return 0;
        }

        return Math.min(Math.max(progress, 0), 100);
    }

    function normalizeLabel(value) {
        const labels = {
            installer: 'Instalador',
            portable: 'Portable',
            prototype: 'Prototipo',
            experimental: 'Experimental'
        };
        const key = String(value || '').trim().toLowerCase();

        return labels[key] || value;
    }

    function isSafeColor(value) {
        return /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(String(value || '').trim());
    }

    function setOptionalCssVariable(name, value) {
        if (isSafeColor(value)) {
            body.style.setProperty(name, String(value).trim());
            return;
        }

        body.style.removeProperty(name);
    }

    function resolvePath(path) {
        if (!path || path.startsWith('#') || path.startsWith('http') || path.startsWith('mailto:')) {
            return path;
        }

        if (rootPath === '.' || rootPath === './') {
            return path;
        }

        return `${rootPath.replace(/\/$/, '')}/${path}`;
    }

    function homeLink(anchor = '') {
        if (pageType === 'home') {
            return anchor || '#inicio';
        }

        return resolvePath(`index.html${anchor}`);
    }

    async function loadProjectData() {
        const dataPath = resolvePath('data/projects.json');

        try {
            const response = await fetch(dataPath, { cache: 'no-cache' });

            if (!response.ok) {
                throw new Error(`No se pudo cargar ${dataPath}`);
            }

            const payload = await response.json();
            const projects = Array.isArray(payload) ? payload : payload.projects;
            const site = Array.isArray(payload) ? {} : payload.site;

            data = {
                site: { ...defaultSite, ...(site || {}) },
                projects: Array.isArray(projects) ? projects : []
            };
        } catch (error) {
            console.error(error);
            data = { site: defaultSite, projects: [] };
        }
    }

    function renderSiteHeader() {
        const header = document.getElementById('siteHeader');

        if (!header) {
            return;
        }

        const logoPath = resolvePath('assets/img/logoBylaba.png');
        const pageContainer = document.querySelector('[data-project-page]');
        const currentProject = pageContainer
            ? data.projects.find((project) => project.slug === pageContainer.dataset.projectPage)
            : null;
        const hasProjectDetails = Boolean(currentProject) && (
            asArray(currentProject.platforms).length ||
            asArray(currentProject.tech).length ||
            hasObjectValues(currentProject.development) ||
            hasObjectValues(currentProject.distribution)
        );
        const hasApproach = asArray(currentProject?.page?.approach).length > 0;
        const hasDownloads = asArray(currentProject?.downloads).length > 0;
        const navItems = pageType === 'project'
            ? [
                { href: homeLink('#inicio'), label: 'Inicio' },
                { href: homeLink('#proyectos'), label: 'Proyectos' },
                { href: '#roadmap', label: 'Roadmap' },
                { href: '#features', label: 'Funciones' },
                hasProjectDetails ? { href: '#detalles', label: 'Detalles' } : null,
                hasApproach ? { href: '#aprendizaje', label: 'Enfoque' } : null,
                hasDownloads ? { href: '#downloads', label: 'Descargas' } : null
            ].filter(Boolean)
            : [
                { href: '#inicio', label: 'Inicio' },
                { href: '#proyectos', label: 'Proyectos' },
                { href: '#construccion', label: 'En construcción' },
                { href: '#proposito', label: 'Propósito' },
                { href: '#contacto', label: 'Contacto' }
            ];

        header.innerHTML = `
            <nav class="site-nav" aria-label="Navegación principal">
                <a class="brand" href="${homeLink('#inicio')}" aria-label="${escapeHtml(data.site.name || 'Bylaba Projects')}">
                    <img src="${logoPath}" alt="Logo de ${escapeHtml(data.site.name || 'Bylaba Projects')}" class="brand-logo">
                    <span>${escapeHtml(data.site.name || 'Bylaba Projects')}</span>
                </a>

                <button class="nav-toggle" id="navToggle" type="button" aria-label="Abrir navegación" aria-controls="primaryNav" aria-expanded="false">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <ul class="nav-links" id="primaryNav">
                    ${navItems.map((item) => `<li><a href="${item.href}">${escapeHtml(item.label)}</a></li>`).join('')}
                </ul>

                <button class="theme-toggle" id="themeToggle" type="button" aria-label="Cambiar tema" title="Cambiar tema">
                    <span id="themeIcon" aria-hidden="true"></span>
                </button>
            </nav>
        `;
    }

    function renderSiteFooter() {
        const footer = document.getElementById('siteFooter');

        if (!footer) {
            return;
        }

        footer.innerHTML = `
            <div class="footer-inner">
                <a class="brand footer-brand" href="${homeLink('#inicio')}" aria-label="Volver al inicio">
                    <img src="${resolvePath('assets/img/logoBylaba.png')}" alt="" class="brand-logo" aria-hidden="true">
                    <span>${escapeHtml(data.site.name || 'Bylaba Projects')}</span>
                </a>
                <p>© ${escapeHtml(data.site.year || new Date().getFullYear())} ${escapeHtml(data.site.name || 'Bylaba Projects')}. Construyendo proyectos reales.</p>
            </div>
        `;
    }

    function projectCard(project) {
        const isActive = Boolean(project.href);
        const statusClass = project.statusVariant === 'live' ? ' status-live' : '';
        const link = isActive
            ? `<a class="text-link" href="${resolvePath(project.href)}">Ver proyecto</a>`
            : '<span class="text-link is-disabled" aria-disabled="true">Próximamente</span>';

        return `
            <article class="project-card${isActive ? ' project-card-featured' : ''} reveal">
                <div class="project-topline">
                    <span class="project-initials">${escapeHtml(project.initials)}</span>
                    <span class="status-pill${statusClass}">${escapeHtml(project.status || project.category)}</span>
                </div>
                <h3>${escapeHtml(project.name)}</h3>
                <p>${escapeHtml(project.description)}</p>
                <ul class="tag-list">
                    ${(project.tags || []).map((tag) => `<li>${escapeHtml(tag)}</li>`).join('')}
                </ul>
                ${link}
            </article>
        `;
    }

    function renderProjectList() {
        const container = document.querySelector('[data-project-list]');

        if (!container) {
            return;
        }

        container.innerHTML = data.projects.map(projectCard).join('');
    }

    function metricItem(metric) {
        return `
            <div>
                <dt>${escapeHtml(metric.value)}</dt>
                <dd>${escapeHtml(metric.label)}</dd>
            </div>
        `;
    }

    function detailItem(label, value) {
        if (value === null || value === undefined || value === '') {
            return '';
        }

        return `
            <div>
                <dt>${escapeHtml(label)}</dt>
                <dd>${escapeHtml(value)}</dd>
            </div>
        `;
    }

    function renderRoadmap(roadmap) {
        return roadmap.map((item, index) => `
            <article class="roadmap-item${item.active ? ' is-active' : ''} reveal">
                <span>${String(index + 1).padStart(2, '0')}</span>
                <div>
                    <h3>${escapeHtml(typeof item === 'string' ? item : item.title)}</h3>
                    ${typeof item === 'string' || !item.description ? '' : `<p>${escapeHtml(item.description)}</p>`}
                </div>
            </article>
        `).join('');
    }

    function getInitials(value) {
        return String(value || '')
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join('');
    }

    function renderFeature(feature) {
        const title = typeof feature === 'string' ? feature : feature.title;
        const description = typeof feature === 'string' ? '' : feature.description;
        const initials = typeof feature === 'string' ? getInitials(feature) : feature.initials || getInitials(title);

        return `
            <article class="project-card reveal">
                <div class="project-topline">
                    <span class="project-initials">${escapeHtml(initials)}</span>
                </div>
                <h3>${escapeHtml(title)}</h3>
                ${description ? `<p>${escapeHtml(description)}</p>` : ''}
            </article>
        `;
    }

    function normalizeProjectPage(project) {
        const page = project.page || {};
        const roadmap = page.roadmap || project.roadmap || [];
        const features = page.features || project.features || [];
        const platforms = asArray(project.platforms);
        const tech = asArray(project.tech);
        const development = isPlainObject(project.development) ? project.development : {};
        const summaryMetrics = [
            development.version ? { value: development.version, label: 'versión actual' } : null,
            platforms.length ? { value: String(platforms.length), label: 'plataformas' } : null,
            tech.length ? { value: String(tech.length), label: 'tecnologías' } : null
        ].filter(Boolean);

        return {
            title: page.title || `${project.name} | ${data.site.name}`,
            metaDescription: page.metaDescription || project.description,
            eyebrow: page.eyebrow || project.category || 'Proyecto',
            lead: page.lead || project.tagline || project.description,
            heroText: page.heroText || project.description,
            summaryStatus: page.summaryStatus || development.stability || project.currentPhase || project.status,
            metrics: page.metrics || (summaryMetrics.length ? summaryMetrics : [
                { value: String(roadmap.length), label: 'etapas' },
                { value: String(features.length), label: 'funciones' },
                { value: project.currentPhase || project.status, label: 'fase actual' }
            ]),
            summaryTitle: page.summaryTitle || project.tagline || project.name,
            summary: page.summary || [project.description],
            currentStatusTitle: page.currentStatusTitle || `Fase actual: ${project.currentPhase || development.phase || project.status}`,
            currentPhase: page.currentPhase || project.currentPhase || development.phase || project.status,
            currentStatusDescription: page.currentStatusDescription || project.description,
            progress: page.progress ?? project.progress ?? 0,
            roadmapTitle: page.roadmapTitle || 'Roadmap del proyecto.',
            roadmap,
            featuresTitle: page.featuresTitle || 'Funciones principales.',
            features,
            approachTitle: page.approachTitle || 'Enfoque y aprendizaje.',
            approach: page.approach || []
        };
    }

    function getProjectTheme(project) {
        const theme = project?.page?.theme || project?.theme || project?.branding?.theme;

        if (!theme) {
            return '';
        }

        const normalizedTheme = String(theme).trim().toLowerCase();

        return /^[a-z0-9-]+$/.test(normalizedTheme) ? normalizedTheme : '';
    }

    function applyProjectTheme(project) {
        const theme = getProjectTheme(project);
        const currentThemeLink = document.querySelector('link[data-project-theme-stylesheet]');

        if (!theme) {
            delete body.dataset.projectTheme;
            currentThemeLink?.remove();
        } else {
            let themeLink = currentThemeLink;
            const themeHref = resolvePath(`public/css/themes/${theme}.css`);

            body.dataset.projectTheme = theme;

            if (!themeLink) {
                themeLink = document.createElement('link');
                themeLink.rel = 'stylesheet';
                themeLink.setAttribute('data-project-theme-stylesheet', theme);
                document.head.appendChild(themeLink);
            }

            if (themeLink.getAttribute('href') !== themeHref) {
                themeLink.setAttribute('href', themeHref);
            }

            themeLink.setAttribute('data-project-theme-stylesheet', theme);
        }

        if (project?.branding) {
            setOptionalCssVariable('--primary', project.branding.primaryColor);
            setOptionalCssVariable('--accent', project.branding.accentColor);
            setOptionalCssVariable('--surface-muted', project.branding.surfaceColor);
            return;
        }

        body.style.removeProperty('--primary');
        body.style.removeProperty('--accent');
        body.style.removeProperty('--surface-muted');
    }

    function renderListSection({ id, eyebrow, title, items, tinted = false }) {
        const normalizedItems = asArray(items);

        if (!normalizedItems.length) {
            return '';
        }

        return `
            <section class="section${tinted ? ' section-tinted' : ''}"${id ? ` id="${id}"` : ''} aria-labelledby="${id}-title">
                <div class="section-heading reveal">
                    <p class="eyebrow">${escapeHtml(eyebrow)}</p>
                    <h2 id="${id}-title">${escapeHtml(title)}</h2>
                </div>
                <div class="projects-grid project-features-grid">
                    ${normalizedItems.map((item) => `
                        <article class="project-card reveal">
                            <div class="project-topline">
                                <span class="project-initials">${escapeHtml(getInitials(item))}</span>
                            </div>
                            <h3>${escapeHtml(item)}</h3>
                        </article>
                    `).join('')}
                </div>
            </section>
        `;
    }

    function renderProjectDetails(project) {
        const platforms = asArray(project.platforms);
        const tech = asArray(project.tech);
        const development = isPlainObject(project.development) ? project.development : {};
        const distribution = isPlainObject(project.distribution) ? project.distribution : {};
        const details = [
            development.version ? detailItem('Versión', development.version) : '',
            development.phase ? detailItem('Etapa', normalizeLabel(development.phase)) : '',
            development.stability ? detailItem('Estabilidad', normalizeLabel(development.stability)) : '',
            platforms.length ? detailItem('Plataformas', platforms.join(', ')) : '',
            tech.length ? detailItem('Tecnologías', tech.join(', ')) : '',
            'offline' in distribution ? detailItem('Funciona offline', formatBoolean(distribution.offline)) : '',
            'internetRequired' in distribution ? detailItem('Requiere internet', formatBoolean(distribution.internetRequired)) : '',
            'portableVersion' in distribution ? detailItem('Versión portable', formatBoolean(distribution.portableVersion)) : ''
        ].join('');

        if (!details) {
            return '';
        }

        return `
            <section class="section" id="detalles" aria-labelledby="details-title">
                <div class="section-heading reveal">
                    <p class="eyebrow">Detalles técnicos</p>
                    <h2 id="details-title">Información base del producto.</h2>
                </div>

                <dl class="summary-metrics reveal">
                    ${details}
                </dl>
            </section>
        `;
    }

    function renderDownloads(project) {
        const downloads = asArray(project.downloads);

        if (!downloads.length) {
            return '';
        }

        return `
            <section class="section section-tinted" id="downloads" aria-labelledby="downloads-title">
                <div class="section-heading reveal">
                    <p class="eyebrow">Descargas</p>
                    <h2 id="downloads-title">Versiones disponibles por plataforma.</h2>
                </div>

                <div class="projects-grid project-features-grid">
                    ${downloads.map((download) => {
                        const hasUrl = Boolean(download.url);
                        const title = [download.platform, download.format].filter(Boolean).join(' ');

                        return `
                            <article class="project-card reveal">
                                <div class="project-topline">
                                    <span class="project-initials">${escapeHtml(getInitials(download.platform))}</span>
                                    <span class="status-pill${hasUrl ? ' status-live' : ''}">${hasUrl ? 'Disponible' : 'Próximamente'}</span>
                                </div>
                                <h3>${escapeHtml(title || 'Descarga')}</h3>
                                <p>${escapeHtml(normalizeLabel(download.type) || 'Paquete de instalación')}</p>
                                ${hasUrl
                                    ? `<a class="text-link" href="${resolvePath(download.url)}" target="_blank" rel="noopener noreferrer">Descargar</a>`
                                    : '<span class="text-link is-disabled" aria-disabled="true">Aún no disponible</span>'}
                            </article>
                        `;
                    }).join('')}
                </div>
            </section>
        `;
    }

    function renderProjectPage() {
        const container = document.querySelector('[data-project-page]');

        if (!container) {
            return;
        }

        const slug = container.dataset.projectPage;
        const project = data.projects.find((item) => item.slug === slug);

        if (!project) {
            applyProjectTheme(null);
            container.innerHTML = `
                <section class="section">
                    <div class="section-heading">
                        <p class="eyebrow">Proyecto no encontrado</p>
                        <h1>No se encontró información para este proyecto.</h1>
                    </div>
                </section>
            `;
            return;
        }

        const page = normalizeProjectPage(project);
        const progress = clampProgress(page.progress);
        const statusClass = project.statusVariant === 'live' ? ' status-live' : '';
        applyProjectTheme(project);
        document.title = page.title || `${project.name} | ${data.site.name}`;

        const metaDescription = document.querySelector('meta[name="description"]');

        if (metaDescription && page.metaDescription) {
            metaDescription.setAttribute('content', page.metaDescription);
        }

        container.innerHTML = `
            <section class="hero project-hero" id="inicio">
                <div class="hero-inner">
                    <div class="hero-copy reveal">
                        <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
                        <h1>${escapeHtml(project.name)}</h1>
                        <p class="hero-lead">${escapeHtml(page.lead)}</p>
                        <p class="hero-text">${escapeHtml(page.heroText)}</p>
                        <div class="hero-actions">
                            <a class="button button-primary" href="#roadmap">Ver roadmap</a>
                            <a class="button button-secondary" href="${homeLink('#proyectos')}">Volver a proyectos</a>
                        </div>
                    </div>

                    <aside class="hero-summary project-summary-card reveal" aria-label="Resumen de ${escapeHtml(project.name)}">
                        <div class="project-topline">
                            <span class="project-initials">${escapeHtml(project.initials)}</span>
                            <span class="status-pill${statusClass}">${escapeHtml(project.status)}</span>
                        </div>
                        <div class="summary-heading">
                            <span>Estado actual</span>
                            <strong>${escapeHtml(page.summaryStatus)}</strong>
                        </div>
                        <dl class="summary-metrics">
                            ${(page.metrics || []).map(metricItem).join('')}
                        </dl>
                    </aside>
                </div>
            </section>

            <section class="section project-section" aria-labelledby="summary-title">
                <div class="section-heading reveal">
                    <p class="eyebrow">Resumen</p>
                    <h2 id="summary-title">${escapeHtml(page.summaryTitle)}</h2>
                </div>
                <div class="intro-content reveal">
                    ${(page.summary || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
                </div>
            </section>

            <section class="section section-tinted project-status-section" aria-labelledby="status-title">
                <div class="project-status-layout">
                    <div class="section-heading reveal">
                        <p class="eyebrow">Estado actual</p>
                        <h2 id="status-title">${escapeHtml(page.currentStatusTitle)}</h2>
                    </div>

                    <article class="project-card status-panel reveal">
                        <span class="status-pill${statusClass}">${escapeHtml(project.status || page.currentPhase)}</span>
                        <h3>${escapeHtml(page.currentPhase)}</h3>
                        <p>${escapeHtml(page.currentStatusDescription)}</p>
                        <div class="progress-block" aria-label="Progreso del proyecto">
                            <div class="progress-header">
                                <span>Progreso estimado</span>
                                <strong>${escapeHtml(progress)}%</strong>
                            </div>
                            <div class="progress-track">
                                <span style="width: ${progress}%"></span>
                            </div>
                        </div>
                    </article>
                </div>
            </section>

            ${renderProjectDetails(project)}

            <section class="section" id="roadmap" aria-labelledby="roadmap-title">
                <div class="section-heading reveal">
                    <p class="eyebrow">Roadmap</p>
                    <h2 id="roadmap-title">${escapeHtml(page.roadmapTitle)}</h2>
                </div>
                <div class="roadmap-list">
                    ${renderRoadmap(page.roadmap || [])}
                </div>
            </section>

            <section class="section section-tinted" id="features" aria-labelledby="features-title">
                <div class="section-heading reveal">
                    <p class="eyebrow">Detalles y funciones</p>
                    <h2 id="features-title">${escapeHtml(page.featuresTitle)}</h2>
                </div>
                <div class="projects-grid project-features-grid">
                    ${(page.features || []).map(renderFeature).join('')}
                </div>
            </section>

            ${renderListSection({
                id: 'diferenciales',
                eyebrow: 'Diferenciales',
                title: 'Aspectos que definen la propuesta.',
                items: project.differentiators,
                tinted: false
            })}

            ${renderApproach(page)}

            ${renderDownloads(project)}
            ${renderDemo(project)}
        `;
    }

    function renderApproach(page) {
        const approach = asArray(page.approach);

        if (!approach.length) {
            return '';
        }

        return `
            <section class="section purpose-section" id="aprendizaje" aria-labelledby="approach-title">
                <div class="purpose-layout">
                    <div class="section-heading reveal">
                        <p class="eyebrow">Enfoque y aprendizaje</p>
                        <h2 id="approach-title">${escapeHtml(page.approachTitle)}</h2>
                    </div>
                    <div class="purpose-copy reveal">
                        ${approach.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
                    </div>
                </div>
            </section>
        `;
    }

    function renderDemo(project) {
        if (!project.demo?.available) {
            return '';
        }

        return `
            <section class="section section-tinted" aria-labelledby="demo-title">
                <div class="section-heading reveal">
                    <p class="eyebrow">Demo pública</p>
                    <h2 id="demo-title">Explorar versión actual</h2>
                </div>

                <article class="project-card reveal">
                    <p class="project-text">
                        ${escapeHtml(project.demo.note)}
                    </p>

                    <div class="demo-credentials">
                        <p>
                            <strong>Usuario:</strong>
                            ${escapeHtml(project.demo.username)}
                        </p>

                        <p>
                            <strong>Contraseña:</strong>
                            ${escapeHtml(project.demo.password)}
                        </p>
                    </div>

                    <div class="hero-actions">
                        <a
                            href="${project.demo.url}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="button button-primary"
                        >
                            Ver demo
                        </a>
                    </div>
                </article>
            </section>
        `;
    }

    function setTheme(mode) {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = document.getElementById('themeIcon');
        const isDark = mode === 'dark';

        body.classList.toggle('dark-mode', isDark);
        localStorage.setItem('theme', mode);

        if (themeIcon) {
            themeIcon.innerHTML = isDark ? icons.light : icons.dark;
        }

        if (themeToggle) {
            themeToggle.setAttribute('aria-label', isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
        }
    }

    function getInitialTheme() {
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme === 'light' || savedTheme === 'dark') {
            return savedTheme;
        }

        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function initNavigation() {
        const navToggle = document.getElementById('navToggle');
        const primaryNav = document.getElementById('primaryNav');

        if (!navToggle || !primaryNav) {
            return;
        }

        navToggle.addEventListener('click', () => {
            const isOpen = primaryNav.classList.toggle('is-open');
            body.classList.toggle('nav-open', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        primaryNav.addEventListener('click', (event) => {
            if (event.target instanceof HTMLAnchorElement) {
                primaryNav.classList.remove('is-open');
                body.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 1040) {
                primaryNav.classList.remove('is-open');
                body.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    function initTheme() {
        const themeToggle = document.getElementById('themeToggle');

        setTheme(getInitialTheme());

        if (!themeToggle) {
            return;
        }

        themeToggle.addEventListener('click', () => {
            setTheme(body.classList.contains('dark-mode') ? 'light' : 'dark');
        });
    }

    function initHeaderState() {
        const header = document.getElementById('siteHeader');

        if (!header) {
            return;
        }

        const updateHeader = () => {
            header.classList.toggle('is-scrolled', window.scrollY > 8);
        };

        updateHeader();
        window.addEventListener('scroll', updateHeader, { passive: true });
    }

    function initReveal() {
        const revealElements = document.querySelectorAll('.reveal');

        if (!('IntersectionObserver' in window)) {
            revealElements.forEach((element) => element.classList.add('is-visible'));
            return;
        }

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px'
        });

        revealElements.forEach((element) => revealObserver.observe(element));
    }

    ready(() => {
        loadProjectData().then(() => {
            renderSiteHeader();
            renderSiteFooter();
            renderProjectList();
            renderProjectPage();
            initTheme();
            initNavigation();
            initHeaderState();
            initReveal();
        });
    });
}());
