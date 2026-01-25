/**
 * ScrollNav
 * スクロール連動型ナビゲーション
 */
;(function () {
  'use strict'

  window.ScrollNavApp = window.ScrollNavApp || {}

  let activeId = ''
  let navItems = []
  let navContainer = null
  let triggers = []

  /**
   * ナビゲーションを作成
   * @param {Object} config - 設定オブジェクト
   * @param {Array} config.items - ナビアイテム [{id: 'section-1', label: 'Section 1'}, ...]
   * @param {string} config.container - ナビを挿入するセレクタ (default: 'body')
   * @param {string} config.position - ナビの位置 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' (default: 'top-left')
   * @param {string} config.activeClass - アクティブ時のクラス (default: 'is-active')
   */
  function createNav(config) {
    const lenis = window.ScrollNavApp.getLenis()
    if (!lenis) {
      console.error('ScrollNavApp: Lenis not initialized. Call ScrollNavApp.init() first.')
      return
    }

    navItems = config.items || []
    const containerSelector = config.container || 'body'
    const position = config.position || 'top-left'
    const activeClass = config.activeClass || 'is-active'

    // ナビコンテナ生成
    navContainer = document.createElement('nav')
    navContainer.className = 'scroll-nav scroll-nav--' + position

    // ナビアイテム生成
    navItems.forEach(function (item) {
      const button = document.createElement('button')
      button.className = 'scroll-nav__item'
      button.setAttribute('data-target', item.id)
      button.textContent = item.label

      button.addEventListener('click', function () {
        handleClick(item.id, activeClass)
      })

      navContainer.appendChild(button)
    })

    // DOM に挿入
    const container = document.querySelector(containerSelector)
    if (container === document.body) {
      document.body.appendChild(navContainer)
    } else if (container) {
      container.appendChild(navContainer)
    }

    // ScrollTrigger 設定
    setupScrollTriggers(activeClass)

    // ハッシュ同期
    setupHashSync(activeClass)
  }

  /**
   * ScrollTrigger を設定
   */
  function setupScrollTriggers(activeClass) {
    // 既存のトリガーをクリア
    triggers.forEach(function (trigger) {
      trigger.kill()
    })
    triggers = []

    navItems.forEach(function (item) {
      const trigger = ScrollTrigger.create({
        trigger: '#' + item.id,
        start: 'top center',
        end: 'bottom center',
        onEnter: function () {
          activate(item.id, activeClass)
        },
        onEnterBack: function () {
          activate(item.id, activeClass)
        },
      })
      triggers.push(trigger)
    })
  }

  /**
   * アクティブ状態を更新
   */
  function activate(id, activeClass) {
    activeId = id

    // URL ハッシュを更新
    var pathname = location.pathname
    history.replaceState(null, '', pathname + '#' + id)

    // クラス更新
    if (navContainer) {
      var buttons = navContainer.querySelectorAll('.scroll-nav__item')
      buttons.forEach(function (btn) {
        if (btn.getAttribute('data-target') === id) {
          btn.classList.add(activeClass)
        } else {
          btn.classList.remove(activeClass)
        }
      })
    }
  }

  /**
   * クリックハンドラ
   */
  function handleClick(id, activeClass) {
    var lenis = window.ScrollNavApp.getLenis()
    if (!lenis) return

    activate(id, activeClass)
    lenis.scrollTo('#' + id)
  }

  /**
   * ハッシュ同期を設定
   */
  function setupHashSync(activeClass) {
    var lenis = window.ScrollNavApp.getLenis()

    function syncFromHash() {
      var hash = location.hash.replace('#', '')
      if (hash) {
        activeId = hash
        updateActiveClass(hash, activeClass)
        if (lenis) {
          lenis.scrollTo('#' + hash, { immediate: true })
        }
      }
    }

    // 初期ロード時
    syncFromHash()

    // ブラウザバック/フォワード
    window.addEventListener('popstate', syncFromHash)
  }

  /**
   * アクティブクラスを更新
   */
  function updateActiveClass(id, activeClass) {
    if (navContainer) {
      var buttons = navContainer.querySelectorAll('.scroll-nav__item')
      buttons.forEach(function (btn) {
        if (btn.getAttribute('data-target') === id) {
          btn.classList.add(activeClass)
        } else {
          btn.classList.remove(activeClass)
        }
      })
    }
  }

  /**
   * 現在のアクティブ ID を取得
   */
  function getActiveId() {
    return activeId
  }

  /**
   * ナビゲーションを破棄
   */
  function destroyNav() {
    triggers.forEach(function (trigger) {
      trigger.kill()
    })
    triggers = []

    if (navContainer && navContainer.parentNode) {
      navContainer.parentNode.removeChild(navContainer)
    }
    navContainer = null
    navItems = []
    activeId = ''
  }

  // 公開 API
  window.ScrollNavApp.createNav = createNav
  window.ScrollNavApp.getActiveId = getActiveId
  window.ScrollNavApp.destroyNav = destroyNav
})()
