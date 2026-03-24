function x(){const a=localStorage.getItem("token")||localStorage.getItem("auth_token"),r=document.getElementById("auth-gate-overlay"),t=document.getElementById("auth-loading"),s=document.getElementById("auth-gate-content");return a?(r&&r.remove(),!0):(t&&t.classList.add("hidden"),s&&s.classList.remove("hidden"),!1)}async function f(a){a.preventDefault();const r=document.getElementById("user-needs").value,t=document.getElementById("category-filter").value,s=document.querySelector('input[name="budget"]:checked')?.value||"any",c=document.getElementById("features-needed").value,b=c?c.split(",").map(n=>n.trim()).filter(n=>n):[];if(!r.trim()){d("Please describe what you need help with","error");return}const o=document.getElementById("loading-results"),g=document.getElementById("results-section"),m=document.getElementById("error-state"),u=document.getElementById("recommend-btn");o.classList.remove("hidden"),g.classList.add("hidden"),m.classList.add("hidden"),u.disabled=!0;try{const n="https://marketmindai.com",h=localStorage.getItem("token")||localStorage.getItem("auth_token"),i=await fetch(`${n}/api/ai/recommend-tools`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${h}`},body:JSON.stringify({user_needs:r,category:t||null,budget:s,features_needed:b,limit:5})});if(!i.ok){const e=await i.json();throw new Error(e.detail||"Failed to get recommendations")}const l=await i.json();o.classList.add("hidden"),g.classList.remove("hidden"),document.getElementById("ai-analysis-text").textContent=l.ai_analysis||"Based on your requirements, here are my top recommendations.";const p=document.getElementById("tools-list");l.recommendations?.length>0?p.innerHTML=l.recommendations.map((e,y)=>`
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 ${y===0?"border-green-500":"border-blue-500"}">
            <div class="flex items-start gap-4">
              ${e.logo_url?`
                <img src="${e.logo_url}" alt="${e.name}" class="w-16 h-16 rounded-lg object-contain bg-gray-100 dark:bg-gray-700 p-2">
              `:`
                <div class="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  ${e.name.charAt(0)}
                </div>
              `}
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  ${y===0?'<span class="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">Top Pick</span>':""}
                  <span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                    ${Math.round((e.match_score||.8)*100)}% Match
                  </span>
                </div>
                <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  <a href="/tools/${e.slug}" class="hover:text-blue-600 dark:hover:text-blue-400">${e.name}</a>
                </h4>
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">${e.description?.substring(0,150)}${e.description?.length>150?"...":""}</p>
                
                <div class="flex flex-wrap items-center gap-3 mb-3">
                  <span class="px-3 py-1 rounded-full text-xs font-medium ${e.pricing_type==="free"?"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":e.pricing_type==="freemium"?"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200":"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"}">
                    ${e.pricing_type}
                  </span>
                  ${e.rating?`
                    <span class="flex items-center gap-1 text-yellow-600">
                      ⭐ ${e.rating.toFixed(1)}
                    </span>
                  `:""}
                  ${e.category?`
                    <span class="text-gray-500 dark:text-gray-400 text-sm">${e.category}</span>
                  `:""}
                </div>
                
                <div class="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
                  <p class="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Why recommended:</strong> ${e.match_reason||"Matches your requirements"}
                  </p>
                </div>
                
                <div class="mt-4 flex gap-3">
                  <a href="/tools/${e.slug}" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium" data-testid="view-details-${e.slug}">
                    View Details
                  </a>
                  ${e.url?`<a href="${e.url}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium" data-testid="visit-tool-${e.slug}">Visit Tool</a>`:""}
                  <button onclick="window.addToCompare('${e.id}', '${e.name}')" class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
                    + Compare
                  </button>
                </div>
              </div>
            </div>
          </div>
        `).join(""):p.innerHTML=`
          <div class="text-center py-8">
            <p class="text-gray-600 dark:text-gray-400">No tools found matching your criteria. Try broadening your search.</p>
          </div>
        `}catch(n){console.error("Recommendation error:",n),o.classList.add("hidden"),m.classList.remove("hidden"),document.getElementById("error-message").textContent=n.message||"Failed to get recommendations. Please try again."}finally{u.disabled=!1}}function d(a,r="success"){const t=document.createElement("div");t.className=`fixed bottom-4 right-4 z-50 px-5 py-3 rounded-lg text-white text-sm font-medium shadow-lg ${r==="success"?"bg-green-600":"bg-red-600"}`,t.textContent=a,document.body.appendChild(t),setTimeout(()=>t.remove(),3500)}window.addToCompare=function(a,r){const t=JSON.parse(localStorage.getItem("compareTools")||"[]");if(t.length>=4){d("You can compare up to 4 tools at a time","error");return}t.find(s=>s.id===a)?d("This tool is already in your comparison list","error"):(t.push({id:a,name:r}),localStorage.setItem("compareTools",JSON.stringify(t)),d(`${r} added to comparison. Go to Compare page to view.`,"success"))};x()&&document.getElementById("recommend-form")?.addEventListener("submit",f);
