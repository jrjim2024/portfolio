import { writeFileSync, readFileSync } from 'node:fs'

const html = `<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="author" content="\u5FB7\u7C73\u651D\u5F71\u6709\u9650\u516C\u53F8" />
    <meta name="application-name" content="Demi Studio" />
    <meta
      name="keywords"
      content="Demi Studio, demi studio, demi-studio, \u5FB7\u7C73\u651D\u5F71, \u5FB7\u7C73\u651D\u5F71\u6709\u9650\u516C\u53F8, Demi Photo Studio, \u5FB7\u7C73\u651D\u5F71 Demi Photo Studio, demiart2015, demi_weddingstudio, \u5A5A\u7D17\u651D\u5F71, \u8F15\u5A5A\u7D17, \u5A5A\u79AE\u651D\u5F71, \u7D50\u5A5A\u767B\u8A18\u651D\u5F71, \u60C5\u4FB6\u5BEB\u771F, \u5546\u696D\u651D\u5F71, \u53F0\u5317\u651D\u5F71\u5E2B"
    />
    <meta name="subject" content="\u5FB7\u7C73\u651D\u5F71 Demi Photo Studio\uFF5C\u5A5A\u7D17\u5A5A\u79AE\u8207\u5546\u696D\u651D\u5F71" />

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta name="theme-color" content="#111111" />
    <meta name="color-scheme" content="light" />

    <title>Demi Studio\uFF5C\u5FB7\u7C73\u651D\u5F71 Demi Photo Studio\uFF5C\u5A5A\u7D17\u5A5A\u79AE\u30FB\u5546\u696D\u651D\u5F71</title>
    <meta
      name="description"
      content="Demi Studio\uFF08\u5FB7\u7C73\u651D\u5F71\uFF0FDemi Photo Studio\uFF0CFacebook\uFF1Ademiart2015\uFF0CInstagram\uFF1Ademi_weddingstudio\uFF09\u5B98\u65B9\u7DB2\u7AD9\u3002\u53F0\u5317\u5A5A\u7D17\u651D\u5F71\u3001\u8F15\u5A5A\u7D17\u3001\u5A5A\u79AE\u7D00\u9304\u3001\u7D50\u5A5A\u767B\u8A18\u8207\u60C5\u4FB6\u5BEB\u771F\u3001\u5546\u696D\uFF0F\u54C1\u724C\u5F62\u8C61\u651D\u5F71\u3002"
    />
    <link rel="canonical" href="https://demi-studio.vercel.app/" />
    <link rel="alternate" hreflang="zh-Hant" href="https://demi-studio.vercel.app/" />
    <link rel="alternate" hreflang="x-default" href="https://demi-studio.vercel.app/" />

    <meta property="og:type" content="website" />
    <meta property="og:locale" content="zh_TW" />
    <meta property="og:site_name" content="Demi Studio" />
    <meta property="og:title" content="Demi Studio\uFF5C\u5FB7\u7C73\u651D\u5F71 Demi Photo Studio\uFF5C\u5A5A\u7D17\u5A5A\u79AE\u30FB\u5546\u696D\u651D\u5F71" />
    <meta
      property="og:description"
      content="\u5FB7\u7C73\u651D\u5F71 Demi Photo Studio \u5B98\u65B9\u7DB2\u7AD9\u3002\u5A5A\u7D17\u5A5A\u79AE\u3001\u5546\u696D\u651D\u5F71\uFF1B\u7167\u7247\u4E00\u534A\u7531\u6211\u5B8C\u6210\uFF0C\u53E6\u4E00\u534A\u7531\u6211\u5011\u4E00\u8D77\u5275\u9020\u3002"
    />
    <meta property="og:url" content="https://demi-studio.vercel.app/" />
    <meta property="og:image" content="https://demi-studio.vercel.app/og-image.jpg" />
    <meta property="og:image:secure_url" content="https://demi-studio.vercel.app/og-image.jpg" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Demi Studio \u2014 \u5FB7\u7C73\u651D\u5F71 Demi Photo Studio" />
    <meta property="og:see_also" content="https://www.facebook.com/demiart2015/" />
    <meta property="og:see_also" content="https://www.instagram.com/demi_weddingstudio/" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Demi Studio\uFF5C\u5FB7\u7C73\u651D\u5F71 Demi Photo Studio\uFF5C\u5A5A\u7D17\u5A5A\u79AE\u30FB\u5546\u696D\u651D\u5F71" />
    <meta
      name="twitter:description"
      content="\u5FB7\u7C73\u651D\u5F71 Demi Photo Studio \u5B98\u65B9\u7DB2\u7AD9\u3002\u5A5A\u7D17\u5A5A\u79AE\u3001\u5546\u696D\u651D\u5F71\uFF1B\u7167\u7247\u4E00\u534A\u7531\u6211\u5B8C\u6210\uFF0C\u53E6\u4E00\u534A\u7531\u6211\u5011\u4E00\u8D77\u5275\u9020\u3002"
    />
    <meta name="twitter:image" content="https://demi-studio.vercel.app/og-image.jpg" />
    <meta name="twitter:image:alt" content="Demi Studio \u2014 \u5FB7\u7C73\u651D\u5F71 Demi Photo Studio" />

    <script type="application/ld+json" id="site-jsonld">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["ProfessionalService", "PhotographyBusiness", "LocalBusiness"],
      "@id": "https://demi-studio.vercel.app/#business",
      "name": "Demi Studio",
      "legalName": "\u5FB7\u7C73\u651D\u5F71\u6709\u9650\u516C\u53F8",
      "alternateName": ["\u5FB7\u7C73\u651D\u5F71", "Demi Photo Studio", "demi-studio", "demi studio", "\u5FB7\u7C73\u651D\u5F71 Demi Photo Studio"],
      "description": "Demi Studio\uFF08\u5FB7\u7C73\u651D\u5F71\uFF0FDemi Photo Studio\uFF09\u63D0\u4F9B\u53F0\u5317\u5A5A\u7D17\u651D\u5F71\u3001\u5A5A\u79AE\u7D00\u9304\u3001\u7D50\u5A5A\u767B\u8A18\u8207\u5546\u696D\u651D\u5F71\u3002",
      "url": "https://demi-studio.vercel.app/",
      "image": "https://demi-studio.vercel.app/og-image.jpg",
      "logo": "https://demi-studio.vercel.app/apple-touch-icon.png",
      "telephone": "0907-493-168",
      "priceRange": "$$",
      "areaServed": [
        { "@type": "City", "name": "\u53F0\u5317" },
        { "@type": "AdministrativeArea", "name": "\u53F0\u7063" }
      ],
      "sameAs": [
        "https://www.facebook.com/demiart2015/",
        "https://www.instagram.com/demi_weddingstudio/",
        "https://line.me/ti/p/~noreg0108808"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://demi-studio.vercel.app/#website",
      "name": "Demi Studio",
      "alternateName": ["\u5FB7\u7C73\u651D\u5F71", "Demi Photo Studio", "demi-studio"],
      "url": "https://demi-studio.vercel.app/",
      "inLanguage": "zh-Hant",
      "publisher": { "@id": "https://demi-studio.vercel.app/#business" },
      "about": { "@id": "https://demi-studio.vercel.app/#business" }
    }
  ]
}
    </script>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&amp;family=Noto+Sans+TC:wght@300;400;500;700&amp;display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`

writeFileSync('index.html', html, 'utf8')

const manifest = {
  name: 'Demi Studio — \u5FB7\u7C73\u651D\u5F71 Demi Photo Studio',
  short_name: 'Demi Studio',
  description:
    '\u5FB7\u7C73\u651D\u5F71 Demi Photo Studio\uFF5C\u53F0\u5317\u5A5A\u7D17\u651D\u5F71\u3001\u5A5A\u79AE\u7D00\u9304\u8207\u5546\u696D\uFF0F\u54C1\u724C\u5F62\u8C61\u651D\u5F71\u3002',
  lang: 'zh-Hant',
  dir: 'ltr',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  background_color: '#FAF9F7',
  theme_color: '#111111',
  categories: ['photography', 'lifestyle'],
  icons: [
    { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  ],
}

writeFileSync('public/site.webmanifest', `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

const t = readFileSync('index.html', 'utf8')
console.log('index has 德米:', t.includes('德米攝影'))
console.log('title:', (t.match(/<title>([^<]+)<\/title>/) || [])[1])
console.log('manifest has 德米:', readFileSync('public/site.webmanifest', 'utf8').includes('德米攝影'))
