import{s as m}from"./api.LtktkIWz.js";import{r as y}from"./auth.DepAfbYU.js";y();let a=0;const u=20;async function x(){await d(),v()}async function d(){const t=document.getElementById("loading"),n=document.getElementById("users-table-container"),r=document.getElementById("users-tbody");t.classList.remove("hidden"),n.classList.add("hidden");try{const s=document.getElementById("search-input").value,o=document.getElementById("role-filter").value,i={skip:a,limit:u};s&&(i.search=s),o&&(i.role=o);const l=await m.users.getAll(i);r.innerHTML=l.map(e=>`
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
            <button onclick="window.changeUserRole('${e.id}', '${e.role}')" class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300" data-testid="change-role-${e.id}">
              Change Role
            </button>
            <button onclick="window.toggleUserStatus('${e.id}', ${e.is_active})" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              ${e.is_active?"Deactivate":"Activate"}
            </button>
          </td>
        </tr>
      `).join(""),t.classList.add("hidden"),n.classList.remove("hidden"),document.getElementById("pagination").classList.remove("hidden"),f(l.length)}catch(s){console.error("Error loading users:",s),t.classList.add("hidden")}}function f(t){const n=document.getElementById("page-info"),r=a+1,s=a+t;n.textContent=`${r}-${s}`,document.getElementById("prev-btn").disabled=a===0,document.getElementById("next-btn").disabled=t<u}function v(){let t;document.getElementById("search-input").addEventListener("input",()=>{clearTimeout(t),t=setTimeout(()=>{a=0,d()},500)}),document.getElementById("role-filter").addEventListener("change",()=>{a=0,d()}),document.getElementById("reset-filters-btn").addEventListener("click",()=>{document.getElementById("search-input").value="",document.getElementById("role-filter").value="",a=0,d()}),document.getElementById("prev-btn").addEventListener("click",()=>{a>0&&(a-=u,d())}),document.getElementById("next-btn").addEventListener("click",()=>{a+=u,d()})}window.toggleUserStatus=async function(t,n){if(confirm(`Are you sure you want to ${n?"deactivate":"activate"} this user?`))try{await m.users.update(t,{is_active:!n}),alert("User status updated successfully!"),d()}catch(r){console.error("Error updating user:",r),alert("Failed to update user: "+(r.message||"Unknown error"))}};window.changeUserRole=async function(t,n){const r=["user","admin","superadmin"],s={user:"User - Basic access to create content",admin:"Admin - Can manage tools, categories, and moderate content",superadmin:"Super Admin - Full access to all features"};let o=`Select new role:

`;r.forEach((c,g)=>{const p=c===n?" (Current)":"";o+=`${g+1}. ${s[c]}${p}
`}),o+=`
Enter role number (1-3):`;const i=prompt(o);if(!i)return;const l=parseInt(i)-1;if(l<0||l>=r.length){alert("Invalid selection");return}const e=r[l];if(e===n){alert("User already has this role");return}if(confirm(`Are you sure you want to change this user's role to ${e}?`))try{await m.users.update(t,{role:e}),alert(`User role updated to ${e} successfully!`),d()}catch(c){console.error("Error updating user role:",c),alert("Failed to update user role: "+(c.message||"Unknown error"))}};x();
