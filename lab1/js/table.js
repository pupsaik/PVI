const tbody = document.getElementById("tableBody");
const template = document.getElementById("rowTemplate");
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
            document.getElementById("edit-student-modal").style.display = "block";
            const row = event.target.closest("tr");
            const id = row.querySelector(".id").textContent.trim();
            const student = students.find(s => s.id == parseInt(id));

            if (!student) return;

            currentEditId = student.id;
            document.getElementById("group-edit-input").value = student.group;
            document.getElementById("first-name-edit-input").value = student.name.split(" ")[0];
            document.getElementById("last-name-edit-input").value = student.name.split(" ")[1];
            document.getElementById("gender-edit-input").value = student.gender;
            let dateParts = student.birthday.split(".");
            if (dateParts.length === 3) {
                student.birthday = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            }
            document.getElementById("birthday-edit-input").value = student.birthday;
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

function openAddStudentModal() {
    document.getElementById("add-student-modal").style.display = "block";
}

function closeAddStudentModal() {
    document.getElementById("add-student-modal").style.display = "none";
}

function openEditStudentModal() {
    document.getElementById("edit-student-modal").style.display = "block";
}

function closeEditStudentModal() {
    document.getElementById("edit-student-modal").style.display = "none";
}

document.getElementById("add-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const firstName = document.getElementById("first-name-input").value;
    const secondName = document.getElementById("last-name-input").value;
    const group = document.getElementById("group-input").value;
    const gender = document.getElementById("gender-input").value;
    const birthday = document.getElementById("birthday-input").value;

    let newStudent = {
        id: students.length + 1,
        name: firstName + " " + secondName,
        group,
        gender,
        birthday,
        status: "active"
    }

    students.push(newStudent);
    const row = template.content.cloneNode(true);
    row.querySelector(".id").textContent = newStudent.id;
    row.querySelector(".group").textContent = newStudent.group;
    row.querySelector(".name").textContent = newStudent.name;
    row.querySelector(".gender").textContent = newStudent.gender;
    row.querySelector(".birthday").textContent = formatDate(newStudent.birthday);

    tbody.appendChild(row);
    closeAddStudentModal();
    document.getElementById("add-form").reset();
    attachButtonListeners();
});

document.querySelector(".ok-button").addEventListener("click", () => {
    const firstName = document.getElementById("first-name-input").value;
    const secondName = document.getElementById("last-name-input").value;
    const group = document.getElementById("group-input").value;
    const gender = document.getElementById("gender-input").value;
    const birthday = document.getElementById("birthday-input").value;

    if(firstName === "" || secondName === "" || birthday == "")
    {
        closeAddStudentModal();
        document.getElementById("add-form").reset();
        return;
    }

    let newStudent = {
        id: students.length + 1,
        name: firstName + " " + secondName,
        group,
        gender,
        birthday,
        status: "active"
    }

    students.push(newStudent);
    const row = template.content.cloneNode(true);
    row.querySelector(".id").textContent = newStudent.id;
    row.querySelector(".group").textContent = newStudent.group;
    row.querySelector(".name").textContent = newStudent.name;
    row.querySelector(".gender").textContent = newStudent.gender;
    row.querySelector(".birthday").textContent = formatDate(newStudent.birthday);

    tbody.appendChild(row);
    closeAddStudentModal();
    document.getElementById("add-form").reset();
    attachButtonListeners();
});

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

document.getElementById("edit-button").addEventListener("click", (event) => {
    event.preventDefault();

    const group = document.getElementById("group-edit-input").value;
    const firstName = document.getElementById("first-name-edit-input").value;
    const lastName = document.getElementById("last-name-edit-input").value;
    const birthday = document.getElementById("birthday-edit-input").value;
    const gender = document.getElementById("gender-edit-input").value;
    const student = students.find(s => s.id === currentEditId);
    
    student.group = group;
    student.name = firstName + " " + lastName;
    student.birthday = birthday;

    const row = [...document.querySelectorAll(`#tableBody tr`)].find(tr => tr.querySelector(".id").textContent == currentEditId);
    row.querySelector(".group").textContent = group;
    row.querySelector(".name").textContent = student.name;
    row.querySelector(".birthday").textContent = formatDate(birthday);
    row.querySelector(".gender").textContent = gender;
    closeEditStudentModal();
    
})

function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
}