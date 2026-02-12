import{s as g}from"./api.LtktkIWz.js";import{r as c}from"./auth.DepAfbYU.js";c();async function d(s=30){const r=document.getElementById("loading"),e=document.getElementById("analytics-content"),t=document.getElementById("error");try{r.classList.remove("hidden"),e.classList.add("hidden"),t.classList.add("hidden");const a=await g.getDashboardAnalytics(s);r.classList.add("hidden"),e.classList.remove("hidden"),y(a,s),v(a),x(a),b(a)}catch(a){console.error("Error loading analytics:",a),r.classList.add("hidden"),t.classList.remove("hidden")}}function y(s,r){const e=document.getElementById("stats-grid"),t=s.overview||s;s.recent_activity;const a=t.monthly_growth||{},n=[{title:"Total Users",value:t.total_users?.toLocaleString()||"0",icon:"👥",color:"blue",growth:a.users||0},{title:"Total Tools",value:t.total_tools?.toLocaleString()||"0",icon:"🔧",color:"green",growth:a.tools||0},{title:"Total Blogs",value:t.total_blogs?.toLocaleString()||"0",icon:"📝",color:"purple",growth:a.blogs||0},{title:"Total Reviews",value:t.total_reviews?.toLocaleString()||"0",icon:"⭐",color:"yellow",growth:a.reviews||0}];e.innerHTML=n.map(o=>{const l=o.growth>=0?"text-green-600":"text-red-600",i=o.growth>=0?"↑":"↓";return`
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6" data-testid="stat-card-${o.title.toLowerCase().replace(/ /g,"-")}">
        <div class="flex items-center justify-between mb-2">
          <span class="text-2xl">${o.icon}</span>
          <span class="${l} text-sm font-semibold">${i} ${Math.abs(o.growth).toFixed(1)}%</span>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">${o.value}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">${o.title}</p>
        <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">Last ${r} days growth</p>
      </div>
    `}).join("")}function v(s){const r=document.getElementById("activity-chart"),e=s.recent_activity||{},t=[{label:"New Users Today",value:e.new_users_today||0,max:Math.max(e.new_users_today||0,10)},{label:"New Tools Today",value:e.new_tools_today||0,max:Math.max(e.new_tools_today||0,10)},{label:"New Blogs Today",value:e.new_blogs_today||0,max:Math.max(e.new_blogs_today||0,10)},{label:"New Reviews Today",value:e.new_reviews_today||0,max:Math.max(e.new_reviews_today||0,10)}];r.innerHTML=t.map(a=>`
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">${a.label}</span>
          <span class="text-sm font-bold text-blue-600 dark:text-blue-400">${a.value}</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            class="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" 
            style="width: ${a.value/a.max*100}%"
          ></div>
        </div>
      </div>
    `).join("")}function x(s){const r=document.getElementById("performance-chart"),e=s.performance||{},t=e.total_views||0,a=e.avg_rating||0,n=[{label:"Total Views",value:t,max:Math.max(t,100),displayValue:t.toLocaleString()},{label:"Avg Tool Rating",value:a,max:5,displayValue:a.toFixed(2)+" / 5.0"}];r.innerHTML=n.map(o=>`
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">${o.label}</span>
          <span class="text-sm font-bold text-green-600 dark:text-green-400">${o.displayValue}</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            class="h-3 rounded-full bg-gradient-to-r from-green-500 to-green-600" 
            style="width: ${o.value/o.max*100}%"
          ></div>
        </div>
      </div>
    `).join("")}function b(s){const r=document.getElementById("detailed-stats"),e=s.overview||s,t=s.recent_activity||{};r.innerHTML=`
      <div class="space-y-3">
        <h4 class="font-semibold text-gray-900 dark:text-white">Platform Overview</h4>
        <div class="space-y-2">
          <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <span class="text-gray-700 dark:text-gray-300">Total Users</span>
            <span class="font-bold text-gray-900 dark:text-white">${e.total_users?.toLocaleString()||"0"}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <span class="text-gray-700 dark:text-gray-300">Total Tools</span>
            <span class="font-bold text-gray-900 dark:text-white">${e.total_tools?.toLocaleString()||"0"}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <span class="text-gray-700 dark:text-gray-300">Total Blogs</span>
            <span class="font-bold text-gray-900 dark:text-white">${e.total_blogs?.toLocaleString()||"0"}</span>
          </div>
        </div>
      </div>
      
      <div class="space-y-3">
        <h4 class="font-semibold text-gray-900 dark:text-white">Today's Activity (Real-time)</h4>
        <div class="space-y-2">
          <div class="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <span class="text-gray-700 dark:text-gray-300">New Users Today</span>
            <span class="font-bold text-green-900 dark:text-green-100">${t.new_users_today||0}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <span class="text-gray-700 dark:text-gray-300">New Tools Today</span>
            <span class="font-bold text-green-900 dark:text-green-100">${t.new_tools_today||0}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <span class="text-gray-700 dark:text-gray-300">New Blogs Today</span>
            <span class="font-bold text-green-900 dark:text-green-100">${t.new_blogs_today||0}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <span class="text-gray-700 dark:text-gray-300">New Reviews Today</span>
            <span class="font-bold text-green-900 dark:text-green-100">${t.new_reviews_today||0}</span>
          </div>
        </div>
      </div>
    `}document.getElementById("timeframe")?.addEventListener("change",s=>{const r=parseInt(s.target.value);d(r)});d(30);
