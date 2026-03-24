import{t as x}from"./api.9IHSeoxB.js";let l=[],p,c=[];async function b(){const t=new URLSearchParams(window.location.search).get("tools");if(t){const r=t.split(",");await k(r)}f();try{c=await x.getAll({limit:100})}catch(r){console.error("Error loading tools:",r)}}function f(){const a=document.getElementById("tool-search");a.addEventListener("input",()=>{clearTimeout(p),p=setTimeout(()=>y(a.value),300)})}function y(a){const t=document.getElementById("search-results");if(!a||a.length<2){t.classList.add("hidden");return}const r=c.filter(s=>!l.find(d=>d.id===s.id)&&(s.name.toLowerCase().includes(a.toLowerCase())||s.description.toLowerCase().includes(a.toLowerCase()))).slice(0,5);if(r.length===0){t.classList.add("hidden");return}t.innerHTML=r.map(s=>`
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
    `).join(""),t.classList.remove("hidden")}window.addToolToComparison=function(a){if(l.length>=5){alert("Maximum 5 tools can be compared at once");return}const t=c.find(s=>s.id===a);if(!t)return;l.push(t),g(),m();const r=document.getElementById("tool-search");r.value="",document.getElementById("search-results").classList.add("hidden"),h()};window.removeToolFromComparison=function(a){l=l.filter(t=>t.id!==a),g(),m(),h()};function g(){const a=document.getElementById("selected-tools");if(l.length===0){a.innerHTML='<p class="text-gray-500 dark:text-gray-400 py-2">No tools selected</p>';return}a.innerHTML=l.map(t=>`
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
    `).join("")}function m(){const a=document.getElementById("empty-state"),t=document.getElementById("comparison-container");if(l.length===0){a.classList.remove("hidden"),t.classList.add("hidden");return}a.classList.add("hidden"),t.classList.remove("hidden");const r=document.getElementById("comparison-header");r.innerHTML=`
      <th class="p-4 text-left text-gray-900 dark:text-white font-bold sticky left-0 bg-white dark:bg-gray-800">Feature</th>
      ${l.map(e=>`
        <th class="p-4 text-center min-w-64">
          <div class="flex flex-col items-center space-y-2">
            ${e.logo_url?`<img src="${e.logo_url}" alt="${e.name}" class="w-16 h-16 object-contain" />`:""}
            <a href="/tools/${e.slug}" class="font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">${e.name}</a>
          </div>
        </th>
      `).join("")}
    `;const s=[{label:"Rating",getValue:e=>`<div class="flex items-center justify-center"><span class="text-yellow-500 mr-1">★</span>${e.rating.toFixed(1)} (${e.review_count})</div>`},{label:"Pricing",getValue:e=>`<span class="px-3 py-1 rounded-full text-xs font-medium ${v(e.pricing_type)}">${e.pricing_type}</span>`},{label:"Description",getValue:e=>e.short_description||e.description},{label:"Key Features",getValue:e=>e.features&&e.features.length>0?`<ul class="text-left space-y-1">${e.features.slice(0,5).map(o=>`<li>• ${o}</li>`).join("")}</ul>`:"N/A"},{label:"Pros",getValue:e=>e.pros&&e.pros.length>0?`<ul class="text-left space-y-1 text-green-700 dark:text-green-400">${e.pros.slice(0,3).map(o=>`<li>✓ ${o}</li>`).join("")}</ul>`:"N/A"},{label:"Cons",getValue:e=>e.cons&&e.cons.length>0?`<ul class="text-left space-y-1 text-red-700 dark:text-red-400">${e.cons.slice(0,3).map(o=>`<li>✗ ${o}</li>`).join("")}</ul>`:"N/A"},{label:"Views",getValue:e=>e.view_count.toLocaleString()},{label:"Website",getValue:e=>e.url?`<a href="${e.url}" target="_blank" class="text-blue-600 hover:text-blue-800 dark:text-blue-400">Visit →</a>`:"N/A"}],d=document.getElementById("comparison-body");d.innerHTML=s.map(e=>`
      <tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
        <td class="p-4 font-medium text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-gray-800">${e.label}</td>
        ${l.map(o=>`
          <td class="p-4 text-center text-gray-700 dark:text-gray-300">${e.getValue(o)}</td>
        `).join("")}
      </tr>
    `).join("")}function v(a){const t={free:"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",freemium:"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",paid:"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"};return t[a]||t.paid}async function k(a){const t=document.getElementById("loading");t.classList.remove("hidden");try{l=await x.compare(a),g(),m()}catch(r){console.error("Error loading comparison:",r),alert("Error loading tools for comparison")}finally{t.classList.add("hidden")}}function h(){if(l.length>0){const a=l.map(r=>r.id).join(","),t=new URL(window.location.href);t.searchParams.set("tools",a),window.history.pushState({},"",t)}else window.history.pushState({},"",window.location.pathname)}async function w(){if(l.length<2){alert("Please select at least 2 tools to compare");return}const a=document.getElementById("ai-compare-btn"),t=document.getElementById("ai-comparison-section"),r=document.getElementById("ai-comparison-content");a.disabled=!0,a.innerHTML='<span class="animate-spin">⏳</span> Analyzing...';try{const s="https://marketmindai.com",d=localStorage.getItem("token")||localStorage.getItem("auth_token"),e=await fetch(`${s}/api/ai/quick-compare`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${d}`},body:JSON.stringify(l.map(n=>n.id))});if(!e.ok){const n=await e.json();throw new Error(n.detail||"AI comparison failed")}const o=await e.json();t.classList.remove("hidden");const u=(o.tool_comparisons||[]).map(n=>`
        <div class="bg-white dark:bg-gray-800 rounded-xl p-5 border-2 ${n.is_winner?"border-green-500 shadow-lg shadow-green-100 dark:shadow-green-900/20":"border-gray-200 dark:border-gray-700"}">
          <div class="flex items-center justify-between mb-3">
            <h5 class="text-lg font-bold text-gray-900 dark:text-white">${n.name}</h5>
            ${n.is_winner?'<span class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-bold rounded-full">AI Winner</span>':""}
          </div>
          ${n.overview?`<p class="text-sm text-gray-600 dark:text-gray-400 mb-3">${n.overview}</p>`:""}
          ${n.ratings&&Object.keys(n.ratings).length>0?`
            <div class="mb-3 space-y-1.5">
              ${["features","ease_of_use","pricing","customer_support"].filter(i=>n.ratings[i]).map(i=>`
                <div class="flex items-center gap-2">
                  <span class="text-xs text-gray-500 dark:text-gray-400 w-32 capitalize">${i.replace("_"," ")}</span>
                  <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div class="bg-blue-500 h-1.5 rounded-full" style="width:${Math.min(100,n.ratings[i]/5*100)}%"></div>
                  </div>
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300">${Number(n.ratings[i]).toFixed(1)}</span>
                </div>
              `).join("")}
            </div>
          `:""}
          ${n.pros?.length?`
            <div class="mb-2">
              <p class="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">Pros</p>
              <ul class="space-y-0.5">${n.pros.map(i=>`<li class="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1"><span class="text-green-500 mt-0.5">✓</span>${i}</li>`).join("")}</ul>
            </div>
          `:""}
          ${n.cons?.length?`
            <div class="mb-2">
              <p class="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">Cons</p>
              <ul class="space-y-0.5">${n.cons.map(i=>`<li class="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1"><span class="text-red-500 mt-0.5">✗</span>${i}</li>`).join("")}</ul>
            </div>
          `:""}
          ${n.best_for?.length?`
            <div>
              <p class="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Best For</p>
              <div class="flex flex-wrap gap-1">${n.best_for.map(i=>`<span class="text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">${i}</span>`).join("")}</div>
            </div>
          `:""}
        </div>
      `).join("");r.innerHTML=`
        <div class="space-y-5">
          ${o.winner?`
            <div class="flex items-center gap-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-5 text-white shadow-lg">
              <div class="text-4xl">🏆</div>
              <div>
                <p class="text-sm font-medium opacity-90 mb-0.5">AI Recommended Winner</p>
                <h4 class="text-2xl font-bold">${o.winner}</h4>
              </div>
            </div>
          `:""}
          
          ${o.summary?`
            <div class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
              <h4 class="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                AI Summary
              </h4>
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed">${o.summary}</p>
            </div>
          `:""}

          ${u?`
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                AI Tool Analysis
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-${Math.min(o.tool_comparisons?.length||1,3)} gap-4">
                ${u}
              </div>
            </div>
          `:""}
          
          ${o.recommendation?`
            <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-700">
              <h4 class="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                Recommendation
              </h4>
              <p class="text-blue-700 dark:text-blue-300 leading-relaxed">${o.recommendation}</p>
            </div>
          `:""}
        </div>
      `,t.scrollIntoView({behavior:"smooth",block:"start"})}catch(s){console.error("AI comparison error:",s),t.classList.remove("hidden"),r.innerHTML=`
        <div class="bg-red-50 dark:bg-red-900/30 rounded-lg p-4 border border-red-200 dark:border-red-800">
          <h4 class="font-semibold text-red-800 dark:text-red-200 mb-2">⚠️ Error</h4>
          <p class="text-red-700 dark:text-red-300">${s.message||"Failed to generate AI comparison. Please try again."}</p>
        </div>
      `}finally{a.disabled=!1,a.innerHTML="Get AI Analysis"}}document.getElementById("ai-compare-btn")?.addEventListener("click",w);function $(){const a=localStorage.getItem("token")||localStorage.getItem("auth_token"),t=document.getElementById("auth-gate-overlay"),r=document.getElementById("auth-loading"),s=document.getElementById("auth-gate-content");return a?(t&&t.remove(),!0):(r&&r.classList.add("hidden"),s&&s.classList.remove("hidden"),!1)}$()&&b();
