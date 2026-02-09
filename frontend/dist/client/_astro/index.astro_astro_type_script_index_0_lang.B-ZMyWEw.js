import{s as d}from"./api.CZvKPiQ1.js";async function s(){const e=document.getElementById("loading"),r=document.getElementById("dashboard-content"),a=document.getElementById("error");try{const t=await d.getDashboardAnalytics(30);e.classList.add("hidden"),r.classList.remove("hidden"),n(t.overview),o(t.overview.monthly_growth),l(t.recent_activity.top_categories),i(t.top_content.most_viewed_tools),g(t.top_content.most_viewed_blogs),c(t.recent_activity)}catch(t){console.error("Error loading dashboard:",t),e.classList.add("hidden"),a.classList.remove("hidden")}}function n(e){const r=document.getElementById("stats-grid"),a=[{title:"Total Tools",value:e.total_tools.toLocaleString(),change:`+${e.monthly_growth.tools}%`,icon:"⚡",color:"blue"},{title:"Total Blogs",value:e.total_blogs.toLocaleString(),change:`+${e.monthly_growth.blogs}%`,icon:"📝",color:"green"},{title:"Total Users",value:e.total_users.toLocaleString(),change:`+${e.monthly_growth.users}%`,icon:"👥",color:"purple"},{title:"Total Reviews",value:e.total_reviews.toLocaleString(),change:`+${e.monthly_growth.reviews}%`,icon:"⭐",color:"yellow"}];r.innerHTML=a.map(t=>`
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6" data-testid="stat-card-${t.title.toLowerCase().replace(" ","-")}">
        <div class="flex items-center justify-between mb-2">
          <span class="text-2xl">${t.icon}</span>
          <span class="text-sm font-medium px-2 py-1 rounded-full ${parseFloat(t.change)>=0?"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":"bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}">
            ${t.change}
          </span>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">${t.value}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">${t.title}</p>
      </div>
    `).join("")}function o(e){const r=document.getElementById("growth-chart");r.innerHTML=`
      <div class="space-y-3">
        ${Object.entries(e).map(([a,t])=>`
          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">${a}</span>
              <span class="text-sm font-bold ${parseFloat(t)>=0?"text-green-600 dark:text-green-400":"text-red-600 dark:text-red-400"}">
                ${t>=0?"+":""}${t}%
              </span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                class="h-2 rounded-full ${parseFloat(t)>=0?"bg-green-600 dark:bg-green-500":"bg-red-600 dark:bg-red-500"}" 
                style="width: ${Math.min(Math.abs(parseFloat(t)),100)}%"
              ></div>
            </div>
          </div>
        `).join("")}
      </div>
    `}function l(e){const r=document.getElementById("top-categories");if(!e||e.length===0){r.innerHTML='<p class="text-gray-500 dark:text-gray-400">No categories data available</p>';return}r.innerHTML=e.map(a=>`
      <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div class="flex-1">
          <div class="font-medium text-gray-900 dark:text-white">${a.name}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">${a.tools} tools</div>
        </div>
        <span class="text-sm font-medium px-2 py-1 rounded-full ${a.growth>=0?"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":"bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}">
          ${a.growth>=0?"+":""}${a.growth}%
        </span>
      </div>
    `).join("")}function i(e){const r=document.getElementById("top-tools");if(!e||e.length===0){r.innerHTML='<p class="text-gray-500 dark:text-gray-400">No tools data available</p>';return}r.innerHTML=e.map(a=>`
      <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div class="flex-1">
          <div class="font-medium text-gray-900 dark:text-white">${a.name}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">${a.views.toLocaleString()} views • ${a.rating.toFixed(1)} ⭐</div>
        </div>
      </div>
    `).join("")}function g(e){const r=document.getElementById("top-blogs");if(!e||e.length===0){r.innerHTML='<p class="text-gray-500 dark:text-gray-400">No blogs data available</p>';return}r.innerHTML=e.map(a=>`
      <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div class="flex-1">
          <div class="font-medium text-gray-900 dark:text-white">${a.title}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">${a.views.toLocaleString()} views • ${a.likes} likes</div>
        </div>
      </div>
    `).join("")}function c(e){const r=document.getElementById("recent-activity");r.innerHTML=`
      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">${e.new_users_today}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">New Users</div>
      </div>
      <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <div class="text-2xl font-bold text-green-600 dark:text-green-400">${e.new_tools_today}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">New Tools</div>
      </div>
      <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">${e.new_blogs_today}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">New Blogs</div>
      </div>
      <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">${e.new_reviews_today}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">New Reviews</div>
      </div>
    `}s();
