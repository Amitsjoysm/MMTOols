import{a as o}from"./api.ChDfilu5.js";import{r as g}from"./auth.DepAfbYU.js";g();let s=0;const i=20;async function u(){await n(),m()}async function n(){const a=document.getElementById("loading"),d=document.getElementById("contacts-list");a.classList.remove("hidden"),d.classList.add("hidden");try{const t=document.getElementById("status-filter").value,r={skip:s,limit:i};t&&(r.status_filter=t);const l=await o.getContacts(r);d.innerHTML=l.map(e=>`
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6" data-testid="contact-card-${e.id}">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">${e.name}</h3>
                <span class="px-3 py-1 rounded-full text-xs font-medium ${e.status==="new"?"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200":e.status==="in_progress"?"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200":e.status==="resolved"?"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":"bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"}">
                  ${e.status}
                </span>
                <span class="px-2 py-1 rounded text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  ${e.inquiry_type||"general"}
                </span>
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span class="font-medium">Email:</span> ${e.email}
              </div>
              ${e.company?`
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span class="font-medium">Company:</span> ${e.company}
                </div>
              `:""}
              <div class="text-sm text-gray-500 dark:text-gray-500">
                ${new Date(e.created_at).toLocaleString()}
              </div>
            </div>
          </div>
          
          <div class="mb-4">
            <div class="font-medium text-gray-900 dark:text-white mb-2">Subject: ${e.subject}</div>
            <div class="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3 rounded">
              ${e.message}
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            ${e.status!=="in_progress"?`
              <button onclick="window.updateContactStatus('${e.id}', 'in_progress')" class="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded hover:bg-yellow-200 dark:hover:bg-yellow-800">
                Mark In Progress
              </button>
            `:""}
            ${e.status!=="resolved"?`
              <button onclick="window.updateContactStatus('${e.id}', 'resolved')" class="px-3 py-1 text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded hover:bg-green-200 dark:hover:bg-green-800">
                Mark Resolved
              </button>
            `:""}
            ${e.status!=="closed"?`
              <button onclick="window.updateContactStatus('${e.id}', 'closed')" class="px-3 py-1 text-sm bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
                Close
              </button>
            `:""}
          </div>
        </div>
      `).join(""),a.classList.add("hidden"),d.classList.remove("hidden"),document.getElementById("pagination").classList.remove("hidden"),c(l.length)}catch(t){console.error("Error loading contacts:",t),a.classList.add("hidden")}}function c(a){const d=document.getElementById("page-info"),t=s+1,r=s+a;d.textContent=`${t}-${r}`,document.getElementById("prev-btn").disabled=s===0,document.getElementById("next-btn").disabled=a<i}function m(){document.getElementById("status-filter").addEventListener("change",()=>{s=0,n()}),document.getElementById("reset-filters-btn").addEventListener("click",()=>{document.getElementById("status-filter").value="",s=0,n()}),document.getElementById("prev-btn").addEventListener("click",()=>{s>0&&(s-=i,n())}),document.getElementById("next-btn").addEventListener("click",()=>{s+=i,n()})}window.updateContactStatus=async function(a,d){try{await o.updateContactStatus(a,d),alert("Contact status updated successfully!"),n()}catch(t){console.error("Error updating contact:",t),alert("Failed to update contact: "+(t.message||"Unknown error"))}};u();
