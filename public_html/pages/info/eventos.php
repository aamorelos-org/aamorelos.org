<?php
require_once __DIR__ . '/../../config.php';

$eventsPath = ROOT_PATH . '/js/events.json';
$events = [];

if (is_readable($eventsPath)) {
    $decodedEvents = json_decode(file_get_contents($eventsPath), true);

    if (is_array($decodedEvents)) {
        $events = $decodedEvents;
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eventos y Noticias - Área Morelos</title>
    <link rel="icon" type="image/x-icon" href="<?= url('favicon.ico') ?>">
    <link rel="stylesheet" href="<?= url('styles/styles.css') ?>">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">

    <?php require ROOT_PATH . '/header.php'; ?>

    <?php require ROOT_PATH . '/nav.php'; ?>

    <div class="container mx-auto px-4 py-8">

        <?php require ROOT_PATH . '/breadcrumb.php'; ?>

        <section class="rounded bg-white p-6 shadow">
            <h1 class="mb-6 border-b border-gray-200 pb-2 text-2xl font-bold text-blue-700">Eventos y Noticias</h1>

            <?php if (count($events) > 0): ?>
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <?php foreach ($events as $event): ?>
                        <?php
                        $url = trim($event['url'] ?? '');
                        $isExternal = (bool) preg_match('#^https?://#i', $url);
                        $isInternal = (bool) preg_match('#\.php(\?.*)?$#i', $url);

                        if ($isExternal) {
                            $href = $url;
                        } elseif ($isInternal) {
                            $href = url(ltrim($url, '/'));
                        } else {
                            $href = '#';
                        }

                        $image = trim($event['image'] ?? '');
                        if ($image !== '' && !preg_match('#^https?://#i', $image)) {
                            $image = url(ltrim($image, '/'));
                        }

                        $title = $event['title'] ?? '';
                        $detail = $event['detail'] ?? '';
                        $alt = $event['alt'] ?? $title;
                        $placeholder = 'https://via.placeholder.com/800x350/2b6cb0/ffffff?text=' . rawurlencode($title ?: 'Evento');
                        ?>
                        <a href="<?= htmlspecialchars($href, ENT_QUOTES, 'UTF-8') ?>"
                           <?php if ($isExternal): ?>target="_blank" rel="noopener noreferrer"<?php endif; ?>
                           <?php if ($href === '#'): ?>onclick="return false;"<?php endif; ?>
                           class="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow transition hover:-translate-y-1 hover:shadow-lg">
                            <?php if ($image !== ''): ?>
                                <img src="<?= htmlspecialchars($image, ENT_QUOTES, 'UTF-8') ?>"
                                     alt="<?= htmlspecialchars($alt, ENT_QUOTES, 'UTF-8') ?>"
                                     class="h-48 w-full object-cover"
                                     onerror="this.onerror=null;this.src='<?= htmlspecialchars($placeholder, ENT_QUOTES, 'UTF-8') ?>';">
                            <?php endif; ?>

                            <div class="flex flex-1 flex-col p-5">
                                <h2 class="mb-2 text-lg font-bold text-blue-700"><?= htmlspecialchars($title, ENT_QUOTES, 'UTF-8') ?></h2>
                                <p class="mb-4 text-sm text-gray-600"><?= htmlspecialchars($detail, ENT_QUOTES, 'UTF-8') ?></p>
                                <span class="mt-auto text-sm font-bold text-blue-600 group-hover:underline">Ver más &rarr;</span>
                            </div>
                        </a>
                    <?php endforeach; ?>
                </div>
            <?php else: ?>
                <p class="text-gray-600">No hay eventos disponibles por el momento.</p>
            <?php endif; ?>
        </section>

    </div>
</body>
</html>
