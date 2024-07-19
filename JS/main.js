let displayData = document.getElementById("displayData");
let Search = document.getElementById("Search");

$(document).ready(() => {
    searchByName("").then(() => {
        $(".LoadingScreen").fadeOut(500);
        $("body").css("overflow", "visible");
    });
});

function openSideNav() {
    $(".SideBar").animate({
        left: 0
    }, 500);

    $(".IconUseing").removeClass("bi bi-justify");
    $(".IconUseing").addClass("bi bi-x");

    for (let i = 0; i < 5; i++) {
        $(".links li").eq(i).animate({
            top: 0
        }, (i + 5) * 100);
    }
}

function closeSideNav() {
    let boxWidth = $(".SideBar .Tabs").outerWidth();
    $(".SideBar").animate({
        left: -boxWidth
    }, 500);

    $(".IconUseing").addClass("bi bi-justify");
    $(".IconUseing").removeClass("bi bi-x");

    $(".links li").animate({
        top: 300
    }, 500);
}

closeSideNav();
$(".SideBar i.IconUseing").click(() => {
    if ($(".SideBar").css("left") == "0px") {
        closeSideNav();
    } else {
        openSideNav();
    }
});

async function fetchData(url) {
    let response = await fetch(url);
    return await response.json();
}

function updateDisplay(content = "") {
    document.querySelector("#displayData").innerHTML = content;
    $(".LoadingScreen2").fadeOut(300);
}

function createBox(items, createItemContent) {
    return items.map(createItemContent).join("");
}

function createMealItemContent(meal) {
    return `
    <div class="col-md-3">
        <div onclick="getCategoryMeals('${meal.strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
            <img class="w-100" src="${meal.strCategoryThumb}" alt="">
            <div class="meal-layer position-absolute text-center text-black p-2">
                <h3>${meal.strCategory}</h3>
                <p>${meal.strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
            </div>
        </div>
    </div>`;
}

async function getCategories() {
    updateDisplay();
    $(".LoadingScreen2").fadeIn(300);
    let data = await fetchData('https://www.themealdb.com/api/json/v1/1/categories.php');
    updateDisplay(createBox(data.categories, createMealItemContent));
}

async function getArea() {
    updateDisplay();
    $(".LoadingScreen2").fadeIn(300);
    let data = await fetchData('https://www.themealdb.com/api/json/v1/1/list.php?a=list');

    updateDisplay(createBox(data.meals, area => `
        <div class="col-md-3">
            <div onclick="getAreaMeals('${area.strArea}')" class="meal position-relative overflow-hidden text-center rounded-2 cursor-pointer">
                <i class="bi bi-house-door-fill fs-1"></i> 
                <h3>${area.strArea}</h3>
            </div>
        </div>
    `));
}

async function getIngredients() {
    updateDisplay();
    $(".LoadingScreen2").fadeIn(300);
    let data = await fetchData('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
    updateDisplay(createBox(data.meals.slice(0, 20), ingredient => `
            <div class="col-md-3">
                <div onclick="getIngredientsMeals('${ingredient.strIngredient}')" class="meal position-relative text-center overflow-hidden rounded-2 cursor-pointer">
                    <i class="bi bi-egg-fill fs-1"></i>
                    <h3>${ingredient.strIngredient}</h3>
                    <p>${ingredient.strDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
            </div>
        `));
}

async function getMeals(url, callback) {
    updateDisplay();
    $(".LoadingScreen2").fadeIn(300);
    let data = await fetchData(url);
    updateDisplay(createBox(data.meals.slice(0, 20), callback));
}

async function getCategoryMeals(category) {
    await getMeals(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`, meal => `
        <div class="col-md-3">
            <div onclick="getMealDetails('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${meal.strMealThumb}" alt="">
                <div class="meal-layer position-absolute text-center text-black p-2">
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>
        </div>
    `);
}

async function getAreaMeals(area) {
    await getMeals(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`, meal => `
        <div class="col-md-3">
            <div onclick="getMealDetails('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${meal.strMealThumb}" alt="">
                <div class="meal-layer position-absolute text-center text-black p-2">
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>
        </div>
    `);
}

async function getIngredientsMeals(ingredient) {
    await getMeals(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`, meal => `
        <div class="col-md-3">
            <div onclick="getMealDetails('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${meal.strMealThumb}" alt="">
                <div class="meal-layer position-absolute text-center text-black p-2">
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>
        </div>
    `);
}

async function getMealDetails(mealID) {
    updateDisplay();
    $(".LoadingScreen2").fadeIn(300);
    let data = await fetchData(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    let meal = data.meals[0];
    let ingredients = Array.from({ length: 20 }, (_, i) => meal[`strIngredient${i + 1}`] && `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i + 1}`]} ${meal[`strIngredient${i + 1}`]}</li>`).filter(Boolean).join("");
    let tags = (meal.strTags?.split(",") || []).map(tag => `<li class="alert alert-danger m-2 p-1">${tag}</li>`).join("");

    updateDisplay(`
        <div class="col-md-4">
            <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="">
            <h2>${meal.strMeal}</h2>
        </div>
        <div class="col-md-8">
            <h2>Instructions</h2>
            <p>${meal.strInstructions}</p>
            <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
            <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
            <h3>Recipes :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
                ${ingredients}
            </ul>
            <h3>Tags :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
                ${tags}
            </ul>
            <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
            <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
        </div>`);
}

function showSearchInputs() {
    document.querySelector("#Search").innerHTML = `
        <div class="row py-4">
            <div class="col-md-6">
                <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
            </div>
            <div class="col-md-6">
                <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
            </div>
        </div>`;
    updateDisplay();
}

async function searchMeals(url) {
    updateDisplay();
    $(".LoadingScreen2").fadeIn(300);
    let data = await fetchData(url);
    updateDisplay(createBox(data.meals || [], meal => `
        <div class="col-md-3">
            <div onclick="getMealDetails('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${meal.strMealThumb}" alt="">
                <div class="meal-layer position-absolute text-center text-black p-2">
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>
        </div>
    `));
}

async function searchByName(term) {
    await searchMeals(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
}

async function searchByFLetter(term) {
    await searchMeals(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term || 'a'}`);
}



function showContacts() {
    let rowData = document.getElementById('rowData');
    rowData.innerHTML = `
    <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
        <div class="container w-75 text-center">
            <div class="row g-4">
                <div class="col-md-6">
                    <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                    <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Special characters and numbers not allowed
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                    <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Email not valid *example@yyy.zzz
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                    <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid Phone Number
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                    <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid age
                    </div>
                </div>
                <div class="col-md-6">
                    <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                    <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid password *Minimum eight characters, at least one letter and one number:*
                    </div>
                </div>
                <div class="col-md-6">
                    <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                    <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid repassword 
                    </div>
                </div>
            </div>
            <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
        </div>
    </div>`;

    // Adding focus event listeners
    ['name', 'email', 'phone', 'age', 'password', 'repassword'].forEach(field => {
        document.getElementById(`${field}Input`).addEventListener('focus', () => {
            eval(`${field}InputTouched = true`);
        });
    });
}
function inputsValidation() {
    validateField('name', 'nameAlert', nameValidation);
    validateField('email', 'emailAlert', emailValidation);
    validateField('phone', 'phoneAlert', phoneValidation);
    validateField('age', 'ageAlert', ageValidation);
    validateField('password', 'passwordAlert', passwordValidation);
    validateField('repassword', 'repasswordAlert', repasswordValidation);

    submitBtn.disabled = !(nameValidation() && emailValidation() && phoneValidation() &&
        ageValidation() && passwordValidation() && repasswordValidation());
}

function validateField(fieldName, alertId, validationFunction) {
    if (eval(`${fieldName}InputTouched`)) {
        let alertElement = document.getElementById(alertId);
        if (validationFunction()) {
            alertElement.classList.replace('d-block', 'd-none');
        } else {
            alertElement.classList.replace('d-none', 'd-block');
        }
    }
}

function showContacts() {
    let displayData = document.getElementById('displayData');
    displayData.innerHTML = `
    <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
        <div class="container w-75 text-center">
            <div class="row g-4">
                <div class="col-md-6">
                    <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                    <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Special characters and numbers not allowed
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                    <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Email not valid *example@yyy.zzz
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                    <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid Phone Number
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                    <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid age
                    </div>
                </div>
                <div class="col-md-6">
                    <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                    <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid password *Minimum eight characters, at least one letter and one number:*
                    </div>
                </div>
                <div class="col-md-6">
                    <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                    <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid repassword 
                    </div>
                </div>
            </div>
            <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
        </div>
    </div>`;

    ['name', 'email', 'phone', 'age', 'password', 'repassword'].forEach(field => {
        document.getElementById(`${field}Input`).addEventListener('focus', () => {
            eval(`${field}InputTouched = true`);
        });
    });
}

function inputsValidation() {
    validateField('name', 'nameAlert', nameValidation);
    validateField('email', 'emailAlert', emailValidation);
    validateField('phone', 'phoneAlert', phoneValidation);
    validateField('age', 'ageAlert', ageValidation);
    validateField('password', 'passwordAlert', passwordValidation);
    validateField('repassword', 'repasswordAlert', repasswordValidation);

    submitBtn.disabled = !(nameValidation() && emailValidation() && phoneValidation() &&
        ageValidation() && passwordValidation() && repasswordValidation());
}

function validateField(fieldName, alertId, validationFunction) {
    if (eval(`${fieldName}InputTouched`)) {
        let alertElement = document.getElementById(alertId);
        if (validationFunction()) {
            alertElement.classList.replace('d-block', 'd-none');
        } else {
            alertElement.classList.replace('d-none', 'd-block');
        }
    }
}

function nameValidation() {
    return /^[a-zA-Z ]+$/.test(document.getElementById('nameInput').value);
}
function emailValidation() {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById('emailInput').value);
}
function phoneValidation() {
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById('phoneInput').value);
}
function ageValidation() {
    return /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById('ageInput').value);
}
function passwordValidation() {
    return /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById('passwordInput').value);
}
function repasswordValidation() {
    return document.getElementById('repasswordInput').value === document.getElementById('passwordInput').value;
}