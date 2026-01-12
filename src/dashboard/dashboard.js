let allPlayersData = [];
let filteredData = [];

function loadDashboardData() {
    try {
        const storageKey = 'aimTrainer_scores';
        const data = localStorage.getItem(storageKey);
        allPlayersData = data ? JSON.parse(data) : [];
        renderTable(allPlayersData);
    } catch (error) {
        console.error("Error loading data from storage:", error);
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
                <td>${player.score}</td>
                <td>${(player.reaction / 1000).toFixed(2)}s</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function sortData(property, event) {
    document.querySelectorAll('.sort-btn, button').forEach(btn => {
        btn.classList.remove('active-sort');
    });

    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active-sort');
    }

    const dataToSort = filteredData.length > 0 ? filteredData : allPlayersData;
    
    const sortedData = [...dataToSort].sort((a, b) => {
        if (property === 'reaction') { 
            return a[property] - b[property]; 
        } else {
            return b[property] - a[property];
        }
    });
    
    filteredData = sortedData;
    renderTable(sortedData);
}

document.getElementById('levelFilter').addEventListener('change', function() {
    document.querySelectorAll('.sort-btn, button').forEach(btn => btn.classList.remove('active-sort'));
    const selectedLevel = this.value.toLowerCase();
    
    filteredData = selectedLevel === 'all' 
        ? allPlayersData 
        : allPlayersData.filter(player => player.difficulty.toLowerCase() === selectedLevel);
    
    renderTable(filteredData);
});

loadDashboardData();