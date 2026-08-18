const KEY="rk_products_v1"; let products=JSON.parse(localStorage.getItem(KEY)||"[]"); let currentImage=""; 
const $=id=>document.getElementById(id);
$("year").textContent=new Date().getFullYear();
function save(){localStorage.setItem(KEY,JSON.stringify(products));renderProducts();renderManage();}
function toggleAdmin(){ $("adminPanel").hidden=!$("adminPanel").hidden; if(!$("adminPanel").hidden) renderManage(); }
function renderProducts(){
  const q=$("search").value.toLowerCase(); const grid=$("productsGrid");
  const list=products.filter(p=>(p.name+" "+p.category).toLowerCase().includes(q));
  $("empty").hidden=list.length!==0;
  grid.innerHTML=list.map(p=>`<article class="product">${p.photo?`<img src="${p.photo}" alt="${esc(p.name)}">`:`<div class="placeholder">🥤</div>`}<div class="product-info"><div class="category">${esc(p.category||"Beverage")}</div><h3>${esc(p.name)}</h3><div class="price">₹${Number(p.price).toLocaleString("en-IN")}</div></div></article>`).join("");
}
function renderManage(){
 $("manageList").innerHTML=products.length?products.map(p=>`<div class="manage-item">${p.photo?`<img src="${p.photo}" alt="">`:`<div class="mini-placeholder">🥤</div>`}<div class="grow"><b>${esc(p.name)}</b><div>₹${Number(p.price).toLocaleString("en-IN")} · ${esc(p.category||"Beverage")}</div></div><button class="edit" onclick="editProduct('${p.id}')">Edit</button><button class="delete" onclick="deleteProduct('${p.id}')">Delete</button></div>`).join(""):"<p>No products added yet.</p>";
}
$("photo").addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{currentImage=r.result;$("preview").src=currentImage;$("preview").hidden=false};r.readAsDataURL(f)});
$("productForm").addEventListener("submit",e=>{e.preventDefault();const id=$("editId").value||crypto.randomUUID();const old=products.find(p=>p.id===id);products=products.filter(p=>p.id!==id);products.unshift({id,name:$("name").value.trim(),price:$("price").value,category:$("category").value.trim(),photo:currentImage||old?.photo||""});save();resetForm();});
function editProduct(id){const p=products.find(x=>x.id===id);$("editId").value=p.id;$("name").value=p.name;$("price").value=p.price;$("category").value=p.category||"";currentImage=p.photo||"";$("preview").src=currentImage;$("preview").hidden=!currentImage;window.scrollTo({top:0,behavior:"smooth"});}
function deleteProduct(id){if(confirm("Delete this product?")){products=products.filter(p=>p.id!==id);save();}}
function resetForm(){$("productForm").reset();$("editId").value="";currentImage="";$("preview").hidden=true;}
function esc(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
renderProducts();