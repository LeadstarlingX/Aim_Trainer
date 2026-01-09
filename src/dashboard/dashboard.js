async function loadDashboardData() {
    try {
        const response = await fetch('../data.json'); 
        const data = await response.json();
        renderTable(data);
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

loadDashboardData();