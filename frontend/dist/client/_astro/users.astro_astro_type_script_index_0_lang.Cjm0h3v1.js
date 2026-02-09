import{s as u}from"./api.CZvKPiQ1.js";import{r as m}from"./auth.DepAfbYU.js";m();let n=0;const i=20;async function g(){await d(),x()}async function d(){const t=document.getElementById("loading"),a=document.getElementById("users-table-container"),r=document.getElementById("users-tbody");t.classList.remove("hidden"),a.classList.add("hidden");try{const s=document.getElementById("search-input").value,o=document.getElementById("role-filter").value,l={skip:n,limit:i};s&&(l.search=s),o&&(l.role=o);const c=await u.users.getAll(l);r.innerHTML=c.map(e=>`
        <tr data-testid="user-row-${e.id}">
          <td class="px-6 py-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                ${(e.full_name||e.username).charAt(0).toUpperCase()}
              </div>
              <div>
                <div class="font-medium text-gray-900 dark:text-white">${e.full_name||e.username}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">@${e.username}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">${e.email}</td>
          <td class="px-6 py-4">
            <span class="px-3 py-1 rounded-full text-xs font-medium ${e.role==="superadmin"?"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200":e.role==="admin"?"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200":"bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"}">
              ${e.role}
            </span>
          </td>
          <td class="px-6 py-4">
            <span class="px-3 py-1 rounded-full text-xs font-medium ${e.is_active?"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":"bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}">
              ${e.is_active?"Active":"Inactive"}
            </span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
            ${new Date(e.created_at).toLocaleDateString()}
          </td>
          <td class="px-6 py-4 text-right space-x-2">
            <button onclick="window.toggleUserStatus('${e.id}', ${e.is_active})" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              ${e.is_active?"Deactivate":"Activate"}
            </button>
          </td>
        </tr>
      `).join(""),t.classList.add("hidden"),a.classList.remove("hidden"),document.getElementById("pagination").classList.remove("hidden"),p(c.length)}catch(s){console.error("Error loading users:",s),t.classList.add("hidden")}}function p(t){const a=document.getElementById("page-info"),r=n+1,s=n+t;a.textContent=`${r}-${s}`,document.getElementById("prev-btn").disabled=n===0,document.getElementById("next-btn").disabled=t<i}function x(){let t;document.getElementById("search-input").addEventListener("input",()=>{clearTimeout(t),t=setTimeout(()=>{n=0,d()},500)}),document.getElementById("role-filter").addEventListener("change",()=>{n=0,d()}),document.getElementById("reset-filters-btn").addEventListener("click",()=>{document.getElementById("search-input").value="",document.getElementById("role-filter").value="",n=0,d()}),document.getElementById("prev-btn").addEventListener("click",()=>{n>0&&(n-=i,d())}),document.getElementById("next-btn").addEventListener("click",()=>{n+=i,d()})}window.toggleUserStatus=async function(t,a){if(confirm(`Are you sure you want to ${a?"deactivate":"activate"} this user?`))try{await u.users.update(t,{is_active:!a}),alert("User status updated successfully!"),d()}catch(r){console.error("Error updating user:",r),alert("Failed to update user: "+(r.message||"Unknown error"))}};g();
