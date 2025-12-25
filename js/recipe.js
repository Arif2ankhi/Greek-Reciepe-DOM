const recipeGrid = document.getElementById('recipeGrid');
const searchInput = document.getElementById('searchInput');
const loader = document.getElementById('loader');
const recipeModal = document.getElementById('recipeModal');
const modalContent = document.getElementById('modalContent');

let hasResults = true; // Track if current view has results

window.addEventListener('DOMContentLoaded', () => {
    fetchRecipes('');
});

// Requirement: Search icon click behavior
function handleSearchClick() {
    if (!hasResults || searchInput.value.trim() === "") {
        location.reload(); // Go to home page
    } else {
        searchRecipes();
    }
}

async function searchRecipes() {
    const query = searchInput.value.trim();
    fetchRecipes(query);
}

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchRecipes();
});

async function fetchRecipes(term) {
    recipeGrid.innerHTML = '';
    showLoader(true);

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
        const data = await response.json();
        
        showLoader(false);
        
        if (data.meals) {
            hasResults = true;
            displayRecipes(data.meals);
        } else {
            hasResults = false;
            recipeGrid.innerHTML = `
                <div class="col-span-full text-center py-10">
                    <p class="text-xl text-gray-500 mb-4">No recipes found for "${term}".</p>
                    <button onclick="location.reload()" class="bg-yellow-500 text-white px-6 py-2 rounded">Back to Home</button>
                </div>`;
        }
    } catch (error) {
        console.error("Error:", error);
        showLoader(false);
    }
}

function displayRecipes(meals) {
    meals.forEach(meal => {
        const description = meal.strInstructions.substring(0, 100) + '...';
        const card = document.createElement('div');
        card.className = "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col";
        
        card.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full h-48 object-cover">
            <div class="p-5 flex-grow">
                <h3 class="font-bold text-xl mb-2 text-gray-800">${meal.strMeal}</h3>
                <p class="text-gray-600 text-sm mb-4">${description}</p>
            </div>
            <div class="p-5 pt-0">
                <button onclick="viewDetails('${meal.idMeal}')" class="w-full bg-yellow-500 text-white py-2 rounded font-semibold hover:bg-yellow-600 transition">
                    VIEW DETAILS
                </button>
            </div>
        `;
        recipeGrid.appendChild(card);
    });
}

// Requirement:  loader and open modal with details
async function viewDetails(id) {
    showLoader(true);
    
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();
        const meal = data.meals[0];

        modalContent.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full h-72 object-cover">
            <div class="p-8">
                <h2 class="text-3xl font-bold text-gray-800 mb-2">${meal.strMeal}</h2>
                <div class="flex gap-2 mb-4">
                    <span class="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">${meal.strCategory}</span>
                    <span class="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">${meal.strArea}</span>
                </div>
                <h3 class="text-xl font-semibold mb-2 border-b pb-2 text-yellow-600">Instructions</h3>
                <p class="text-gray-700 leading-relaxed whitespace-pre-line">${meal.strInstructions}</p>
            </div>
        `;

        showLoader(false);
        recipeModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; 
    } catch (error) {
        showLoader(false);
        alert("Could not load recipe details.");
    }
}

function closeModal() {
    recipeModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function showLoader(status) {
    if (status) loader.classList.remove('hidden');
    else loader.classList.add('hidden');
}