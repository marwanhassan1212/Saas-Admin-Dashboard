// users.js - User Management Logic

let currentUsers = [];
let userModalInstance;

document.addEventListener('DOMContentLoaded', () => {
    userModalInstance = new bootstrap.Modal(document.getElementById('userModal'));
    loadUsers();

    // Setup search
    const searchInput = document.getElementById('user-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = currentUsers.filter(u => 
                u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
            );
            renderUsers(filtered);
        });
    }
});

async function loadUsers() {
    const tbody = document.getElementById('users-table-body');
    try {
        currentUsers = await API.getUsers();
        renderUsers(currentUsers);
    } catch(err) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger py-4">Failed to load users.</td></tr>`;
    }
}

function renderUsers(usersList) {
    const tbody = document.getElementById('users-table-body');
    const countDisplay = document.getElementById('user-count-display');
    
    if (usersList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">No users found.</td></tr>`;
        countDisplay.innerText = `Showing 0 users`;
        return;
    }

    let html = '';
    usersList.forEach(u => {
        const statusBadgeClasses = u.status === 'Active' ? 'badge badge-soft-success text-success' : 'badge badge-soft-danger text-danger';
        
        let roleIcon = '';
        if(u.role === 'Admin') roleIcon = '<i class="bi bi-shield-lock-fill text-danger me-1"></i>';
        if(u.role === 'Manager') roleIcon = '<i class="bi bi-briefcase-fill text-primary me-1"></i>';
        if(u.role === 'User') roleIcon = '<i class="bi bi-person-fill text-muted me-1"></i>';

        html += `
            <tr>
                <td class="ps-4">
                    <div class="d-flex align-items-center">
                        <img src="https://ui-avatars.com/api/?name=${u.name.replace(' ','+')}&background=random" class="rounded-circle me-3" width="40" height="40">
                        <div>
                            <div class="fw-medium">${u.name}</div>
                            <div class="text-muted small">${u.email}</div>
                        </div>
                    </div>
                </td>
                <td>${roleIcon} ${u.role}</td>
                <td><span class="badge ${statusBadgeClasses}">${u.status}</span></td>
                <td class="text-muted">${u.joined}</td>
                <td class="text-end pe-4">
                    <button class="btn btn-sm btn-outline-secondary me-1" onclick="editUser(${u.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${u.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
    countDisplay.innerText = `Showing ${usersList.length} users`;
}

function resetUserForm() {
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('userModalLabel').innerText = 'Add User';
}

function editUser(id) {
    const user = currentUsers.find(u => u.id === id);
    if (!user) return;

    document.getElementById('userId').value = user.id;
    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userRole').value = user.role;
    document.getElementById('userStatus').value = user.status;
    document.getElementById('userModalLabel').innerText = 'Edit User';
    
    userModalInstance.show();
}

async function saveUser() {
    const form = document.getElementById('userForm');
    if (!form.reportValidity()) return;

    const id = document.getElementById('userId').value;
    const userData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        role: document.getElementById('userRole').value,
        status: document.getElementById('userStatus').value
    };

    try {
        if (id) {
            // Update
            await API.updateUser(Number(id), userData);
            window.showToast('User updated successfully', 'success');
        } else {
            // Create
            await API.addUser(userData);
            window.showToast('User added successfully', 'success');
        }
        userModalInstance.hide();
        loadUsers();
    } catch(err) {
        window.showToast(err.message || 'An error occurred', 'danger');
    }
}

function deleteUser(id) {
    // Determine the theme for SweetAlert
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const bg = isDark ? '#1e293b' : '#fff';
    const color = isDark ? '#f8fafc' : '#1e293b';

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Yes, delete it!',
        background: bg,
        color: color
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await API.deleteUser(id);
                window.showToast('User deleted successfully', 'success');
                loadUsers();
            } catch(err) {
                window.showToast('Failed to delete user', 'danger');
            }
        }
    });
}
