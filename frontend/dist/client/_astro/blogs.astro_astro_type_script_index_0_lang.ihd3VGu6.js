const i="http://localhost:8001";let r="all",a=[];function l(){return localStorage.getItem("token")||localStorage.getItem("auth_token")}async function d(){const n=l();if(!n){window.location.href="/auth/login";return}g();try{const t=await fetch(`${i}/api/user/blogs`,{headers:{Authorization:`Bearer ${n}`,"Content-Type":"application/json"}});if(t.status===401){window.location.href="/auth/login";return}if(!t.ok)throw new Error("Failed to fetch blogs");a=await t.json(),u(),c()}catch(t){h(t.message)}}function u(){const n=a.length,t=a.filter(o=>o.status==="draft").length,s=a.filter(o=>o.status==="published").length;document.getElementById("all-count").textContent=n,document.getElementById("draft-count").textContent=t,document.getElementById("published-count").textContent=s}function c(){const n=document.getElementById("blogs-container"),t=document.getElementById("empty-state");document.getElementById("loading").classList.add("hidden");let o=a;if(r!=="all"&&(o=a.filter(e=>e.status===r)),o.length===0){n.classList.add("hidden"),t.classList.remove("hidden");return}t.classList.add("hidden"),n.classList.remove("hidden"),n.innerHTML=o.map(e=>`
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition" data-testid="blog-card">
          <div class="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            ${e.featured_image?`
              <img src="${e.featured_image}" alt="${e.title}" class="w-full h-full object-cover" />
            `:`
              <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            `}
          </div>
          <div class="p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${e.status==="published"?"bg-green-100 text-green-800":"bg-gray-100 text-gray-800"}">
                ${e.status==="published"?"✓ Published":"📝 Draft"}
              </span>
              ${e.seo_title?`
                <span class="text-xs text-green-600 dark:text-green-400" title="SEO Optimized">
                  ✓ SEO
                </span>
              `:""}
            </div>
            
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
              ${e.title}
            </h3>
            
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              ${e.excerpt||e.content?.substring(0,120)+"..."||"No description"}
            </p>

            <div class="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              ${new Date(e.created_at).toLocaleDateString()}
              ${e.published_at?`
                <span class="ml-3">Published: ${new Date(e.published_at).toLocaleDateString()}</span>
              `:""}
            </div>

            <div class="flex gap-2">
              <a
                href="/user/blogs/edit/${e.id}"
                class="flex-1 text-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                data-testid="edit-blog-btn"
              >
                Edit
              </a>
              ${e.status==="draft"?`
                <button
                  onclick="publishBlog('${e.id}')"
                  class="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                  data-testid="publish-blog-btn"
                >
                  Publish
                </button>
              `:`
                <a
                  href="/blogs/${e.slug}"
                  class="flex-1 text-center px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition"
                  data-testid="view-blog-btn"
                >
                  View
                </a>
              `}
              <button
                onclick="deleteBlog('${e.id}')"
                class="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
                data-testid="delete-blog-btn"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      `).join("")}window.publishBlog=async function(n){if(!confirm("Are you sure you want to publish this blog? It will be visible to everyone and SEO will be automatically optimized."))return;const t=l();try{const s=await fetch(`${i}/api/user/blogs/${n}/publish`,{method:"POST",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"}});if(!s.ok)throw new Error("Failed to publish blog");const o=await s.json();alert(`Blog published successfully with automatic SEO optimization!

✓ SEO Title: `+o.blog.seo_title+`
✓ SEO Description: Generated
✓ JSON-LD Schema: Added`),d()}catch(s){alert("Error: "+s.message)}};window.deleteBlog=async function(n){if(!confirm("Are you sure you want to delete this blog? This action cannot be undone."))return;const t=l();try{if(!(await fetch(`${i}/api/user/blogs/${n}`,{method:"DELETE",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"}})).ok)throw new Error("Failed to delete blog");alert("Blog deleted successfully!"),d()}catch(s){alert("Error: "+s.message)}};document.querySelectorAll(".filter-tab").forEach(n=>{n.addEventListener("click",t=>{document.querySelectorAll(".filter-tab").forEach(s=>{s.classList.remove("border-blue-600","text-blue-600","active"),s.classList.add("border-transparent")}),t.target.classList.add("border-blue-600","text-blue-600","active"),t.target.classList.remove("border-transparent"),r=t.target.dataset.filter,c()})});function g(){document.getElementById("loading").classList.remove("hidden"),document.getElementById("blogs-container").classList.add("hidden"),document.getElementById("empty-state").classList.add("hidden"),document.getElementById("error").classList.add("hidden")}function h(n){document.getElementById("loading").classList.add("hidden"),document.getElementById("error").classList.remove("hidden"),document.getElementById("error-message").textContent=n}d();
