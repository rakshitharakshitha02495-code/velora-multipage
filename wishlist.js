(function () {
  var KEY = 'velora_wishlist';
  var WA = '919008650012';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  }
  function save(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
  }
  function has(id) { return load().some(function (p) { return p.id === id; }); }

  function toggle(item) {
    var list = load();
    var i = list.findIndex(function (p) { return p.id === item.id; });
    if (i > -1) list.splice(i, 1); else list.push(item);
    save(list);
    refresh();
  }

  function refresh() {
    var list = load();
    document.querySelectorAll('.wish-btn').forEach(function (b) {
      var on = has(b.dataset.id);
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on);
      b.setAttribute('aria-label', on ? 'Remove from wishlist' : 'Add to wishlist');
    });
    document.querySelectorAll('.wish-count').forEach(function (c) {
      c.textContent = list.length;
      c.style.display = list.length ? 'inline-block' : 'none';
    });
    renderPage();
  }

  function renderPage() {
    var box = document.getElementById('wishlist-items');
    if (!box) return;
    var list = load();
    var order = document.getElementById('wish-order');
    if (!list.length) {
      box.innerHTML = '<p class="wish-empty">Your wishlist is empty. <a href="shop.html">Browse the shop</a></p>';
      if (order) order.style.display = 'none';
      return;
    }
    box.innerHTML = list.map(function (p) {
      return '<div class="wish-item">' +
        '<img src="' + p.img + '" alt="' + p.name + '">' +
        '<div><h3>' + p.name + '</h3><p>' + p.price + '</p></div>' +
        '<button class="wish-remove" data-id="' + p.id + '">Remove</button></div>';
    }).join('');
    if (order) {
      order.style.display = 'inline-block';
      var text = 'Hi Velora, I am interested in:\n' + list.map(function (p, i) {
        return (i + 1) + '. ' + p.name + ' (' + p.price + ')';
      }).join('\n');
      order.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text);
    }
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('.wish-btn');
    if (b) {
      e.preventDefault();
      toggle({ id: b.dataset.id, name: b.dataset.name, price: b.dataset.price, img: b.dataset.img });
      return;
    }
    var r = e.target.closest('.wish-remove');
    if (r) {
      save(load().filter(function (p) { return p.id !== r.dataset.id; }));
      refresh();
    }
  });

  document.addEventListener('DOMContentLoaded', refresh);
})();
