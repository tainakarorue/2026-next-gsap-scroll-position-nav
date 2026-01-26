# Swiper + GSAP 実装ガイド (CDN・HTML版)

このガイドでは、CDNを使用してSwiperとGSAPを連動させたスライダーをHTML環境で実装する手順を説明します。

---

## 1. CDNの読み込み

`<head>` タグ内にCSSを追加:

```html
<!-- Swiper CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
```

`</body>` タグの直前にJSを追加:

```html
<!-- GSAP -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>

<!-- Swiper -->
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
```

---

## 2. HTML構造

```html
<div class="swiper gsap-slider">
  <div class="swiper-wrapper">

    <div class="swiper-slide" style="background-color: #fef3c7;">
      <h2 class="slide-title">Slide 1</h2>
      <p class="slide-description">説明テキスト</p>
    </div>

    <div class="swiper-slide" style="background-color: #dbeafe;">
      <h2 class="slide-title">Slide 2</h2>
      <p class="slide-description">説明テキスト</p>
    </div>

    <div class="swiper-slide" style="background-color: #dcfce7;">
      <h2 class="slide-title">Slide 3</h2>
      <p class="slide-description">説明テキスト</p>
    </div>

  </div>

  <!-- ナビゲーション -->
  <div class="swiper-button-prev"></div>
  <div class="swiper-button-next"></div>

  <!-- ページネーション -->
  <div class="swiper-pagination"></div>
</div>
```

---

## 3. CSS スタイル

```css
.gsap-slider {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.gsap-slider .swiper-slide {
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.slide-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.slide-description {
  font-size: 1rem;
  color: #666;
}
```

---

## 4. JavaScript 初期化

```javascript
document.addEventListener('DOMContentLoaded', function() {

  // スライド変更時のアニメーション
  function animateSlide(swiper) {
    var activeSlide = swiper.slides[swiper.activeIndex];
    var title = activeSlide.querySelector('.slide-title');
    var description = activeSlide.querySelector('.slide-description');

    // タイムライン作成
    var tl = gsap.timeline();

    tl.fromTo(
      title,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    )
    .fromTo(
      description,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.4 },
      '-=0.3'
    );
  }

  // Swiper 初期化
  var swiper = new Swiper('.gsap-slider', {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: false,

    // ナビゲーション
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    // ページネーション
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },

    // イベント
    on: {
      init: function() {
        animateSlide(this);
      },
      slideChangeTransitionStart: function() {
        animateSlide(this);
      }
    }
  });

});
```

---

## 5. 応用: カスタムアニメーションパターン

### パターン A: フェードイン + スケール

```javascript
function animateSlide(swiper) {
  var activeSlide = swiper.slides[swiper.activeIndex];

  gsap.fromTo(
    activeSlide,
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }
  );
}
```

### パターン B: 左右からスライドイン

```javascript
function animateSlide(swiper) {
  var activeSlide = swiper.slides[swiper.activeIndex];
  var direction = swiper.activeIndex > swiper.previousIndex ? 1 : -1;

  gsap.fromTo(
    activeSlide.querySelector('.slide-title'),
    { opacity: 0, x: 100 * direction },
    { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
  );
}
```

### パターン C: 連続アニメーション (Stagger)

```javascript
function animateSlide(swiper) {
  var activeSlide = swiper.slides[swiper.activeIndex];
  var elements = activeSlide.querySelectorAll('.animate-item');

  gsap.fromTo(
    elements,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1,  // 各要素を0.1秒ずつ遅延
      ease: 'power2.out'
    }
  );
}
```

---

## 6. Swiperのアニメーションを無効化

GSAPに完全制御を委譲する場合:

```javascript
var swiper = new Swiper('.gsap-slider', {
  speed: 0,  // Swiper のトランジションを無効化
  effect: 'fade',
  fadeEffect: {
    crossFade: true
  },
  // ...
});
```

---

## 7. 完成版サンプルコード

以下のファイルを `html/` フォルダに作成してください:

### html/slider.html

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Swiper + GSAP Demo</title>

  <!-- Swiper CSS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f5f5f5;
      padding: 2rem;
    }

    .gsap-slider {
      width: 100%;
      max-width: 800px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }

    .gsap-slider .swiper-slide {
      height: 400px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem;
    }

    .slide-title {
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 1rem;
      color: #333;
    }

    .slide-description {
      font-size: 1.125rem;
      color: #666;
      max-width: 400px;
    }

    .slide-button {
      margin-top: 1.5rem;
      padding: 0.75rem 2rem;
      background-color: #333;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .slide-button:hover {
      background-color: #555;
    }

    /* Swiper カスタマイズ */
    .swiper-button-next,
    .swiper-button-prev {
      color: #333;
    }

    .swiper-pagination-bullet-active {
      background-color: #333;
    }
  </style>
</head>
<body>

  <div class="swiper gsap-slider">
    <div class="swiper-wrapper">

      <div class="swiper-slide" style="background-color: #fef3c7;">
        <h2 class="slide-title">Welcome</h2>
        <p class="slide-description">GSAPとSwiperを組み合わせた美しいスライダーです。</p>
        <button class="slide-button">詳しく見る</button>
      </div>

      <div class="swiper-slide" style="background-color: #dbeafe;">
        <h2 class="slide-title">Features</h2>
        <p class="slide-description">スムーズなアニメーションと直感的な操作性を実現。</p>
        <button class="slide-button">機能一覧</button>
      </div>

      <div class="swiper-slide" style="background-color: #dcfce7;">
        <h2 class="slide-title">Get Started</h2>
        <p class="slide-description">簡単なセットアップで今すぐ始められます。</p>
        <button class="slide-button">始める</button>
      </div>

    </div>

    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
    <div class="swiper-pagination"></div>
  </div>

  <!-- GSAP -->
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>

  <!-- Swiper -->
  <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

  <script>
    document.addEventListener('DOMContentLoaded', function() {

      function animateSlide(swiper) {
        var activeSlide = swiper.slides[swiper.activeIndex];
        var title = activeSlide.querySelector('.slide-title');
        var description = activeSlide.querySelector('.slide-description');
        var button = activeSlide.querySelector('.slide-button');

        var tl = gsap.timeline();

        tl.fromTo(
          title,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
        )
        .fromTo(
          description,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.3'
        )
        .fromTo(
          button,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' },
          '-=0.2'
        );
      }

      var swiper = new Swiper('.gsap-slider', {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: false,

        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },

        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },

        on: {
          init: function() {
            animateSlide(this);
          },
          slideChangeTransitionStart: function() {
            animateSlide(this);
          }
        }
      });

    });
  </script>

</body>
</html>
```

---

## 8. 主要なSwiperイベント一覧

| イベント名 | タイミング |
|-----------|-----------|
| `init` | 初期化時 |
| `slideChange` | スライド変更後 |
| `slideChangeTransitionStart` | トランジション開始時 |
| `slideChangeTransitionEnd` | トランジション終了時 |
| `progress` | スワイプ中の進捗 (0-1) |
| `touchStart` | タッチ/クリック開始 |
| `touchEnd` | タッチ/クリック終了 |

---

## 9. トラブルシューティング

### スタイルが適用されない

- Swiper CSSのCDNリンクが `<head>` 内にあるか確認
- ブラウザのキャッシュをクリア

### アニメーションが動かない

1. GSAPのCDNがSwiperより先に読み込まれているか確認
2. `DOMContentLoaded` イベント内で初期化しているか確認
3. セレクタが正しいか確認 (typoがないか)

### スライドが表示されない

- `.swiper-wrapper` と `.swiper-slide` のクラス名が正確か確認
- 高さが設定されているか確認

---

## 参考リンク

- [Swiper Getting Started](https://swiperjs.com/get-started)
- [Swiper API](https://swiperjs.com/swiper-api)
- [GSAP Documentation](https://greensock.com/docs/)
