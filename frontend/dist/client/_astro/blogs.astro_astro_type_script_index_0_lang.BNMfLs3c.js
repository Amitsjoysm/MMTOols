import{s as u}from"./api.ChDfilu5.js";import{r as h}from"./auth.DepAfbYU.js";h();let a=0;const g=20;let b=[],c=null;async function B(){await E(),await s(),v()}async function E(){try{b=await u.users.getAll({limit:1e3});const e=document.getElementById("author-filter"),t=document.getElementById("blog-author");b.forEach(n=>{const d=document.createElement("option");d.value=n.id,d.textContent=n.full_name||n.username,e.appendChild(d);const r=document.createElement("option");r.value=n.id,r.textContent=n.full_name||n.username,t.appendChild(r)});const l=getCurrentUser();l&&(document.getElementById("blog-author").value=l.id)}catch(e){console.error("Error loading authors:",e)}}async function s(){const e=document.getElementById("loading"),t=document.getElementById("blogs-table-container"),l=document.getElementById("blogs-tbody");e.classList.remove("hidden"),t.classList.add("hidden");try{const n=document.getElementById("search-input").value,d=document.getElementById("status-filter").value,r=document.getElementById("author-filter").value,i={skip:a,limit:g};n&&(i.search=n),d&&(i.status=d),r&&(i.author_id=r);const y=await u.blogs.getAll(i);l.innerHTML=y.map(o=>`
        <tr data-testid="blog-row-${o.id}">
          <td class="px-6 py-4">
            <div class="font-medium text-gray-900 dark:text-white">${o.title}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">${o.slug}</div>
          </td>
          <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
            ${o.author_name||"Unknown"}
          </td>
          <td class="px-6 py-4">
            <span class="px-3 py-1 rounded-full text-xs font-medium ${o.status==="published"?"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":o.status==="draft"?"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200":"bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"}">
              ${o.status}
            </span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
            <div>${o.view_count} views</div>
            <div>${o.like_count} likes</div>
          </td>
          <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
            ${new Date(o.created_at).toLocaleDateString()}
          </td>
          <td class="px-6 py-4 text-right space-x-2">
            <button onclick="window.editBlog('${o.id}')" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" data-testid="edit-blog-${o.id}">
              Edit
            </button>
            ${o.status!=="published"?`
              <button onclick="window.publishBlog('${o.id}')" class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                Publish
              </button>
            `:`
              <button onclick="window.unpublishBlog('${o.id}')" class="text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300">
                Unpublish
              </button>
            `}
            <button onclick="window.deleteBlog('${o.id}', '${o.title.replace(/'/g,"\\'")}')" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" data-testid="delete-blog-${o.id}">
              Delete
            </button>
          </td>
        </tr>
      `).join(""),e.classList.add("hidden"),t.classList.remove("hidden"),document.getElementById("pagination").classList.remove("hidden"),f(y.length)}catch(n){console.error("Error loading blogs:",n),e.classList.add("hidden")}}function f(e){const t=document.getElementById("page-info"),l=a+1,n=a+e;t.textContent=`${l}-${n}`;const d=document.getElementById("prev-btn"),r=document.getElementById("next-btn");d.disabled=a===0,r.disabled=e<g}function v(){let e;document.getElementById("search-input").addEventListener("input",()=>{clearTimeout(e),e=setTimeout(()=>{a=0,s()},500)}),document.getElementById("status-filter").addEventListener("change",()=>{a=0,s()}),document.getElementById("author-filter").addEventListener("change",()=>{a=0,s()}),document.getElementById("reset-filters-btn").addEventListener("click",()=>{document.getElementById("search-input").value="",document.getElementById("status-filter").value="",document.getElementById("author-filter").value="",a=0,s()}),document.getElementById("prev-btn").addEventListener("click",()=>{a>0&&(a-=g,s())}),document.getElementById("next-btn").addEventListener("click",()=>{a+=g,s()}),document.getElementById("create-blog-btn").addEventListener("click",()=>{p()}),document.getElementById("close-modal").addEventListener("click",m),document.getElementById("cancel-btn").addEventListener("click",m),document.getElementById("blog-form").addEventListener("submit",x)}function p(e){const t=document.getElementById("blog-modal"),l=document.getElementById("modal-title");if(document.getElementById("blog-form").reset(),c=e?.id||null,l.textContent=e?"Edit Blog":"Add New Blog",e)document.getElementById("blog-id").value=e.id,document.getElementById("blog-title").value=e.title,document.getElementById("blog-excerpt").value=e.excerpt||"",document.getElementById("blog-content").value=e.content,document.getElementById("blog-author").value=e.author_id,document.getElementById("blog-status").value=e.status,document.getElementById("blog-image").value=e.featured_image||"",document.getElementById("blog-tags").value=e.tags?.join(", ")||"";else{const d=getCurrentUser();d&&(document.getElementById("blog-author").value=d.id)}t.classList.remove("hidden")}function m(){document.getElementById("blog-modal").classList.add("hidden"),c=null}async function x(e){e.preventDefault();const t=e.target.querySelector('button[type="submit"]'),l=t.textContent;t.disabled=!0,t.textContent="Saving...";try{const n=document.getElementById("blog-tags").value,d=n?n.split(",").map(i=>i.trim()).filter(i=>i):[],r={title:document.getElementById("blog-title").value,excerpt:document.getElementById("blog-excerpt").value,content:document.getElementById("blog-content").value,author_id:document.getElementById("blog-author").value,status:document.getElementById("blog-status").value,featured_image:document.getElementById("blog-image").value,tags:d};c?await u.blogs.update(c,r):await u.blogs.create(r),m(),s(),alert(c?"Blog updated successfully!":"Blog created successfully!")}catch(n){console.error("Error saving blog:",n),alert("Failed to save blog: "+(n.message||"Unknown error"))}finally{t.disabled=!1,t.textContent=l}}window.editBlog=async function(e){try{const l=(await u.blogs.getAll({skip:0,limit:1e3})).find(n=>n.id===e);l&&p(l)}catch(t){console.error("Error loading blog:",t)}};window.publishBlog=async function(e){if(confirm("Are you sure you want to publish this blog?"))try{await u.blogs.publish(e),alert("Blog published successfully!"),s()}catch(t){console.error("Error publishing blog:",t),alert("Failed to publish blog: "+(t.message||"Unknown error"))}};window.unpublishBlog=async function(e){if(confirm("Are you sure you want to unpublish this blog?"))try{await u.blogs.unpublish(e),alert("Blog unpublished successfully!"),s()}catch(t){console.error("Error unpublishing blog:",t),alert("Failed to unpublish blog: "+(t.message||"Unknown error"))}};window.deleteBlog=async function(e,t){if(confirm(`Are you sure you want to delete "${t}"? This action cannot be undone.`))try{await u.blogs.delete(e),alert("Blog deleted successfully!"),s()}catch(l){console.error("Error deleting blog:",l),alert("Failed to delete blog: "+(l.message||"Unknown error"))}};B();
