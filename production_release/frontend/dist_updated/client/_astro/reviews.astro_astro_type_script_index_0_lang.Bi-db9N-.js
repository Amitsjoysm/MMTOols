import{a as c}from"./api.9IHSeoxB.js";import{r as m}from"./auth.-1gIpQ0w.js";m();let t=0;const a=20;async function y(){await s(),u()}async function s(){const n=document.getElementById("loading"),i=document.getElementById("reviews-table-container"),d=document.getElementById("reviews-tbody");n.classList.remove("hidden"),i.classList.add("hidden");try{const r=document.getElementById("verified-filter").value,o={skip:t,limit:a};r!==""&&(o.verified=r==="true");const l=await c.getReviews(o);d.innerHTML=l.map(e=>`
        <tr data-testid="review-row-${e.id}">
          <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">${e.user}</td>
          <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">${e.tool}</td>
          <td class="px-6 py-4">
            <div class="flex items-center">
              <span class="text-yellow-500">★</span>
              <span class="ml-1 text-sm font-medium text-gray-900 dark:text-white">${e.rating}/5</span>
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="max-w-xs">
              <div class="font-medium text-gray-900 dark:text-white text-sm">${e.title||"No title"}</div>
            </div>
          </td>
          <td class="px-6 py-4">
            <span class="px-3 py-1 rounded-full text-xs font-medium ${e.is_verified?"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"}">
              ${e.is_verified?"Verified":"Pending"}
            </span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
            ${new Date(e.created_at).toLocaleDateString()}
          </td>
          <td class="px-6 py-4 text-right">
            ${e.is_verified?`
              <button onclick="window.verifyReview('${e.id}', false)" class="text-orange-600 hover:text-orange-800 dark:text-orange-400 text-sm">
                Unverify
              </button>
            `:`
              <button onclick="window.verifyReview('${e.id}', true)" class="text-green-600 hover:text-green-800 dark:text-green-400 text-sm" data-testid="verify-review-${e.id}">
                Verify
              </button>
            `}
          </td>
        </tr>
      `).join(""),n.classList.add("hidden"),i.classList.remove("hidden"),document.getElementById("pagination").classList.remove("hidden"),g(l.length)}catch(r){console.error("Error loading reviews:",r),n.classList.add("hidden")}}function g(n){const i=document.getElementById("page-info"),d=t+1,r=t+n;i.textContent=`${d}-${r}`,document.getElementById("prev-btn").disabled=t===0,document.getElementById("next-btn").disabled=n<a}function u(){document.getElementById("verified-filter").addEventListener("change",()=>{t=0,s()}),document.getElementById("reset-filters-btn").addEventListener("click",()=>{document.getElementById("verified-filter").value="",t=0,s()}),document.getElementById("prev-btn").addEventListener("click",()=>{t>0&&(t-=a,s())}),document.getElementById("next-btn").addEventListener("click",()=>{t+=a,s()})}window.verifyReview=async function(n,i){if(confirm(`Are you sure you want to ${i?"verify":"unverify"} this review?`))try{await c.verifyReview(n,i),alert(`Review ${i?"verified":"unverified"} successfully!`),s()}catch(d){console.error("Error updating review:",d),alert("Failed to update review: "+(d.message||"Unknown error"))}};y();
