(function () {
  var KEY = 'velora_wishlist', NUM = '919008650012';

  var css = '.wish-btn{position:absolute;top:14px;right:14px;z-index:3;width:40px;height:40px;border:0;border-radius:50%;background:rgba(255,255,255,.92);color:#141010;font-size:22px;line-height:1;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.18);transition:transform .15s,color .15s}' +
    '.wish-btn:hover{transform:scale(1.1)}.wish-btn.active{color:#c2185b}' +
    '.wish-btn:focus-visible{outline:3px solid #141010;outline-offset:2px}' +
    '.lb-info .wish-btn{position:static;display:inline-block;margin:10px 10px 0 0;vertical-align:middle}' +
    '.wish-link{white-space:nowrap}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function slug(t) { return String(t).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function load() {
    var raw; try { raw = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { raw = []; }
    var seen = {}, out = [];
    raw.forEach(function (p) {
      if (!p || !p.name) return;
      p.id = p.id || slug(p.name);
      if (!seen[p.id]) { seen[p.id] = 1; out.push(p); }
    });
    return out;
  }
  function save(l) { try { localStorage.setItem(KEY, JSON.stringify(l)); } catch (e) {} }
  function has(id) { return load().some(function (p) { return p.id === id; }); }
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

  function thumb(btn) {
    var host = btn.closest('.prod, .card, .lb-card');
    var img = host && host.querySelector('img');
    if (!img || !img.src || img.hidden || !img.naturalWidth) return btn.dataset.img || '';
    if (img.src.indexOf('data:') !== 0) return img.src;
    try {
      var w = 200, h = Math.round(w * img.naturalHeight / img.naturalWidth);
      var c = document.createElement('canvas'); c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      return c.toDataURL('image/jpeg', 0.7);
    } catch (e) { return ''; }
  }

  function refresh() {
    var list = load();
    document.querySelectorAll('.wish-btn').forEach(function (b) {
      var id = b.dataset.id || slug(b.dataset.name || ''), on = has(id);
      b.classList.toggle('active', on);
      b.textContent = on ? '♥' : '♡';
      b.setAttribute('aria-pressed', on);
      b.setAttribute('aria-label', on ? 'Remove from wishlist' : 'Add to wishlist');
    });
    document.querySelectorAll('.wish-count').forEach(function (c) { c.textContent = list.length; });
    renderPage();
  }

  function renderPage() {
    var box = document.getElementById('wishlist-items');
    if (!box) return;
    var list = load();
    if (!list.length) {
      box.innerHTML = '<div class="empty"><p>Your wishlist is empty. Tap the heart on any piece to save it here.</p><a class="btn" href="shop.html">Browse the shop</a></div>';
      return;
    }
    var html = list.map(function (p) {
      return '<div class="citem">' +
        (p.img ? '<img src="' + esc(p.img) + '" alt="' + esc(p.name) + '">' : '<div class="noimg" aria-hidden="true"></div>') +
        '<div><h3>' + esc(p.name) + '</h3><p class="pr">' + esc(p.price) + '</p>' +
        '<button type="button" class="add-cart" data-id="' + esc(p.id) + '" data-name="' + esc(p.name) + '" data-price="' + esc(p.price) + '" data-img="' + esc(p.img || '') + '">Add to Cart</button></div>' +
        '<div class="cside"><button class="rm" data-w="rm" data-id="' + esc(p.id) + '">Remove</button></div></div>';
    }).join('');
    var lines = ['Hello Velora! I am interested in:', ''].concat(list.map(function (p, i) { return (i + 1) + '. ' + p.name + ' (' + p.price + ')'; }));
    html += '<div class="actions"><a class="btn" href="https://wa.me/' + NUM + '?text=' + encodeURIComponent(lines.join('\n')) + '" target="_blank" rel="noopener">Enquire on WhatsApp</a>' +
      '<a class="btn ghost" href="shop.html">Keep shopping</a>' +
      '<button type="button" class="clr" data-w="clear">Clear wishlist</button></div>';
    box.innerHTML = html;
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('.wish-btn');
    if (b) {
      e.preventDefault(); e.stopPropagation();
      var name = b.dataset.name, id = b.dataset.id || slug(name), list = load();
      var i = list.findIndex(function (p) { return p.id === id; });
      if (i > -1) list.splice(i, 1);
      else list.push({ id: id, name: name, price: b.dataset.price, img: thumb(b) });
      save(list); refresh();
      return;
    }
    var w = e.target.closest('[data-w]');
    if (w) {
      var l = load();
      if (w.dataset.w === 'clear') l = [];
      else l = l.filter(function (p) { return p.id !== w.dataset.id; });
      save(l); refresh();
    }
  }, true);

  window.veloraWish = { refresh: refresh };
  window.addEventListener('storage', refresh);
  document.addEventListener('DOMContentLoaded', refresh);
})();
