'use client'
import { useState } from 'react'
import { ThumbsUp, Heart, Flame, HandMetal, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ReactionsProps {
  reactions: { like: number; love: number; fire: number; clap: number; mind_blown: number }
  onReact: (type: string) => void
}

const reactionTypes = [
  { key: 'like', icon: ThumbsUp, label: 'Like' },
  { key: 'love', icon: Heart, label: 'Love' },
  { key: 'fire', icon: Flame, label: 'Fire' },
  { key: 'clap', icon: HandMetal, label: 'Clap' },
  { key: 'mind_blown', icon: Sparkles, label: 'Mind Blown' },
]

export function Reactions({ reactions, onReact }: ReactionsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {reactionTypes.map(r => {
        const Icon = r.icon
        const count = (reactions as any)[r.key] || 0
        return (
          <Button key={r.key} variant="outline" size="sm" onClick={() => onReact(r.key)} className="gap-1.5">
            <Icon className="h-4 w-4" />
            <span className="text-xs">{count}</span>
          </Button>
        )
      })}
    </div>
  )
}
