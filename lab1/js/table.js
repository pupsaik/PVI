const tbody = document.getElementById("tableBody");
const template = document.getElementById("rowTemplate");
let isEditMode = false;
let currentEditId = null;
    
function loadTable() {

    students.forEach(item => {
        const row = template.content.cloneNode(true);
        row.querySelector(".id").textContent = item.id;
        row.querySelector(".group").textContent = item.group;
        row.querySelector(".name").textContent = item.name;
        row.querySelector(".gender").textContent = item.gender;
        row.querySelector(".birthday").textContent = item.birthday;
        if(item.name === localStorage.getItem("username"))
            row.querySelector(".status-icon").src = "../assets/images/online.png";
        tbody.appendChild(row);
        
    });
}

function attachButtonListeners() {
    document.querySelectorAll(".delete-button").forEach(button => {
        button.addEventListener("click", (event) => {
            const checkboxes = document.querySelectorAll(".delete-checkbox");
            let checkedAtLeastOne = Array.from(checkboxes).some(checkbox => checkbox.checked);
            const modal = document.querySelector(".delete-modal");
            const modalText = modal.querySelector(".modal-text");
            const okButton = modal.querySelector(".ok-button");
            const cancelButton = modal.querySelector(".cancel-button");
            const closeButton = modal.querySelector(".modal-close-button");

            modal.style.display = "block";
            
            if (checkedAtLeastOne) {
                modalText.textContent = "Are you sure you want to delete these students?";
                okButton.onclick = () => {
                    const checkedRows = [...document.querySelectorAll("#tableBody tr")].filter(row => row.querySelector(".delete-checkbox").checked);
                    checkedRows.forEach(row => deleteStudent(row));
                    modal.style.display = "none";
                };
            } else {
                const row = event.target.closest("tr");
                const studentName = row.querySelector(".name").textContent;
                modalText.textContent = `Are you sure you want to delete ${studentName}?`;
                okButton.onclick = () => {
                    deleteStudent(row);
                    modal.style.display = "none";
                };
            }

            cancelButton.onclick = () => {
                modal.style.display = "none";
            };

            closeButton.onclick = () => {
                modal.style.display = "none";
            }
        });
    });

    document.querySelectorAll(".edit-button").forEach(button => {
        button.addEventListener("click", (event) => {
            let id = parseInt(event.target.closest("tr").querySelector(".id").textContent);
            openStudentModal(true, students.find(s => s.id === id));
        });
    });

    document.querySelector(".modal-close-button").addEventListener("click", () => {
        document.querySelector(".modal").style.display = "none";
    });
}

attachButtonListeners();

function deleteStudent(row) {
    const studentId = parseInt(row.querySelector(".id").textContent.trim());
    const student = students.find(s => s.id === studentId);

    if (student) {
        students.splice(students.indexOf(student), 1);
        row.remove();
    }
}

function openStudentModal(isEdit = false, student = null) {
    document.querySelectorAll(".invalid").forEach(input => {
        clearError(input);
    });

    const modal = document.getElementById("student-modal");
    const title = document.getElementById("modal-title");
    const submitButton = document.getElementById("submit-button");
    const form = document.getElementById("student-form");

    if (isEdit && student) {
        isEditMode = true;
        currentEditId = student.id;
        title.textContent = "Edit student";
        submitButton.textContent = "Edit";
        document.getElementById("student-id").value = student.id;
        document.getElementById("group-input").value = student.group;
        document.getElementById("first-name-input").value = student.name.split(" ")[0];
        document.getElementById("last-name-input").value = student.name.split(" ")[1];
        document.getElementById("gender-input").value = student.gender;
        document.getElementById("birthday-input").value = convertStringToDate(student.birthday);
    } else {
        title.textContent = "Add student";
        submitButton.textContent = "Create";
        form.reset();
    }

    modal.style.display = "block";
}

function closeStudentModal() {
    document.getElementById("student-modal").style.display = "none";
}

document.querySelector(".add-button").addEventListener("click", () => openStudentModal(false));

document.querySelectorAll(".edit-button").forEach(button => {
    button.addEventListener("click", (event) => {
        const studentRow = event.target.closest("tr");
        const student = {
            id: studentRow.querySelector(".id").textContent,
            group: studentRow.querySelector(".group").textContent,
            firstName: studentRow.querySelector(".name").textContent.split(" ")[0],
            lastName: studentRow.querySelector(".name").textContent.split(" ")[1],
            gender: studentRow.querySelector(".gender").textContent,
            birthday: studentRow.querySelector(".birthday").textContent,
        };
        openStudentModal(true, student);
    });
});

function showError(inputElement, errorMessage) {
    inputElement.classList.add("invalid");
    const inputContainer = inputElement.closest(".input-container");
    const errorElement = inputContainer.querySelector(".error-message");
    errorElement.style.display = "block";
    errorElement.textContent = errorMessage;
}

function clearError(inputElement) {
    inputElement.classList.remove("invalid");
    const inputContainer = inputElement.closest(".input-container");
    const errorElement = inputContainer.querySelector(".error-message");
    errorElement.style.display = "none";
    errorElement.textContent = "";
}


document.querySelector(".form").addEventListener("submit", (event) => {
    event.preventDefault();
    let formIsValid = true;
    
    const id = document.getElementById("student-id").value;
    const group = document.getElementById("group-input").value;
    const firstName = document.getElementById("first-name-input");
    const lastName = document.getElementById("last-name-input");
    const gender = document.getElementById("gender-input").value;
    const birthday = document.getElementById("birthday-input");
    
    const nameSymbolQuantity = /^.{2,20}$/;
    const nameSymbolsPattern = /^[A-Za-z.]+$/;

    if (!nameSymbolQuantity.test(firstName.value)) {
        showError(firstName, "First name must contain 2-20 characters.");
        formIsValid = false;
    } else if (!nameSymbolsPattern.test(firstName.value)) {
        showError(firstName, "First name must contain only letters.");
        formIsValid = false;
    } else {
        clearError(firstName);
    }
    
    if (!nameSymbolQuantity.test(lastName.value)) {
        showError(lastName, "Last name must contain 2-20 characters.");
        formIsValid = false;
    } else if (!nameSymbolsPattern.test(lastName.value)) {
        showError(lastName, "Last name must contain only letters.");
        formIsValid = false;
    } else {
        clearError(lastName);
    }

    let year = parseInt(birthday.value.split("-")[0]);
    if (year > 2015 || year < 2000)
    {
        showError(birthday, "Year must be between 2000 and 2015.");
        formIsValid = false;
        
    } else {
        clearError(birthday);    
    }
    
       
    if (formIsValid) {
        // Збираємо дані з форми
        const firstName = document.getElementById("first-name-input").value;
        const lastName = document.getElementById("last-name-input").value;
        const fullName = `${firstName} ${lastName}`;
        const group = document.getElementById("group-input").value;
        const gender = document.getElementById("gender-input").value;
        const birthday = document.getElementById("birthday-input").value;
        
        if (isEditMode && currentEditId !== null) {
            // Режим редагування
            updateStudent(currentEditId, {
                name: fullName,
                group,
                gender,
                birthday: formatDateForDisplay(birthday)
            });
        } else {
            // Режим додавання
            addNewStudent({
                name: fullName,
                group,
                gender, 
                birthday: formatDateForDisplay(birthday)
            });
        }
        
        // Закриваємо модальне вікно
        document.getElementById("student-modal").style.display = "none";
    }
});

function addNewStudent(studentData) {
    // Створюємо новий об'єкт студента
    const newStudent = {
        id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
        name: studentData.name,
        group: studentData.group,
        gender: studentData.gender,
        birthday: studentData.birthday,
        status: "active"
    };
    
    // Додаємо студента в масив даних
    students.push(newStudent);
    
    // Додаємо студента в таблицю
    const row = template.content.cloneNode(true);
    row.querySelector(".id").textContent = newStudent.id;
    row.querySelector(".group").textContent = newStudent.group;
    row.querySelector(".name").textContent = newStudent.name;
    row.querySelector(".gender").textContent = newStudent.gender;
    row.querySelector(".birthday").textContent = newStudent.birthday;
    
    // Встановлюємо статус онлайн, якщо це поточний користувач
    if(newStudent.name === localStorage.getItem("username")) {
        row.querySelector(".status-icon").src = "../assets/images/online.png";
    }
    
    tbody.appendChild(row);
    
    // Перепривʼязуємо обробники подій
    attachButtonListeners();
    
    console.log("Added new student:", newStudent);
}

function updateStudent(id, studentData) {
    // Знаходимо студента за ID
    const studentIndex = students.findIndex(s => s.id === parseInt(id));
    
    if (studentIndex !== -1) {
        // Зберігаємо поточний статус
        const currentStatus = students[studentIndex].status;
        
        // Оновлюємо дані студента
        students[studentIndex] = {
            ...students[studentIndex], // зберігаємо існуючі поля
            ...studentData, // перезаписуємо оновлені поля
            status: currentStatus // зберігаємо поточний статус
        };
        
        // Оновлюємо рядок в таблиці
        const rows = document.querySelectorAll("#tableBody tr");
        for (const row of rows) {
            const rowId = parseInt(row.querySelector(".id").textContent);
            if (rowId === parseInt(id)) {
                row.querySelector(".group").textContent = studentData.group;
                row.querySelector(".name").textContent = studentData.name;
                row.querySelector(".gender").textContent = studentData.gender;
                row.querySelector(".birthday").textContent = studentData.birthday;
                break;
            }
        }
        
        console.log("Updated student:", students[studentIndex]);
        // Скидаємо змінні режиму редагування
        isEditMode = false;
        currentEditId = null;
    } else {
        console.error("Student with ID", id, "not found");
    }
}

document.getElementById("general-checkbox").addEventListener("click", function() {
    const checkboxes = document.querySelectorAll(".delete-checkbox");
    if(this.checked) {
        checkboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
    }
    else {
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    }
})

function formatDateForDisplay(dateString) {
    if (!dateString) return "";
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return dateString;
        }
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    } catch (error) {
        console.error("Error formatting date:", error);
        return dateString;
    }
}

function convertStringToDate(date) {
    console.log(date)
    const parts = date.split(".");
    if (parts.length !== 3) return "";
        const formattedDate = new Date(parseInt(parts[2]), parseInt(parts[1]), parseInt(parts[0]));
    
    console.log(formattedDate);
    return formattedDate.toISOString().split("T")[0];
}