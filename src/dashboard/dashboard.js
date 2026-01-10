let allPlayersData = [];
async function loadDashboardData() {
    try {
        const response = await fetch('../data.json'); 
        allPlayersData = await response.json();
        renderTable(allPlayersData);
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

function renderTable(data) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; 

    data.forEach(player => {
        const row = `
            <tr>
                <td>${player.name}</td>
                <td>${player.difficulty}</td>
                <td>${player.accuracy}%</td>
                <td>${player.reactionTime}s</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function sortData(property) {
    const sortedData = [...allPlayersData].sort((a, b) => {
        if (property === 'reactionTime') {
            return a[property] - b[property]; 
        } else {
            return b[property] - a[property];
        }
    });
    renderTable(sortedData);
}

document.getElementById('levelFilter').addEventListener('change', function() {
    const selectedLevel = this.value.toLowerCase();
    
    if (selectedLevel === 'all') {
        renderTable(allPlayersData);
    } else {
        const filteredData = allPlayersData.filter(player => 
            player.difficulty.toLowerCase() === selectedLevel
        );
        renderTable(filteredData);
    }
});

loadDashboardData();