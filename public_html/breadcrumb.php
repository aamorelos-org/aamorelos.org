<?php
$current_page = basename($_SERVER['SCRIPT_NAME']);
$page_titles = [
    'index.php' => 'Inicio',
    'grupos.php' => 'Grupos',
    'info.php' => '¿Qué es AA?',
    'eventos.php' => 'Eventos y Noticias',
    'autodiagnosticos.php' => 'Auto Diagnósticos',
    'comites.php' => 'Comités',
    'ubicacion.php' => 'Ubicación',
    'distritos.php' => 'Distritos',
    'detalle_grupo.php' => 'Detalle del Grupo',
    'detalle_distrito.php' => 'Detalle del Distrito',
    'detalle_comite.php' => 'Detalle del Comité'
];

$title = isset($page_titles[$current_page]) ? $page_titles[$current_page] : 'Página';

if (!empty($breadcrumb_title)) {
    $title = $breadcrumb_title;
}

if ($current_page !== 'index.php') {
    echo '<div class="breadcrumb">';
    echo 'Está aquí: <a href="' . url('index.php') . '">Inicio</a> / ' . $title;
    echo '</div>';
}
?>