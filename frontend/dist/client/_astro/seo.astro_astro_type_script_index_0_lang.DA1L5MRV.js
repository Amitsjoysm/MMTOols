import{s as d}from"./api.ChDfilu5.js";import{r as o}from"./auth.DepAfbYU.js";o();let r=[];async function n(){await i(),x()}async function i(){try{const e=await d.seo.getOverview(),s=document.getElementById("seo-overview");s.innerHTML=`
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6" data-testid="seo-health-score">
          <div class="text-3xl font-bold ${e.overview.seo_health_score>=80?"text-green-600 dark:text-green-400":e.overview.seo_health_score>=60?"text-yellow-600 dark:text-yellow-400":"text-red-600 dark:text-red-400"}">
            ${e.overview.seo_health_score.toFixed(1)}%
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">SEO Health Score</div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">${e.overview.seo_optimized}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">Pages Optimized</div>
          <div class="text-xs text-gray-500 mt-1">of ${e.overview.total_pages} total</div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">${e.tools.with_seo}/${e.tools.total}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">Tools with SEO</div>
          <div class="text-xs text-gray-500 mt-1">${e.tools.completion_rate}% complete</div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="text-3xl font-bold text-green-600 dark:text-green-400">${e.blogs.with_seo}/${e.blogs.total}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">Blogs with SEO</div>
          <div class="text-xs text-gray-500 mt-1">${e.blogs.completion_rate}% complete</div>
        </div>
      `}catch(e){console.error("Error loading SEO overview:",e)}}async function g(){const e=document.getElementById("loading");e.classList.remove("hidden");try{await d.seo.generateJsonLd("all",1e3),alert("JSON-LD generated successfully for all content!"),await i()}catch(s){console.error("Error generating JSON-LD:",s),alert("Failed to generate JSON-LD: "+(s.message||"Unknown error"))}finally{e.classList.add("hidden")}}async function c(){const e=document.getElementById("loading"),s=document.getElementById("seo-issues-section");e.classList.remove("hidden");try{const t=await d.seo.getIssues();r=t.issues||[];const a=document.getElementById("issues-summary");a.innerHTML=`
        <div class="p-3 bg-red-50 dark:bg-red-900/20 rounded">
          <div class="text-2xl font-bold text-red-600 dark:text-red-400">${t.summary.critical||0}</div>
          <div class="text-xs text-gray-600 dark:text-gray-400">Critical</div>
        </div>
        <div class="p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
          <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">${t.summary.high||0}</div>
          <div class="text-xs text-gray-600 dark:text-gray-400">High</div>
        </div>
        <div class="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
          <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">${t.summary.medium||0}</div>
          <div class="text-xs text-gray-600 dark:text-gray-400">Medium</div>
        </div>
        <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">${t.summary.low||0}</div>
          <div class="text-xs text-gray-600 dark:text-gray-400">Low</div>
        </div>
      `,l(r),s.classList.remove("hidden")}catch(t){console.error("Error analyzing SEO issues:",t),alert("Failed to analyze SEO issues: "+(t.message||"Unknown error"))}finally{e.classList.add("hidden")}}function l(e){const s=document.getElementById("issues-list");if(e.length===0){s.innerHTML='<p class="text-center text-gray-500 dark:text-gray-400 py-8">No issues found! Your SEO is in great shape.</p>';return}s.innerHTML=e.map(t=>`
      <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-2">
              <h4 class="font-bold text-gray-900 dark:text-white">${t.title}</h4>
              <span class="px-2 py-1 rounded text-xs font-medium ${t.severity==="critical"?"bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200":t.severity==="high"?"bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200":t.severity==="medium"?"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200":"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"}">
                ${t.severity}
              </span>
              <span class="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                ${t.page_type}
              </span>
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">${t.page_path}</div>
          </div>
        </div>
        
        <div class="mb-3">
          <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issues:</div>
          <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
            ${t.issues.map(a=>`<li>${a}</li>`).join("")}
          </ul>
        </div>
        
        <div>
          <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recommendations:</div>
          <ul class="list-disc list-inside text-sm text-green-600 dark:text-green-400">
            ${t.recommendations.map(a=>`<li>${a}</li>`).join("")}
          </ul>
        </div>
      </div>
    `).join("")}function x(){document.getElementById("generate-json-ld-btn").addEventListener("click",g),document.getElementById("analyze-issues-btn").addEventListener("click",c),document.getElementById("severity-filter").addEventListener("change",e=>{const s=e.target.value,t=s?r.filter(a=>a.severity===s):r;l(t)})}n();
