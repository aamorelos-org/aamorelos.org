<?php
define('ROOT_PATH', __DIR__);

$docRoot = isset($_SERVER['DOCUMENT_ROOT']) ? str_replace('\\', '/', rtrim($_SERVER['DOCUMENT_ROOT'], '/\\')) : '';
$rootDir = str_replace('\\', '/', rtrim(ROOT_PATH, '/\\'));

$basePath = '';
if ($docRoot !== '' && stripos($rootDir, $docRoot) === 0) {
    $basePath = substr($rootDir, strlen($docRoot));
}

define('BASE_URL', rtrim($basePath, '/') . '/');

function url($path = '')
{
    return BASE_URL . ltrim($path, '/');
}
