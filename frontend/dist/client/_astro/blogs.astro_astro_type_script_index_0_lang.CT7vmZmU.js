function u(){if(typeof window<"u"){const e=window.location.origin;if(e.includes("preview.app.github.dev")||e.includes("github.dev")||e.includes("preview.emergentagent.com"))return e.replace(":3000",":8001").replace("3000-","8001-")}return"http://localhost:8001"}const i=u();let a="all",o=[];function l(){return localStorage.getItem("token")||localStorage.getItem("auth_token")}async function d(){const e=l();if(!e){window.location.href="/auth/login";return}h();try{const n=await fetch(`${i}/api/user/blogs`,{headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"}});if(n.status===401){window.location.href="/auth/login";return}if(!n.ok)throw new Error("Failed to fetch blogs");o=await n.json(),g(),c()}catch(n){m(n.message)}}function g(){const e=o.length,n=o.filter(r=>r.status==="draft").length,s=o.filter(r=>r.status==="published").length;document.getElementById("all-count").textContent=e,document.getElementById("draft-count").textContent=n,document.getElementById("published-count").textContent=s}function c(){const e=document.getElementById("blogs-container"),n=document.getElementById("empty-state");document.getElementById("loading").classList.add("hidden");let r=o;if(a!=="all"&&(r=o.filter(t=>t.status===a)),r.length===0){e.classList.add("hidden"),n.classList.remove("hidden");return}n.classList.add("hidden"),e.classList.remove("hidden"),e.innerHTML=r.map(t=>`
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition" data-testid="blog-card">
          <div class="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            ${t.featured_image?`
              <img src="${t.featured_image}" alt="${t.title}" class="w-full h-full object-cover" />
            `:`
              <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            `}
          </div>
          <div class="p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${t.status==="published"?"bg-green-100 text-green-800":"bg-gray-100 text-gray-800"}">
                ${t.status==="published"?"✓ Published":"📝 Draft"}
              </span>
              ${t.seo_title?`
                <span class="text-xs text-green-600 dark:text-green-400" title="SEO Optimized">
                  ✓ SEO
                </span>
              `:""}
            </div>
            
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
              ${t.title}
            </h3>
            
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              ${t.excerpt||t.content?.substring(0,120)+"..."||"No description"}
            </p>

            <div class="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              ${new Date(t.created_at).toLocaleDateString()}
              ${t.published_at?`
                <span class="ml-3">Published: ${new Date(t.published_at).toLocaleDateString()}</span>
              `:""}
            </div>

            <div class="flex gap-2">
              <a
                href="/user/blogs/edit/${t.id}"
                class="flex-1 text-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                data-testid="edit-blog-btn"
              >
                Edit
              </a>
              ${t.status==="draft"?`
                <button
                  onclick="publishBlog('${t.id}')"
                  class="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                  data-testid="publish-blog-btn"
                >
                  Publish
                </button>
              `:`
                <a
                  href="/blogs/${t.slug}"
                  class="flex-1 text-center px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition"
                  data-testid="view-blog-btn"
                >
                  View
                </a>
              `}
              <button
                onclick="deleteBlog('${t.id}')"
                class="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
                data-testid="delete-blog-btn"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      `).join("")}window.publishBlog=async function(e){if(!confirm("Are you sure you want to publish this blog? It will be visible to everyone and SEO will be automatically optimized."))return;const n=l();try{const s=await fetch(`${i}/api/user/blogs/${e}/publish`,{method:"POST",headers:{Authorization:`Bearer ${n}`,"Content-Type":"application/json"}});if(!s.ok)throw new Error("Failed to publish blog");const r=await s.json();alert(`Blog published successfully with automatic SEO optimization!

✓ SEO Title: `+r.blog.seo_title+`
✓ SEO Description: Generated
✓ JSON-LD Schema: Added`),d()}catch(s){alert("Error: "+s.message)}};window.deleteBlog=async function(e){if(!confirm("Are you sure you want to delete this blog? This action cannot be undone."))return;const n=l();try{if(!(await fetch(`${i}/api/user/blogs/${e}`,{method:"DELETE",headers:{Authorization:`Bearer ${n}`,"Content-Type":"application/json"}})).ok)throw new Error("Failed to delete blog");alert("Blog deleted successfully!"),d()}catch(s){alert("Error: "+s.message)}};document.querySelectorAll(".filter-tab").forEach(e=>{e.addEventListener("click",n=>{document.querySelectorAll(".filter-tab").forEach(s=>{s.classList.remove("border-blue-600","text-blue-600","active"),s.classList.add("border-transparent")}),n.target.classList.add("border-blue-600","text-blue-600","active"),n.target.classList.remove("border-transparent"),a=n.target.dataset.filter,c()})});function h(){document.getElementById("loading").classList.remove("hidden"),document.getElementById("blogs-container").classList.add("hidden"),document.getElementById("empty-state").classList.add("hidden"),document.getElementById("error").classList.add("hidden")}function m(e){document.getElementById("loading").classList.add("hidden"),document.getElementById("error").classList.remove("hidden"),document.getElementById("error-message").textContent=e}d();
