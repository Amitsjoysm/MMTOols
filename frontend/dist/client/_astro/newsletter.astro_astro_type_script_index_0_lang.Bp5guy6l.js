import{a as l}from"./api.LtktkIWz.js";import{r as g}from"./auth.DepAfbYU.js";g();let e=0;const n=20;async function m(){await u(),await r(),x()}async function u(){try{const t=await l.getNewsletterStats(),d=document.getElementById("stats-grid");d.innerHTML=`
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6" data-testid="stat-total-subscribers">
          <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">${t.total_subscribers||0}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Subscribers</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6" data-testid="stat-active-subscribers">
          <div class="text-3xl font-bold text-green-600 dark:text-green-400">${t.active_subscribers||0}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">Active</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6" data-testid="stat-unsubscribed">
          <div class="text-3xl font-bold text-red-600 dark:text-red-400">${t.unsubscribed_count||0}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">Unsubscribed</div>
        </div>
      `}catch(t){console.error("Error loading newsletter stats:",t)}}async function r(){const t=document.getElementById("loading"),d=document.getElementById("subscribers-table-container"),i=document.getElementById("subscribers-tbody");t.classList.remove("hidden"),d.classList.add("hidden");try{const a=document.getElementById("status-filter").value,c={skip:e,limit:n};a&&(c.status_filter=a);const o=await l.getNewsletterSubscriptions(c);i.innerHTML=o.map(s=>`
        <tr data-testid="subscriber-row-${s.id}">
          <td class="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">${s.email}</td>
          <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">${s.source||"website"}</td>
          <td class="px-6 py-4">
            <span class="px-3 py-1 rounded-full text-xs font-medium ${s.status==="active"?"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":"bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}">
              ${s.status}
            </span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
            ${new Date(s.subscribed_at).toLocaleDateString()}
          </td>
          <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
            ${s.unsubscribed_at?new Date(s.unsubscribed_at).toLocaleDateString():"-"}
          </td>
        </tr>
      `).join(""),t.classList.add("hidden"),d.classList.remove("hidden"),document.getElementById("pagination").classList.remove("hidden"),b(o.length)}catch(a){console.error("Error loading subscribers:",a),t.classList.add("hidden")}}function b(t){const d=document.getElementById("page-info"),i=e+1,a=e+t;d.textContent=`${i}-${a}`,document.getElementById("prev-btn").disabled=e===0,document.getElementById("next-btn").disabled=t<n}function x(){document.getElementById("status-filter").addEventListener("change",()=>{e=0,r()}),document.getElementById("reset-filters-btn").addEventListener("click",()=>{document.getElementById("status-filter").value="",e=0,r()}),document.getElementById("prev-btn").addEventListener("click",()=>{e>0&&(e-=n,r())}),document.getElementById("next-btn").addEventListener("click",()=>{e+=n,r()})}m();
