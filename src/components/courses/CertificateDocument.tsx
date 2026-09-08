'use client'
import { useState } from 'react'
import { Award, BadgeCheck, Printer, Link2, Check } from 'lucide-react'

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

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/verify/${certificateNumber}` : ''

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div>
      {/* Toolbar (hidden on print) */}
      <div className="no-print flex flex-wrap items-center justify-center gap-3 mb-6">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-bg text-white text-sm font-medium shadow-lg shadow-blue-500/25 hover:brightness-110 transition-all"
        >
          <Printer className="h-4 w-4" /> Download / Print
        </button>
        <button
          onClick={copyLink}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass text-text-primary text-sm font-medium hover:border-blue-500/40 transition-all"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Link2 className="h-4 w-4" />}
          {copied ? 'Link Copied!' : 'Copy Share Link'}
        </button>
      </div>

      {/* Certificate document */}
      <div className="relative rounded-3xl p-[3px] bg-gradient-to-br from-blue-500/40 via-indigo-500/40 to-cyan-400/40 shadow-2xl shadow-blue-500/20">
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

                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
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
                      <p className="text-[10px] text-slate-400">Verify at hamedprodev.rw/verify</p>
                    )}
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
