<?php $current_page = basename($_SERVER['SCRIPT_NAME']); ?>
<!-- Barra de navegación principal fija -->
<nav class="main-nav-container" id="mainNav" aria-label="Navegación principal">
    <div class="nav-inner container mx-auto px-4">
        <div class="nav-bar">
            <span class="nav-bar-title">Menú</span>
            <button class="nav-toggle" id="navToggle" type="button" aria-label="Abrir menú de navegación" aria-expanded="false" aria-controls="navMenu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>

        <div class="nav-menu" id="navMenu">
            <a href="<?= url('index.php') ?>" class="nav-item <?php echo $current_page == 'index.php' ? 'active' : ''; ?>">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                    <path d="M3 10.5 12 3l9 7.5"/>
                    <path d="M5 9.5V21h14V9.5"/>
                    <path d="M9 21v-6h6v6"/>
                </svg>
                <span class="nav-text">INICIO</span>
            </a>

            <!-- Menú desplegable para INFORMACIÓN -->
            <div class="nav-item dropdown <?php echo in_array($current_page, ['info.php', 's.php', 'eventos.php', 'agendas.php', 'mapa.php', 'autodiagnosticos.php']) ? 'active' : ''; ?>" role="button" tabindex="0" aria-haspopup="true" aria-expanded="false">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                    <circle cx="12" cy="12" r="9"/>
                    <path d="M12 16v-4"/>
                    <path d="M12 8h.01"/>
                </svg>
                <span class="nav-text">INFORMACIÓN</span>

                <div class="dropdown-content">
                    <a href="<?= url('pages/info/info.php') ?>">¿QUÉ ES AA?</a>
                    <a href="<?= url('pages/info/eventos.php') ?>">EVENTOS Y NOTICIAS</a>
                    <div class="dropdown-submenu">
                        <a href="<?= url('autodiagnosticos.php') ?>">AUTO DIAGNÓSTICOS</a>
                    </div>
                </div>
            </div>

            <a href="<?= url('pages/grupos/grupos.php') ?>" class="nav-item <?php echo $current_page == 'grupos.php' ? 'active' : ''; ?>">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                    <circle cx="9" cy="8" r="3.5"/>
                    <path d="M2 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1"/>
                    <path d="M16 4.5a3.5 3.5 0 0 1 0 7"/>
                    <path d="M17.5 15h1a5 5 0 0 1 5 5v1"/>
                </svg>
                <span class="nav-text">GRUPOS</span>
            </a>

            <a href="<?= url('pages/directorio/directorio.php') ?>" class="nav-item <?php echo in_array($current_page, ['directorio.php', 'detalle_comite.php']) ? 'active' : ''; ?>">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                    <path d="M9 18h6"/>
                    <path d="M10 21h4"/>
                    <path d="M12 3a6 6 0 0 0-3.5 10.9c.4.3.5.7.5 1.1v1h6v-1c0-.4.1-.8.5-1.1A6 6 0 0 0 12 3Z"/>
                </svg>
                <span class="nav-text">Directorio</span>
            </a>

            <a href="<?= url('pages/ubicacion/ubicacion.php') ?>" class="nav-item <?php echo $current_page == 'ubicacion.php' ? 'active' : ''; ?>">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                    <path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11Z"/>
                    <circle cx="12" cy="10" r="2.5"/>
                </svg>
                <span class="nav-text">UBICACIÓN</span>
            </a>

            <a href="<?= url('pages/distritos/distritos.php') ?>" class="nav-item <?php echo $current_page == 'distritos.php' ? 'active' : ''; ?>">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                    <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/>
                    <path d="M9 4v14"/>
                    <path d="M15 6v14"/>
                </svg>
                <span class="nav-text">DISTRITOS</span>
            </a>
        </div>
    </div>
</nav>

<script>
(function () {
    var nav = document.getElementById('mainNav');
    if (!nav) return;

    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('navMenu');
    var dropdowns = nav.querySelectorAll('.nav-item.dropdown');
    var desktop = window.matchMedia('(min-width: 1024px)');

    function closeMenu() {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menú de navegación');
    }

    toggle.addEventListener('click', function () {
        var isOpen = menu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    });

    dropdowns.forEach(function (dropdown) {
        dropdown.addEventListener('click', function (event) {
            if (desktop.matches) return;
            if (event.target.closest('.dropdown-content')) return;
            event.preventDefault();
            var isOpen = dropdown.classList.toggle('open');
            dropdown.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        dropdown.addEventListener('keydown', function (event) {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            dropdown.click();
        });
    });

    document.addEventListener('click', function (event) {
        if (desktop.matches) return;
        if (!nav.contains(event.target)) closeMenu();
    });

    desktop.addEventListener('change', function () {
        closeMenu();
        dropdowns.forEach(function (dropdown) {
            dropdown.classList.remove('open');
            dropdown.setAttribute('aria-expanded', 'false');
        });
    });
})();
</script>
