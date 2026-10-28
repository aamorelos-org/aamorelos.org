<?php require_once __DIR__ . '/../../config.php'; ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Área Morelos - Distritos - AA</title>
    <link rel="icon" type="image/x-icon" href="<?= url('favicon.ico') ?>">
    <link rel="stylesheet" href="<?= url('styles/styles.css') ?>">
    <link rel="stylesheet" href="<?= url('styles/distritos.css') ?>">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>window.BASE_URL = <?= json_encode(BASE_URL) ?>;</script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body class="bg-gray-100">

     <?php require ROOT_PATH . '/header.php'; ?>

    <?php require ROOT_PATH . '/nav.php'; ?>

    <div class="container mx-auto px-4 py-8">

        <?php require ROOT_PATH . '/breadcrumb.php'; ?>
        
        <div class="content-section bg-white p-6 rounded shadow">
        <h1 class="text-2xl font-bold text-blue-700 mb-4 border-b border-gray-200 pb-2">Directorio de Distritos</h1>
        
        <div class="search-box flex flex-wrap gap-4 mb-6">
            <input type="text" id="filterName" placeholder="Buscar por Nombre" class="border p-2 rounded w-full md:w-64">
            <input type="text" id="filterMunicipality" placeholder="Buscar por Municipio" class="border p-2 rounded w-full md:w-64">
            <button onclick="filterDistricts()" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Buscar</button>
            <button onclick="clearFilters()" class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Limpiar</button>
        </div>

        <div class="overflow-x-auto">
            <table id="districtsTable" class="w-full border-collapse">
                <thead>
                    <tr class="bg-blue-100 text-blue-700">
                        <th class="p-3 border">Distrito</th>
                        <th class="p-3 border">Municipio</th>
                        <th class="p-3 border">Colonia</th>
                        <th class="p-3 border">Área</th>
                    </tr>
                </thead>
                <tbody id="districtsBody">
                    <!-- Data will be loaded here by JS -->
                </tbody>
            </table>
        </div>
        <div id="paginationInfo" class="text-center mt-4 text-gray-600"></div>
        <div id="pagination" class="mt-4"></div>
    </div>
     

    </div> 

    <script src="<?= url('js/distritos.js') ?>"></script>
</body>
</html>