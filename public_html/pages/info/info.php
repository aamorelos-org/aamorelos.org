<?php require_once __DIR__ . '/../../config.php'; ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Área Morelos - AA</title>
    <link rel="stylesheet" href="<?= url('styles/styles.css') ?>">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>window.BASE_URL = <?= json_encode(BASE_URL) ?>;</script>
</head>
<body class="bg-gray-100">

     <?php require ROOT_PATH . '/header.php'; ?>

    <?php require ROOT_PATH . '/nav.php'; ?>

    <div class="container mx-auto px-4 py-8">

        <?php require ROOT_PATH . '/breadcrumb.php'; ?>
       <?php require __DIR__ . '/aa_info.php'; ?>

    </div> 

    <script src="<?= url('js/index.js') ?>"></script>
</body>
</html>