// EMPLOYEE MANAGEMENT SYSTEM

// API URL

const API_URL = "https://dummyjson.com/users";

// Employee array

let employees = [];

// Current department

let currentDepartment = "All";

// Current search text

let currentSearch = "";

// FETCH EMPLOYEES

function fetchEmployees() {
  const status = document.getElementById("status");

  status.innerHTML = "Loading employees...";

  fetch(API_URL)
    .then(function (response) {
      return response.json();
    })

    .then(function (data) {
      // Convert API users into our employee format

      employees = data.users.map(function (user, index) {
        const departments = ["IT", "HR", "Finance", "Marketing"];

        return {
          id: user.id,

          name: user.firstName + " " + user.lastName,

          age: user.age,

          email: user.email,

          phone: user.phone,

          image: user.image,

          department: departments[index % 4],

          salary: 30000 + index * 2500,
        };
      });

      displayEmployees(employees);

      status.innerHTML = "Employee data loaded successfully.";
    })

    .catch(function (error) {
      console.log(error);

      status.innerHTML = "Unable to load employee data. Please try again.";
    })

    .finally(function () {
      console.log("API request completed.");
    });
}

// DISPLAY EMPLOYEES

function displayEmployees(employeeList) {
  const container = document.getElementById("employeeContainer");

  container.innerHTML = "";

  if (employeeList.length === 0) {
    container.innerHTML = "<p>No employees found.</p>";

    updateStatistics([]);

    return;
  }

  employeeList.forEach(function (employee) {
    const card = document.createElement("div");

    card.className = "employee-card";

    card.innerHTML = `

            <img
                src="${employee.image}"
                alt="${employee.name}"
            >

            <h3>${employee.name}</h3>

            <p>
                <strong>Age:</strong>
                ${employee.age}
            </p>

            <p>
                <strong>Email:</strong>
                ${employee.email}
            </p>

            <p>
                <strong>Department:</strong>
                ${employee.department}
            </p>

            <p>
                <strong>Phone:</strong>
                ${employee.phone}
            </p>

            <p>
                <strong>Salary:</strong>
                ₹${employee.salary.toLocaleString("en-IN")}
            </p>

            <button
                class="delete-btn"
                onclick="deleteEmployee(${employee.id})"
            >
                Delete
            </button>

        `;

    container.appendChild(card);
  });

  updateStatistics(employeeList);
}

// SEARCH EMPLOYEES

function searchEmployees() {
  const searchInput = document.getElementById("searchInput");

  currentSearch = searchInput.value.toLowerCase();

  applyFilters();
}

// FILTER DEPARTMENT

function filterDepartment(department) {
  currentDepartment = department;

  applyFilters();
}

// APPLY SEARCH + DEPARTMENT FILTER

function applyFilters() {
  let filteredEmployees = employees;

  // Search filter

  if (currentSearch !== "") {
    filteredEmployees = filteredEmployees.filter(function (employee) {
      return employee.name.toLowerCase().includes(currentSearch);
    });
  }

  // Department filter

  if (currentDepartment !== "All") {
    filteredEmployees = filteredEmployees.filter(function (employee) {
      return employee.department === currentDepartment;
    });
  }

  displayEmployees(filteredEmployees);
}

// ADD EMPLOYEE

function addEmployee() {
  const name = document.getElementById("name").value.trim();

  const age = document.getElementById("age").value;

  const email = document.getElementById("email").value.trim();

  const department = document.getElementById("department").value;

  const salary = document.getElementById("salary").value;

  // Validate employee

  const isValid = validateEmployee(name, age, email, department, salary);

  if (!isValid) {
    return;
  }

  // Create employee object

  const newEmployee = {
    id: Date.now(),

    name: name,

    age: Number(age),

    email: email,

    department: department,

    salary: Number(salary),

    phone: "Not available",

    image: "https://dummyjson.com/icon/1/128",
  };

  // Spread operator

  employees = [...employees, newEmployee];

  // Display employees

  applyFilters();

  // Clear form

  clearForm();

  alert("Employee added successfully.");
}

// VALIDATE EMPLOYEE

function validateEmployee(name, age, email, department, salary) {
  let valid = true;

  // Clear previous errors

  document.getElementById("nameError").innerHTML = "";

  document.getElementById("ageError").innerHTML = "";

  document.getElementById("emailError").innerHTML = "";

  document.getElementById("departmentError").innerHTML = "";

  document.getElementById("salaryError").innerHTML = "";

  // Name validation

  if (name === "") {
    document.getElementById("nameError").innerHTML =
      "❌ Please enter employee name";

    valid = false;
  }

  // Age validation

  if (age === "" || Number(age) <= 18) {
    document.getElementById("ageError").innerHTML =
      "❌ Age must be greater than 18";

    valid = false;
  }

  // Email validation

  if (email === "") {
    document.getElementById("emailError").innerHTML =
      "❌ Please enter employee email";

    valid = false;
  }

  // Department validation

  if (department === "") {
    document.getElementById("departmentError").innerHTML =
      "❌ Please select department";

    valid = false;
  }

  // Salary validation

  if (salary === "" || Number(salary) <= 0) {
    document.getElementById("salaryError").innerHTML =
      "❌ Please enter valid salary";

    valid = false;
  }

  return valid;
}

// DELETE EMPLOYEE

function deleteEmployee(id) {
  const employee = employees.find(function (employee) {
    return employee.id === id;
  });

  if (employee) {
    const confirmDelete = confirm("Delete " + employee.name + "?");

    if (!confirmDelete) {
      return;
    }
  }

  employees = employees.filter(function (employee) {
    return employee.id !== id;
  });

  applyFilters();
}

// CLEAR FORM

function clearForm() {
  document.getElementById("employeeForm").reset();

  document.getElementById("nameError").innerHTML = "";

  document.getElementById("ageError").innerHTML = "";

  document.getElementById("emailError").innerHTML = "";

  document.getElementById("departmentError").innerHTML = "";

  document.getElementById("salaryError").innerHTML = "";
}

// CALCULATE SALARY

function calculateSalary(employeeList) {
  const totalSalary = employeeList.reduce(function (total, employee) {
    return total + employee.salary;
  }, 0);

  let averageSalary = 0;

  if (employeeList.length > 0) {
    averageSalary = totalSalary / employeeList.length;
  }

  return {
    total: totalSalary,

    average: averageSalary,
  };
}

// UPDATE STATISTICS

function updateStatistics(employeeList) {
  const count = employeeList.length;

  const salary = calculateSalary(employeeList);

  document.getElementById("employeeCount").innerHTML = count;

  document.getElementById("totalSalary").innerHTML =
    "₹" + salary.total.toLocaleString("en-IN");

  document.getElementById("averageSalary").innerHTML =
    "₹" + Math.round(salary.average).toLocaleString("en-IN");

  // Highest salary

  displayHighestSalary(employeeList);
}

// HIGHEST SALARY EMPLOYEE

function displayHighestSalary(employeeList) {
  const highestElement = document.getElementById("highestEmployee");

  if (employeeList.length === 0) {
    highestElement.innerHTML = "No employee available";

    return;
  }

  const highestEmployee = employeeList.reduce(function (highest, employee) {
    if (employee.salary > highest.salary) {
      return employee;
    }

    return highest;
  });

  highestElement.innerHTML = `

        <strong>Name:</strong>
        ${highestEmployee.name}

        <br>

        <strong>Salary:</strong>
        ₹${highestEmployee.salary.toLocaleString("en-IN")}

    `;
}

// SORT EMPLOYEES

function sortEmployees() {
  const sortValue = document.getElementById("sortSelect").value;

  let sortedEmployees = [...employees];

  if (sortValue === "nameAsc") {
    sortedEmployees.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  } else if (sortValue === "nameDesc") {
    sortedEmployees.sort(function (a, b) {
      return b.name.localeCompare(a.name);
    });
  } else if (sortValue === "ageAsc") {
    sortedEmployees.sort(function (a, b) {
      return a.age - b.age;
    });
  } else if (sortValue === "ageDesc") {
    sortedEmployees.sort(function (a, b) {
      return b.age - a.age;
    });
  } else if (sortValue === "salaryAsc") {
    sortedEmployees.sort(function (a, b) {
      return a.salary - b.salary;
    });
  } else if (sortValue === "salaryDesc") {
    sortedEmployees.sort(function (a, b) {
      return b.salary - a.salary;
    });
  }

  displayEmployees(sortedEmployees);
}

// DATE AND TIME

function updateDateTime() {
  const now = new Date();

  const day = now.getDate();

  const month = now.toLocaleString("en-US", { month: "long" });

  const year = now.getFullYear();

  const hours = now.getHours();

  const minutes = now.getMinutes();

  const seconds = now.getSeconds();

  document.getElementById("date").innerHTML =
    "Today: " + day + " " + month + " " + year;

  document.getElementById("time").innerHTML =
    "Time: " +
    String(hours).padStart(2, "0") +
    ":" +
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0");
}

// EVENT LISTENERS

// Search button

document.getElementById("searchBtn").addEventListener("click", searchEmployees);

// Search while typing

document
  .getElementById("searchInput")
  .addEventListener("input", searchEmployees);

// Department buttons

const departmentButtons = document.querySelectorAll(".department-btn");

departmentButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    departmentButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    const department = button.getAttribute("data-department");

    filterDepartment(department);
  });
});

// Add employee form

document
  .getElementById("employeeForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    addEmployee();
  });

// Sort

document.getElementById("sortSelect").addEventListener("change", sortEmployees);

// START APPLICATION

fetchEmployees();

// Update time every second

setInterval(updateDateTime, 1000);

updateDateTime();

