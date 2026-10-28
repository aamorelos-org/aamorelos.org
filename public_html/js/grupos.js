let groupsData = [];
let currentPage = 1;
const rowsPerPage = 50;

$(document).ready(function() {
    $.getJSON((window.BASE_URL || '') + 'js/groups.json', function(data) {
        groupsData = data;
        renderTable(data);
    });
});

function renderTable(data, page = 1) {
    currentPage = page;
    const tbody = $('#groupsBody');
    tbody.empty();
    
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = data.slice(start, end);

    $.each(paginatedData, function(index, group) {
        const row = `<tr>
            <td style="padding: 10px; border: 1px solid #dcdcdc;"><a href="${window.BASE_URL || ''}pages/grupos/detalle_grupo.php?id=${group.id}" style="color: #0077b6; text-decoration: none;">${group.name}</a></td>
            <td style="padding: 10px; border: 1px solid #dcdcdc;">${group.municipality}</td>
            <td style="padding: 10px; border: 1px solid #dcdcdc;">${group.neighborhood}</td>
            <td style="padding: 10px; border: 1px solid #dcdcdc;">${group.type}</td>
            <td style="padding: 10px; border: 1px solid #dcdcdc;">${group.gender}</td>
            <td style="padding: 10px; border: 1px solid #dcdcdc;">${group.language}</td>
            <td style="padding: 10px; border: 1px solid #dcdcdc;">${group.smoking_text}</td>
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

function filterGroups() {
    const muni = $('#filterMunicipality').val().toLowerCase();
    const col = $('#filterColonia').val().toLowerCase();
    
    const filtered = groupsData.filter(g => 
        (g.municipality.toLowerCase().includes(muni) || muni === '') &&
        (g.neighborhood.toLowerCase().includes(col) || col === '')
    );
    renderTable(filtered, 1);
}

function clearFilters() {
    $('#filterMunicipality').val('');
    $('#filterColonia').val('');
    renderTable(groupsData, 1);
}
