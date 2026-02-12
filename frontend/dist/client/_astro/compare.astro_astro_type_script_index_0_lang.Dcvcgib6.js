import{t as g}from"./api.LtktkIWz.js";let r=[],u,i=[];async function p(){const t=new URLSearchParams(window.location.search).get("tools");if(t){const n=t.split(",");await x(n)}h();try{i=await g.getAll({limit:100})}catch(n){console.error("Error loading tools:",n)}}function h(){const a=document.getElementById("tool-search");a.addEventListener("input",()=>{clearTimeout(u),u=setTimeout(()=>f(a.value),300)})}function f(a){const t=document.getElementById("search-results");if(!a||a.length<2){t.classList.add("hidden");return}const n=i.filter(s=>!r.find(l=>l.id===s.id)&&(s.name.toLowerCase().includes(a.toLowerCase())||s.description.toLowerCase().includes(a.toLowerCase()))).slice(0,5);if(n.length===0){t.classList.add("hidden");return}t.innerHTML=n.map(s=>`
      <button
        onclick="window.addToolToComparison('${s.id}')"
        class="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3"
        data-testid="add-tool-${s.slug}"
      >
        ${s.logo_url?`<img src="${s.logo_url}" alt="${s.name}" class="w-10 h-10 object-contain rounded" />`:""}
        <div class="flex-1">
          <div class="font-medium text-gray-900 dark:text-white">${s.name}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">${s.short_description||""}</div>
        </div>
      </button>
    `).join(""),t.classList.remove("hidden")}window.addToolToComparison=function(a){if(r.length>=5){alert("Maximum 5 tools can be compared at once");return}const t=i.find(s=>s.id===a);if(!t)return;r.push(t),d(),c();const n=document.getElementById("tool-search");n.value="",document.getElementById("search-results").classList.add("hidden"),m()};window.removeToolFromComparison=function(a){r=r.filter(t=>t.id!==a),d(),c(),m()};function d(){const a=document.getElementById("selected-tools");if(r.length===0){a.innerHTML='<p class="text-gray-500 dark:text-gray-400 py-2">No tools selected</p>';return}a.innerHTML=r.map(t=>`
      <div class="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900 px-3 py-2 rounded-lg">
        <span class="text-blue-900 dark:text-blue-100 font-medium">${t.name}</span>
        <button
          onclick="window.removeToolFromComparison('${t.id}')"
          class="text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
          data-testid="remove-tool-${t.slug}"
        >
          ×
        </button>
      </div>
    `).join("")}function c(){const a=document.getElementById("empty-state"),t=document.getElementById("comparison-container");if(r.length===0){a.classList.remove("hidden"),t.classList.add("hidden");return}a.classList.add("hidden"),t.classList.remove("hidden");const n=document.getElementById("comparison-header");n.innerHTML=`
      <th class="p-4 text-left text-gray-900 dark:text-white font-bold sticky left-0 bg-white dark:bg-gray-800">Feature</th>
      ${r.map(e=>`
        <th class="p-4 text-center min-w-64">
          <div class="flex flex-col items-center space-y-2">
            ${e.logo_url?`<img src="${e.logo_url}" alt="${e.name}" class="w-16 h-16 object-contain" />`:""}
            <a href="/tools/${e.slug}" class="font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">${e.name}</a>
          </div>
        </th>
      `).join("")}
    `;const s=[{label:"Rating",getValue:e=>`<div class="flex items-center justify-center"><span class="text-yellow-500 mr-1">★</span>${e.rating.toFixed(1)} (${e.review_count})</div>`},{label:"Pricing",getValue:e=>`<span class="px-3 py-1 rounded-full text-xs font-medium ${b(e.pricing_type)}">${e.pricing_type}</span>`},{label:"Description",getValue:e=>e.short_description||e.description},{label:"Key Features",getValue:e=>e.features&&e.features.length>0?`<ul class="text-left space-y-1">${e.features.slice(0,5).map(o=>`<li>• ${o}</li>`).join("")}</ul>`:"N/A"},{label:"Pros",getValue:e=>e.pros&&e.pros.length>0?`<ul class="text-left space-y-1 text-green-700 dark:text-green-400">${e.pros.slice(0,3).map(o=>`<li>✓ ${o}</li>`).join("")}</ul>`:"N/A"},{label:"Cons",getValue:e=>e.cons&&e.cons.length>0?`<ul class="text-left space-y-1 text-red-700 dark:text-red-400">${e.cons.slice(0,3).map(o=>`<li>✗ ${o}</li>`).join("")}</ul>`:"N/A"},{label:"Views",getValue:e=>e.view_count.toLocaleString()},{label:"Website",getValue:e=>e.url?`<a href="${e.url}" target="_blank" class="text-blue-600 hover:text-blue-800 dark:text-blue-400">Visit →</a>`:"N/A"}],l=document.getElementById("comparison-body");l.innerHTML=s.map(e=>`
      <tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
        <td class="p-4 font-medium text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-gray-800">${e.label}</td>
        ${r.map(o=>`
          <td class="p-4 text-center text-gray-700 dark:text-gray-300">${e.getValue(o)}</td>
        `).join("")}
      </tr>
    `).join("")}function b(a){const t={free:"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",freemium:"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",paid:"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"};return t[a]||t.paid}async function x(a){const t=document.getElementById("loading");t.classList.remove("hidden");try{r=await g.compare(a),d(),c()}catch(n){console.error("Error loading comparison:",n),alert("Error loading tools for comparison")}finally{t.classList.add("hidden")}}function m(){if(r.length>0){const a=r.map(n=>n.id).join(","),t=new URL(window.location.href);t.searchParams.set("tools",a),window.history.pushState({},"",t)}else window.history.pushState({},"",window.location.pathname)}function y(){const a=localStorage.getItem("token")||localStorage.getItem("auth_token"),t=document.getElementById("auth-gate-overlay"),n=document.getElementById("auth-loading"),s=document.getElementById("auth-gate-content");return a?(t&&t.remove(),!0):(n&&n.classList.add("hidden"),s&&s.classList.remove("hidden"),!1)}y()&&p();
