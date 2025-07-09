export function createResultsTable(tabularData) {
    const existingTable = document.getElementById('results-table');
    if (existingTable) existingTable.remove();

    if (!tabularData?.length) return;

    const tableContainer = document.createElement('div');
    tableContainer.id = 'results-table';
    tableContainer.className = 'mt-6';
    tableContainer.innerHTML = `
        <div class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div class="px-4 py-3 bg-gray-750 border-b border-gray-700">
                <h4 class="text-sm font-semibold text-gray-200">Tabular Results</h4>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left text-gray-300">
                    <thead class="text-xs text-gray-400 uppercase bg-gray-700">
                        <tr>
                            <th scope="col" class="px-6 py-3 font-medium">Formula</th>
                            <th scope="col" class="px-6 py-3 font-medium">Molar mass, g/mol</th>
                            <th scope="col" class="px-6 py-3 font-medium">Mass, g</th>
                        </tr>
                    </thead>
                    <tbody id="table-body" class="divide-y divide-gray-700">
                        ${tabularData.map(row => `
                            <tr class="bg-gray-800 hover:bg-gray-750 transition-colors">
                                <td class="px-6 py-4 font-mono text-sm text-white">${row.formula}</td>
                                <td class="px-6 py-4 text-sm text-gray-300">${row.molar}</td>
                                <td class="px-6 py-4 text-sm text-gray-300">${row.masses}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    document.getElementById('results-section').appendChild(tableContainer);
}

export function updateTableVisibility(mode) {
    const table = document.getElementById('results-table');
    if (!table) return;
    table.style.display = mode === 'masses' ? 'block' : 'none';
}