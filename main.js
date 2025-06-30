const form = document.getElementById("addContactForm");
const nameInput = document.getElementById("nameInput");
const phoneInput = document.getElementById("phoneInput");
const contactList = document.getElementById("contactList");
const searchInput = document.getElementById("searchInput");
const title = document.querySelector("header h1");
const trashBtn = document.getElementById("trashBtn");
const starBtn = document.getElementById("starBtn");

phoneInput.addEventListener('input', function(e) {
    let value = phoneInput.value.replace(/\D/g, '');

    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 0) value = '(' + value;
    if (value.length > 3) value = value.slice(0, 3) + ') ' + value.slice(3);
    if (value.length > 10) value = value.slice(0, 10) + '-' + value.slice(10);

    phoneInput.value = value;
});

let contacts = [];
let trash = [];
let showingTrash = false;
let showingFavorites = false;

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    if (name && phone) {
        const contact = {
            id: Date.now(),
            name,
            phone,
            favorite: false,
        };

        contacts.push(contact);
        nameInput.value = "";
        phoneInput.value = "";
        renderContacts();
    }
});

function renderContacts(filter = "") {
    contactList.innerHTML = "";

    let listToShow = [];

    if (showingTrash) {
        listToShow = trash;
    } else if (showingFavorites) {
        listToShow = contacts.filter((c) => c.favorite);
    } else {
        listToShow = contacts;
    }

    const filtered = listToShow.filter((c) =>
        c.name.toLowerCase().includes(filter.toLowerCase())
    );

    filtered.forEach((contact) => {
        const div = document.createElement("div");
        div.className = "contact";

        div.innerHTML = `
        <div class="info">
            <strong>${contact.name}</strong><br />
            <small>${contact.phone}</small>
        </div>
        <div class="actions">
            ${
                !showingTrash
                    ? `
                <button class="icon-btn" title="Editar" onclick="editContact(${contact.id})">
                    <img src="./Images/Pen.png" width="20" alt="Editar" />
                </button>
                <button class="icon-btn" title="Excluir" onclick="moveToTrash(${contact.id})">
                    <img src="./Images/Trash.png" width="20" alt="Excluir" />
                </button>
                <button class="icon-btn" title="Favoritar" onclick="toggleFavorite(${contact.id})">
                    <img src="./Images/Star.png" width="20" alt="Favoritar" />
                </button>
            `
                    : `
                <button class="icon-btn" title="Restaurar" onclick="restoreFromTrash(${contact.id})">
                    <img src="./Images/Recycle.png" width="20" alt="Restaurar" />
                </button>
                <button class="icon-btn" title="Excluir permanentemente" onclick="deletePermanently(${contact.id})">
                    <img src="./Images/Trash.png" width="20" alt="Excluir permanentemente" />
                </button>
            `
            }
        </div>
        `;

        contactList.appendChild(div);
    });

    if (showingTrash) {
        title.textContent = "Lixeira";
        trashBtn.textContent = "📒";
        trashBtn.title = "Voltar para contatos";
        starBtn.style.visibility = "hidden";
    } else if (showingFavorites) {
        title.textContent = "Favoritos";
        starBtn.textContent = "📒";
        starBtn.title = "Voltar para contatos";
        trashBtn.style.visibility = "hidden";
    } else {
        title.textContent = "Contatos";
        trashBtn.textContent = "🗑️";
        trashBtn.title = "Abrir lixeira";
        starBtn.textContent = "⭐";
        starBtn.title = "Ver favoritos";
        trashBtn.style.visibility = "visible";
        starBtn.style.visibility = "visible";
    }
}

function deleteContact(id) {
    contacts = contacts.filter((c) => c.id !== id);
    renderContacts(searchInput.value);
}

function moveToTrash(id) {
    const contact = contacts.find((c) => c.id === id);
    if (contact) {
        contacts = contacts.filter((c) => c.id !== id);
        trash.push(contact);
        renderContacts(searchInput.value);
    }
}

function restoreFromTrash(id) {
    const contact = trash.find((c) => c.id === id);
    if (contact) {
        trash = trash.filter((c) => c.id !== id);
        contacts.push(contact);
        renderContacts(searchInput.value);
    }
}

function deletePermanently(id) {
    trash = trash.filter((c) => c.id !== id);
    renderContacts(searchInput.value);
}

function toggleFavorite(id) {
    contacts = contacts.map((c) =>
        c.id === id ? { ...c, favorite: !c.favorite } : c
    );
    renderContacts(searchInput.value);
}

function editContact(id) {
    const contact = contacts.find((c) => c.id === id);
    if (!contact) return;

    const newName = prompt("Editar nome:", contact.name);
    const newPhone = prompt("Editar telefone:", contact.phone);

    if (newName && newPhone) {
        contact.name = newName;
        contact.phone = newPhone;
        renderContacts(searchInput.value);
    }
}

searchInput.addEventListener("input", () => {
    renderContacts(searchInput.value);
});

trashBtn.addEventListener("click", () => {
    if (showingFavorites) return;
    showingTrash = !showingTrash;
    showingFavorites = false;
    renderContacts(searchInput.value);
});

starBtn.addEventListener("click", () => {
    if (showingTrash) return;
    showingFavorites = !showingFavorites;
    showingTrash = false;
    renderContacts(searchInput.value);
});

renderContacts();
