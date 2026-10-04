(() => {
  const path = location.pathname;
  const levelFolder = document.body?.dataset?.level || '';
  const isLower = document.documentElement.dataset.level === 'A1-A2';
  if (!isLower) return;
  const type = new URLSearchParams(location.search).get('type') || '';
  const support = {
    guess: 'Прочитай підказку та вибери правильне слово італійською.',
    situations: 'Прочитай ситуацію та вибери відповідь італійською.',
    roleplay: 'Уяви ситуацію та вибери, що сказати італійською.',
    mixed: 'Прочитай завдання. Відповідь потрібно вибрати італійською.'
  };
  const msg = support[type];
  if (!msg) return;
  window.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    if (!content) return;
    const add = () => {
      if (content.querySelector('.uk-support')) return;
      const el = document.createElement('div');
      el.className = 'uk-support';
      el.textContent = msg;
      content.appendChild(el);
    };
    new MutationObserver(add).observe(content, {childList:true, subtree:true});
    add();
  });
})();
