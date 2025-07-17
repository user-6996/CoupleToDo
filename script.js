// Couple To-Do List App
class CoupleTodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('coupleTasks')) || [];
        this.partnerInfo = JSON.parse(localStorage.getItem('partnerInfo')) || null;
        this.init();
    }

    init() {
        this.checkPartnerSetup();
        this.bindEvents();
        this.renderTasks();
        this.updateStats();
        this.toggleEmptyState();
        this.updateWelcomeMessage();
    }

    checkPartnerSetup() {
        if (!this.partnerInfo) {
            this.showPartnerSetup();
        } else {
            this.hidePartnerSetup();
        }
    }

    showPartnerSetup() {
        const popup = document.getElementById('partnerSetupPopup');
        popup.style.display = 'flex';
    }

    hidePartnerSetup() {
        const popup = document.getElementById('partnerSetupPopup');
        popup.style.display = 'none';
    }

    bindEvents() {
        const addBtn = document.getElementById('addTaskBtn');
        const taskInput = document.getElementById('taskInput');
        const setupForm = document.getElementById('partnerSetupForm');

        addBtn.addEventListener('click', () => this.addTask());
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        setupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePartnerSetup();
        });
    }

    handlePartnerSetup() {
        const partnerName = document.getElementById('partnerName').value.trim();
        const partnerType = document.querySelector('input[name="partnerType"]:checked')?.value;

        if (!partnerName || !partnerType) {
            this.showNotification('Please fill in all fields! 💕', 'warning');
            return;
        }

        this.partnerInfo = {
            name: partnerName,
            type: partnerType
        };

        localStorage.setItem('partnerInfo', JSON.stringify(this.partnerInfo));
        this.hidePartnerSetup();
        this.updateWelcomeMessage();
        this.createFloatingHearts();
        this.showNotification(`Welcome, ${partnerName}! 💖`, 'success');
    }

    updateWelcomeMessage() {
        const welcomeMessage = document.getElementById('welcomeMessage');
        const partnerBadge = document.getElementById('partnerBadge');
        const partnerInfo = document.getElementById('partnerInfo');

        if (this.partnerInfo) {
            const partnerIcon = this.getPartnerIcon(this.partnerInfo.type);
            welcomeMessage.textContent = `Welcome, ${this.partnerInfo.name}! 💖`;
            partnerBadge.textContent = `${partnerIcon} ${this.partnerInfo.name}`;
            partnerInfo.style.display = 'flex';
        } else {
            welcomeMessage.textContent = 'Share the love, share the tasks! 💖';
            partnerInfo.style.display = 'none';
        }
    }

    addTask() {
        const taskInput = document.getElementById('taskInput');
        const partnerSelect = document.getElementById('partnerSelect');
        
        const text = taskInput.value.trim();
        const partner = partnerSelect.value;

        if (!text) {
            this.showNotification('Please enter a task! 💕', 'warning');
            return;
        }

        const task = {
            id: Date.now(),
            text: text,
            partner: partner,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.toggleEmptyState();

        // Clear input
        taskInput.value = '';
        taskInput.focus();

        // Add floating hearts animation
        this.createFloatingHearts();

        this.showNotification('Task added with love! 💖', 'success');
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            this.updateStats();

            if (task.completed) {
                this.createFloatingHearts();
                this.showNotification('Great job! Task completed! 🎉', 'success');
            }
        }
    }

    deleteTask(id) {
        const taskIndex = this.tasks.findIndex(t => t.id === id);
        if (taskIndex !== -1) {
            this.tasks.splice(taskIndex, 1);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.toggleEmptyState();
            this.showNotification('Task removed! 💫', 'info');
        }
    }

    renderTasks() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        this.tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            taskList.appendChild(taskElement);
        });
    }

    createTaskElement(task) {
        const taskDiv = document.createElement('div');
        taskDiv.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskDiv.dataset.id = task.id;

        const partnerIcon = this.getPartnerIcon(task.partner);
        const partnerText = this.getPartnerText(task.partner);

        taskDiv.innerHTML = `
            <div class="task-content">
                <div class="task-text">${task.text}</div>
                <div class="task-owner">${partnerIcon} ${partnerText}</div>
            </div>
            <div class="task-actions">
                <button class="action-btn complete-btn" onclick="app.toggleTask(${task.id})" title="Mark as complete">
                    ${task.completed ? '🔄' : '✅'}
                </button>
                <button class="action-btn delete-btn" onclick="app.deleteTask(${task.id})" title="Delete task">
                    ❌
                </button>
            </div>
        `;

        return taskDiv;
    }

    getPartnerIcon(partner) {
        const icons = {
            'both': '👫',
            'partner1': '👨',
            'partner2': '👩'
        };
        return icons[partner] || '👫';
    }

    getPartnerText(partner) {
        const texts = {
            'both': 'Both Partners',
            'partner1': 'Partner 1',
            'partner2': 'Partner 2'
        };
        return texts[partner] || 'Both Partners';
    }

    updateStats() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;

        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
    }

    toggleEmptyState() {
        const emptyState = document.getElementById('emptyState');
        const taskList = document.getElementById('taskList');
        
        if (this.tasks.length === 0) {
            emptyState.style.display = 'block';
            taskList.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            taskList.style.display = 'flex';
        }
    }

    saveTasks() {
        localStorage.setItem('coupleTasks', JSON.stringify(this.tasks));
    }

    createFloatingHearts() {
        const heartsContainer = document.getElementById('floatingHearts');
        const hearts = ['💕', '💖', '💗', '💓', '💝', '💞'];
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'heart';
                heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
                heart.style.left = Math.random() * 100 + '%';
                heart.style.top = '100%';
                
                heartsContainer.appendChild(heart);
                
                setTimeout(() => {
                    heart.remove();
                }, 3000);
            }, i * 100);
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-text">${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            font-family: 'Poppins', sans-serif;
            font-size: 0.9rem;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': '✅',
            'warning': '⚠️',
            'error': '❌',
            'info': '💡'
        };
        return icons[type] || '💡';
    }

    getNotificationColor(type) {
        const colors = {
            'success': 'linear-gradient(135deg, #4ecdc4, #44a08d)',
            'warning': 'linear-gradient(135deg, #ffd93d, #ff6b6b)',
            'error': 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
            'info': 'linear-gradient(135deg, #74b9ff, #0984e3)'
        };
        return colors[type] || 'linear-gradient(135deg, #74b9ff, #0984e3)';
    }

    // Add some sample tasks for demo
    addSampleTasks() {
        const sampleTasks = [
            {
                id: Date.now() - 3000,
                text: 'Plan our next date night 🌹',
                partner: 'both',
                completed: false,
                createdAt: new Date().toISOString()
            },
            {
                id: Date.now() - 2000,
                text: 'Cook dinner together 👨‍🍳',
                partner: 'both',
                completed: true,
                createdAt: new Date().toISOString()
            },
            {
                id: Date.now() - 1000,
                text: 'Buy groceries 🛒',
                partner: 'partner1',
                completed: false,
                createdAt: new Date().toISOString()
            }
        ];

        this.tasks = [...sampleTasks, ...this.tasks];
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.toggleEmptyState();
    }

    // Reset partner info (for testing)
    resetPartnerInfo() {
        localStorage.removeItem('partnerInfo');
        this.partnerInfo = null;
        this.checkPartnerSetup();
        this.updateWelcomeMessage();
    }
}

// Initialize the app
const app = new CoupleTodoApp();

// Add sample tasks if no tasks exist (for demo purposes)
if (app.tasks.length === 0) {
    // Uncomment the line below to add sample tasks for demo
    // app.addSampleTasks();
}

// Add some fun interactions
document.addEventListener('DOMContentLoaded', () => {
    // Add sparkle effect to the title
    const title = document.querySelector('.title');
    title.addEventListener('click', () => {
        app.createFloatingHearts();
    });

    // Add hover effect to the add button
    const addBtn = document.getElementById('addTaskBtn');
    addBtn.addEventListener('mouseenter', () => {
        addBtn.style.transform = 'translateY(-3px) scale(1.05)';
    });
    addBtn.addEventListener('mouseleave', () => {
        addBtn.style.transform = 'translateY(0) scale(1)';
    });

    // Add double-click to title to reset partner info (for testing)
    title.addEventListener('dblclick', () => {
        if (confirm('Reset partner info? (This will show the setup popup again)')) {
            app.resetPartnerInfo();
        }
    });
}); 