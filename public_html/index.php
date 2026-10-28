<?php require_once __DIR__ . '/config.php'; ?>
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

        <?php require ROOT_PATH . '/carrousel.php'; ?>

        <?php
        $committeesPath = ROOT_PATH . '/js/committees.json';
        $committees = [];

        if (is_readable($committeesPath)) {
            $committeesJson = file_get_contents($committeesPath);
            $decodedCommittees = json_decode($committeesJson, true);

            if (is_array($decodedCommittees)) {
                $committees = $decodedCommittees;
            }
        }

        $reflectionsPath = ROOT_PATH . '/js/reflections.json';
        $reflections = [];

        if (is_readable($reflectionsPath)) {
            $reflectionsJson = file_get_contents($reflectionsPath);
            $decodedReflections = json_decode($reflectionsJson, true);

            if (is_array($decodedReflections)) {
                $reflections = $decodedReflections;
            }
        }
        ?>

        <?php if (count($committees) > 0): ?>
            <section id="comites" class="mt-10 scroll-mt-6">
                <h1 class="mb-6 border-b border-gray-200 pb-2 text-2xl font-bold text-blue-700">Comités de servicio</h1>

                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <?php foreach ($committees as $index => $committee): ?>
                        <?php
                        $isDark = $index % 2 === 0;
                        $committeeUrl = $committee['url'] ?? '#';
                        $isExternal = (bool) preg_match('#^https?://#i', $committeeUrl);

                        if (!$isExternal) {
                            $committeeUrl = url(ltrim($committeeUrl, '/'));
                        }
                        ?>
                        <article class="flex flex-col rounded-lg p-6 shadow <?= $isDark ? 'bg-[#2b6cb0] text-white' : 'bg-white text-gray-700' ?>">
                            <h3 class="mb-3 text-lg font-bold"><?= htmlspecialchars($committee['nombre'] ?? '', ENT_QUOTES, 'UTF-8') ?></h3>
                            <p class="mb-4 text-sm leading-relaxed"><?= htmlspecialchars($committee['descripcion'] ?? '', ENT_QUOTES, 'UTF-8') ?></p>
                            <a href="<?= htmlspecialchars($committeeUrl, ENT_QUOTES, 'UTF-8') ?>"
                               <?php if ($isExternal): ?>target="_blank" rel="noopener noreferrer"<?php endif; ?>
                               class="mt-auto text-sm font-bold <?= $isDark ? 'text-white hover:text-gray-200' : 'text-[#2b6cb0] hover:text-[#005f73]' ?>">
                                LEER MÁS &gt;
                            </a>
                        </article>
                    <?php endforeach; ?>
                </div>
            </section>
        <?php endif; ?>

        <?php if (count($reflections) > 0): ?>
            <section id="reflexiones" class="mt-12 scroll-mt-24">
                <div class="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-gray-200 pb-3">
                    <div>
                        <h2 class="text-2xl font-bold text-blue-700">Reflexiones</h2>
                        <p class="mt-1 text-sm text-gray-500">Mensajes breves para acompañar el camino de la recuperación.</p>
                    </div>
                </div>

                <div class="reflection-grid">
                    <?php foreach ($reflections as $reflection): ?>
                        <?php
                        $reflectionImage = trim($reflection['image'] ?? '');
                        if ($reflectionImage !== '' && !preg_match('#^https?://#i', $reflectionImage)) {
                            $reflectionImage = url(ltrim($reflectionImage, '/'));
                        }

                        $reflectionUrl = trim($reflection['url'] ?? '#');
                        if ($reflectionUrl !== '' && !preg_match('#^https?://#i', $reflectionUrl)) {
                            $reflectionUrl = url(ltrim($reflectionUrl, '/'));
                        }

                        $reflectionTitle = $reflection['title'] ?? '';
                        $reflectionSubtitle = $reflection['subtitle'] ?? '';
                        ?>
                        <a href="<?= htmlspecialchars($reflectionUrl, ENT_QUOTES, 'UTF-8') ?>" class="reflection-card">
                            <div class="reflection-media">
                                <img src="<?= htmlspecialchars($reflectionImage, ENT_QUOTES, 'UTF-8') ?>"
                                     alt="<?= htmlspecialchars($reflection['alt'] ?? $reflectionTitle, ENT_QUOTES, 'UTF-8') ?>"
                                     loading="lazy">
                                <span class="reflection-overlay">Leer reflexión &rarr;</span>
                            </div>
                            <div class="reflection-body">
                                <?php if ($reflectionSubtitle !== ''): ?>
                                    <span class="reflection-kicker"><?= htmlspecialchars($reflectionSubtitle, ENT_QUOTES, 'UTF-8') ?></span>
                                <?php endif; ?>
                                <h3 class="reflection-title"><?= htmlspecialchars($reflectionTitle, ENT_QUOTES, 'UTF-8') ?></h3>
                            </div>
                        </a>
                    <?php endforeach; ?>
                </div>
            </section>
        <?php endif; ?>

    </div> 

    <script src="<?= url('js/index.js') ?>"></script>
</body>
</html>