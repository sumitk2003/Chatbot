class ChatBot {
    constructor() {
        this.messages = [];
        this.todos = [];
        this.commands = this.initializeCommands();
        this.setupEventListeners();
    }

    initializeCommands() {
        return {
            help: {
                description: 'Display available commands',
                handler: () => {
                    const commandList = Object.entries(this.commands)
                        .map(([cmd, info]) => `/${cmd} - ${info.description}`)
                        .join('\n');
                    return 'Available commands:\n' + commandList;
                }
            },
            joke: {
                description: 'Get a random programming joke',
                handler: async () => {
                    const response = await fetch('https://v2.jokeapi.dev/joke/Programming?safe-mode');
                    const data = await response.json();
                    return data.type === 'single' 
                        ? data.joke 
                        : `${data.setup}\n${data.delivery}`;
                }
            },
            calculator: {
                description: 'Perform basic arithmetic operations',
                handler: (expression) => {
                    try {
                        // Using Function instead of eval for better security
                        const result = new Function('return ' + expression)();
                        return `Result: ${result}`;
                    } catch {
                        return 'Invalid calculation. Please try again.';
                    }
                }
            },
            weather: {
                description: 'Get weather information for a city',
                handler: async (city) => {
                    if (!city) return 'Please provide a city name';
                    return `Weather feature coming soon for: ${city}`;
                }
            },
            time: {
                description: 'Show current time',
                handler: () => new Date().toLocaleTimeString()
            },
            date: {
                description: 'Show today\'s date',
                handler: () => new Date().toLocaleDateString()
            },
            quote: {
                description: 'Get an inspirational quote',
                handler: async () => {
                    const response = await fetch('https://api.quotable.io/random');
                    const data = await response.json();
                    return `"${data.content}"\n- ${data.author}`;
                }
            },
            news: {
                description: 'Show top news headlines',
                handler: () => 'News headlines feature coming soon.'
            },
            fact: {
                description: 'Display a random fun fact',
                handler: async () => {
                    const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
                    const data = await response.json();
                    return data.text;
                }
            },
            todo: {
                description: 'Manage todo list (add/list/remove)',
                handler: (args) => {
                    const [action, ...rest] = args.split(' ');
                    const task = rest.join(' ');

                    switch (action) {
                        case 'add':
                            if (!task) return 'Please provide a task to add';
                            this.todos.push({
                                id: Date.now(),
                                task,
                                completed: false
                            });
                            return `Added task: ${task}`;
                        
                        case 'list':
                            if (this.todos.length === 0) return 'No tasks in your todo list.';
                            return 'Todo list:\n' + this.todos.map(todo => `- ${todo.task}`).join('\n');
                        
                        case 'remove':
                            if (!task) return 'Please provide a task to remove';
                            const index = this.todos.findIndex(t => t.task === task);
                            if (index > -1) {
                                this.todos.splice(index, 1);
                                return `Removed task: ${task}`;
                            }
                            return 'Task not found.';
                        
                        default:
                            return 'Invalid todo command. Use: /todo add <task>, /todo list, or /todo remove <task>';
                    }
                }
            },
            gif: {
                description: 'Display a GIF based on keyword',
                handler: (keyword) => {
                    if (!keyword) return 'Please provide a keyword for the GIF';
                    return 'GIF feature coming soon.';
                }
            },
            define: {
                description: 'Show the definition of a word',
                handler: async (word) => {
                    if (!word) return 'Please provide a word to define';
                    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
                    if (!response.ok) return 'Word not found';
                    const data = await response.json();
                    const definition = data[0].meanings[0].definitions[0].definition;
                    return `Definition of "${word}":\n${definition}`;
                }
            },
            translate: {
                description: 'Translate text to another language',
                handler: (args) => {
                    const [text, language] = args.split(' ');
                    if (!text || !language) return 'Please provide both text and target language';
                    return 'Translation feature coming soon.';
                }
            },
            emoji: {
                description: 'Show an emoji based on feeling',
                handler: (feeling) => {
                    if (!feeling) return 'Please provide a feeling';
                    const emojis = {
                        happy: '😊', sad: '😢', angry: '😠',
                        love: '❤️', laugh: '😂', cool: '😎',
                        surprised: '😮', tired: '😴'
                    };
                    return emojis[feeling.toLowerCase()] || '🤔';
                }
            },
            reminder: {
                description: 'Set a reminder',
                handler: (args) => {
                    const [time, ...task] = args.split(' ');
                    if (!time || task.length === 0) {
                        return 'Please provide both time and task';
                    }
                    return `Reminder feature coming soon. You wanted to be reminded about "${task.join(' ')}" at ${time}`;
                }
            },
            math: {
                description: 'Solve a math expression',
                handler: (expression) => {
                    if (!expression) return 'Please provide a math expression';
                    try {
                        const result = new Function('return ' + expression)();
                        return `${expression} = ${result}`;
                    } catch {
                        return 'Invalid math expression';
                    }
                }
            },
            story: {
                description: 'Display a short motivational story',
                handler: () => {
                    return 'Once upon a time, there was a small ant who decided to climb a mountain. Everyone said it was impossible, but the ant kept climbing, one tiny step at a time. After many days, the ant reached the top, proving that persistence and determination can overcome any obstacle.';
                }
            },
            meme: {
                description: 'Display a random meme',
                handler: () => 'Meme feature coming soon.'
            },
            color: {
                description: 'Display a color preview',
                handler: (color) => {
                    if (!color) return 'Please provide a color name';
                    return `Here's your color: ${color}`;
                }
            },
            image: {
                description: 'Display an image based on keyword',
                handler: (keyword) => {
                    if (!keyword) return 'Please provide a keyword';
                    return `Here's an image of "${keyword}"\nhttps://source.unsplash.com/400x300/?${encodeURIComponent(keyword)}`;
                }
            },
            music: {
                description: 'Suggest a music playlist by genre',
                handler: (genre) => {
                    if (!genre) return 'Please provide a music genre';
                    const playlists = {
                        rock: 'Classic Rock Essentials',
                        jazz: 'Jazz Classics',
                        pop: 'Top Pop Hits',
                        classical: 'Classical Masterpieces',
                        electronic: 'Electronic Beats',
                        hiphop: 'Hip Hop Favorites'
                    };
                    return `Suggested playlist for ${genre}: ${playlists[genre.toLowerCase()] || 'Genre not found'}`;
                }
            },
            shorten: {
                description: 'Shorten a URL',
                handler: (url) => {
                    if (!url) return 'Please provide a URL to shorten';
                    return 'URL shortening feature coming soon.';
                }
            },
            ip: {
                description: 'Show your IP address',
                handler: async () => {
                    try {
                        const response = await fetch('https://api.ipify.org?format=json');
                        const data = await response.json();
                        return `Your IP address is: ${data.ip}`;
                    } catch {
                        return 'Could not fetch IP address';
                    }
                }
            },
            clear: {
                description: 'Clear chat history',
                handler: () => {
                    this.clearMessages();
                    return 'Chat history cleared';
                }
            }
        };
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        const moonIcon = document.getElementById('moonIcon');
        const sunIcon = document.getElementById('sunIcon');
        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            moonIcon.classList.toggle('hidden');
            sunIcon.classList.toggle('hidden');
        });

        // Message input
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');

        const sendMessage = () => {
            const message = messageInput.value.trim();
            if (message) {
                this.handleUserInput(message);
                messageInput.value = '';
            }
        };

        sendButton.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    async handleUserInput(input) {
        this.addMessage(input, 'user');

        if (input.startsWith('/')) {
            const [command, ...args] = input.slice(1).split(' ');
            await this.processCommand(command, args.join(' '));
        } else {
            this.addMessage("Please start your command with '/' (e.g., /help)", 'bot');
        }
    }

    async processCommand(command, args) {
        const cmd = this.commands[command];
        if (cmd) {
            try {
                const response = await cmd.handler(args);
                this.addMessage(response, 'bot');
            } catch (error) {
                this.addMessage('An error occurred while processing your command.', 'bot');
            }
        } else {
            this.addMessage(`Unknown command '${command}'. Type /help for available commands.`, 'bot');
        }
    }

    addMessage(content, type) {
        const message = {
            id: Date.now(),
            content,
            type,
            timestamp: new Date()
        };

        this.messages.push(message);
        this.renderMessage(message);
        this.scrollToBottom();
    }

    renderMessage(message) {
        const messagesContainer = document.getElementById('messagesContainer');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.type}`;

        const avatar = document.createElement('div');
        avatar.className = `avatar ${message.type}-avatar`;
        
        // Add icon to avatar
        const icon = document.createElement('svg');
        icon.className = 'icon';
        icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.setAttribute('fill', 'none');
        icon.setAttribute('stroke', 'currentColor');
        icon.setAttribute('stroke-width', '2');

        if (message.type === 'bot') {
            icon.innerHTML = '<path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path><path d="M12 8v8"></path><path d="M5 3v7"></path><path d="M19 3v7"></path><path d="M12 16v4"></path><rect x="4" y="8" width="16" height="8" rx="2"></rect>';
        } else {
            icon.innerHTML = '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>';
        }
        
        avatar.appendChild(icon);

        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'message-content';
        
        const text = document.createElement('p');
        text.textContent = message.content;
        
        const timestamp = document.createElement('div');
        timestamp.className = 'timestamp';
        timestamp.textContent = message.timestamp.toLocaleTimeString();

        contentWrapper.appendChild(text);
        contentWrapper.appendChild(timestamp);

        if (message.type === 'user') {
            messageElement.appendChild(contentWrapper);
            messageElement.appendChild(avatar);
        } else {
            messageElement.appendChild(avatar);
            messageElement.appendChild(contentWrapper);
        }

        messagesContainer.appendChild(messageElement);
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('messagesContainer');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    clearMessages() {
        const messagesContainer = document.getElementById('messagesContainer');
        messagesContainer.innerHTML = '';
        this.messages = [];
    }
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.chatBot = new ChatBot();
});