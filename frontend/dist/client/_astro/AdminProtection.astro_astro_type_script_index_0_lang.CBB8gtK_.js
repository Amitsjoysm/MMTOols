async function p(){const n=document.getElementById("admin-protection-overlay"),i=localStorage.getItem("token")||localStorage.getItem("auth_token");if(!i){console.warn("No authentication token found"),window.location.replace("/admin/login?redirect="+encodeURIComponent(window.location.pathname));return}function m(){const e="https://superadmin-boost-1.preview.emergentagent.com";return console.log("Using PUBLIC_API_URL from environment:",e),e}const a=m();console.log("API URL for admin verification:",a);const c=3,l=1e3;async function d(e=1){try{console.log(`Auth verification attempt ${e}/${c}`);const o=new AbortController,s=setTimeout(()=>o.abort(),1e4),t=await fetch(`${a}/api/auth/me`,{method:"GET",headers:{Authorization:`Bearer ${i}`,"Content-Type":"application/json",Accept:"application/json"},signal:o.signal,credentials:"include"});if(clearTimeout(s),t.status===401){console.error("Authentication failed: Invalid or expired token"),localStorage.removeItem("token"),localStorage.removeItem("auth_token"),localStorage.removeItem("user_data"),window.location.replace("/admin/login?error=session_expired");return}if(t.status===403){console.error("Access denied: Insufficient permissions");const h=await t.json().catch(()=>null);u(h);return}if(t.status===500||t.status===502||t.status===503)throw new Error(`Server error: ${t.status}`);if(!t.ok)throw new Error(`HTTP error ${t.status}`);const r=await t.json();if(console.log("User authenticated:",r.email,"Role:",r.role),!r||!r.role||!r.email)throw new Error("Invalid user data received from server");if(r.role!=="admin"&&r.role!=="superadmin"){console.error("Access denied: User role is",r.role),u(r);return}if(r.is_active===!1){console.error("Access denied: User account is inactive"),localStorage.removeItem("token"),localStorage.removeItem("auth_token"),localStorage.removeItem("user_data"),window.location.replace("/admin/login?error=account_inactive");return}localStorage.setItem("user_data",JSON.stringify(r)),console.log("Admin access granted successfully"),n&&(n.style.opacity="0",n.style.transition="opacity 0.3s ease-out",setTimeout(()=>n.remove(),300))}catch(o){if(console.error(`Admin validation error (attempt ${e}):`,o),e<c&&(o.name==="AbortError"||o.message.includes("Server error")||o.message.includes("NetworkError")||o.message.includes("Failed to fetch")))return console.log(`Retrying in ${l}ms...`),await new Promise(s=>setTimeout(s,l)),d(e+1);g(o,e)}}function u(e){n.innerHTML=`
        <div class="text-center text-white p-8 max-w-md">
          <svg class="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 class="text-2xl font-bold mb-2">Access Denied</h2>
          <p class="mb-6">You don't have permission to access the admin area.</p>
          <p class="text-sm text-gray-400 mb-6">${e&&e.role?`Your role: ${e.role}`:"Admin or SuperAdmin role required"}</p>
          <div class="space-y-3">
            <a href="/" class="block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Go to Home</a>
            <button onclick="localStorage.clear(); window.location.href='/auth/login';" class="block w-full px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">Sign Out</button>
          </div>
        </div>
      `}function g(e,o){const s=e.name==="AbortError",t=e.message.includes("Failed to fetch")||e.message.includes("NetworkError");n.innerHTML=`
        <div class="text-center text-white p-8 max-w-md">
          <svg class="w-16 h-16 mx-auto mb-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 class="text-2xl font-bold mb-2">${s?"Request Timeout":"Connection Error"}</h2>
          <p class="mb-4">Unable to verify your access${o>1?` after ${o} attempts`:""}.</p>
          <p class="text-sm text-gray-400 mb-6">
            ${s?"The server is taking too long to respond.":t?"Please check your internet connection.":"There was an error communicating with the server."}
          </p>
          <div class="space-y-3">
            <button onclick="window.location.reload()" class="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Retry
            </button>
            <a href="/admin/login" class="block px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
              Back to Login
            </a>
          </div>
        </div>
      `}d()}p();
