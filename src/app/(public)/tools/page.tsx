'use client'
import { useState } from 'react'
import type { Metadata } from 'next'

const tools = [
  { id: 'regex', name: 'Regex Tester', description: 'Test regular expressions with real-time matching' },
  { id: 'json', name: 'JSON Formatter', description: 'Beautify and validate JSON data' },
  { id: 'base64', name: 'Base64 Encoder/Decoder', description: 'Encode and decode Base64 strings' },
  { id: 'jwt', name: 'JWT Decoder', description: 'Decode JSON Web Tokens' },
  { id: 'color', name: 'Color Picker', description: 'Pick colors and get HEX, RGB, HSL values' },
  { id: 'cron', name: 'Cron Builder', description: 'Build cron expressions visually' },
  { id: 'markdown', name: 'Markdown Previewer', description: 'Live preview Markdown with syntax highlighting' },
]

function RegexTool() {
  const [pattern, setPattern] = useState('')
  const [testStr, setTestStr] = useState('')
  const [matches, setMatches] = useState<string[]>([])
  const handleTest = () => { try { const re = new RegExp(pattern, 'g'); setMatches(testStr.match(re) || []) } catch { setMatches([]) } }
  return (
    <div className="space-y-4">
      <input placeholder="Regex pattern" value={pattern} onChange={e => setPattern(e.target.value)} className="w-full rounded-lg border border-border-primary bg-surface-tertiary px-3 py-2 text-sm text-text-primary" />
      <textarea placeholder="Test string" value={testStr} onChange={e => setTestStr(e.target.value)} className="w-full rounded-lg border border-border-primary bg-surface-tertiary px-3 py-2 text-sm text-text-primary h-24" />
      <button onClick={handleTest} className="px-4 py-2 rounded-lg bg-brand-primary text-white text-sm">Test</button>
      <div className="text-sm text-text-secondary">Matches: {matches.length > 0 ? matches.join(', ') : 'None'}</div>
    </div>
  )
}

function JsonTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const format = () => { try { setOutput(JSON.stringify(JSON.parse(input), null, 2)); setError('') } catch (e: any) { setError(e.message); setOutput('') } }
  return (
    <div className="space-y-4">
      <textarea placeholder="Paste JSON here" value={input} onChange={e => setInput(e.target.value)} className="w-full rounded-lg border border-border-primary bg-surface-tertiary px-3 py-2 text-sm text-text-primary font-mono h-40" />
      <button onClick={format} className="px-4 py-2 rounded-lg bg-brand-primary text-white text-sm">Format</button>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {output && <pre className="rounded-lg border border-border-primary bg-surface-card p-4 text-sm text-text-primary font-mono overflow-auto max-h-60">{output}</pre>}
    </div>
  )
}

function Base64Tool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const encode = () => { try { setOutput(btoa(input)) } catch { setOutput('Error') } }
  const decode = () => { try { setOutput(atob(input)) } catch { setOutput('Error') } }
  return (
    <div className="space-y-4">
      <textarea placeholder="Input text" value={input} onChange={e => setInput(e.target.value)} className="w-full rounded-lg border border-border-primary bg-surface-tertiary px-3 py-2 text-sm text-text-primary h-24" />
      <div className="flex gap-2"><button onClick={encode} className="px-4 py-2 rounded-lg bg-brand-primary text-white text-sm">Encode</button><button onClick={decode} className="px-4 py-2 rounded-lg bg-surface-tertiary text-text-primary text-sm border border-border-primary">Decode</button></div>
      {output && <pre className="rounded-lg border border-border-primary bg-surface-card p-4 text-sm text-text-primary font-mono break-all">{output}</pre>}
    </div>
  )
}

function JwtTool() {
  const [token, setToken] = useState('')
  const [decoded, setDecoded] = useState<any>(null)
  const decode = () => { try { const parts = token.split('.'); setDecoded({ header: JSON.parse(atob(parts[0])), payload: JSON.parse(atob(parts[1])) }) } catch { setDecoded(null) } }
  return (
    <div className="space-y-4">
      <textarea placeholder="Paste JWT token" value={token} onChange={e => setToken(e.target.value)} className="w-full rounded-lg border border-border-primary bg-surface-tertiary px-3 py-2 text-sm text-text-primary font-mono h-24" />
      <button onClick={decode} className="px-4 py-2 rounded-lg bg-brand-primary text-white text-sm">Decode</button>
      {decoded && <div className="space-y-2"><div><h4 className="text-sm font-semibold text-text-primary mb-1">Header</h4><pre className="rounded border border-border-primary bg-surface-card p-3 text-xs text-text-primary font-mono">{JSON.stringify(decoded.header, null, 2)}</pre></div><div><h4 className="text-sm font-semibold text-text-primary mb-1">Payload</h4><pre className="rounded border border-border-primary bg-surface-card p-3 text-xs text-text-primary font-mono">{JSON.stringify(decoded.payload, null, 2)}</pre></div></div>}
    </div>
  )
}

function ColorTool() {
  const [color, setColor] = useState('#6366f1')
  return (
    <div className="space-y-4">
      <input type="color" value={color} onChange={e => setColor(e.target.value)} className="h-12 w-24 rounded cursor-pointer" />
      <div className="grid grid-cols-3 gap-2 text-sm"><div className="rounded border border-border-primary bg-surface-card p-2"><span className="text-text-muted">HEX</span><p className="font-mono text-text-primary">{color}</p></div><div className="rounded border border-border-primary bg-surface-card p-2"><span className="text-text-muted">RGB</span><p className="font-mono text-text-primary">{parseInt(color.slice(1,3),16)}, {parseInt(color.slice(3,5),16)}, {parseInt(color.slice(5,7),16)}</p></div></div>
      <div className="h-20 rounded-lg" style={{ backgroundColor: color }} />
    </div>
  )
}

function CronTool() {
  const [fields, setFields] = useState({ minute: '*', hour: '*', day: '*', month: '*', weekday: '*' })
  const expression = `${fields.minute} ${fields.hour} ${fields.day} ${fields.month} ${fields.weekday}`
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-2">{Object.entries(fields).map(([key, val]) => (<div key={key}><label className="text-xs text-text-muted capitalize">{key}</label><input value={val} onChange={e => setFields({ ...fields, [key]: e.target.value })} className="w-full rounded border border-border-primary bg-surface-tertiary px-2 py-1 text-sm text-text-primary font-mono mt-1" /></div>))}</div>
      <div className="rounded border border-border-primary bg-surface-card p-3 font-mono text-sm text-brand-primary">{expression}</div>
    </div>
  )
}

function MarkdownTool() {
  const [md, setMd] = useState('# Hello World\n\nThis is **bold** and *italic*.\n\n- Item 1\n- Item 2')
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <textarea value={md} onChange={e => setMd(e.target.value)} className="w-full rounded-lg border border-border-primary bg-surface-tertiary px-3 py-2 text-sm text-text-primary font-mono h-64" />
      <div className="rounded-lg border border-border-primary bg-surface-card p-4 text-sm text-text-primary prose prose-invert max-h-64 overflow-auto" dangerouslySetInnerHTML={{ __html: md.replace(/^### (.*)$/gm, '<h3>$1</h3>').replace(/^## (.*)$/gm, '<h2>$1</h2>').replace(/^# (.*)$/gm, '<h1>$1</h1>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/^- (.*)$/gm, '<li>$1</li>').replace(/\n/g, '<br/>') }} />
    </div>
  )
}

const toolComponents: Record<string, React.FC> = { regex: RegexTool, json: JsonTool, base64: Base64Tool, jwt: JwtTool, color: ColorTool, cron: CronTool, markdown: MarkdownTool }

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState('json')
  const ActiveComponent = toolComponents[activeTool]
  return (
    <div className="section-padding">
      <div className="container-wide">
        <h1 className="text-4xl font-bold mb-4">Developer Tools</h1>
        <p className="text-text-secondary mb-8">Free browser-based tools for developers.</p>
        <div className="flex flex-wrap gap-2 mb-8">
          {tools.map(t => (
            <button key={t.id} onClick={() => setActiveTool(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTool === t.id ? 'bg-brand-primary text-white' : 'bg-surface-card text-text-secondary hover:text-text-primary border border-border-primary'}`}>{t.name}</button>
          ))}
        </div>
        <div className="rounded-xl border border-border-primary bg-surface-card p-6">
          <h2 className="text-xl font-semibold mb-2">{tools.find(t => t.id === activeTool)?.name}</h2>
          <p className="text-sm text-text-secondary mb-6">{tools.find(t => t.id === activeTool)?.description}</p>
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  )
}
