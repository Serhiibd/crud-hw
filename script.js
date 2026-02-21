const API_URL = "http://localhost:3001/students";

const getBtn = document.getElementById("get-students-btn");
const tableBody = document.querySelector("#students-table tbody");
const addForm = document.getElementById("add-student-form");

function getStudents() {
  return fetch(API_URL)
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch students");
      return response.json();
    })
    .then((students) => {
      renderStudents(students);
      return students;
    })
    .catch((err) => {
      console.error(err);
      alert("Не вдалося отримати список студентів");
    });
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
        <td>${Array.isArray(student.skills) ? student.skills.join(", ") : ""}</td>
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

function addStudent(e) {
  e.preventDefault();

  const newStudent = {
    name: document.getElementById("name").value,
    age: Number(document.getElementById("age").value),
    course: document.getElementById("course").value,
    skills: document
      .getElementById("skills")
      .value.split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    email: document.getElementById("email").value,
    isEnrolled: document.getElementById("isEnrolled").checked,
  };

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newStudent),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to add student");
      // якщо API повертає створений об'єкт, можна зробити return response.json();
      return null;
    })
    .then(() => {
      addForm.reset();
      return getStudents();
    })
    .catch((err) => {
      console.error(err);
      alert("Не вдалося додати студента");
    });
}

function updateStudent(id) {
  const newCourse = prompt("Введіть новий курс:");
  if (!newCourse) return;

  fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ course: newCourse }),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to update student");
      return null;
    })
    .then(() => getStudents())
    .catch((err) => {
      console.error(err);
      alert("Не вдалося оновити студента");
    });
}

function deleteStudent(id) {
  if (!confirm("Ви впевнені, що хочете видалити студента?")) return;

  fetch(`${API_URL}/${id}`, { method: "DELETE" })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to delete student");
      return null;
    })
    .then(() => getStudents())
    .catch((err) => {
      console.error(err);
      alert("Не вдалося видалити студента");
    });
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
