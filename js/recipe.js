const recipeGrid = document.getElementById('recipeGrid');
        const searchInput = document.getElementById('searchInput');
        const loader = document.getElementById('loader');

        // Initial Load
        window.addEventListener('DOMContentLoaded', () => {
            fetchRecipes('');
        });

        // Search Functionality
        async function searchRecipes() {
            const query = searchInput.value.trim();
            if (query) {
                fetchRecipes(query);
            }
        }

        // Allow "Enter" key to search
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchRecipes();
        });

        async function fetchRecipes(term) {
            recipeGrid.innerHTML = '';
            loader.classList.remove('hidden');

            try {
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
                const data = await response.json();
                
                loader.classList.add('hidden');
                
                if (data.meals) {
                    displayRecipes(data.meals);
                } else {
                    recipeGrid.innerHTML = '<p class="col-span-full text-center text-gray-500">No recipes found. Try another search!</p>';
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                loader.classList.add('hidden');
            }
        }

        function displayRecipes(meals) {
            meals.forEach(meal => {
                // Limit instructions length for the card
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
                        <button onclick="viewDetails('${meal.idMeal}')" class="w-full bg-yellow-500 text-white py-2 rounded font-semibold hover:bg-yellow-600 transition duration-300">
                            VIEW DETAILS
                        </button>
                    </div>
                `;
                recipeGrid.appendChild(card);
            });
        }

        async function viewDetails(id) {
            // Using the lookup API as you requested
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
            const data = await response.json();
            const meal = data.meals[0];
            alert(`Recipe: ${meal.strMeal}\nCategory: ${meal.strCategory}\nOrigin: ${meal.strArea}`);
        }