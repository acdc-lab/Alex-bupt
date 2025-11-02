/* assets/js/like.js */
/* 说明：在页面加载完成后，自动找到侧栏里的 GitHub 图标链接，
 * 并在它后面插入一个“点赞”按钮。按钮仅本地交互，不做任何计数。
 */
(function () {
  // 选择器：找到 GitHub 链接（minimal-light 左栏一般会有）
  const GITHUB_SELECTOR = 'a[href*="github.com"]:not([href*="gist.github.com"])';
  const STORAGE_KEY_LIKED = 'ml_interactive_like'; // 仅用于本机记忆高亮（可删掉）

  function findGithubAnchor() {
    // 先在常见的侧栏容器里找；找不到再全局兜底
    const sideCandidates = document.querySelectorAll(
      '.profile a, .sidebar a, .sidebar-links a, .links a, .contact a, ' + GITHUB_SELECTOR
    );
    for (const el of sideCandidates) {
      if (el.matches && el.matches(GITHUB_SELECTOR)) return el;
    }
    return document.querySelector(GITHUB_SELECTOR);
  }

  function createLikeButton() {
    const wrap = document.createElement('span');
    wrap.className = 'like-wrap';

    const btn = document.createElement('button');
    btn.className = 'like-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Like');
    btn.setAttribute('aria-pressed', 'false'); // 无障碍支持

    // 图标（你也可以改成 ❤️）
    const icon = document.createElement('span');
    icon.className = 'like-icon';
    icon.textContent = '👍';

    const text = document.createElement('span');
    text.className = 'like-text';
    text.textContent = 'Like';

    btn.appendChild(icon);
    btn.appendChild(text);
    wrap.appendChild(btn);

    // 如果想记住“已点赞”的视觉状态（本机），启用下面这段
    const liked = localStorage.getItem(STORAGE_KEY_LIKED) === '1';
    if (liked) {
      btn.classList.add('liked');
      btn.setAttribute('aria-pressed', 'true');
    }

    btn.addEventListener('click', () => {
      // 纯交互：切换视觉状态 + 弹跳动画
      const nowLiked = !btn.classList.contains('liked');
      btn.classList.toggle('liked', nowLiked);
      btn.setAttribute('aria-pressed', nowLiked ? 'true' : 'false');

      // 本机记忆（可注释掉，若完全不希望持久化）
      try {
        if (nowLiked) localStorage.setItem(STORAGE_KEY_LIKED, '1');
        else localStorage.removeItem(STORAGE_KEY_LIKED);
      } catch (_) {}
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
    if (!gh) return;
    const like = createLikeButton();
    insertAfter(gh, like);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
