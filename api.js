// Mock API using LocalStorage

const API = {
    // Delay simulator to mock network latency
    delay: (ms = 500) => new Promise(resolve => setTimeout(resolve, ms)),

    // Generic Methods
    getItems: async (key) => {
        await API.delay();
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    },

    saveItems: (key, items) => {
        localStorage.setItem(key, JSON.stringify(items));
    },

    // User Operations
    getUsers: async () => {
        let users = await API.getItems('users');
        if (users.length === 0) {
            // Seed some dummy data if empty
            users = [
                { id: 1, name: "Alice Smith", email: "alice@example.com", role: "Admin", status: "Active", joined: "2023-01-15" },
                { id: 2, name: "Bob Johnson", email: "bob@example.com", role: "User", status: "Active", joined: "2023-03-22" },
                { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "User", status: "Inactive", joined: "2023-05-10" },
                { id: 4, name: "Diana Prince", email: "diana@example.com", role: "Manager", status: "Active", joined: "2023-06-01" },
            ];
            API.saveItems('users', users);
        }
        return users;
    },

    addUser: async (user) => {
        await API.delay();
        const users = await API.getItems('users');
        user.id = Date.now();
        user.joined = new Date().toISOString().split('T')[0];
        users.push(user);
        API.saveItems('users', users);
        return user;
    },

    updateUser: async (id, updatedData) => {
        await API.delay();
        let users = await API.getItems('users');
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            users[index] = { ...users[index], ...updatedData };
            API.saveItems('users', users);
            return users[index];
        }
        throw new Error("User not found");
    },

    deleteUser: async (id) => {
        await API.delay();
        let users = await API.getItems('users');
        users = users.filter(u => u.id !== id);
        API.saveItems('users', users);
        return true;
    },

    // Authentication (Mock)
    login: async (email, password) => {
        await API.delay(800);
        // Dummy logic
        if (email === 'admin@admin.com' && password === 'password') {
            const user = { id: 1, name: 'Admin User', email: email, role: 'Admin' };
            localStorage.setItem('currentUser', JSON.stringify(user));
            return user;
        }
        throw new Error('Invalid email or password. Use admin@admin.com / password');
    },

    logout: () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    },

    // Dashboard Stats
    getDashboardStats: async () => {
        await API.delay(600);
        return {
            totalRevenue: "$45,231.89",
            activeUsers: "2,350",
            totalOrders: "1,204",
            growth: "+20.1%"
        };
    }
};

window.API = API;
