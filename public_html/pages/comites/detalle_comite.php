<?php
require_once __DIR__ . '/../../config.php';

$committeesPath = ROOT_PATH . '/js/committees.json';
$committees = [];

if (is_readable($committeesPath)) {
    $decodedCommittees = json_decode(file_get_contents($committeesPath), true);

    if (is_array($decodedCommittees)) {
        $committees = $decodedCommittees;
    }
}

$committeeId = isset($_GET['id']) ? (int) $_GET['id'] : 0;
$committee = null;

foreach ($committees as $item) {
    if ((int) ($item['id'] ?? 0) === $committeeId) {
        $committee = $item;
        break;
    }
}

if ($committee === null && $committeeId > 0 && isset($committees[$committeeId - 1])) {
    $committee = $committees[$committeeId - 1];
}

$breadcrumb_title = $committee['nombre'] ?? 'Comité no encontrado';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($breadcrumb_title, ENT_QUOTES, 'UTF-8') ?> - Área Morelos</title>
    <link rel="icon" type="image/x-icon" href="<?= url('favicon.ico') ?>">
    <link rel="stylesheet" href="<?= url('styles/styles.css') ?>">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">

    <?php require ROOT_PATH . '/header.php'; ?>

    <?php require ROOT_PATH . '/nav.php'; ?>

    <div class="container mx-auto px-4 py-8">

        <?php require ROOT_PATH . '/breadcrumb.php'; ?>

        <?php if ($committee): ?>
            <article class="content-section bg-white p-6 rounded shadow">
                <a href="<?= url('index.php') ?>#comites" class="mb-4 inline-block text-sm font-bold text-blue-600 hover:underline">
                    &larr; Volver a comités
                </a>

                <h1><?= htmlspecialchars($committee['nombre'] ?? '', ENT_QUOTES, 'UTF-8') ?></h1>

                <p class="text-lg font-semibold text-gray-700">
                    <?= htmlspecialchars($committee['descripcion'] ?? '', ENT_QUOTES, 'UTF-8') ?>
                </p>

                <?php if (!empty($committee['detalle'])): ?>
                    <div class="info-box">
                        <p><?= htmlspecialchars($committee['detalle'], ENT_QUOTES, 'UTF-8') ?></p>
                    </div>
                <?php endif; ?>

                <?php if (!empty($committee['actividades']) && is_array($committee['actividades'])): ?>
                    <h2>¿En qué se enfoca?</h2>
                    <ul class="list-disc space-y-2 pl-6">
                        <?php foreach ($committee['actividades'] as $actividad): ?>
                            <li><?= htmlspecialchars($actividad, ENT_QUOTES, 'UTF-8') ?></li>
                        <?php endforeach; ?>
                    </ul>
                <?php endif; ?>

                <?php if (!empty($committee['fuente'])): ?>
                    <div class="source-link">
                        Fuente:
                        <a href="<?= htmlspecialchars($committee['fuente'], ENT_QUOTES, 'UTF-8') ?>" target="_blank" rel="noopener noreferrer">aa.org</a>
                    </div>
                <?php endif; ?>
            </article>
        <?php else: ?>
            <div class="content-section bg-white p-6 rounded shadow">
                <h1>Comité no encontrado</h1>
                <p>El comité solicitado no existe o no está disponible.</p>
                <a href="<?= url('index.php') ?>#comites" class="font-bold text-blue-600 hover:underline">&larr; Volver a comités</a>
            </div>
        <?php endif; ?>

    </div>
</body>
</html>
