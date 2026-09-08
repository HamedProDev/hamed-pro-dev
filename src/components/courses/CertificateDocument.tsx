'use client'
import { useState, useRef } from 'react'
import QRCode from 'react-qr-code'
import { toPng } from 'html-to-image'
import { Award, BadgeCheck, Printer, Download, Link2, Check, Loader2 } from 'lucide-react'

function ShareIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d={path} />
    </svg>
  )
}

const X_LOGO = 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'
const WHATSAPP_LOGO = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z'
const LINKEDIN_LOGO = 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'

interface CertificateDocumentProps {
  certificateNumber: string
  courseTitle: string
  recipientName: string
  issueDate: string
  score?: number | null
  verified?: boolean
}

export function CertificateDocument({
  certificateNumber,
  courseTitle,
  recipientName,
  issueDate,
  score,
  verified = true,
}: CertificateDocumentProps) {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const docRef = useRef<HTMLDivElement>(null)

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/verify/${certificateNumber}` : ''

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const downloadPng = async () => {
    if (!docRef.current) return
    setDownloading(true)
    try {
      const dataUrl = await toPng(docRef.current, { pixelRatio: 2, backgroundColor: '#ffffff', cacheBust: true })
      const link = document.createElement('a')
      link.download = `certificate-${certificateNumber}.png`
      link.href = dataUrl
      link.click()
    } catch {
      // Fall back to the browser's print dialog if image capture fails.
      window.print()
    }
    setDownloading(false)
  }

  return (
    <div>
      {/* Toolbar (hidden on print) */}
      <div className="no-print flex flex-wrap items-center justify-center gap-3 mb-6">
        <button
          onClick={downloadPng}
          disabled={downloading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-bg text-white text-sm font-medium shadow-lg shadow-blue-500/25 hover:brightness-110 transition-all disabled:opacity-60"
        >
          {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {downloading ? 'Generating…' : 'Download PNG'}
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass text-text-primary text-sm font-medium hover:border-blue-500/40 transition-all"
        >
          <Printer className="h-4 w-4" /> Print / PDF
        </button>
        <button
          onClick={copyLink}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass text-text-primary text-sm font-medium hover:border-blue-500/40 transition-all"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Link2 className="h-4 w-4" />}
          {copied ? 'Link Copied!' : 'Copy Share Link'}
        </button>
        <span className="text-text-muted text-sm">Share:</span>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just earned my "${courseTitle}" certificate! 🎓`)}&url=${encodeURIComponent(shareUrl)}`}
          target="_blank" rel="noopener noreferrer"
          className="h-9 w-9 flex items-center justify-center rounded-lg glass text-text-secondary hover:text-text-primary hover:border-blue-500/40 transition-all"
          aria-label="Share on X"
          title="Share on X"
        ><ShareIcon path={X_LOGO} /></a>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`I just earned my "${courseTitle}" certificate! 🎓 ${shareUrl}`)}`}
          target="_blank" rel="noopener noreferrer"
          className="h-9 w-9 flex items-center justify-center rounded-lg glass text-text-secondary hover:text-text-primary hover:border-blue-500/40 transition-all"
          aria-label="Share on WhatsApp"
          title="Share on WhatsApp"
        ><ShareIcon path={WHATSAPP_LOGO} /></a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
          target="_blank" rel="noopener noreferrer"
          className="h-9 w-9 flex items-center justify-center rounded-lg glass text-text-secondary hover:text-text-primary hover:border-blue-500/40 transition-all"
          aria-label="Share on LinkedIn"
          title="Share on LinkedIn"
        ><ShareIcon path={LINKEDIN_LOGO} /></a>
      </div>

      {/* Certificate document */}
      <div ref={docRef} className="relative rounded-3xl p-[3px] bg-gradient-to-br from-blue-500/40 via-indigo-500/40 to-cyan-400/40 shadow-2xl shadow-blue-500/20">
        <div className="rounded-[22px] bg-white text-slate-900 overflow-hidden">
          {/* inner gold/blue double border */}
          <div className="m-2 rounded-2xl border-2 border-blue-200 p-2">
            <div className="rounded-xl border border-blue-100 p-8 sm:p-12 relative">
              {/* subtle corner accents */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-blue-500/30 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-blue-500/30 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-blue-500/30 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-blue-500/30 rounded-br-2xl" />

              <div className="text-center relative">
                <div className="flex justify-center mb-5">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    <Award className="h-8 w-8" />
                  </div>
                </div>

                <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-blue-600 font-semibold mb-2">
                  Certificate of Completion
                </p>
                <p className="text-sm text-slate-500 mb-6">This is to certify that</p>

                <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-6">
                  {recipientName}
                </h2>

                <p className="text-sm text-slate-500 mb-2">has successfully completed the course</p>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">{courseTitle}</h3>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 text-xs text-slate-500 mb-6">
                  <div>
                    <p className="uppercase tracking-wider text-slate-400 mb-1">Issued on</p>
                    <p className="font-semibold text-slate-700">
                      {new Date(issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="hidden sm:block h-8 w-px bg-blue-100" />
                  <div>
                    <p className="uppercase tracking-wider text-slate-400 mb-1">Certificate ID</p>
                    <p className="font-mono font-semibold text-slate-700">{certificateNumber}</p>
                  </div>
                  {score !== null && score !== undefined && (
                    <>
                      <div className="hidden sm:block h-8 w-px bg-blue-100" />
                      <div>
                        <p className="uppercase tracking-wider text-slate-400 mb-1">Score</p>
                        <p className="font-semibold text-slate-700">{score}%</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-6 pt-6 border-t border-blue-100">
                  <div className="text-center">
                    <div className="h-12 w-12 mx-auto mb-2 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                      <BadgeCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">Verified</p>
                    {verified && (
                      <p className="text-[10px] text-slate-400">Verify at {shareUrl.replace(/^https?:\/\//, '').replace(/\/.*/, '')}/verify</p>
                    )}
                  </div>

                  {/* QR code for instant verification */}
                  <div className="text-center">
                    <div className="mx-auto mb-1 w-20 h-20 p-1 bg-white rounded-lg border border-blue-100">
                      {shareUrl && <QRCode value={shareUrl} size={72} fgColor="#0f172a" bgColor="#ffffff" />}
                    </div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">Scan to verify</p>
                  </div>

                  <div className="text-center">
                    <p className="font-serif text-xl italic text-slate-700 mb-1">Hamed Hussein</p>
                    <div className="w-32 h-px bg-slate-300 mx-auto mb-1" />
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">Fullstack & AI/ML Engineer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
