(function () {
  var KEY = 'velora_cart';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  }
  function save(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
  }

  function updateCount() {
    var total = load().reduce(function (sum, p) { return sum + p.qty; }, 0);
    document.querySelectorAll('.cart-count').forEach(function (c) {
      c.textContent = total;
    });
  }

  function add(item) {
    var list = load();
    var found = list.find(function (p) { return p.id === item.id; });
    if (found) found.qty += 1;
    else { item.qty = 1; list.push(item); }
    save(list);
    updateCount();
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('.add-cart');
    if (!b) return;
    e.preventDefault();
    add({ id: b.dataset.id, name: b.dataset.name, price: b.dataset.price, img: b.dataset.img });
  });

  window.addEventListener('storage', updateCount);
  document.addEventListener('DOMContentLoaded', updateCount);
})();
