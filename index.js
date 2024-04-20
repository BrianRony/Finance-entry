document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Fetch data from server
        const response = await fetch('http://localhost:3000/data');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        
        // Calculate total and average values
        const totalRevenue = data.reduce((acc, entry) => acc + entry.revenue, 0);
        const totalExpenditure = data.reduce((acc, entry) => acc + entry.expenditure, 0);
        const averageRevenue = totalRevenue / data.length || 0;
        const averageExpenditure = totalExpenditure / data.length || 0;

        // Update summary section
        document.getElementById('totalRevenue').innerText = `$${totalRevenue.toFixed(2)}`;
        document.getElementById('totalExpenditure').innerText = `$${totalExpenditure.toFixed(2)}`;
        document.getElementById('averageRevenue').innerText = `$${averageRevenue.toFixed(2)}`;
        document.getElementById('averageExpenditure').innerText = `$${averageExpenditure.toFixed(2)}`;

        // Sort data by date in descending order
        data.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Display submitted data
        data.forEach(displaySubmittedData);
    } catch (error) {
        console.error('Error:', error.message);
    }
});

async function submitData() {
    const date = document.getElementById('date').value;
    const revenue = parseFloat(document.getElementById('revenue').value);
    const expenditure = parseFloat(document.getElementById('expenditure').value);
    const comment = document.getElementById('comment').value;

    if (isNaN(revenue) || isNaN(expenditure) || revenue <= 0 || expenditure <= 0) {
        document.getElementById('error-message').innerText = 'Please enter valid revenue and expenditure amounts.';
        return;
    }

    const data = {
        date: date,
        revenue: revenue,
        expenditure: expenditure,
        comment: comment
    };

    try {
        const response = await fetch('http://localhost:3000/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to submit data');
        }

        document.getElementById('date').value = '';
        document.getElementById('revenue').value = '';
        document.getElementById('expenditure').value = '';
        document.getElementById('comment').value = '';

        displaySubmittedData(data);
    } catch (error) {
        console.error('Error:', error.message);
        document.getElementById('error-message').innerText = 'Failed to submit data. Please try again.';
    }
}

async function deleteDataById(idToDelete) {
    const confirmation = confirm('Are you sure you want to delete this entry?');
    if (!confirmation) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/data/${idToDelete}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete data');
        }

        // Update the UI to reflect the deletion
        const cardToDelete = document.getElementById(idToDelete);
        cardToDelete.remove();
    } catch (error) {
        console.error('Error:', error.message);
        document.getElementById('error-message').innerText = 'Failed to delete data. Please try again.';
    }
}

function displaySubmittedData(data) {
    const submittedData = document.getElementById('submittedData');
    const card = document.createElement('div');
    card.className = 'card';
    card.id = data.id;
    card.innerHTML = `
        <div class="card-header">
            <span>Date: ${data.date}</span>
            <button onclick="deleteDataById('${data.id}')">Delete</button>
        </div>
        <div class="card-body">
            <p><strong>Revenue:</strong> $${data.revenue}</p>
            <p><strong>Expenditure:</strong> $${data.expenditure}</p>
            <p><strong>Comment:</strong> ${data.comment}</p>
        </div>
    `;
    submittedData.appendChild(card);
}
