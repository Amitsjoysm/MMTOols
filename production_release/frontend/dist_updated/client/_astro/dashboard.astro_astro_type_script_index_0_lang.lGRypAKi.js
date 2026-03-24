import{b as u,u as l}from"./api.9IHSeoxB.js";let m=null,e=null;async function g(){const s=document.getElementById("loading"),t=document.getElementById("not-logged-in"),d=document.getElementById("dashboard-content");try{if(!localStorage.getItem("auth_token")){s.classList.add("hidden"),t.classList.remove("hidden");return}m=await u.getCurrentUser(),e=await l.getDashboard(),i(),s.classList.add("hidden"),d.classList.remove("hidden"),y()}catch(a){console.error("Error loading dashboard:",a),s.classList.add("hidden"),t.classList.remove("hidden"),localStorage.removeItem("auth_token")}}function i(){const s=document.getElementById("user-avatar"),t=document.getElementById("user-name"),d=document.getElementById("user-email"),a=document.getElementById("user-bio"),o=(e.user.full_name||e.user.username).split(" ").map(n=>n[0]).join("").toUpperCase().substring(0,2);s.textContent=o,t.textContent=e.user.full_name||e.user.username,d.textContent=e.user.email,a.textContent=e.user.bio||"No bio added yet.",document.getElementById("stat-blogs").textContent=e.stats.total_blogs,document.getElementById("stat-published").textContent=e.stats.published_blogs,document.getElementById("stat-reviews").textContent=e.stats.total_reviews,document.getElementById("stat-favorites").textContent=e.stats.favorite_tools;const r=document.getElementById("recent-blogs");e.recent_blogs&&e.recent_blogs.length>0?r.innerHTML=e.recent_blogs.map(n=>`
        <div class="border-b border-gray-200 dark:border-gray-700 last:border-0 py-4">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="font-medium text-gray-900 dark:text-white mb-1">${n.title}</h3>
              <div class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span class="px-2 py-1 rounded-full text-xs font-medium ${n.status==="published"?"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"}">
                  ${n.status}
                </span>
                <span>${n.view_count} views</span>
                <span>${new Date(n.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
            <a href="/user/blogs/${n.id}/edit" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm">
              Edit
            </a>
          </div>
        </div>
      `).join(""):r.innerHTML='<p class="text-gray-500 dark:text-gray-400 text-center py-8">No blogs yet. Create your first blog!</p>'}function y(){const s=document.getElementById("edit-profile-btn"),t=document.getElementById("edit-profile-modal"),d=document.getElementById("cancel-edit-btn"),a=document.getElementById("edit-profile-form");s.addEventListener("click",()=>{document.getElementById("edit-full-name").value=e.user.full_name||"",document.getElementById("edit-bio").value=e.user.bio||"",t.classList.remove("hidden")}),d.addEventListener("click",()=>{t.classList.add("hidden")}),a.addEventListener("submit",async o=>{o.preventDefault();const r=document.getElementById("edit-full-name").value,n=document.getElementById("edit-bio").value;try{await l.updateProfile({full_name:r,bio:n}),e=await l.getDashboard(),i(),t.classList.add("hidden"),alert("Profile updated successfully!")}catch(c){console.error("Error updating profile:",c),alert("Failed to update profile. Please try again.")}}),t.addEventListener("click",o=>{o.target===t&&t.classList.add("hidden")})}g();
