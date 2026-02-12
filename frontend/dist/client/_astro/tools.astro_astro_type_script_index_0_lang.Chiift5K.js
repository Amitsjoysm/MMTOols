import{s as p,c as k}from"./api.LtktkIWz.js";import{r as w}from"./auth.DepAfbYU.js";w();let c=0;const v=20;let E=[],x=[],g=null;async function $(){await L(),await _(),await m(),C()}async function L(){try{E=await k.getAll();const e=document.getElementById("category-filter");E.forEach(d=>{const t=document.createElement("option");t.value=d.slug,t.textContent=d.name,e.appendChild(t)});const o=document.getElementById("tool-categories");E.forEach(d=>{const t=document.createElement("option");t.value=d.id,t.textContent=d.name,o.appendChild(t)})}catch(e){console.error("Error loading categories:",e)}}async function _(){try{const e=await fetch(f()+"/api/superadmin/admins",{headers:{Authorization:`Bearer ${localStorage.getItem("auth_token")}`}});if(e.ok){x=await e.json();const o=document.getElementById("tool-assigned-admin");for(;o.options.length>1;)o.remove(1);x.forEach(d=>{const t=document.createElement("option");t.value=d.id,t.textContent=`${d.full_name||d.username} (${d.role})`,o.appendChild(t)})}}catch(e){console.error("Error loading admins:",e)}}async function m(){const e=document.getElementById("loading"),o=document.getElementById("tools-table-container"),d=document.getElementById("tools-tbody");e.classList.remove("hidden"),o.classList.add("hidden");try{const t=document.getElementById("search-input").value,r=document.getElementById("category-filter").value,s=document.getElementById("status-filter").value,a={skip:c,limit:v};t&&(a.search=t),r&&(a.category=r),s&&(a.status=s);const l=await p.tools.getAll(a);d.innerHTML=l.map(n=>`
        <tr data-testid="tool-row-${n.id}">
          <td class="px-6 py-4">
            <div class="flex items-center space-x-3">
              ${n.logo_url?`<img src="${n.logo_url}" alt="${n.name}" class="h-10 w-10 object-contain rounded" />`:""}
              <div>
                <div class="font-medium text-gray-900 dark:text-white">${n.name}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">${n.slug}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="flex flex-wrap gap-1">
              ${n.categories?.slice(0,2).map(i=>`
                <span class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">${i.name}</span>
              `).join("")||'<span class="text-gray-500">-</span>'}
            </div>
          </td>
          <td class="px-6 py-4">
            <span class="px-3 py-1 rounded-full text-xs font-medium ${n.pricing_type==="free"?"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":n.pricing_type==="freemium"?"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200":"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"}">
              ${n.pricing_type}
            </span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
            <div>${n.view_count} views</div>
            <div>${n.review_count} reviews</div>
          </td>
          <td class="px-6 py-4">
            <span class="px-3 py-1 rounded-full text-xs font-medium ${n.is_active?"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":"bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}">
              ${n.is_active?"Active":"Inactive"}
            </span>
          </td>
          <td class="px-6 py-4 text-right space-x-2">
            <button onclick="window.editTool('${n.id}')" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" data-testid="edit-tool-${n.id}">
              Edit
            </button>
            <button onclick="window.deleteTool('${n.id}', '${n.name}')" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" data-testid="delete-tool-${n.id}">
              Delete
            </button>
          </td>
        </tr>
      `).join(""),e.classList.add("hidden"),o.classList.remove("hidden"),document.getElementById("pagination").classList.remove("hidden"),T(l.length)}catch(t){console.error("Error loading tools:",t),e.classList.add("hidden")}}function T(e){const o=document.getElementById("page-info"),d=c+1,t=c+e;o.textContent=`${d}-${t}`;const r=document.getElementById("prev-btn"),s=document.getElementById("next-btn");r.disabled=c===0,s.disabled=e<v}function C(){let e;document.getElementById("search-input").addEventListener("input",()=>{clearTimeout(e),e=setTimeout(()=>{c=0,m()},500)}),document.getElementById("category-filter").addEventListener("change",()=>{c=0,m()}),document.getElementById("status-filter").addEventListener("change",()=>{c=0,m()}),document.getElementById("reset-filters-btn").addEventListener("click",()=>{document.getElementById("search-input").value="",document.getElementById("category-filter").value="",document.getElementById("status-filter").value="",c=0,m()}),document.getElementById("prev-btn").addEventListener("click",()=>{c>0&&(c-=v,m())}),document.getElementById("next-btn").addEventListener("click",()=>{c+=v,m()}),document.getElementById("create-tool-btn").addEventListener("click",()=>{I()}),document.getElementById("close-modal").addEventListener("click",b),document.getElementById("cancel-btn").addEventListener("click",b),document.getElementById("tool-form").addEventListener("submit",A),document.getElementById("bulk-upload-btn").addEventListener("click",()=>{S()}),document.getElementById("close-bulk-modal").addEventListener("click",B),document.getElementById("cancel-bulk-btn").addEventListener("click",B),document.getElementById("download-template-btn").addEventListener("click",U),document.getElementById("bulk-upload-form").addEventListener("submit",j)}function I(e){const o=document.getElementById("tool-modal"),d=document.getElementById("modal-title");if(document.getElementById("tool-form").reset(),g=e?.id||null,d.textContent=e?"Edit Tool":"Add New Tool",e){document.getElementById("tool-id").value=e.id,document.getElementById("tool-name").value=e.name,document.getElementById("tool-url").value=e.url||"",document.getElementById("tool-pricing").value=e.pricing_type,document.getElementById("tool-short-desc").value=e.short_description||"",document.getElementById("tool-description").value=e.description,document.getElementById("tool-logo").value=e.logo_url||"",document.getElementById("tool-screenshot").value=e.screenshot_url||"",document.getElementById("tool-active").checked=e.is_active,document.getElementById("tool-featured").checked=e.is_featured;const r=document.getElementById("tool-assigned-admin");r.value=e.assigned_admin_id||"";const s=document.getElementById("tool-categories");Array.from(s.options).forEach(a=>{a.selected=e.categories?.some(l=>l.id===a.value)})}o.classList.remove("hidden")}function b(){document.getElementById("tool-modal").classList.add("hidden"),g=null}async function A(e){e.preventDefault();const o=e.target.querySelector('button[type="submit"]'),d=o.textContent;o.disabled=!0,o.textContent="Saving...";try{const t=document.getElementById("tool-categories"),r=Array.from(t.selectedOptions).map(n=>n.value),a=document.getElementById("tool-assigned-admin").value||null,l={name:document.getElementById("tool-name").value,url:document.getElementById("tool-url").value,pricing_type:document.getElementById("tool-pricing").value,short_description:document.getElementById("tool-short-desc").value,description:document.getElementById("tool-description").value,logo_url:document.getElementById("tool-logo").value,screenshot_url:document.getElementById("tool-screenshot").value,is_active:document.getElementById("tool-active").checked,is_featured:document.getElementById("tool-featured").checked,category_ids:r,features:[],pros:[],cons:[]};if(g){if(await p.tools.update(g,l),a!==null){const n=localStorage.getItem("auth_token");await fetch(`${f()}/api/superadmin/tools/${g}/assign-admin`,{method:"PUT",headers:{Authorization:`Bearer ${n}`,"Content-Type":"application/json"},body:JSON.stringify({admin_id:a||null})})}}else{const n=await p.tools.create(l);if(n.tool_id&&a){const i=localStorage.getItem("auth_token");await fetch(`${f()}/api/superadmin/tools/${n.tool_id}/assign-admin`,{method:"PUT",headers:{Authorization:`Bearer ${i}`,"Content-Type":"application/json"},body:JSON.stringify({admin_id:a})})}}b(),m(),alert(g?"Tool updated successfully!":"Tool created successfully!")}catch(t){console.error("Error saving tool:",t),alert("Failed to save tool: "+(t.message||"Unknown error"))}finally{o.disabled=!1,o.textContent=d}}window.editTool=async function(e){try{const o=await p.tools.getAll({skip:0,limit:1e3}).then(d=>d.find(t=>t.id===e));o&&I(o)}catch(o){console.error("Error loading tool:",o)}};function S(){const e=document.getElementById("bulk-upload-modal");document.getElementById("bulk-upload-form").reset(),document.getElementById("upload-progress").classList.add("hidden"),document.getElementById("upload-results").classList.add("hidden"),e.classList.remove("hidden")}function B(){document.getElementById("bulk-upload-modal").classList.add("hidden")}async function U(){try{const e=await p.tools.getAll({skip:0,limit:1}),o=localStorage.getItem("auth_token"),d=await fetch(`${f()}/api/superadmin/tools/csv-template`,{headers:{Authorization:`Bearer ${o}`}});if(!d.ok)throw new Error("Failed to download template");const t=await d.json(),r=t.headers.join(","),s=t.template.map(y=>t.headers.map(u=>`"${y[u]||""}"`).join(",")).join(`
`),a=r+`
`+s,l=new Blob([a],{type:"text/csv"}),n=window.URL.createObjectURL(l),i=document.createElement("a");i.href=n,i.download="tools_upload_template.csv",document.body.appendChild(i),i.click(),document.body.removeChild(i),window.URL.revokeObjectURL(n),alert("Template downloaded successfully!")}catch(e){console.error("Error downloading template:",e),alert("Failed to download template: "+(e.message||"Unknown error"))}}function f(){if(typeof window<"u"){const e=window.location.origin;if(e.includes("preview.app.github.dev")||e.includes("github.dev")||e.includes("preview.emergentagent.com"))return e.replace(":3000",":8001").replace("3000-","8001-")}return"http://localhost:8001"}async function j(e){e.preventDefault();const o=document.getElementById("csv-file-input");if(!o.files||o.files.length===0){alert("Please select a CSV file");return}const d=o.files[0],t=document.getElementById("upload-btn"),r=document.getElementById("upload-progress"),s=document.getElementById("progress-bar"),a=document.getElementById("progress-text"),l=document.getElementById("upload-results");t.disabled=!0,t.textContent="Uploading...",r.classList.remove("hidden"),l.classList.add("hidden");try{const n=new FormData;n.append("file",d);const i=localStorage.getItem("auth_token");s.style.width="50%",a.textContent="Uploading file...";const y=await fetch(`${f()}/api/superadmin/tools/bulk-upload`,{method:"POST",headers:{Authorization:`Bearer ${i}`},body:n});if(s.style.width="100%",a.textContent="Processing...",!y.ok){const h=await y.json();throw new Error(h.detail||"Upload failed")}const u=await y.json();l.innerHTML=`
        <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <h4 class="font-semibold text-green-900 dark:text-green-100 mb-2">✅ Upload Successful!</h4>
          <p class="text-sm text-green-800 dark:text-green-200">
            ${u.message}<br>
            Created: ${u.created_tools?.length||0} tools
          </p>
          ${u.errors&&u.errors.length>0?`
            <div class="mt-3 text-xs text-red-800 dark:text-red-200">
              <p class="font-semibold mb-1">Errors:</p>
              <ul class="list-disc list-inside">
                ${u.errors.slice(0,5).map(h=>`<li>${h}</li>`).join("")}
              </ul>
            </div>
          `:""}
        </div>
      `,l.classList.remove("hidden"),setTimeout(()=>{B(),m()},3e3)}catch(n){console.error("Error uploading file:",n),l.innerHTML=`
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h4 class="font-semibold text-red-900 dark:text-red-100 mb-2">❌ Upload Failed</h4>
          <p class="text-sm text-red-800 dark:text-red-200">${n.message||"Unknown error occurred"}</p>
        </div>
      `,l.classList.remove("hidden")}finally{t.disabled=!1,t.textContent="Upload & Import",r.classList.add("hidden")}}window.deleteTool=async function(e,o){if(confirm(`Are you sure you want to delete "${o}"? This action cannot be undone.`))try{await p.tools.delete(e),alert("Tool deleted successfully!"),m()}catch(d){console.error("Error deleting tool:",d),alert("Failed to delete tool: "+(d.message||"Unknown error"))}};$();
