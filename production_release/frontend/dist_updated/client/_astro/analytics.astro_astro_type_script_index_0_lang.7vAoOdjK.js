import{a as r}from"./api.9IHSeoxB.js";async function n(e=30){const a=document.getElementById("loading"),l=document.getElementById("analytics-content"),t=document.getElementById("error");try{a.classList.remove("hidden"),l.classList.add("hidden"),t.classList.add("hidden");const s=await r.getAnalytics(e);a.classList.add("hidden"),l.classList.remove("hidden"),d(s,e),i(s),o(s),c(s)}catch(s){console.error("Error loading analytics:",s),a.classList.add("hidden"),t.classList.remove("hidden")}}function d(e,a){const l=document.getElementById("stats-grid"),t=[{title:"Total Blog Views",value:e.analytics.blog_views.toLocaleString(),icon:"📊",color:"blue"},{title:"New Blogs",value:e.analytics.new_blogs.toLocaleString(),icon:"📝",color:"green"},{title:"Tool Views",value:e.analytics.tool_views.toLocaleString(),icon:"🔧",color:"purple"},{title:"New Reviews",value:e.analytics.new_reviews.toLocaleString(),icon:"⭐",color:"yellow"}];l.innerHTML=t.map(s=>`
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6" data-testid="stat-card-${s.title.toLowerCase().replace(/ /g,"-")}">
        <div class="flex items-center justify-between mb-2">
          <span class="text-2xl">${s.icon}</span>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">${s.value}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">${s.title}</p>
        <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">Last ${a} days</p>
      </div>
    `).join("")}function i(e){const a=document.getElementById("activity-chart"),l=[{label:"New Users",value:e.analytics.new_users,max:Math.max(e.analytics.new_users,10)},{label:"New Blogs",value:e.analytics.new_blogs,max:Math.max(e.analytics.new_blogs,10)},{label:"New Reviews",value:e.analytics.new_reviews,max:Math.max(e.analytics.new_reviews,10)}];a.innerHTML=l.map(t=>`
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">${t.label}</span>
          <span class="text-sm font-bold text-blue-600 dark:text-blue-400">${t.value}</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            class="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" 
            style="width: ${t.value/t.max*100}%"
          ></div>
        </div>
      </div>
    `).join("")}function o(e){const a=document.getElementById("performance-chart"),l=[{label:"Blog Views",value:e.analytics.blog_views,max:Math.max(e.analytics.blog_views,100)},{label:"Tool Views",value:e.analytics.tool_views,max:Math.max(e.analytics.tool_views,100)}];a.innerHTML=l.map(t=>`
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">${t.label}</span>
          <span class="text-sm font-bold text-green-600 dark:text-green-400">${t.value.toLocaleString()}</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            class="h-3 rounded-full bg-gradient-to-r from-green-500 to-green-600" 
            style="width: ${t.value/t.max*100}%"
          ></div>
        </div>
      </div>
    `).join("")}function c(e){const a=document.getElementById("detailed-stats");a.innerHTML=`
      <div class="space-y-3">
        <h4 class="font-semibold text-gray-900 dark:text-white">Content Activity</h4>
        <div class="space-y-2">
          <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <span class="text-gray-700 dark:text-gray-300">New Blogs Created</span>
            <span class="font-bold text-gray-900 dark:text-white">${e.analytics.new_blogs}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <span class="text-gray-700 dark:text-gray-300">Total Blog Views</span>
            <span class="font-bold text-gray-900 dark:text-white">${e.analytics.blog_views.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div class="space-y-3">
        <h4 class="font-semibold text-gray-900 dark:text-white">User Engagement</h4>
        <div class="space-y-2">
          <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <span class="text-gray-700 dark:text-gray-300">New Users</span>
            <span class="font-bold text-gray-900 dark:text-white">${e.analytics.new_users}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <span class="text-gray-700 dark:text-gray-300">New Reviews</span>
            <span class="font-bold text-gray-900 dark:text-white">${e.analytics.new_reviews}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <span class="text-gray-700 dark:text-gray-300">Tool Views</span>
            <span class="font-bold text-gray-900 dark:text-white">${e.analytics.tool_views.toLocaleString()}</span>
          </div>
        </div>
      </div>
    `}document.getElementById("timeframe")?.addEventListener("change",e=>{const a=parseInt(e.target.value);n(a)});n(30);
