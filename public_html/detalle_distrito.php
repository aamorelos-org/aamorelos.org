<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detalle del Distrito - Área Morelos</title>
    <link rel="stylesheet" href="styles/styles.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>
    <?php include 'header.php'; ?>
    <div class="wrapper">
        <?php include 'nav.php'; ?>
        <?php include 'breadcrumb.php'; ?>
        
        <div class="content-section" id="district-detail">
            <h1 style="color: var(--color-primary);"><i class="fas fa-map-marked-alt"></i> Detalle del Distrito</h1>
            <div id="detail-content">Cargando información...</div>
        </div>
    </div>

<script>
        $(document).ready(function() {
            const urlParams = new URLSearchParams(window.location.search);
            const districtId = urlParams.get('id');

            if (districtId) {
                $.getJSON('js/districts.json', function(data) {
                    const district = data.find(d => d.id == districtId);
                    if (district) {
                        // Construir búsqueda en Google Maps con dirección y municipio
                        const mapQuery = encodeURIComponent(`${district.address}, ${district.neighborhood}, ${district.municipality}, Morelos`);
                        const mapHtml = `<div style="margin-top: 15px;">
                            <iframe 
                                width="100%" 
                                height="300" 
                                frameborder="0" 
                                style="border:0; border-radius: 8px;" 
                                src="https://www.google.com/maps?q=${mapQuery}&z=15&output=embed" 
                                allowfullscreen>
                            </iframe>
                        </div>`;

                        $('#detail-content').html(`
                            <div class="info-box">
                                <h2 style="color: var(--color-primary);"><i class="fas fa-map-marked-alt"></i> ${district.name}</h2>
                                <p><strong>📍 Área:</strong> ${district.area}</p>
                                <p><strong>🏘️ Municipio:</strong> ${district.municipality}</p>
                                <p><strong>🏠 Colonia:</strong> ${district.neighborhood}</p>
                                <p><strong>📍 Dirección:</strong> ${district.address || 'No disponible'}</p>
                                ${district.reference ? `<p><strong>🧭 Referencias:</strong> ${district.reference}</p>` : ''}
                                ${district.phone ? `<p><strong>📞 Teléfono:</strong> ${district.phone}</p>` : ''}
                                <hr>
                                <h3>🗺️ Ubicación aproximada:</h3>
                                ${mapHtml}
                            </div>
                        `);
                    } else {
                        $('#detail-content').html('<p>Distrito no encontrado.</p>');
                    }
                });
            } else {
                $('#detail-content').html('<p>ID de distrito no especificado.</p>');
            }
        });
    </script>
</body>
</html>