let districtsData = [];
let currentPage = 1;
const rowsPerPage = 50;

$(document).ready(function() {
    $.getJSON('js/districts.json', function(data) {
        districtsData = data;
        renderTable(data);
    });
});

function renderTable(data, page = 1) {
    currentPage = page;
    const tbody = $('#districtsBody');
    tbody.empty();
    
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = data.slice(start, end);

    $.each(paginatedData, function(index, district) {
        const row = `<tr>
            <td style="padding: 10px; border: 1px solid #dcdcdc;">
                <div class="tooltip-wrapper">
                    <a href="detalle_distrito.php?id=${district.id}" style="color: #0077b6; text-decoration: none;">${district.name}</a>
                    <div class="tooltip-text">
                        <strong>Distrito:</strong> ${district.name}<br>
                        <strong>Municipio:</strong> ${district.municipality}<br>
                        <strong>Colonia:</strong> ${district.neighborhood}<br>
                        <strong>Dirección:</strong> ${district.address}
                    </div>
                </div>
            </td>
            <td style="padding: 10px; border: 1px solid #dcdcdc;">${district.municipality}</td>
            <td style="padding: 10px; border: 1px solid #dcdcdc;">${district.neighborhood}</td>
            <td style="padding: 10px; border: 1px solid #dcdcdc;">${district.area}</td>
        </tr>`;
        tbody.append(row);
    });

    const pageCount = Math.ceil(data.length / rowsPerPage);
    $('#paginationInfo').text(`Página ${currentPage} de ${pageCount || 1} | Total de registros: ${data.length}`);

    renderPagination(data);
}

function renderPagination(data) {
    const pageCount = Math.ceil(data.length / rowsPerPage);
    const paginationContainer = $('#pagination');
    paginationContainer.empty();

    const ul = $('<ul style="list-style: none; display: flex; justify-content: center; padding: 0;"></ul>');

    for (let i = 1; i <= pageCount; i++) {
        const li = $('<li style="margin: 0 5px;"></li>');
        const a = $(`<a href="#" style="padding: 8px 12px; text-decoration: none; border: 1px solid #dcdcdc; color: #2b6cb0; border-radius: 4px;">${i}</a>`);
        
        if (i === currentPage) {
            a.css({'background-color': '#2b6cb0', 'color': 'white'});
        }
        
        a.click(function(e) {
            e.preventDefault();
            renderTable(data, i);
        });
        
        li.append(a);
        ul.append(li);
    }
    paginationContainer.append(ul);
}

function filterDistricts() {
    const name = $('#filterName').val().toLowerCase();
    const muni = $('#filterMunicipality').val().toLowerCase();
    
    const filtered = districtsData.filter(d => 
        (d.name.toLowerCase().includes(name) || name === '') &&
        (d.municipality.toLowerCase().includes(muni) || muni === '')
    );
    renderTable(filtered, 1);
}

function clearFilters() {
    $('#filterName').val('');
    $('#filterMunicipality').val('');
    renderTable(districtsData, 1);
}
