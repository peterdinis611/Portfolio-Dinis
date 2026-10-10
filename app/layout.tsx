import type { Metadata } from 'next'
import { DM_Sans, Instrument_Serif } from 'next/font/google'
import Script from 'next/script'
import '@/index.css'
import '@/styles/preload.css'
import { getSiteUrl, seoCopy } from '@/lib/seo'

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin', 'latin-ext'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: seoCopy.sk.title,
  description: seoCopy.sk.description,
}

const themeBootScript = `(function(){try{var t=localStorage.getItem('portfolio-theme');if(t!=='dark'&&t!=='light'){var m=document.cookie.match(/(?:^|; )portfolio-theme=(dark|light)/);t=m?m[1]:'light'}var a=localStorage.getItem('portfolio-animations')||'on';var r=document.documentElement;r.dataset.theme=t;r.classList.toggle('dark',t==='dark');r.dataset.animations=a}catch(e){}})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="sk"
      className={`${dmSans.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <Script id="theme-boot" strategy="beforeInteractive">
          {themeBootScript}
        </Script>
        {children}
      </body>
    </html>
  )
}
