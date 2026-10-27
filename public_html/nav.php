<?php $current_page = basename($_SERVER['SCRIPT_NAME']); ?>
<!-- Menú de Navegación Estilo Tarjetas con Iconos y Desplegable -->
<nav class="main-nav-container">
    
    <!-- Logotipo Institucional a la izquierda -->
    <a href="index.php" class="nav-logo">
        <img src="images/logo.gif" alt="Central Mexicana de Servicios Generales de Alcohólicos Anónimos, A.C.">
    </a>

    <!-- Pestañas / Botones de Navegación -->
    <div class="nav-menu">
        <a href="index.php" class="nav-item <?php echo $current_page == 'index.php' ? 'active' : ''; ?>">
            <span class="nav-icon">🏠</span>
            <span class="nav-text">INICIO</span>
        </a>

        <!-- Menú desplegable para INFORMACIÓN -->
        <div class="nav-item dropdown <?php echo in_array($current_page, ['info.php', 's.php', 'agendas.php', 'mapa.php', 'autodiagnosticos.php']) ? 'active' : ''; ?>">
            <span class="nav-icon">✏️</span>
            <span class="nav-text">INFORMACIÓN</span>
            
            <div class="dropdown-content">
                <a href="info.php">¿QUÉ ES AA?</a>
                <a href="s.php">EVENTOS Y NOTICIAS</a>
                <a href="agendas.php">AGENDAS DE TRABAJO</a>
                <a href="mapa.php">MAPA DE DISTRITOS</a>
                <div class="dropdown-submenu">
                    <a href="autodiagnosticos.php">AUTO DIAGNÓSTICOS ▶</a>
                </div>
            </div>
        </div>

        <a href="grupos.php" class="nav-item <?php echo $current_page == 'grupos.php' ? 'active' : ''; ?>">
            <span class="nav-icon">⚙️</span>
            <span class="nav-text">GRUPOS</span>
        </a>
        <a href="comites.php" class="nav-item <?php echo $current_page == 'comites.php' ? 'active' : ''; ?>">
            <span class="nav-icon">💡</span>
            <span class="nav-text">COMITÉS</span>
        </a>
        <a href="ubicacion.php" class="nav-item <?php echo $current_page == 'ubicacion.php' ? 'active' : ''; ?>">
            <span class="nav-icon">💬</span>
            <span class="nav-text">UBICACIÓN</span>
        </a>
        <a href="distritos.php" class="nav-item <?php echo $current_page == 'distritos.php' ? 'active' : ''; ?>">
            <span class="nav-icon">👥</span>
            <span class="nav-text">DISTRITOS</span>
        </a>
    </div>

</nav>