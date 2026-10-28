<?php require_once __DIR__ . '/../../config.php'; ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detalle del Grupo - Área Morelos</title>
    <link rel="icon" type="image/x-icon" href="<?= url('favicon.ico') ?>">
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
        
        <div class="content-section bg-white p-6 rounded shadow" id="group-detail">
            <h1 class="text-2xl font-bold text-blue-700 mb-4 border-b border-gray-200 pb-2">Detalle del Grupo</h1>
            <div id="detail-content">Cargando información...</div>
        </div>
    </div>

    <script>
        $(document).ready(function() {
            const urlParams = new URLSearchParams(window.location.search);
            const groupId = urlParams.get('id');

            if (groupId) {
                $.getJSON((window.BASE_URL || '') + 'js/groups.json', function(data) {
                    const group = data.find(g => g.id == groupId);
                    if (group) {
                        // Preparar días de sesión
                        const days = [
                            {label: 'Lunes', val: group.schedule_monday},
                            {label: 'Martes', val: group.schedule_tuesday},
                            {label: 'Miércoles', val: group.schedule_wednesday},
                            {label: 'Jueves', val: group.schedule_thursday},
                            {label: 'Viernes', val: group.schedule_friday},
                            {label: 'Sábado', val: group.schedule_saturday},
                            {label: 'Domingo', val: group.schedule_sunday}
                        ].filter(d => d.val && d.val.trim() !== '');

                        const scheduleHtml = days.length > 0 
                            ? days.map(d => `<p>📅 <strong>${d.label}:</strong> ${d.val}</p>`).join('')
                            : '<p>⏳ Sin horarios registrados.</p>';

                        // Mapa (simplificado)
                        let mapHtml = '<p>📍 Ubicación no disponible.</p>';
                        if (group.latitude && group.longitude) {
                            mapHtml = `<div style="margin-top: 15px;">
                                <iframe 
                                    width="100%" 
                                    height="300" 
                                    frameborder="0" 
                                    style="border:0; border-radius: 8px;" 
                                    src="https://www.google.com/maps?q=${group.latitude},${group.longitude}&z=15&output=embed" 
                                    allowfullscreen>
                                </iframe>
                            </div>`;
                        }

                        $('#detail-content').html(`
                            <div class="info-box">
                                <h2 style="color: var(--color-primary);"><i class="fas fa-users"></i> ${group.name}</h2>
                                <p><strong>📍 Municipio:</strong> ${group.municipality}</p>
                                <p><strong>🏘️ Colonia:</strong> ${group.neighborhood}</p>
                                <p><strong>🏠 Dirección:</strong> ${group.address || 'No disponible'}</p>
                                ${group.reference ? `<p><strong>🧭 Referencias:</strong> ${group.reference}</p>` : ''}
                                <hr>
                                <h3>🕒 Horarios de Sesión:</h3>
                                ${scheduleHtml}
                                ${group.schedule_observation ? `<p><strong>📝 Observaciones:</strong> ${group.schedule_observation}</p>` : ''}
                                <hr>
                                <h3>🗺️ Ubicación:</h3>
                                ${mapHtml}
                            </div>
                        `);
                    } else {
                        $('#detail-content').html('<p>Grupo no encontrado.</p>');
                    }
                });
            } else {
                $('#detail-content').html('<p>ID de grupo no especificado.</p>');
            }
        });
    </script>
</body>
</html>