<?php require_once __DIR__ . '/../../config.php'; ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mapa de Distritos - Área Morelos</title>
    <link rel="stylesheet" href="<?= url('styles/styles.css') ?>">
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
            <h1 class="text-2xl font-bold text-blue-700 mb-4 border-b border-gray-200 pb-2">Mapa y Directorio de Distritos</h1>
            <p class="mb-4">Visualice la ubicación de los distritos o consulte el listado a continuación.</p>
            
            <div id="map" class="w-full h-96 rounded overflow-hidden">
                <iframe 
                    width="100%" 
                    height="100%" 
                    frameborder="0" 
                    style="border:0" 
                    src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d241031.57945037197!2d-99.3905586941406!3d18.81427144933931!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sAlcoholicos%20Anonimos%20Morelos!5e0!3m2!1ses-419!2smx!4v1634567890123!5m2!1ses-419!2smx" 
                    allowfullscreen>
                </iframe>
            </div>

            <h2 class="text-xl font-bold text-blue-700 mt-8 mb-4">Listado de Distritos</h2>
            <div class="overflow-x-auto">
                <table class="w-full border-collapse">
                    <thead>
                        <tr class="bg-blue-100 text-blue-700">
                            <th class="p-3 border">Distrito</th>
                            <th class="p-3 border">Municipio</th>
                        </tr>
                    </thead>
                    <tbody id="districtsList">
                        <!-- Loaded by JS -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <script>
        $(document).ready(function() {
            $.getJSON((window.BASE_URL || '') + 'js/districts.json', function(data) {
                const tbody = $('#districtsList');
                $.each(data, function(index, district) {
                    tbody.append(`<tr>
                        <td class="p-3 border">
                            <a href="${window.BASE_URL || ''}pages/distritos/detalle_distrito.php?id=${district.id}" class="text-blue-600 hover:underline">${district.name}</a>
                        </td>
                        <td class="p-3 border">${district.municipality}</td>
                    </tr>`);
                });
            });
        });
    </script>
</body>
</html>