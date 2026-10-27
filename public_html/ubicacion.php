<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mapa de Distritos - Área Morelos</title>
    <link rel="stylesheet" href="styles/styles.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <style>
        #map { height: 600px; width: 100%; border-radius: 8px; margin-top: 20px; }
    </style>
</head>
<body>
    <?php include 'header.php'; ?>
    <div class="wrapper">
        <?php include 'nav.php'; ?>
        <?php include 'breadcrumb.php'; ?>
        
        <div class="content-section">
            <h1>Mapa y Directorio de Distritos</h1>
            <p>Visualice la ubicación de los distritos o consulte el listado a continuación.</p>
            
            <div id="map">
                <iframe 
                    width="100%" 
                    height="400" 
                    frameborder="0" 
                    style="border:0" 
                    src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d241031.57945037197!2d-99.3905586941406!3d18.81427144933931!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sAlcoholicos%20Anonimos%20Morelos!5e0!3m2!1ses-419!2smx!4v1634567890123!5m2!1ses-419!2smx" 
                    allowfullscreen>
                </iframe>
            </div>

            <h2 style="margin-top: 30px;">Listado de Distritos</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <thead>
                    <tr style="background-color: #e6f7ff; color: #2b6cb0;">
                        <th style="padding: 10px; border: 1px solid #dcdcdc;">Distrito</th>
                        <th style="padding: 10px; border: 1px solid #dcdcdc;">Municipio</th>
                    </tr>
                </thead>
                <tbody id="districtsList">
                    <!-- Loaded by JS -->
                </tbody>
            </table>
        </div>
    </div>

    <script>
        $(document).ready(function() {
            $.getJSON('js/districts.json', function(data) {
                const tbody = $('#districtsList');
                $.each(data, function(index, district) {
                    tbody.append(`<tr>
                        <td style="padding: 10px; border: 1px solid #dcdcdc;">
                            <a href="detalle_distrito.php?id=${district.id}">${district.name}</a>
                        </td>
                        <td style="padding: 10px; border: 1px solid #dcdcdc;">${district.municipality}</td>
                    </tr>`);
                });
            });
        });
    </script>
</body>
</html>