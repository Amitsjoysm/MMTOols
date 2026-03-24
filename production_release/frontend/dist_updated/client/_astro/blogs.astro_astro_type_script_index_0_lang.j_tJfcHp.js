const i="https://marketmindai.com";let a="all",r=[],d=[];function c(){return localStorage.getItem("token")||localStorage.getItem("auth_token")}async function u(){const t=c();if(!t){window.location.href="/auth/login";return}m();try{const[e,s]=await Promise.all([fetch(`${i}/api/user/blogs`,{headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"}}),fetch(`${i}/api/user/bookmarks`,{headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"}})]);if(e.status===401){window.location.href="/auth/login";return}if(!e.ok)throw new Error("Failed to fetch blogs");r=await e.json(),d=s.ok?await s.json():[],h(),g()}catch(e){p(e.message)}}function h(){const t=r.length,e=r.filter(o=>o.status==="draft").length,s=r.filter(o=>o.status==="published").length;document.getElementById("all-count").textContent=String(t),document.getElementById("draft-count").textContent=String(e),document.getElementById("published-count").textContent=String(s),document.getElementById("bookmark-count").textContent=String(d.length)}function g(){const t=document.getElementById("blogs-container"),e=document.getElementById("empty-state");document.getElementById("loading").classList.add("hidden");let o=[];if(a==="bookmarks"?o=d:a==="all"?o=r:o=r.filter(n=>n.status===a),o.length===0){t.classList.add("hidden"),e.classList.remove("hidden");return}e.classList.add("hidden"),t.classList.remove("hidden"),t.innerHTML=o.map(n=>`
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition" data-testid="blog-card">
          <div class="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            ${n.featured_image?`
              <img src="${n.featured_image}" alt="${n.title}" class="w-full h-full object-cover" />
            `:`
              <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            `}
          </div>
          <div class="p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${n.status==="published"?"bg-green-100 text-green-800":"bg-gray-100 text-gray-800"}">
                ${n.status==="published"?"✓ Published":"📝 Draft"}
              </span>
              ${n.seo_title?`
                <span class="text-xs text-green-600 dark:text-green-400" title="SEO Optimized">
                  ✓ SEO
                </span>
              `:""}
            </div>
            
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
              ${n.title}
            </h3>
            
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              ${n.excerpt||n.content?.substring(0,120)+"..."||"No description"}
            </p>

            <div class="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              ${new Date(n.created_at).toLocaleDateString()}
              ${n.published_at?`
                <span class="ml-3">Published: ${new Date(n.published_at).toLocaleDateString()}</span>
              `:""}
            </div>

            <div class="flex gap-2">
              <a
                href="/user/blogs/edit/${n.id}"
                class="flex-1 text-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                data-testid="edit-blog-btn"
              >
                Edit
              </a>
              ${n.status==="draft"?`
                <button
                  onclick="publishBlog('${n.id}')"
                  class="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                  data-testid="publish-blog-btn"
                >
                  Publish
                </button>
              `:`
                <a
                  href="/blogs/${n.slug}"
                  class="flex-1 text-center px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition"
                  data-testid="view-blog-btn"
                >
                  View
                </a>
              `}
              <button
                onclick="deleteBlog('${n.id}')"
                class="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
                data-testid="delete-blog-btn"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      `).join("")}function l(t,e="success"){const s=document.createElement("div");s.className=`fixed bottom-4 right-4 z-50 px-5 py-3 rounded-lg text-white text-sm font-medium shadow-lg ${e==="success"?"bg-green-600":"bg-red-600"}`,s.textContent=t,document.body.appendChild(s),setTimeout(()=>s.remove(),3500)}window.publishBlog=async function(t){if(!confirm("Are you sure you want to publish this blog? It will be visible to everyone and SEO will be automatically optimized."))return;const e=c();try{if(!(await fetch(`${i}/api/user/blogs/${t}/publish`,{method:"POST",headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"}})).ok)throw new Error("Failed to publish blog");l("Blog published successfully with SEO optimization!","success"),u()}catch(s){l("Error: "+s.message,"error")}};window.deleteBlog=async function(t){if(!confirm("Are you sure you want to delete this blog? This action cannot be undone."))return;const e=c();try{if(!(await fetch(`${i}/api/user/blogs/${t}`,{method:"DELETE",headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"}})).ok)throw new Error("Failed to delete blog");l("Blog deleted successfully!","success"),u()}catch(s){l("Error: "+s.message,"error")}};document.querySelectorAll(".filter-tab").forEach(t=>{t.addEventListener("click",e=>{document.querySelectorAll(".filter-tab").forEach(s=>{s.classList.remove("border-blue-600","text-blue-600","active"),s.classList.add("border-transparent")}),e.target.classList.add("border-blue-600","text-blue-600","active"),e.target.classList.remove("border-transparent"),a=e.target.dataset.filter,g()})});function m(){document.getElementById("loading").classList.remove("hidden"),document.getElementById("blogs-container").classList.add("hidden"),document.getElementById("empty-state").classList.add("hidden"),document.getElementById("error").classList.add("hidden")}function p(t){document.getElementById("loading").classList.add("hidden"),document.getElementById("error").classList.remove("hidden"),document.getElementById("error-message").textContent=t}u();
