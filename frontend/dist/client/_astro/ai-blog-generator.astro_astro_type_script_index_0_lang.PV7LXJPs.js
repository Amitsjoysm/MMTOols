import{i as u}from"./auth.DepAfbYU.js";import{b as c,u as p}from"./api.ChDfilu5.js";u()||(window.location.href="/auth/login?redirect=/ai-blog-generator");let g=null;async function m(){const o=document.getElementById("topics-list");try{const t=await c.getBlogTopics();t.suggested_topics&&t.suggested_topics.length>0?(o.innerHTML=t.suggested_topics.map(n=>`
          <button 
            class="topic-suggestion w-full text-left px-4 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors text-gray-700 dark:text-gray-300"
            data-topic="${n}"
          >
            ${n}
          </button>
        `).join(""),document.querySelectorAll(".topic-suggestion").forEach(n=>{n.addEventListener("click",a=>{const r=a.target.dataset.topic;r&&(document.getElementById("topic").value=r)})})):o.innerHTML='<p class="text-gray-600 dark:text-gray-400">No suggestions available</p>'}catch(t){console.error("Error loading topics:",t),o.innerHTML='<p class="text-gray-600 dark:text-gray-400">Failed to load suggestions</p>'}}const i=document.getElementById("generate-blog-form"),s=document.getElementById("form-message"),d=document.getElementById("generated-blog"),y=document.getElementById("blog-content");i.addEventListener("submit",async o=>{o.preventDefault();const t=i.querySelector('button[type="submit"]'),n=document.getElementById("topic").value,a=document.getElementById("keywords").value,r=document.getElementById("length").value;t.disabled=!0,t.textContent="Generating... This may take a minute",s.classList.add("hidden"),d.classList.add("hidden");try{const e=await c.generateBlog({topic:n,keywords:a.split(",").map(l=>l.trim()).filter(l=>l),target_length:r,auto_publish:!1});g={title:e.title,content:e.content,excerpt:e.excerpt,tags:e.tags||[],seo_title:e.seo_title,seo_description:e.seo_description,seo_keywords:e.seo_keywords},y.innerHTML=`
        <h1 class="text-3xl font-bold mb-4">${e.title}</h1>
        <div class="text-gray-600 dark:text-gray-400 mb-6">
          <p><strong>Excerpt:</strong> ${e.excerpt}</p>
          ${e.seo_keywords?`<p><strong>Keywords:</strong> ${e.seo_keywords}</p>`:""}
          ${e.tags&&e.tags.length>0?`<p><strong>Tags:</strong> ${e.tags.join(", ")}</p>`:""}
        </div>
        <div class="blog-content">
          ${e.content}
        </div>
      `,d.classList.remove("hidden"),s.className="p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg",s.textContent="Blog post generated successfully!",s.classList.remove("hidden")}catch(e){console.error("Error generating blog:",e),s.className="p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg",s.textContent=e.message||"Failed to generate blog post. Please try again.",s.classList.remove("hidden")}finally{t.disabled=!1,t.textContent="Generate Blog Post"}});const b=document.getElementById("save-blog-btn");b?.addEventListener("click",async()=>{if(g)try{await p.createBlog(g),alert("Blog saved to drafts!"),window.location.href="/user/dashboard"}catch(o){console.error("Error saving blog:",o),alert("Failed to save blog. Please try again.")}});m();
