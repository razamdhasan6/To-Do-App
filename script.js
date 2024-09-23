document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');

    const searchEle = document.querySelector('.search');
    const addBtnEle = document.querySelector('.add');

    searchEle.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            addBtnEle.click();
        }
    });
    

    addBtnEle.addEventListener('click', () => {
        let userInput = searchEle.value.trim();

        // Check if the input is not empty
        if (userInput) {
            addTaskToList(userInput, false); // New tasks start unchecked
            saveTasks();  // Save tasks after adding a new task
            // Clear the input field after adding the task
            searchEle.value = '';
        }
    });

    function addTaskToList(task, isCompleted) {
        // Create new elements dynamically
        const lowerContentDiv = document.createElement('div');
        lowerContentDiv.classList.add('lower-content');

        const radioInput = document.createElement('input');
        radioInput.classList.add('radio');
        radioInput.type = 'radio';
        radioInput.id = `task-radio-${Date.now()}`;

        const paragraph = document.createElement('p');
        paragraph.classList.add('p');
        paragraph.textContent = task;

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete');
        deleteBtn.textContent = '⨯';

        // Append the new elements to the div
        lowerContentDiv.appendChild(radioInput);
        lowerContentDiv.appendChild(paragraph);
        lowerContentDiv.appendChild(deleteBtn);

        // Insert the new div at the top of the container
        const firstLowerContent = container.querySelector('.lower-content');
        if (firstLowerContent) {
            container.insertBefore(lowerContentDiv, firstLowerContent);
        } else {
            container.appendChild(lowerContentDiv);
        }

        // Function to toggle radio button and line-through style
        const toggleLineThrough = () => {
            radioInput.checked = !radioInput.checked;
            if (radioInput.checked) {
                paragraph.style.textDecorationLine = 'line-through';
                paragraph.style.backgroundColor = '#f1f2f3';
            } else {
                paragraph.style.textDecorationLine = 'none';
                paragraph.style.backgroundColor = 'lightYellow';
            }
            saveTasks(); // Save the updated state after toggling
        };

        // Apply the saved state if available
        if (isCompleted) {
            radioInput.checked = true;
            paragraph.style.textDecorationLine = 'line-through';
            paragraph.style.backgroundColor = '#f1f2f3';
        }

        // Click on the paragraph or the radio button triggers the same function
        paragraph.addEventListener('click', toggleLineThrough);
        radioInput.addEventListener('click', toggleLineThrough);

        // Add functionality to the delete button
        deleteBtn.addEventListener('click', () => {
            container.removeChild(lowerContentDiv);
            saveTasks(); // Save tasks after deleting a task

            // If no tasks are left, display the default message
            if (!container.querySelector('.lower-content')) {
                addTaskToList('Your task showing like this', false);
            }
        });
    };

    // Save all tasks to localStorage, including their toggle state
    const saveTasks = () => {
        const tasks = [];
        document.querySelectorAll('.lower-content').forEach(data => {
            const taskData = data.querySelector('p');
            const radioInput = data.querySelector('input.radio');

            if (taskData && radioInput) {
                const task = taskData.textContent;
                const isCompleted = radioInput.checked;
                tasks.push({ content: task, isCompleted });  // Save the toggle state
            }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Load tasks from localStorage and create task elements
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

        // If no tasks are found, display the default message
        if (tasks.length === 0) {
            addTaskToList('Your task showing like this', false);
        } else {
            // Reverse the order to maintain newest tasks at the top
            tasks.reverse().forEach(task => {
                addTaskToList(task.content, task.isCompleted);  // Load the toggle state
            });
        }
    };
    
    // Load tasks from localStorage when the page loads
    loadTasks();
});
