let baseURL = "https://jsonplaceholder.typicode.com";

const cl = console.log;

const userForm = document.getElementById("userForm");
const name = document.getElementById("name");
const username = document.getElementById("username");
const email = document.getElementById("email");
const address = document.getElementById("address");
const phone = document.getElementById("phone");
const editBtn = document.getElementById("editBtn");
const updateBtn = document.getElementById("updateBtn");
const cardContainer = document.getElementById("cardContainer");
const spinner = document.getElementById("spinner");

let userArr = [];

function snackbar(msg, icon) {
  swal.fire({
    title: msg,
    icon: icon,
    timer: 2000,
  });
}

function fetchUserData(ele) {
  spinner.classList.remove("d-none");

  let xhr = new XMLHttpRequest();
  let postURL = `${baseURL}/users`;

  xhr.open("GET", postURL);
  xhr.send(null);
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      userArr = JSON.parse(xhr.response);

      creatCard(userArr.reverse());
      spinner.classList.add("d-none");
    }
  };
}

fetchUserData();

function creatCard(ele) {
  let result = "";
  ele.forEach((element, i) => {
    result += `
    <tr id="${element.id}">
  <td>${ele.length - i}</td>
  <td>${element.name}</td>
  <td>${element.username}</td>
  <td>${element.email}</td>
  <td>${element.address.city}</td>
  <td>${element.phone}</td>

  <td><i class="fa-solid fa-2x cursor-pointer text-primary 
  fa-pen-to-square"  onclick = "onedit(this)"></i></
  td>
   <td><i class="fa-solid fa-2x cursor-pointer text-danger 
  fa-trash" onclick = "ondelete(this)"></i></td>

</tr>
    `;
  });

  cardContainer.innerHTML = result;
}
function onSubmitHandalar(ele) {
  ele.preventDefault();

  spinner.classList.remove("d-none");

  let newObj = {
    name: name.value,
    username: username.value,
    email: email.value,
    address: address.value,
    phone: phone.value,
  };

  userArr.push(newObj);

  let xhr = new XMLHttpRequest();
  let postURL = `${baseURL}/users`;
  xhr.open("POST", postURL);
  xhr.send(JSON.stringify(newObj));
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      this.response = JSON.parse(xhr.response);

      let tr = document.createElement("tr");
      tr.id = this.response.id;
      tr.innerHTML = `
      <td>${userArr.length}</td>
<td>${newObj.name}</td>
<td>${newObj.username}</td>
<td>${newObj.email}</td>
<td>${newObj.address}</td>
<td>${newObj.phone}</td>
<td><i class="fa-solid fa-2x cursor-pointer text-primary 
fa-pen-to-square" onclick = "onedit(this)"></i></
td>
 <td><i class="fa-solid fa-2x cursor-pointer text-danger 
fa-trash" onclick = "ondelete(this)"></i></td>
      `;

      cardContainer.prepend(tr);
      snackbar("User Add Successfully", "success");
    }
    spinner.classList.add("d-none");
  };
}

function onedit(ele) {
  spinner.classList.remove("d-none");

  let editId = ele.closest("tr").id;
  localStorage.setItem("editId", editId);
  let editURL = `${baseURL}/users/${editId}`;

  let xhr = new XMLHttpRequest();
  xhr.open("GET", editURL);
  xhr.send(null);
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let editObj = JSON.parse(xhr.response);

      name.value = editObj.name;
      username.value = editObj.username;
      email.value = editObj.email;
      address.value = editObj.address.city;
      phone.value = editObj.phone;

      editBtn.classList.add("d-none");
      updateBtn.classList.remove("d-none");
      spinner.classList.add("d-none");
    }
  };
}

function onUpdateHandalar(ele) {
  spinner.classList.remove("d-none");

  let updateId = localStorage.getItem("editId").id;
  let updObj = {
    name: name.value,
    username: name.value,
    email: email.value,
    address: address.value,
    phone: phone.value,
  };

  let xhr = new XMLHttpRequest();
  let updURL = `${baseURL}/users/${updateId}`;
  xhr.open("PUT", updURL);
  xhr.send(JSON.stringify(updObj));
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let tr = document.getElementById(updateId);
      tr.innerHTML = `
      <td>${userArr.length}</td>
      <td>${updObj.name}</td>
      <td>${updObj.username}</td>
      <td>${updObj.email}</td>
      <td>${updObj.address.city}</td>
      <td>${updObj.phone}</td>
      <td><i class="fa-solid fa-2x  text-primary 
      fa-pen-to-square" onclick = "onedit(this)"></i></
      td>
       <td><i class="fa-solid fa-2x text-danger 
      fa-trash" onclick = "ondelete(this)"></i></td>

      `;

      editBtn.classList.remove("d-none");
      updateBtn.classList.add("d-none");
    }

    userForm.reset();
    spinner.classList.add("d-none");
    snackbar("User Successfully", "success");
  };
}

function ondelete(ele) {
  spinner.classList.remove("d-none");

  Swal.fire({
    title: "Are you sure?",
    text: "You want to delete this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      let deleteId = ele.closest("tr").id;
      let deleteURL = `${baseURL}/users/${deleteId}`;

      let xhr = new XMLHttpRequest();
      xhr.open("DELETE", deleteURL);
      xhr.send(null);
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
          document.getElementById(deleteId).remove();
          spinner.classList.add("d-none");
          swal.fire({
            title: "User delete successfully.",
            icon: "success",
            timer: 2000,
          });
        }
      };
    }
  });
}

userForm.addEventListener("submit", onSubmitHandalar);
updateBtn.addEventListener("click", onUpdateHandalar);
