import{s as u}from"./api.9IHSeoxB.js";import{r as y}from"./auth.-1gIpQ0w.js";y();let r=0;const m=20;function x(e){const t={superadmin:"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",admin:"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",user:"bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"};return t[e]||t.user}function v(e){return e?"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":"bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}async function o(){const e=document.getElementById("loading"),t=document.getElementById("users-table-container"),a=document.getElementById("users-tbody");e.classList.remove("hidden"),t.classList.add("hidden");try{const d=document.getElementById("search-input").value.trim(),i=document.getElementById("role-filter").value,s={skip:r,limit:m};d&&(s.search=d),i&&(s.role=i);const l=await u.users.getAll(s);a.innerHTML=l.map(n=>`
        <tr data-user-id="${n.id}" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
          <td class="px-6 py-4">
            <div class="flex items-center space-x-3 min-w-0">
              <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                ${(n.full_name||n.username||"?").charAt(0).toUpperCase()}
              </div>
              <div class="min-w-0">
                <div class="font-medium text-gray-900 dark:text-white truncate">${n.full_name||n.username}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">@${n.username}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-[180px] truncate">${n.email}</td>
          <td class="px-6 py-4">
            <span class="px-3 py-1 rounded-full text-xs font-medium ${x(n.role)}" data-role-badge="${n.id}">
              ${n.role}
            </span>
          </td>
          <td class="px-6 py-4">
            <span class="px-3 py-1 rounded-full text-xs font-medium ${v(n.is_active)}">
              ${n.is_active?"Active":"Inactive"}
            </span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
            ${new Date(n.created_at).toLocaleDateString()}
          </td>
          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end gap-2 flex-wrap">
              <button
                onclick="window.openRoleModal('${n.id}', '${n.role}', '${(n.full_name||n.username).replace(/'/g,"\\'")}', '${n.email}')"
                class="px-3 py-1.5 text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors whitespace-nowrap"
                ${n.role==="superadmin"?'title="Cannot demote last superadmin"':""}>
                Change Role
              </button>
              <button
                onclick="window.toggleUserStatus('${n.id}', ${n.is_active})"
                class="px-3 py-1.5 text-xs font-medium ${n.is_active?"bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 hover:bg-red-200":"bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 hover:bg-green-200"} rounded-lg transition-colors whitespace-nowrap">
                ${n.is_active?"Deactivate":"Activate"}
              </button>
            </div>
          </td>
        </tr>
      `).join(""),e.classList.add("hidden"),t.classList.remove("hidden"),document.getElementById("pagination").classList.remove("hidden"),f(l.length);const p=document.getElementById("total-count");r===0&&l.length<m&&(p.textContent=`${l.length} user${l.length!==1?"s":""}`)}catch(d){console.error("Error loading users:",d),e.classList.add("hidden")}}function f(e){const t=document.getElementById("page-info"),a=r+1,d=r+e;t.textContent=`${a}–${d}`,document.getElementById("prev-btn").disabled=r===0,document.getElementById("next-btn").disabled=e<m}window.toggleUserStatus=async function(e,t){if(confirm(`Are you sure you want to ${t?"deactivate":"activate"} this user?`))try{await u.users.update(e,{is_active:!t}),c(`User ${t?"deactivated":"activated"} successfully.`,"success"),o()}catch(a){c("Failed to update user: "+(a.message||"Unknown error"),"error")}};window.openRoleModal=function(e,t,a,d){document.getElementById("modal-user-id").value=e,document.getElementById("modal-current-role").value=t,document.getElementById("modal-username").textContent=a,document.getElementById("modal-email").textContent=d,document.querySelectorAll('input[name="new-role"]').forEach(s=>{s.checked=s.value===t}),document.getElementById("role-warning").classList.add("hidden"),document.getElementById("role-modal").classList.remove("hidden")};document.querySelectorAll('input[name="new-role"]').forEach(e=>{e.addEventListener("change",()=>{const t=document.getElementById("role-warning"),a=document.getElementById("role-warning-text");if(e.value==="superadmin")a.textContent="This user will have FULL access to all admin features including user management and system settings.",t.classList.remove("hidden");else if(e.value==="user"){const d=document.getElementById("modal-current-role").value;d==="superadmin"||d==="admin"?(a.textContent="This will remove all admin privileges from this user.",t.classList.remove("hidden")):t.classList.add("hidden")}else t.classList.add("hidden")})});document.getElementById("confirm-role-btn").addEventListener("click",async()=>{const e=document.getElementById("modal-user-id").value,t=document.querySelector('input[name="new-role"]:checked')?.value,a=document.getElementById("modal-current-role").value;if(!t){c("Please select a role.","error");return}if(t===a){document.getElementById("role-modal").classList.add("hidden");return}const d=document.getElementById("confirm-role-btn");d.disabled=!0,d.textContent="Saving…";try{await u.users.update(e,{role:t}),document.getElementById("role-modal").classList.add("hidden"),c(`Role updated to "${t}" successfully!`,"success"),o()}catch(i){c("Failed to update role: "+(i.message||"Unknown error"),"error")}finally{d.disabled=!1,d.textContent="Save Role"}});document.getElementById("role-modal").addEventListener("click",e=>{e.target===e.currentTarget&&e.currentTarget.classList.add("hidden")});let g;document.getElementById("search-input").addEventListener("input",()=>{clearTimeout(g),g=setTimeout(()=>{r=0,o()},500)});document.getElementById("role-filter").addEventListener("change",()=>{r=0,o()});document.getElementById("reset-filters-btn").addEventListener("click",()=>{document.getElementById("search-input").value="",document.getElementById("role-filter").value="",r=0,o()});document.getElementById("prev-btn").addEventListener("click",()=>{r>0&&(r-=m,o())});document.getElementById("next-btn").addEventListener("click",()=>{r+=m,o()});function c(e,t){const a=document.getElementById("toast-notification");a&&a.remove();const d=document.createElement("div");d.id="toast-notification",d.className=`fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-xl shadow-xl text-white text-sm font-medium transition-all transform translate-y-0 ${t==="success"?"bg-green-600":"bg-red-600"}`,d.textContent=e,document.body.appendChild(d),setTimeout(()=>d.remove(),4e3)}o();
