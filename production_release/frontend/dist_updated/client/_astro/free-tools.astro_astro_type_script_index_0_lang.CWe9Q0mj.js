import{s as d}from"./api.9IHSeoxB.js";let r=null;async function n(o=""){const t=document.getElementById("loading"),e=document.getElementById("tools-content"),l=document.getElementById("error"),s=document.getElementById("no-tools"),i=document.getElementById("tools-grid");try{t.classList.remove("hidden"),e.classList.add("hidden"),l.classList.add("hidden");const a={limit:200};o&&(a.search=o);const c=(await d.freeTools.getAll(a)).tools||[];t.classList.add("hidden"),e.classList.remove("hidden"),c.length===0?(s.classList.remove("hidden"),i.classList.add("hidden")):(s.classList.add("hidden"),i.classList.remove("hidden"),m(c))}catch(a){console.error("Error loading tools:",a),t.classList.add("hidden"),l.classList.remove("hidden")}}function m(o){const t=document.getElementById("tools-grid");t.innerHTML=o.map(e=>`
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6" data-testid="free-tool-card">
        <div class="flex items-start justify-between mb-3">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">${e.name}</h3>
          <span class="px-2 py-1 text-xs font-semibold rounded-full ${e.is_active?"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":"bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}">
            ${e.is_active?"Active":"Inactive"}
          </span>
        </div>
        
        ${e.description?`
          <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">${e.description}</p>
        `:""}
        
        <div class="mb-4">
          <a href="${e.link}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline text-sm break-all">
            ${e.link}
          </a>
        </div>
        
        <div class="flex gap-2">
          <button
            onclick="editTool('${e.id}')"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            data-testid="edit-tool-btn"
          >
            Edit
          </button>
          <button
            onclick="toggleToolStatus('${e.id}', ${!e.is_active})"
            class="flex-1 px-4 py-2 ${e.is_active?"bg-yellow-600 hover:bg-yellow-700":"bg-green-600 hover:bg-green-700"} text-white rounded-lg transition-colors text-sm"
            data-testid="toggle-status-btn"
          >
            ${e.is_active?"Deactivate":"Activate"}
          </button>
          <button
            onclick="deleteTool('${e.id}')"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            data-testid="delete-tool-btn"
          >
            Delete
          </button>
        </div>
      </div>
    `).join("")}document.getElementById("add-tool-btn")?.addEventListener("click",()=>{r=null,document.getElementById("modal-title").textContent="Add Free Tool",document.getElementById("tool-form").reset(),document.getElementById("tool-modal").classList.remove("hidden")});document.getElementById("close-modal")?.addEventListener("click",()=>{document.getElementById("tool-modal").classList.add("hidden")});document.getElementById("cancel-btn")?.addEventListener("click",()=>{document.getElementById("tool-modal").classList.add("hidden")});document.getElementById("tool-form")?.addEventListener("submit",async o=>{o.preventDefault();const t=document.getElementById("tool-name").value,e=document.getElementById("tool-link").value,l=document.getElementById("tool-description").value;try{r?await d.freeTools.update(r,{name:t,link:e,description:l}):await d.freeTools.create({name:t,link:e,description:l}),document.getElementById("tool-modal").classList.add("hidden"),n(document.getElementById("search-input").value)}catch(s){console.error("Error saving tool:",s),alert("Failed to save tool. Please try again.")}});window.editTool=async o=>{try{const t=await d.freeTools.get(o);r=o,document.getElementById("modal-title").textContent="Edit Free Tool",document.getElementById("tool-name").value=t.name,document.getElementById("tool-link").value=t.link,document.getElementById("tool-description").value=t.description||"",document.getElementById("tool-modal").classList.remove("hidden")}catch(t){console.error("Error loading tool:",t),alert("Failed to load tool details.")}};window.toggleToolStatus=async(o,t)=>{try{await d.freeTools.update(o,{is_active:t}),n(document.getElementById("search-input").value)}catch(e){console.error("Error updating tool status:",e),alert("Failed to update tool status.")}};window.deleteTool=async o=>{if(confirm("Are you sure you want to delete this tool?"))try{await d.freeTools.delete(o),n(document.getElementById("search-input").value)}catch(t){console.error("Error deleting tool:",t),alert("Failed to delete tool.")}};document.getElementById("search-btn")?.addEventListener("click",()=>{n(document.getElementById("search-input").value)});document.getElementById("search-input")?.addEventListener("keypress",o=>{o.key==="Enter"&&n(document.getElementById("search-input").value)});n();
