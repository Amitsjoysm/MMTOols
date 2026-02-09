const i="http://localhost:8001";let s="pending",a=[],o=null;function l(){return localStorage.getItem("token")}async function d(t="pending"){const r=l();if(!r){window.location.href="/auth/login";return}g();try{const n=await fetch(`${i}/api/admin/tool-claims?status_filter=${t}`,{headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/json"}});if(n.status===401){window.location.href="/auth/login";return}if(!n.ok)throw new Error("Failed to fetch claims");a=await n.json(),c(),m()}catch(n){u(n.message)}}function c(){const t=a.filter(e=>e.claim_status==="pending").length,r=a.filter(e=>e.claim_status==="approved").length,n=a.filter(e=>e.claim_status==="rejected").length;document.getElementById("pending-count").textContent=t,document.getElementById("approved-count").textContent=r,document.getElementById("rejected-count").textContent=n}function m(){const t=document.getElementById("claims-container"),r=document.getElementById("empty-state");if(document.getElementById("loading").classList.add("hidden"),a.length===0){t.classList.add("hidden"),r.classList.remove("hidden");return}r.classList.add("hidden"),t.classList.remove("hidden"),t.innerHTML=a.map(e=>`
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-start justify-between">
            <div class="flex items-start space-x-4 flex-1">
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
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  ${e.name}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  ${e.short_description||"No description"}
                </p>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-gray-500 dark:text-gray-400">Requested by:</span>
                    <p class="font-medium text-gray-900 dark:text-white">
                      ${e.claimed_by?.full_name||e.claimed_by?.username}
                    </p>
                    <p class="text-xs text-gray-500">${e.claimed_by?.email}</p>
                  </div>
                  <div>
                    <span class="text-gray-500 dark:text-gray-400">Request Date:</span>
                    <p class="font-medium text-gray-900 dark:text-white">
                      ${new Date(e.claim_request_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                ${e.claim_rejection_reason?`
                  <div class="mt-3 p-3 bg-red-50 dark:bg-red-900 rounded-lg">
                    <p class="text-sm text-red-800 dark:text-red-200">
                      <strong>Rejection Reason:</strong> ${e.claim_rejection_reason}
                    </p>
                  </div>
                `:""}
              </div>
            </div>
            <div class="flex flex-col gap-2 ml-4">
              <span class="px-3 py-1 text-xs font-semibold rounded-full ${e.claim_status==="pending"?"bg-yellow-100 text-yellow-800":e.claim_status==="approved"?"bg-green-100 text-green-800":"bg-red-100 text-red-800"}">
                ${e.claim_status.toUpperCase()}
              </span>
              ${e.claim_status==="pending"?`
                <button
                  onclick="approveClaim('${e.id}')"
                  class="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                  data-testid="approve-claim-btn-${e.id}"
                >
                  ✓ Approve
                </button>
                <button
                  onclick="openRejectModal('${e.id}')"
                  class="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
                  data-testid="reject-claim-btn-${e.id}"
                >
                  ✗ Reject
                </button>
              `:""}
            </div>
          </div>
        </div>
      `).join("")}window.approveClaim=async function(t){const r=l();if(r)try{if(!(await fetch(`${i}/api/admin/tool-claims/${t}/approve`,{method:"PUT",headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/json"}})).ok)throw new Error("Failed to approve claim");alert("Claim approved successfully!"),d(s)}catch(n){alert("Error: "+n.message)}};window.openRejectModal=function(t){o=t,document.getElementById("rejection-modal").classList.remove("hidden"),document.getElementById("rejection-reason").value=""};document.getElementById("cancel-reject").addEventListener("click",()=>{document.getElementById("rejection-modal").classList.add("hidden"),o=null});document.getElementById("confirm-reject").addEventListener("click",async()=>{const t=l();if(!t||!o)return;const r=document.getElementById("rejection-reason").value.trim();try{if(!(await fetch(`${i}/api/admin/tool-claims/${o}/reject`,{method:"PUT",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify({approved:!1,rejection_reason:r||"No reason provided"})})).ok)throw new Error("Failed to reject claim");alert("Claim rejected successfully!"),document.getElementById("rejection-modal").classList.add("hidden"),o=null,d(s)}catch(n){alert("Error: "+n.message)}});document.querySelectorAll(".filter-tab").forEach(t=>{t.addEventListener("click",r=>{document.querySelectorAll(".filter-tab").forEach(n=>{n.classList.remove("border-blue-600","text-blue-600","active"),n.classList.add("border-transparent")}),r.target.classList.add("border-blue-600","text-blue-600","active"),r.target.classList.remove("border-transparent"),s=r.target.dataset.filter,d(s)})});document.getElementById("refreshBtn").addEventListener("click",()=>{d(s)});function g(){document.getElementById("loading").classList.remove("hidden"),document.getElementById("claims-container").classList.add("hidden"),document.getElementById("empty-state").classList.add("hidden"),document.getElementById("error").classList.add("hidden")}function u(t){document.getElementById("loading").classList.add("hidden"),document.getElementById("error").classList.remove("hidden"),document.getElementById("error-message").textContent=t}d("pending");
