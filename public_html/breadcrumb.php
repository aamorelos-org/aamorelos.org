<?php
$current_page = basename($_SERVER['SCRIPT_NAME']);
$page_titles = [
    'index.php' => 'Inicio',
    'grupos.php' => 'Grupos',
    'info.php' => '¿Qué es AA?',
    's.php' => 'Eventos y Noticias',
    'agendas.php' => 'Agendas de Trabajo',
    'mapa.php' => 'Mapa de Distritos',
    'autodiagnosticos.php' => 'Auto Diagnósticos',
    'comites.php' => 'Comités',
    'ubicacion.php' => 'Ubicación',
    'distritos.php' => 'Distritos'
];

$title = isset($page_titles[$current_page]) ? $page_titles[$current_page] : 'Página';

if ($current_page !== 'index.php') {
    echo '<div class="breadcrumb">';
    echo 'Está aquí: <a href="index.php">Inicio</a> / ' . $title;
    echo '</div>';
}
?>