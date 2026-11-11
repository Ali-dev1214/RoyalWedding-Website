document.addEventListener("DOMContentLoaded", () => {
  const toggle=document.getElementById("menuToggle"), nav=document.getElementById("mainNav");
  if(toggle&&nav) toggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));toggle.textContent=open?"✕":"☰";});

  const filters=document.querySelectorAll(".filter-btn"), galleryItems=document.querySelectorAll(".gallery-grid figure");
  filters.forEach(btn=>btn.addEventListener("click",()=>{filters.forEach(x=>x.classList.remove("active"));btn.classList.add("active");galleryItems.forEach(item=>item.hidden=btn.dataset.filter!=="all"&&item.dataset.category!==btn.dataset.filter);}));

  const booking=document.getElementById("bookingForm");
  if(booking){
    const money=n=>"PKR "+Math.round(n).toLocaleString("en-PK");
    const eventCards=[...booking.querySelectorAll(".event-rate-card")];
    const estimate=document.getElementById("estimateTotal"), breakdown=document.getElementById("billBreakdown");
    const calculate=()=>{
      let total=0, rows=[];
      eventCards.forEach(card=>{
        const active=card.querySelector(".event-active").checked;
        const guests=Math.max(0,Number(card.querySelector(".event-guests").value)||0);
        const rate=Number(card.dataset.rate), subtotal=active?guests*rate:0;
        card.querySelector(".event-subtotal").textContent=money(subtotal);
        if(active){total+=subtotal;rows.push({name:card.dataset.event,hall:card.querySelector(".event-hall").value,guests,rate,subtotal});}
      });
      let extras=0;
      booking.querySelectorAll(".service-check:checked").forEach(x=>extras+=Number(x.dataset.price||0));
      if(extras) rows.push({name:"Additional services",hall:"Selected add-ons",guests:"—",rate:0,subtotal:extras});
      total+=extras;
      breakdown.innerHTML=rows.length?rows.map(r=>`<div class="bill-row"><span><b>${r.name}</b><br>${r.hall} · ${r.guests==="—"?"":r.guests+" guests × "+money(r.rate)+" per head"}</span><strong>${money(r.subtotal)}</strong></div>`).join(""):"<p>Select an event to see its cost breakdown.</p>";
      estimate.textContent=money(total);
      return {total,rows};
    };
    eventCards.forEach(card=>{card.querySelectorAll("input,select").forEach(el=>el.addEventListener("input",calculate));card.querySelectorAll("input,select").forEach(el=>el.addEventListener("change",calculate));});
    booking.querySelectorAll(".service-check").forEach(el=>el.addEventListener("change",calculate));
    calculate();
    booking.addEventListener("submit",e=>{
      e.preventDefault();
      if(!booking.reportValidity()) return;
      const result=calculate();
      if(!result.rows.length){const box=document.getElementById("bookingSuccess");box.hidden=false;box.innerHTML="<h3>Please select at least one event.</h3><p>Choose Mehndi, Baraat, Walima or Mayun to calculate your estimate.</p>";box.scrollIntoView({behavior:"smooth",block:"center"});return;}
      const name=document.getElementById("bookingName").value.trim();
      const box=document.getElementById("bookingSuccess");
      box.hidden=false;
      box.innerHTML=`<h3>✓ Booking information submitted successfully!</h3><p>Thank you, ${name.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}. Your booking summary is ready.</p><p><b>Selected events:</b> ${result.rows.map(r=>r.name).join(", ")}</p><p><b>Estimated total bill:</b> ${money(result.total)}</p><p class="success-note">This is a frontend demo. Your information has not been stored or sent to the venue.</p>`;
      box.scrollIntoView({behavior:"smooth",block:"center"});
    });
  }

  const commentForm=document.getElementById("commentForm");
  if(commentForm) commentForm.addEventListener("submit",e=>{
    e.preventDefault();if(!commentForm.reportValidity())return;
    const name=document.getElementById("commentName").value.trim(),event=document.getElementById("commentEvent").value,text=document.getElementById("commentText").value.trim();
    const card=document.createElement("article");card.className="comment-item";
    const stars=document.createElement("div");stars.className="comment-stars";stars.textContent="★★★★★";
    const para=document.createElement("p");para.textContent="“"+text+"”";
    const author=document.createElement("b");author.textContent=name;
    const meta=document.createElement("small");meta.textContent=event+" celebration";
    card.append(stars,para,author,meta);document.getElementById("commentList").prepend(card);
    document.getElementById("commentMessage").textContent="Thank you! Your comment has been added to this page (demo only).";
    commentForm.reset();
  });

  const contact=document.getElementById("contactForm");
  if(contact) contact.addEventListener("submit",e=>{e.preventDefault();document.getElementById("contactMessage").textContent="Thank you! This is a frontend demo, so your message was not sent.";contact.reset();});
  document.querySelectorAll(".account-tab").forEach(tab=>tab.addEventListener("click",()=>{document.querySelectorAll(".account-tab").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".account-form").forEach(x=>x.classList.remove("active"));tab.classList.add("active");document.getElementById(tab.dataset.tab+"Form").classList.add("active");}));
  document.querySelectorAll(".account-form").forEach(form=>form.addEventListener("submit",e=>{e.preventDefault();const message=form.querySelector(".form-message");if(message)message.textContent="Demo only — authentication is not connected."; }));
});