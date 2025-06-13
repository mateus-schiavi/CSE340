document.addEventListener('DOMContentLoaded', () => {
    // Botões para adicionar
    document.querySelectorAll('.btn-add').forEach(button => {
        button.addEventListener('click', () => {
            const invId = button.dataset.invId;
            fetch(`/cart/add/${invId}`, { method: 'POST' })
                .then(response => {
                    if (response.ok) {
                        location.reload();
                    } else {
                        alert('Error adding item to cart.');
                    }
                })
                .catch(() => alert('Error connecting to server.'));
        });
    });

    // Botões para remover
    document.querySelectorAll('.btn-remove').forEach(button => {
        button.addEventListener('click', () => {
            const invId = button.dataset.invId;
            fetch(`/cart/remove/${invId}`, { method: 'POST' })
                .then(response => {
                    if (response.ok) {
                        location.reload();
                    } else {
                        alert('Error removing item from cart.');
                    }
                })
                .catch(() => alert('Error connecting to server.'));
        });
    });
});
