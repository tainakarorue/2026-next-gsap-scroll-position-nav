# ScrollNav 使用マニュアル

スクロール連動型ナビゲーションをバニラ JavaScript で実装するためのライブラリです。

## ファイル構成

```
html/
├── js/
│   ├── scroll-nav-init.js  # Lenis + ScrollTrigger 初期化
│   └── scroll-nav.js       # ナビゲーション機能
├── css/
│   └── scroll-nav.css      # スタイル
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

### 5. 初期化

```html
<script>
  document.addEventListener('DOMContentLoaded', function () {
    // Lenis + ScrollTrigger を初期化
    ScrollNavApp.init()

    // ナビゲーションを作成
    ScrollNavApp.createNav({
      items: [
        { id: 'section-1', label: 'Section 1' },
        { id: 'section-2', label: 'Section 2' },
        { id: 'section-3', label: 'Section 3' },
      ],
      position: 'top-left',
    })
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

### `ScrollNavApp.createNav(config)`

ナビゲーションを作成します。

| パラメータ | 型 | デフォルト | 説明 |
|-----------|-----|-----------|------|
| `config.items` | array | `[]` | ナビアイテムの配列 `[{id, label}, ...]` |
| `config.container` | string | `'body'` | ナビを挿入するセレクタ |
| `config.position` | string | `'top-left'` | ナビの位置 |
| `config.activeClass` | string | `'is-active'` | アクティブ時のクラス名 |

**position の選択肢:**
- `'top-left'`
- `'top-right'`
- `'bottom-left'`
- `'bottom-right'`

```js
ScrollNavApp.createNav({
  items: [
    { id: 'hero', label: 'Hero' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ],
  position: 'top-right',
  activeClass: 'active',
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

ナビゲーションを破棄します。

```js
ScrollNavApp.destroyNav()
```

### `ScrollNavApp.destroy()`

Lenis と ScrollTrigger を破棄します。

```js
ScrollNavApp.destroy()
```

## スタイルのカスタマイズ

CSS 変数やクラスを上書きしてカスタマイズできます。

```css
/* ナビアイテムの色を変更 */
.scroll-nav__item {
  background-color: #f0f0f0;
  color: #333;
}

.scroll-nav__item.is-active {
  background-color: #007bff;
  color: #fff;
}

/* 位置を調整 */
.scroll-nav--top-left {
  top: 2rem;
  left: 2rem;
}
```

## 機能

- スクロール位置に応じてナビゲーションのアクティブ状態が自動更新
- ナビクリックでスムーズスクロール
- URL ハッシュとの同期（ブラウザバック対応）
- Lenis によるスムーズなスクロール体験

## 動作確認

`index.html` をブラウザで開いて動作を確認できます。
