# ScrollNav 使用マニュアル

スクロール連動型ナビゲーションをバニラ JavaScript で実装するためのライブラリです。

## ファイル構成

```
html/
├── js/
│   ├── scroll-nav-init.js  # Lenis + ScrollTrigger 初期化
│   └── scroll-nav.js       # ナビゲーション機能
├── css/
│   └── scroll-nav.css      # ベーススタイル
├── index.html              # サンプルページ
└── README.md               # このファイル
```

## 導入手順

### 1. CDN の読み込み

HTML の `</body>` 直前に以下を追加します。

```html
<!-- GSAP + ScrollTrigger -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>

<!-- Lenis -->
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js"></script>
```

### 2. ScrollNav ファイルの読み込み

```html
<!-- ScrollNav -->
<script src="js/scroll-nav-init.js"></script>
<script src="js/scroll-nav.js"></script>
```

### 3. CSS の読み込み

`<head>` 内に追加します。

```html
<link rel="stylesheet" href="css/scroll-nav.css">
```

### 4. HTML にセクションを追加

各セクションに一意の `id` を付与します。

```html
<section id="section-1">Section 1</section>
<section id="section-2">Section 2</section>
<section id="section-3">Section 3</section>
```

### 5. HTML にナビゲーションを作成

`data-scroll-target` 属性でターゲットセクションの ID を指定します。
中身は自由にカスタマイズできます（テキスト、アイコン、画像など）。

```html
<nav class="scroll-nav">
  <!-- テキストのみ -->
  <button class="scroll-nav__item" data-scroll-target="section-1">
    Section 1
  </button>

  <!-- アイコン + テキスト -->
  <button class="scroll-nav__item" data-scroll-target="section-2">
    <i class="icon">🔥</i> Section 2
  </button>

  <!-- a タグでも OK -->
  <a href="#section-3" class="scroll-nav__item" data-scroll-target="section-3">
    Section 3
  </a>
</nav>
```

### 6. 初期化

```html
<script>
  document.addEventListener('DOMContentLoaded', function () {
    // Lenis + ScrollTrigger を初期化
    ScrollNavApp.init()

    // ナビゲーションを初期化（HTML で作成したナビに機能を付与）
    ScrollNavApp.initNav()
  })
</script>
```

## API リファレンス

### `ScrollNavApp.init(options)`

Lenis と ScrollTrigger を初期化します。

| パラメータ | 型 | デフォルト | 説明 |
|-----------|-----|-----------|------|
| `options.duration` | number | `1.1` | スクロールアニメーションの長さ |
| `options.easing` | function | exponential | イージング関数 |

```js
ScrollNavApp.init({
  duration: 1.5,
})
```

### `ScrollNavApp.initNav(config)`

HTML で作成したナビゲーションにスクロール連動機能を付与します。

| パラメータ | 型 | デフォルト | 説明 |
|-----------|-----|-----------|------|
| `config.navSelector` | string | `'[data-scroll-target]'` | ナビアイテムのセレクタ |
| `config.activeClass` | string | `'is-active'` | アクティブ時のクラス名 |

```js
ScrollNavApp.initNav({
  navSelector: '[data-scroll-target]',
  activeClass: 'is-active',
})
```

### `ScrollNavApp.getLenis()`

Lenis インスタンスを取得します。

```js
const lenis = ScrollNavApp.getLenis()
lenis.scrollTo('#section-2')
```

### `ScrollNavApp.getActiveId()`

現在アクティブなセクション ID を取得します。

```js
const currentSection = ScrollNavApp.getActiveId()
console.log(currentSection) // 'section-1'
```

### `ScrollNavApp.destroyNav()`

ナビゲーションの機能を破棄します（イベントリスナーと ScrollTrigger をクリア）。

```js
ScrollNavApp.destroyNav()
```

### `ScrollNavApp.destroy()`

Lenis と ScrollTrigger を破棄します。

```js
ScrollNavApp.destroy()
```

## スタイルのカスタマイズ

ナビゲーションは HTML で自由に作成できるため、CSS も自由にカスタマイズできます。

```css
/* ナビコンテナ */
.scroll-nav {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* ナビアイテム */
.scroll-nav__item {
  padding: 0.5rem 1rem;
  background-color: #e5e7eb;
  border-radius: 0.25rem;
  color: #000;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.scroll-nav__item:hover {
  background-color: #d1d5db;
}

/* アクティブ状態 */
.scroll-nav__item.is-active {
  background-color: #000;
  color: #fff;
}
```

## 機能

- スクロール位置に応じてナビゲーションのアクティブ状態が自動更新
- ナビクリックでスムーズスクロール
- URL ハッシュとの同期（ブラウザバック対応）
- Lenis によるスムーズなスクロール体験
- HTML でナビを自由にカスタマイズ可能（テキスト、アイコン、画像など）

## 動作確認

`index.html` をブラウザで開いて動作を確認できます。
