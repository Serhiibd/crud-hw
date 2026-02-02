const API_URL = "http://localhost:3001/students";

const getBtn = document.getElementById("get-students-btn");
const tableBody = document.querySelector("#students-table tbody");
const addForm = document.getElementById("add-student-form");

async function getStudents() {
  const response = await fetch(API_URL);
  const students = await response.json();
  renderStudents(students);
}

function renderStudents(students) {
  tableBody.innerHTML = students
    .map(
      (student) => `
      <tr>
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${student.age}</td>
        <td>${student.course}</td>
        <td>${student.skills.join(", ")}</td>
        <td>${student.email}</td>
        <td>${student.isEnrolled ? "✅" : "❌"}</td>
        <td>
          <button data-action="update" data-id="${student.id}">Оновити</button>
          <button data-action="delete" data-id="${student.id}">Видалити</button>
        </td>
      </tr>
    `,
    )
    .join("");
}

async function addStudent(e) {
  e.preventDefault();

  const newStudent = {
    name: document.getElementById("name").value,
    age: Number(document.getElementById("age").value),
    course: document.getElementById("course").value,
    skills: document
      .getElementById("skills")
      .value.split(",")
      .map((s) => s.trim()),
    email: document.getElementById("email").value,
    isEnrolled: document.getElementById("isEnrolled").checked,
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newStudent),
  });

  addForm.reset();
  getStudents();
}

async function updateStudent(id) {
  const newCourse = prompt("Введіть новий курс:");
  if (!newCourse) return;

  await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ course: newCourse }),
  });

  getStudents();
}

async function deleteStudent(id) {
  if (!confirm("Ви впевнені, що хочете видалити студента?")) return;

  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  getStudents();
}

getBtn.addEventListener("click", getStudents);
addForm.addEventListener("submit", addStudent);

tableBody.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const id = btn.dataset.id;
  const action = btn.dataset.action;

  if (action === "delete") deleteStudent(id);
  if (action === "update") updateStudent(id);
});
