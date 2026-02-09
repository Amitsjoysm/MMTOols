import{s as u,c as f}from"./api.CZvKPiQ1.js";import{r as x}from"./auth.DepAfbYU.js";x();let l=0;const m=20;let g=[],i=null;async function I(){await B(),await r(),b()}async function B(){try{g=await f.getAll();const e=document.getElementById("category-filter");g.forEach(d=>{const t=document.createElement("option");t.value=d.slug,t.textContent=d.name,e.appendChild(t)});const n=document.getElementById("tool-categories");g.forEach(d=>{const t=document.createElement("option");t.value=d.id,t.textContent=d.name,n.appendChild(t)})}catch(e){console.error("Error loading categories:",e)}}async function r(){const e=document.getElementById("loading"),n=document.getElementById("tools-table-container"),d=document.getElementById("tools-tbody");e.classList.remove("hidden"),n.classList.add("hidden");try{const t=document.getElementById("search-input").value,s=document.getElementById("category-filter").value,a=document.getElementById("status-filter").value,c={skip:l,limit:m};t&&(c.search=t),s&&(c.category=s),a&&(c.status=a);const p=await u.tools.getAll(c);d.innerHTML=p.map(o=>`
        <tr data-testid="tool-row-${o.id}">
          <td class="px-6 py-4">
            <div class="flex items-center space-x-3">
              ${o.logo_url?`<img src="${o.logo_url}" alt="${o.name}" class="h-10 w-10 object-contain rounded" />`:""}
              <div>
                <div class="font-medium text-gray-900 dark:text-white">${o.name}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">${o.slug}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="flex flex-wrap gap-1">
              ${o.categories?.slice(0,2).map(E=>`
                <span class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">${E.name}</span>
              `).join("")||'<span class="text-gray-500">-</span>'}
            </div>
          </td>
          <td class="px-6 py-4">
            <span class="px-3 py-1 rounded-full text-xs font-medium ${o.pricing_type==="free"?"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":o.pricing_type==="freemium"?"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200":"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"}">
              ${o.pricing_type}
            </span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
            <div>${o.view_count} views</div>
            <div>${o.review_count} reviews</div>
          </td>
          <td class="px-6 py-4">
            <span class="px-3 py-1 rounded-full text-xs font-medium ${o.is_active?"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":"bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}">
              ${o.is_active?"Active":"Inactive"}
            </span>
          </td>
          <td class="px-6 py-4 text-right space-x-2">
            <button onclick="window.editTool('${o.id}')" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" data-testid="edit-tool-${o.id}">
              Edit
            </button>
            <button onclick="window.deleteTool('${o.id}', '${o.name}')" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" data-testid="delete-tool-${o.id}">
              Delete
            </button>
          </td>
        </tr>
      `).join(""),e.classList.add("hidden"),n.classList.remove("hidden"),document.getElementById("pagination").classList.remove("hidden"),h(p.length)}catch(t){console.error("Error loading tools:",t),e.classList.add("hidden")}}function h(e){const n=document.getElementById("page-info"),d=l+1,t=l+e;n.textContent=`${d}-${t}`;const s=document.getElementById("prev-btn"),a=document.getElementById("next-btn");s.disabled=l===0,a.disabled=e<m}function b(){let e;document.getElementById("search-input").addEventListener("input",()=>{clearTimeout(e),e=setTimeout(()=>{l=0,r()},500)}),document.getElementById("category-filter").addEventListener("change",()=>{l=0,r()}),document.getElementById("status-filter").addEventListener("change",()=>{l=0,r()}),document.getElementById("reset-filters-btn").addEventListener("click",()=>{document.getElementById("search-input").value="",document.getElementById("category-filter").value="",document.getElementById("status-filter").value="",l=0,r()}),document.getElementById("prev-btn").addEventListener("click",()=>{l>0&&(l-=m,r())}),document.getElementById("next-btn").addEventListener("click",()=>{l+=m,r()}),document.getElementById("create-tool-btn").addEventListener("click",()=>{v()}),document.getElementById("close-modal").addEventListener("click",y),document.getElementById("cancel-btn").addEventListener("click",y),document.getElementById("tool-form").addEventListener("submit",k)}function v(e){const n=document.getElementById("tool-modal"),d=document.getElementById("modal-title");if(document.getElementById("tool-form").reset(),i=e?.id||null,d.textContent=e?"Edit Tool":"Add New Tool",e){document.getElementById("tool-id").value=e.id,document.getElementById("tool-name").value=e.name,document.getElementById("tool-url").value=e.url||"",document.getElementById("tool-pricing").value=e.pricing_type,document.getElementById("tool-short-desc").value=e.short_description||"",document.getElementById("tool-description").value=e.description,document.getElementById("tool-logo").value=e.logo_url||"",document.getElementById("tool-screenshot").value=e.screenshot_url||"",document.getElementById("tool-active").checked=e.is_active,document.getElementById("tool-featured").checked=e.is_featured;const s=document.getElementById("tool-categories");Array.from(s.options).forEach(a=>{a.selected=e.categories?.some(c=>c.id===a.value)})}n.classList.remove("hidden")}function y(){document.getElementById("tool-modal").classList.add("hidden"),i=null}async function k(e){e.preventDefault();const n=e.target.querySelector('button[type="submit"]'),d=n.textContent;n.disabled=!0,n.textContent="Saving...";try{const t=document.getElementById("tool-categories"),s=Array.from(t.selectedOptions).map(c=>c.value),a={name:document.getElementById("tool-name").value,url:document.getElementById("tool-url").value,pricing_type:document.getElementById("tool-pricing").value,short_description:document.getElementById("tool-short-desc").value,description:document.getElementById("tool-description").value,logo_url:document.getElementById("tool-logo").value,screenshot_url:document.getElementById("tool-screenshot").value,is_active:document.getElementById("tool-active").checked,is_featured:document.getElementById("tool-featured").checked,category_ids:s,features:[],pros:[],cons:[]};i?await u.tools.update(i,a):await u.tools.create(a),y(),r(),alert(i?"Tool updated successfully!":"Tool created successfully!")}catch(t){console.error("Error saving tool:",t),alert("Failed to save tool: "+(t.message||"Unknown error"))}finally{n.disabled=!1,n.textContent=d}}window.editTool=async function(e){try{const n=await u.tools.getAll({skip:0,limit:1e3}).then(d=>d.find(t=>t.id===e));n&&v(n)}catch(n){console.error("Error loading tool:",n)}};window.deleteTool=async function(e,n){if(confirm(`Are you sure you want to delete "${n}"? This action cannot be undone.`))try{await u.tools.delete(e),alert("Tool deleted successfully!"),r()}catch(d){console.error("Error deleting tool:",d),alert("Failed to delete tool: "+(d.message||"Unknown error"))}};I();
