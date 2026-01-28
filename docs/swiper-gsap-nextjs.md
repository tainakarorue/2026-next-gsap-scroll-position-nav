# Swiper + GSAP 実装ガイド (Next.js版)

このガイドでは、Next.js環境でSwiperとGSAPを連動させたスライダーを実装する手順を説明します。

---

## 1. パッケージのインストール

```bash
npm install swiper
```

> 既に `gsap` と `@gsap/react` はインストール済みです。

---

## 2. コンポーネントの作成

`components/gsap-slider.tsx` を作成してください。

### 基本構造

```tsx
'use client'

import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

// Swiper のスタイル
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const SLIDES = [
  { id: 1, title: 'Slide 1', color: '#fef3c7' },
  { id: 2, title: 'Slide 2', color: '#dbeafe' },
  { id: 3, title: 'Slide 3', color: '#dcfce7' },
]

export function GsapSlider() {
  const swiperRef = useRef<SwiperType | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // スライド変更時のアニメーション
  const animateSlide = (swiper: SwiperType) => {
    const activeSlide = swiper.slides[swiper.activeIndex]
    const title = activeSlide?.querySelector('.slide-title')

    if (title) {
      gsap.fromTo(
        title,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      )
    }
  }

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        onSlideChangeTransitionStart={animateSlide}
        onInit={animateSlide}
        className="rounded-lg overflow-hidden"
      >
        {SLIDES.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="h-[400px] flex items-center justify-center"
              style={{ backgroundColor: slide.color }}
            >
              <h2 className="slide-title text-4xl font-bold">{slide.title}</h2>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
```

---

## 3. useGSAP の contextSafe と scope

### contextSafe の役割

`contextSafe` は、**アニメーションが作成される場所**によって必要かどうかが決まります。

| 作成場所                               | contextSafe                |
| -------------------------------------- | -------------------------- |
| `useGSAP` のコールバック内で直接作成   | 不要（自動クリーンアップ） |
| イベントハンドラ・コールバック内で作成 | **必要**                   |

Swiperのイベントハンドラ（`onSlideChangeTransitionStart` など）内でアニメーションを作成する場合、`useGSAP` のコールバック外で実行されるため、`contextSafe` でラップする必要があります。

```tsx
const containerRef = useRef<HTMLDivElement>(null)

// useGSAP から contextSafe を取得
const { contextSafe } = useGSAP({ scope: containerRef })

// contextSafe でラップすることで、アニメーションが適切にクリーンアップされる
const animateSlide = contextSafe((swiper: SwiperType) => {
  const activeSlide = swiper.slides[swiper.activeIndex]
  const title = activeSlide?.querySelector('.slide-title')

  if (title) {
    gsap.fromTo(
      title,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    )
  }
})

// イベントハンドラとして使用
<Swiper onSlideChangeTransitionStart={animateSlide}>
```

### scope の役割

`scope` には主に2つの役割があります。

**1. セレクタの範囲を制限**

文字列セレクタを使用した場合、`scope` 内の要素のみが対象になります。

```tsx
const containerRef = useRef<HTMLDivElement>(null)

useGSAP(
  () => {
    // scope を設定すると、containerRef 内の .box のみが対象
    // 同じクラス名を持つ他のコンポーネントの要素に影響を与えない
    gsap.to('.box', { x: 100 })
  },
  { scope: containerRef },
)
```

**2. クリーンアップの対象範囲**

コンポーネントがアンマウントされたとき、`scope` 内で作成されたアニメーションが自動的にクリーンアップされます。

---

## 4. ページでの使用

`app/page.tsx` にコンポーネントを追加します。

```tsx
import { GsapSlider } from '@/components/gsap-slider'

export default function Page() {
  return (
    <main className="py-20">
      <GsapSlider />
    </main>
  )
}
```

---

## 5. 応用: カスタムアニメーションパターン

### パターン A: フェードイン + スケール

```tsx
const animateSlide = (swiper: SwiperType) => {
  const activeSlide = swiper.slides[swiper.activeIndex]

  gsap.fromTo(
    activeSlide,
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' },
  )
}
```

### パターン B: 複数要素の連続アニメーション

```tsx
const animateSlide = (swiper: SwiperType) => {
  const activeSlide = swiper.slides[swiper.activeIndex]
  const title = activeSlide?.querySelector('.slide-title')
  const description = activeSlide?.querySelector('.slide-description')
  const button = activeSlide?.querySelector('.slide-button')

  const tl = gsap.timeline()

  tl.fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5 })
    .fromTo(
      description,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4 },
      '-=0.2', // 前のアニメーションと0.2秒重なる
    )
    .fromTo(
      button,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.3 },
      '-=0.1',
    )
}
```

### パターン C: 前スライドのアニメーション終了

```tsx
const animateSlideOut = (swiper: SwiperType) => {
  const previousSlide = swiper.slides[swiper.previousIndex]

  if (previousSlide) {
    gsap.to(previousSlide, {
      opacity: 0,
      x: -50,
      duration: 0.3,
    })
  }
}

const animateSlideIn = (swiper: SwiperType) => {
  const activeSlide = swiper.slides[swiper.activeIndex]

  gsap.fromTo(
    activeSlide,
    { opacity: 0, x: 50 },
    { opacity: 1, x: 0, duration: 0.5, delay: 0.2 },
  )
}

// Swiper に両方設定
// onSlideChangeTransitionStart={animateSlideOut}
// onSlideChangeTransitionEnd={animateSlideIn}
```

---

## 6. Swiperのアニメーションを無効化する場合

GSAP に完全にアニメーションを委譲したい場合:

```tsx
<Swiper
  speed={0}  // Swiperのトランジションを無効化
  effect="fade"
  fadeEffect={{ crossFade: true }}
  // ...
>
```

---

## 7. 主要なSwiperイベント一覧

| イベント名                     | タイミング             |
| ------------------------------ | ---------------------- |
| `onInit`                       | 初期化時               |
| `onSlideChange`                | スライド変更後         |
| `onSlideChangeTransitionStart` | トランジション開始時   |
| `onSlideChangeTransitionEnd`   | トランジション終了時   |
| `onProgress`                   | スワイプ中の進捗 (0-1) |
| `onTouchStart`                 | タッチ/クリック開始    |
| `onTouchEnd`                   | タッチ/クリック終了    |

---

## 8. TypeScript 型定義

```tsx
import type { Swiper as SwiperType } from 'swiper'
import type { SwiperOptions } from 'swiper/types'

// Swiper インスタンスの型
const swiperRef = useRef<SwiperType | null>(null)

// オプションの型
const swiperOptions: SwiperOptions = {
  slidesPerView: 1,
  spaceBetween: 20,
  // ...
}
```

---

## 9. トラブルシューティング

### スタイルが適用されない

`'use client'` ディレクティブがあるか確認してください。また、CSSインポートが正しいか確認:

```tsx
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
```

### GSAP アニメーションが動かない

1. 対象要素が存在するか確認 (`querySelector` の結果が `null` でないか)
2. `useGSAP` フック内でアニメーションを実行しているか確認
3. 要素に `opacity: 0` などの初期スタイルが設定されていないか確認

---

## 参考リンク

- [Swiper React](https://swiperjs.com/react)
- [GSAP Documentation](https://greensock.com/docs/)
- [@gsap/react](https://www.npmjs.com/package/@gsap/react)
