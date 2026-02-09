const s="http://localhost:8001";function n(){return localStorage.getItem("token")}async function i(){const r=n();if(!r){window.location.href="/auth/login";return}try{const t=await fetch(`${s}/api/user/claimed-tools`,{headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/json"}});if(t.status===401){window.location.href="/auth/login";return}if(!t.ok)throw new Error("Failed to fetch claimed tools");const a=await t.json();d(a)}catch(t){l(t.message)}}function d(r){const t=document.getElementById("tools-container"),a=document.getElementById("empty-state");if(document.getElementById("loading").classList.add("hidden"),r.length===0){t.classList.add("hidden"),a.classList.remove("hidden");return}a.classList.add("hidden"),t.classList.remove("hidden"),t.innerHTML=r.map(e=>`
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition" data-testid="claimed-tool-card">
          <div class="p-6">
            <div class="flex items-start space-x-4 mb-4">
              ${e.logo_url?`
                <img src="${e.logo_url}" alt="${e.name}" class="w-16 h-16 rounded-lg object-cover" />
              `:`
                <div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              `}
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  ${e.name}
                </h3>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${e.claim_status==="pending"?"bg-yellow-100 text-yellow-800":e.claim_status==="approved"?"bg-green-100 text-green-800":"bg-red-100 text-red-800"}">
                  ${e.claim_status.toUpperCase()}
                </span>
              </div>
            </div>
            
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              ${e.short_description||"No description"}
            </p>

            <div class="space-y-2 text-sm">
              <div>
                <span class="text-gray-500 dark:text-gray-400">Requested:</span>
                <span class="text-gray-900 dark:text-white ml-2">
                  ${new Date(e.claim_request_date).toLocaleDateString()}
                </span>
              </div>
              
              ${e.claim_approved_date?`
                <div>
                  <span class="text-gray-500 dark:text-gray-400">Approved:</span>
                  <span class="text-gray-900 dark:text-white ml-2">
                    ${new Date(e.claim_approved_date).toLocaleDateString()}
                  </span>
                </div>
              `:""}

              ${e.claim_rejection_reason?`
                <div class="mt-3 p-3 bg-red-50 dark:bg-red-900 rounded-lg">
                  <p class="text-xs text-red-800 dark:text-red-200">
                    <strong>Rejection Reason:</strong><br/>
                    ${e.claim_rejection_reason}
                  </p>
                </div>
              `:""}
            </div>

            <div class="mt-4 flex gap-2">
              ${e.claim_status==="approved"?`
                <a
                  href="/tools/${e.slug}"
                  class="flex-1 text-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                  data-testid="view-tool-btn"
                >
                  View Tool
                </a>
              `:e.claim_status==="pending"?`
                <button
                  onclick="cancelClaim('${e.id}')"
                  class="flex-1 px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition"
                  data-testid="cancel-claim-btn"
                >
                  Cancel Request
                </button>
              `:`
                <button
                  onclick="reclaimTool('${e.id}')"
                  class="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                  data-testid="reclaim-tool-btn"
                >
                  Request Again
                </button>
              `}
            </div>
          </div>
        </div>
      `).join("")}window.cancelClaim=async function(r){if(!confirm("Are you sure you want to cancel this claim request?"))return;const t=n();if(t)try{if(!(await fetch(`${s}/api/user/tool-claims/${r}`,{method:"DELETE",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"}})).ok)throw new Error("Failed to cancel claim");alert("Claim request cancelled successfully!"),i()}catch(a){alert("Error: "+a.message)}};window.reclaimTool=async function(r){const t=n();if(t)try{const a=await fetch(`${s}/api/tools/${r}/claim`,{method:"POST",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify({reason:"Requesting again after review"})});if(!a.ok){const o=await a.json();throw new Error(o.detail||"Failed to claim tool")}alert("Claim request submitted successfully!"),i()}catch(a){alert("Error: "+a.message)}};function l(r){document.getElementById("loading").classList.add("hidden"),document.getElementById("error").classList.remove("hidden"),document.getElementById("error-message").textContent=r}i();
