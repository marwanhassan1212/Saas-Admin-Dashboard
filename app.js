// Core Application Logic

document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Management (Dark/Light Mode)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    // Get theme from local storage or system preference
    const currentTheme = localStorage.getItem('theme') || 
                         (prefersDarkScheme.matches ? 'dark' : 'light');

    if (currentTheme == 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        if(themeToggleBtn) themeToggleBtn.innerHTML = '<i class="bi bi-sun"></i>';
    } else {
        document.body.setAttribute('data-theme', 'light');
        if(themeToggleBtn) themeToggleBtn.innerHTML = '<i class="bi bi-moon"></i>';
    }

    if(themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            let theme = document.body.getAttribute('data-theme');
            if (theme === 'dark') {
                document.body.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                themeToggleBtn.innerHTML = '<i class="bi bi-moon"></i>';
            } else {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeToggleBtn.innerHTML = '<i class="bi bi-sun"></i>';
            }
            
            // Dispatch event for charts to update
            window.dispatchEvent(new Event('themeChanged'));
        });
    }

    // 2. Sidebar Toggle (Mobile)
    const toggleSidebarBtn = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('sidebar');

    if (toggleSidebarBtn && sidebar) {
        toggleSidebarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('show');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth < 992 && sidebar.classList.contains('show')) {
                if (!sidebar.contains(e.target) && e.target !== toggleSidebarBtn) {
                    sidebar.classList.remove('show');
                }
            }
        });
    }

    // 3. Mark active state in sidebar
    const currentLocation = location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if(href === currentLocation) {
            link.parentElement.classList.add('active');
        }
    });
});

// Global Utility functions
window.showToast = function(message, type = 'success') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.position = 'fixed';
        toastContainer.style.bottom = '20px';
        toastContainer.style.right = '20px';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0 mb-2`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;

    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
    bsToast.show();

    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
};

// Check Authentication
window.checkAuth = function() {
    const currentUser = localStorage.getItem('currentUser');
    const publicPages = ['login.html', 'register.html', 'forgot-password.html'];
    const currentFile = location.pathname.split('/').pop() || 'index.html';

    if (!currentUser && !publicPages.includes(currentFile)) {
        window.location.href = 'login.html';
    } else if (currentUser && publicPages.includes(currentFile)) {
        window.location.href = 'index.html';
    }
};

// Execute Auth Check immediately
checkAuth();
