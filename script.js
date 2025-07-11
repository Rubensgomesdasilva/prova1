document.addEventListener('DOMContentLoaded', () => {
    const itemForm = document.getElementById('item-form');
    const itemIdInput = document.getElementById('item-id');
    const itemNameInput = document.getElementById('item-name');
    const btnSave = document.getElementById('btn-save');
    const btnCancel = document.getElementById('btn-cancel');
    const itemList = document.getElementById('item-list');
    const apiUrl = 'http://localhost:3000/items';

    itemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        itemIdInput.value ? updateItem(itemIdInput.value, itemNameInput.value) : createItem(itemNameInput.value);
    });

    btnCancel.addEventListener('click', resetForm);

    function loadItems() {
        fetch(apiUrl)
            .then(res => res.json())
            .then(items => {
                itemList.innerHTML = '';
                items.forEach(addItemToList);
            })
            .catch(console.error);
    }

    function addItemToList(item) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="item-name">${item.name}</span><!-- errado -->
            <div class="item-actions">
                <button class="btn-edit">Editar</button>
                <button class="btn-delete">Excluir</button>
            </div>`;
        li.querySelector('.btn-edit').addEventListener('click', () => editItem(item));
        li.querySelector('.btn-delete').addEventListener('click', () => deleteItem(item.id));
        itemList.appendChild(li);
    }

    function createItem(name) {
        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        })
        .then(res => res.json())
        .then(item => {
            addItemToList(item);
            itemForm.reset();
        })
        .catch(console.error);
    }

    function editItem(item) {
        itemIdInput.value = item.id;
        itemNameInput.value = item.name;
        btnSave.textContent = 'Atualizar Item';
        btnCancel.classList.remove('hidden');
    }

    function updateItem(id, name) {
        fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        })
        .then(() => {
            resetForm();
            loadItems();
        })
        .catch(console.error);
    }

    function deleteItem(id) {
        if (confirm('Tem certeza que deseja excluir este item?')) {
            fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
                .then(() => loadItems())
                .catch(console.error);
        }
    }

    function resetForm() {
        itemIdInput.value = '';
        itemNameInput.value = '';
        btnSave.textContent = 'Adicionar Item';
        btnCancel.classList.add('hidden');
    }

    loadItems();
});
