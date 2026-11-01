(function () {
  var KEY = 'velora_cart';

  function slug(t) { return String(t).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function load() {
    var raw; try { raw = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { raw = []; }
    // repair older saved items: give every item an id and merge duplicates
    var out = [], seen = {};
    raw.forEach(function (p) {
      if (!p || !p.name) return;
      p.id = p.id || slug(p.name);
      p.qty = Math.max(1, parseInt(p.qty, 10) || 1);
      if (seen[p.id]) { seen[p.id].qty += p.qty; if (!seen[p.id].img && p.img) seen[p.id].img = p.img; }
      else { seen[p.id] = p; out.push(p); }
    });
    return out;
  }
  function save(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
  }

  function updateCount() {
    var total = load().reduce(function (sum, p) { return sum + p.qty; }, 0);
    document.querySelectorAll('.cart-count').forEach(function (c) { c.textContent = total; });
  }

  // small thumbnail so the cart stays light in browser storage
  function thumb(btn) {
    if (btn.dataset.img) return btn.dataset.img;
    var host = btn.closest('.prod, .card, .lb-card');
    var img = host && host.querySelector('img');
    if (!img || !img.src || img.hidden || !img.naturalWidth) return '';
    if (img.src.indexOf('data:') !== 0) return img.src;
    try {
      var w = 200, h = Math.round(w * img.naturalHeight / img.naturalWidth);
      var c = document.createElement('canvas'); c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      return c.toDataURL('image/jpeg', 0.7);
    } catch (e) { return ''; }
  }

  function add(item) {
    var list = load();
    var found = list.find(function (p) { return p.id === item.id; });
    if (found) { found.qty += 1; if (!found.img && item.img) found.img = item.img; }
    else { item.qty = 1; list.push(item); }
    save(list);
    updateCount();
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('.add-cart');
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    var name = b.dataset.name;
    add({ id: b.dataset.id || slug(name), name: name, price: b.dataset.price, img: thumb(b) });
    var old = b.dataset.label || b.textContent;
    b.dataset.label = old;
    b.textContent = 'Added ✓';
    clearTimeout(b._t);
    b._t = setTimeout(function () { b.textContent = old; }, 1300);
  }, true);

  window.addEventListener('storage', updateCount);
  document.addEventListener('DOMContentLoaded', updateCount);
})();
