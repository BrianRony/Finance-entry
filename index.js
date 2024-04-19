document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('http://localhost:3000/data');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
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
    }
}

async function deleteDataById(idToDelete) {
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
