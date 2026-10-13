// Parcel Trail - small progressive enhancements (the site works without JavaScript)
(function () {
  // Tracking numbers: force upper case while typing
  document.querySelectorAll('input[name="id"]').forEach(function (el) {
    el.addEventListener('input', function () {
      var pos = el.selectionStart;
      el.value = el.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      el.setSelectionRange(pos, pos);
    });
  });

  // Live price estimate on the booking form (server recalculates the final price)
  var form = document.getElementById('bookForm');
  if (form) {
    var rates = JSON.parse(form.dataset.rates);
    var weight = document.getElementById('weight');
    var out = document.getElementById('quote');
    var update = function () {
      var chosen = form.querySelector('input[name="service"]:checked');
      var w = parseFloat(weight.value);
      if (!chosen || isNaN(w) || w <= 0) { out.textContent = 'Rs --'; return; }
      var r = rates[chosen.value];
      out.textContent = 'Rs ' + (r.base + r.per_kg * w).toFixed(2);
    };
    form.addEventListener('input', update);
    update();
  }
})();
