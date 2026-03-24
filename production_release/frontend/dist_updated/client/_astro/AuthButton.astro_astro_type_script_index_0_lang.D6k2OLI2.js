function i(){const t=localStorage.getItem("token")||localStorage.getItem("auth_token"),e=localStorage.getItem("user_data");if(!t||!e)return null;try{return JSON.parse(e)}catch{return null}}function s(t){const e=document.querySelector('nav[aria-label="Main navigation"] ul');if(!e||document.querySelector("[data-user-nav]"))return;if(t.role==="user"){const r=document.createElement("li");r.setAttribute("data-user-nav","true"),r.className="dropdown",r.innerHTML=`
        <button
          type="button"
          class="hover:text-link dark:hover:text-white px-4 py-3 flex items-center whitespace-nowrap text-blue-600 dark:text-blue-400 font-semibold"
          data-testid="my-account-dropdown"
        >
          My Account
          <svg class="w-3.5 h-3.5 ml-0.5 hidden md:inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <ul class="dropdown-menu md:backdrop-blur-md dark:md:bg-dark rounded md:absolute pl-4 md:pl-0 md:hidden font-medium md:bg-white/90 md:min-w-[200px] drop-shadow-xl">
          <li>
            <a
              class="first:rounded-t last:rounded-b md:hover:bg-gray-100 hover:text-link dark:hover:text-white dark:hover:bg-gray-700 py-2 px-5 block whitespace-no-wrap"
              href="/user/dashboard"
              data-testid="nav-my-dashboard"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              class="first:rounded-t last:rounded-b md:hover:bg-gray-100 hover:text-link dark:hover:text-white dark:hover:bg-gray-700 py-2 px-5 block whitespace-no-wrap"
              href="/user/blogs"
              data-testid="nav-my-blogs"
            >
              My Blogs
            </a>
          </li>
          <li>
            <a
              class="first:rounded-t last:rounded-b md:hover:bg-gray-100 hover:text-link dark:hover:text-white dark:hover:bg-gray-700 py-2 px-5 block whitespace-no-wrap"
              href="/user/blogs/create"
              data-testid="nav-create-blog"
            >
              Create Blog
            </a>
          </li>
          <li>
            <a
              class="first:rounded-t last:rounded-b md:hover:bg-gray-100 hover:text-link dark:hover:text-white dark:hover:bg-gray-700 py-2 px-5 block whitespace-no-wrap"
              href="/user/claimed-tools"
              data-testid="nav-claimed-tools"
            >
              Claimed Tools
            </a>
          </li>
          <li>
            <button
              onclick="window.logoutUser()"
              class="w-full text-left first:rounded-t last:rounded-b md:hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-700 py-2 px-5 block whitespace-no-wrap text-red-500"
              data-testid="nav-logout"
            >
              Logout
            </button>
          </li>
        </ul>
      `;const a=Array.from(e.children).find(l=>l.querySelector("a")?.getAttribute("href")?.includes("/contact"));a?e.insertBefore(r,a):e.appendChild(r)}}function u(){document.addEventListener("click",t=>{t.target.closest('a[href*="/tools/compare"]')&&(localStorage.getItem("token")||localStorage.getItem("auth_token")||(t.preventDefault(),confirm("Login required to compare tools. Would you like to login now?")&&(window.location.href="/auth/login?redirect=/tools/compare")))})}window.logoutUser=function(){confirm("Are you sure you want to logout?")&&(localStorage.removeItem("token"),localStorage.removeItem("auth_token"),localStorage.removeItem("user_data"),window.location.href="/")};function d(){const t=i(),e=document.querySelector('[id="auth-button"]')||document.querySelector('a[href="/auth/login"]');if(e)if(t){const o=t.role;o==="user"?(s(t),e.textContent="Dashboard",e.setAttribute("href","/user/dashboard")):(o==="superadmin"||o==="admin")&&(e.textContent="Admin Panel",e.setAttribute("href","/admin"))}else e.textContent="Login",e.setAttribute("href","/auth/login")}function n(){d(),u()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",n):n();window.addEventListener("pageshow",d);
