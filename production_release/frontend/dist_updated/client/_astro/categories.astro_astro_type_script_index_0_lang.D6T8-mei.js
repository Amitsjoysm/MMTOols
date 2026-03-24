import{s as i}from"./api.9IHSeoxB.js";import{r as u}from"./auth.-1gIpQ0w.js";u();let a=[],o=null;async function g(){await l(),p()}async function l(){const t=document.getElementById("loading"),n=document.getElementById("categories-grid"),d=document.getElementById("empty-state");t.classList.remove("hidden"),n.classList.add("hidden"),d.classList.add("hidden");try{a=await i.categories.getAll(),a.length===0?d.classList.remove("hidden"):(y(),n.classList.remove("hidden")),t.classList.add("hidden")}catch(e){console.error("Error loading categories:",e),t.classList.add("hidden")}}function y(){const t=document.getElementById("categories-grid"),n=a.filter(e=>!e.parent_id);a.filter(e=>e.parent_id);const d=new Map(n.map(e=>[e.id,e]));t.innerHTML=a.map(e=>{const r=e.parent_id?d.get(e.parent_id)?.name||"Unknown Parent":null;return`
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${e.parent_id?"border-l-4 border-blue-500":""}" data-testid="category-card-${e.id}">
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            ${e.parent_id?`<span class="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded mb-2">Subcategory of: ${r}</span>`:'<span class="inline-block px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded mb-2">Parent Category</span>'}
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
          <button onclick="window.deleteCategory('${e.id}', '${e.name.replace(/'/g,"\\'")}')" class="px-3 py-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" data-testid="delete-category-${e.id}">
            Delete
          </button>
        </div>
      </div>
    `}).join(""),c()}function c(t){const n=document.getElementById("category-parent"),d=a.filter(e=>!e.parent_id&&e.id!==t);n.innerHTML='<option value="">-- No Parent (Main Category) --</option>'+d.map(e=>`<option value="${e.id}">${e.name}</option>`).join("")}function p(){document.getElementById("create-category-btn").addEventListener("click",()=>m()),document.getElementById("close-modal").addEventListener("click",s),document.getElementById("cancel-btn").addEventListener("click",s),document.getElementById("category-form").addEventListener("submit",v)}function m(t){const n=document.getElementById("category-modal"),d=document.getElementById("modal-title");document.getElementById("category-form").reset(),o=t?.id||null,d.textContent=t?"Edit Category":"Add New Category",c(t?.id),t&&(document.getElementById("category-id").value=t.id,document.getElementById("category-name").value=t.name,document.getElementById("category-description").value=t.description||"",document.getElementById("category-parent").value=t.parent_id||"",document.getElementById("category-seo-title").value=t.seo_title||"",document.getElementById("category-seo-description").value=t.seo_description||"",document.getElementById("category-seo-keywords").value=t.seo_keywords||""),n.classList.remove("hidden")}function s(){document.getElementById("category-modal").classList.add("hidden"),o=null}async function v(t){t.preventDefault();const n=t.target.querySelector('button[type="submit"]'),d=n.textContent;n.disabled=!0,n.textContent="Saving...";try{const e=document.getElementById("category-parent").value,r={name:document.getElementById("category-name").value,description:document.getElementById("category-description").value,parent_id:e||null,seo_title:document.getElementById("category-seo-title").value,seo_description:document.getElementById("category-seo-description").value,seo_keywords:document.getElementById("category-seo-keywords").value};o?await i.categories.update(o,r):await i.categories.create(r),s(),await l(),alert(o?"Category updated successfully!":"Category created successfully!")}catch(e){console.error("Error saving category:",e),alert("Failed to save category: "+(e.message||"Unknown error"))}finally{n.disabled=!1,n.textContent=d}}window.editCategory=function(t){const n=a.find(d=>d.id===t);n&&m(n)};window.deleteCategory=async function(t,n){if(confirm(`Are you sure you want to delete "${n}"? This action cannot be undone.`))try{await i.categories.delete(t),alert("Category deleted successfully!"),l()}catch(d){console.error("Error deleting category:",d),alert("Failed to delete category: "+(d.message||"Unknown error"))}};g();
