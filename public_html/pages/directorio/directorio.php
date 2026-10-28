<?php require_once __DIR__ . '/../../config.php'; ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Directorio - Área Morelos</title>
    <link rel="icon" type="image/x-icon" href="<?= url('favicon.ico') ?>">
    <link rel="stylesheet" href="<?= url('styles/styles.css') ?>">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <?php require ROOT_PATH . '/header.php'; ?>
    <?php require ROOT_PATH . '/nav.php'; ?>
    <div class="container mx-auto px-4 py-8">
        <?php require ROOT_PATH . '/breadcrumb.php'; ?>
        <h1 class="text-2xl font-bold text-blue-700 mb-4 border-b border-gray-200 pb-2">Directorio</h1>
        <div id="gallery" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <?php
            $imagesDir = ROOT_PATH . '/images/directorio/';
            $images = glob($imagesDir . '*.{jpg,jpeg,png,gif}', GLOB_BRACE);
            foreach ($images as $index => $image) {
                $imageName = basename($image);
                $relPath = '../../images/directorio/' . $imageName;
                echo '<div class="bg-white p-2 rounded shadow cursor-pointer gallery-item" data-index="' . $index . '" data-src="' . $relPath . '">';
                echo '<img src="' . $relPath . '" alt="' . $imageName . '" class="w-full h-auto">';
                echo '</div>';
            }
            ?>
        </div>
    </div>

    <!-- Modal para visualización -->
    <div id="imageModal" class="fixed inset-0 bg-black bg-opacity-80 hidden z-[9999] flex items-center justify-center">
        <button id="closeModal" class="absolute top-4 right-4 text-white text-3xl">&times;</button>
        <button id="prevBtn" class="absolute left-4 text-white text-4xl">&lt;</button>
        <img id="modalImage" src="" class="max-h-[90vh] max-w-[90vw] object-contain">
        <button id="nextBtn" class="absolute right-4 text-white text-4xl">&gt;</button>
    </div>

    <script>
        const images = <?php echo json_encode(array_map(fn($img) => '../../images/directorio/' . basename($img), $images)); ?>;
        let currentIndex = 0;

        const modal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        const items = document.querySelectorAll('.gallery-item');

        function openModal(index) {
            currentIndex = index;
            modalImage.src = images[currentIndex];
            modal.classList.remove('hidden');
        }

        function closeModal() {
            modal.classList.add('hidden');
        }

        items.forEach((item, index) => {
            item.addEventListener('click', () => openModal(index));
        });

        document.getElementById('closeModal').addEventListener('click', closeModal);
        document.getElementById('prevBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            modalImage.src = images[currentIndex];
        });
        document.getElementById('nextBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % images.length;
            modalImage.src = images[currentIndex];
        });
        
        modal.addEventListener('click', closeModal);
        modalImage.addEventListener('click', (e) => e.stopPropagation());
    </script>
</body>
</html>
