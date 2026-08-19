document.addEventListener('DOMContentLoaded', function(){
  // footer year
  var yearEl = document.getElementById('footer-year');
  if(yearEl){ yearEl.textContent = new Date().getFullYear(); }

  // mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if(toggle && links){
    toggle.addEventListener('click', function(){
      links.classList.toggle('nav-links-open');
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(function(item){
    var q = item.querySelector('.faq-q');
    q.addEventListener('click', function(){
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function(i){ i.classList.remove('open'); });
      if(!wasOpen){ item.classList.add('open'); }
    });
  });

  // falling snow — generated once, respects reduced motion
  var field = document.querySelector('.snowfield');
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(field && !prefersReduced){
    for(var i = 0; i < 28; i++){
      var flake = document.createElement('span');
      flake.style.left = (Math.random() * 100) + '%';
      flake.style.animationDuration = (8 + Math.random() * 10) + 's';
      flake.style.animationDelay = (Math.random() * 10) + 's';
      flake.style.opacity = 0.25 + Math.random() * 0.5;
      flake.style.width = flake.style.height = (3 + Math.random() * 4) + 'px';
      field.appendChild(flake);
    }
  }
});
