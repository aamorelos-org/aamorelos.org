<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Área Morelos - AA</title>
    <link rel="stylesheet" href="styles/styles.css">
    <link rel="stylesheet" href="styles/grupos.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>

     <?php include 'header.php'; ?>

    <div class="wrapper">

        <?php include 'nav.php'; ?>
        <?php include 'breadcrumb.php'; ?>
        
        <div class="content-section">
        <h1>Directorio de Grupos</h1>
        
        <div class="search-box">
            <input type="text" id="filterMunicipality" placeholder="Buscar por Municipio">
            <input type="text" id="filterColonia" placeholder="Buscar por Colonia">
            <button onclick="filterGroups()">Buscar</button>
            <button onclick="clearFilters()">Limpiar</button>
        </div>

        <table id="groupsTable">
            <thead>
                <tr style="background-color: #e6f7ff; color: #2b6cb0;">
                    <th style="padding: 10px; border: 1px solid #dcdcdc;">Grupo</th>
                    <th style="padding: 10px; border: 1px solid #dcdcdc;">Municipio</th>
                    <th style="padding: 10px; border: 1px solid #dcdcdc;">Colonia</th>
                    <th style="padding: 10px; border: 1px solid #dcdcdc;">Tipo</th>
                    <th style="padding: 10px; border: 1px solid #dcdcdc;">Genero</th>
                    <th style="padding: 10px; border: 1px solid #dcdcdc;">Idioma</th>
                    <th style="padding: 10px; border: 1px solid #dcdcdc;">Se fuma</th>
                </tr>
            </thead>
            <tbody id="groupsBody">
                <!-- Data will be loaded here by JS -->
            </tbody>
        </table>
        <div id="paginationInfo"></div>
        <div id="pagination"></div>
    </div>
     

    </div> 

    <script src="js/grupos.js"></script>
</body>
</html>