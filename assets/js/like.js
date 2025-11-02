/* assets/js/like.js */
(function () {
  // -------- 可配置项 --------
  const STORAGE_KEY_COUNT = 'ml_like_count';
  const STORAGE_KEY_LIKED = 'ml_has_liked';
  const INITIAL_COUNT = 0;         // 初始显示的点赞数（可改）
  const GITHUB_SELECTOR =
    'a[href*="github.com"]:not([href*="gist.github.com"])'; // 找到侧边栏的 GitHub 链接

  function findGithubAnchor() {
    // 1) 先在“侧栏”里找（minimal-light 左栏是 .profile 或 .sidebar，主题版本略有差异）
    const sideCandidates = document.querySelectorAll(
      '.profile a, .sidebar a, .sidebar-links a, .links a, .contact a, ' + GITHUB_SELECTOR
    );
    for (const el of sideCandidates) {
      if (el.matches && el.matches(GITHUB_SELECTOR)) return el;
    }
    // 2) 兜底：全局找第一个 github 链接
    return document.querySelector(GITHUB_SELECTOR);
  }

  function loadCount() {
    const v = localStorage.getItem(STORAGE_KEY_COUNT);
    return v === null ? INITIAL_COUNT : parseInt(v, 10) || 0;
  }
  function hasLiked() {
    return localStorage.getItem(STORAGE_KEY_LIKED) === '1';
  }
  function saveCount(n) {
    localStorage.setItem(STORAGE_KEY_COUNT, String(n));
  }
  function markLiked() {
    localStorage.setItem(STORAGE_KEY_LIKED, '1');
  }

  function createLikeButton(count, liked) {
    const wrap = document.createElement('span');
    wrap.className = 'like-wrap';

    const btn = document.createElement('button');
    btn.className = 'like-btn' + (liked ? ' liked' : '');
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Like');

    const icon = document.createElement('span');
    icon.className = 'like-icon';
    icon.textContent = '👍';

    const num = document.createElement('span');
    num.className = 'like-num';
    num.textContent = String(count);

    btn.appendChild(icon);
    btn.appendChild(num);
    wrap.appendChild(btn);

    btn.addEventListener('click', function () {
      if (hasLiked()) return;               // 防重复点赞
      const c = loadCount() + 1;
      saveCount(c);
      markLiked();
      num.textContent = String(c);
      btn.classList.add('liked');
    });

    return wrap;
  }

  function insertAfter(target, node) {
    if (!target || !target.parentNode) return;
    if (target.nextSibling) target.parentNode.insertBefore(node, target.nextSibling);
    else target.parentNode.appendChild(node);
  }

  function run() {
    const gh = findGithubAnchor();
    if (!gh) return; // 没找到 GitHub 链接就不操作
    const count = loadCount();
    const liked = hasLiked();
    const like = createLikeButton(count, liked);
    insertAfter(gh, like);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
