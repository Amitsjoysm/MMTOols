import{s as a}from"./api.CZvKPiQ1.js";import{r as c}from"./auth.DepAfbYU.js";c();let r=[],n=null;async function m(){await i(),u()}async function i(){const t=document.getElementById("loading"),e=document.getElementById("categories-grid"),d=document.getElementById("empty-state");t.classList.remove("hidden"),e.classList.add("hidden"),d.classList.add("hidden");try{r=await a.categories.getAll(),r.length===0?d.classList.remove("hidden"):(g(),e.classList.remove("hidden")),t.classList.add("hidden")}catch(o){console.error("Error loading categories:",o),t.classList.add("hidden")}}function g(){const t=document.getElementById("categories-grid");t.innerHTML=r.map(e=>`
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow" data-testid="category-card-${e.id}">
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">${e.name}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">${e.description||"No description"}</p>
            <div class="text-xs text-gray-500 dark:text-gray-500">
              <span class="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Slug: ${e.slug}</span>
            </div>
          </div>
        </div>
        
        ${e.seo_title||e.seo_description?`
          <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div class="text-xs text-gray-500 dark:text-gray-500">
              <div class="flex items-center space-x-2 mb-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>SEO Optimized</span>
              </div>
            </div>
          </div>
        `:""}
        
        <div class="mt-4 flex items-center justify-end space-x-2">
          <button onclick="window.editCategory('${e.id}')" class="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" data-testid="edit-category-${e.id}">
            Edit
          </button>
          <button onclick="window.deleteCategory('${e.id}', '${e.name.replace(/'/g,"\\'")}')
class="px-3 py-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" data-testid="delete-category-${e.id}">
            Delete
          </button>
        </div>
      </div>
    `).join("")}function u(){document.getElementById("create-category-btn").addEventListener("click",()=>l()),document.getElementById("close-modal").addEventListener("click",s),document.getElementById("cancel-btn").addEventListener("click",s),document.getElementById("category-form").addEventListener("submit",y)}function l(t){const e=document.getElementById("category-modal"),d=document.getElementById("modal-title");document.getElementById("category-form").reset(),n=t?.id||null,d.textContent=t?"Edit Category":"Add New Category",t&&(document.getElementById("category-id").value=t.id,document.getElementById("category-name").value=t.name,document.getElementById("category-description").value=t.description||"",document.getElementById("category-seo-title").value=t.seo_title||"",document.getElementById("category-seo-description").value=t.seo_description||"",document.getElementById("category-seo-keywords").value=t.seo_keywords||""),e.classList.remove("hidden")}function s(){document.getElementById("category-modal").classList.add("hidden"),n=null}async function y(t){t.preventDefault();const e=t.target.querySelector('button[type="submit"]'),d=e.textContent;e.disabled=!0,e.textContent="Saving...";try{const o={name:document.getElementById("category-name").value,description:document.getElementById("category-description").value,seo_title:document.getElementById("category-seo-title").value,seo_description:document.getElementById("category-seo-description").value,seo_keywords:document.getElementById("category-seo-keywords").value};n?await a.categories.update(n,o):await a.categories.create(o),s(),i(),alert(n?"Category updated successfully!":"Category created successfully!")}catch(o){console.error("Error saving category:",o),alert("Failed to save category: "+(o.message||"Unknown error"))}finally{e.disabled=!1,e.textContent=d}}window.editCategory=function(t){const e=r.find(d=>d.id===t);e&&l(e)};window.deleteCategory=async function(t,e){if(confirm(`Are you sure you want to delete "${e}"? This action cannot be undone.`))try{await a.categories.delete(t),alert("Category deleted successfully!"),i()}catch(d){console.error("Error deleting category:",d),alert("Failed to delete category: "+(d.message||"Unknown error"))}};m();
