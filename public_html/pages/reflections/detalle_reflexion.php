<?php
require_once __DIR__ . '/../../config.php';

if (!isset($reflectionId)) {
    header('Location: ' . url('index.php'));
    exit;
}

$reflectionsPath = ROOT_PATH . '/js/reflections.json';
$reflections = [];

if (is_readable($reflectionsPath)) {
    $decodedReflections = json_decode(file_get_contents($reflectionsPath), true);

    if (is_array($decodedReflections)) {
        $reflections = $decodedReflections;
    }
}

$reflection = null;
$reflectionIndex = null;

foreach ($reflections as $index => $item) {
    if ((string) ($item['id'] ?? '') === (string) $reflectionId) {
        $reflection = $item;
        $reflectionIndex = $index;
        break;
    }
}

$previousReflection = ($reflectionIndex !== null && $reflectionIndex > 0) ? $reflections[$reflectionIndex - 1] : null;
$nextReflection = ($reflectionIndex !== null && $reflectionIndex < count($reflections) - 1) ? $reflections[$reflectionIndex + 1] : null;

$breadcrumb_title = $reflection['title'] ?? 'Reflexión no encontrada';

if (!function_exists('reflection_link')) {
    function reflection_link(array $item)
    {
        $href = trim($item['url'] ?? '#');

        if ($href !== '' && !preg_match('#^https?://#i', $href)) {
            $href = url(ltrim($href, '/'));
        }

        return $href;
    }
}

if (!function_exists('reflection_image')) {
    function reflection_image(array $item)
    {
        $image = trim($item['image'] ?? '');

        if ($image !== '' && !preg_match('#^https?://#i', $image)) {
            $image = url(ltrim($image, '/'));
        }

        return $image;
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($breadcrumb_title, ENT_QUOTES, 'UTF-8') ?> - Área Morelos</title>
    <link rel="stylesheet" href="<?= url('styles/styles.css') ?>">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">

    <?php require ROOT_PATH . '/header.php'; ?>

    <?php require ROOT_PATH . '/nav.php'; ?>

    <div class="container mx-auto px-4 py-8">

        <?php require ROOT_PATH . '/breadcrumb.php'; ?>

        <?php if ($reflection): ?>
            <article class="reflection-detail">
                <div class="reflection-detail-grid">
                    <figure class="reflection-detail-media">
                        <img src="<?= htmlspecialchars(reflection_image($reflection), ENT_QUOTES, 'UTF-8') ?>"
                             alt="<?= htmlspecialchars($reflection['alt'] ?? ($reflection['title'] ?? ''), ENT_QUOTES, 'UTF-8') ?>">
                    </figure>

                    <div class="reflection-detail-content">
                        <span class="reflection-detail-kicker">
                            Reflexión<?= !empty($reflection['subtitle']) ? ' · ' . htmlspecialchars($reflection['subtitle'], ENT_QUOTES, 'UTF-8') : '' ?>
                        </span>

                        <h1><?= htmlspecialchars($reflection['title'] ?? '', ENT_QUOTES, 'UTF-8') ?></h1>

                        <?php if (!empty($reflection['description'])): ?>
                            <p><?= htmlspecialchars($reflection['description'], ENT_QUOTES, 'UTF-8') ?></p>
                        <?php endif; ?>

                        <a class="reflection-back" href="<?= url('index.php') ?>#reflexiones">&larr; Volver a reflexiones</a>
                    </div>
                </div>

                <nav class="reflection-pager" aria-label="Navegación entre reflexiones">
                    <?php if ($previousReflection): ?>
                        <a href="<?= htmlspecialchars(reflection_link($previousReflection), ENT_QUOTES, 'UTF-8') ?>">
                            <span class="pager-label">Anterior</span>
                            <?= htmlspecialchars($previousReflection['title'] ?? '', ENT_QUOTES, 'UTF-8') ?>
                        </a>
                    <?php else: ?>
                        <span></span>
                    <?php endif; ?>

                    <?php if ($nextReflection): ?>
                        <a class="is-next" href="<?= htmlspecialchars(reflection_link($nextReflection), ENT_QUOTES, 'UTF-8') ?>">
                            <span class="pager-label">Siguiente</span>
                            <?= htmlspecialchars($nextReflection['title'] ?? '', ENT_QUOTES, 'UTF-8') ?>
                        </a>
                    <?php endif; ?>
                </nav>
            </article>
        <?php else: ?>
            <div class="content-section bg-white p-6 rounded shadow">
                <h1>Reflexión no encontrada</h1>
                <p>La reflexión solicitada no existe o no está disponible.</p>
                <a href="<?= url('index.php') ?>#reflexiones" class="font-bold text-blue-600 hover:underline">&larr; Volver a reflexiones</a>
            </div>
        <?php endif; ?>

    </div>
</body>
</html>
