import { createServiceClient } from '@/lib/supabase/server'

// XP awarded per action (kept modest so levels feel earned).
export const XP = {
  LESSON_COMPLETE: 10,
  LESSON_QUIZ_PERFECT: 5,
  COURSE_COMPLETE: 100,
  FINAL_QUIZ_PASS: 50,
  COMMENT_POSTED: 2,
  CERTIFICATE_EARNED: 25,
} as const

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function daysAgoISO(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

/**
 * Award XP to a user, log the event, and refresh their daily streak.
 * Safe to call when Supabase isn't configured (no-ops gracefully).
 */
export async function awardXp(
  userId: string,
  points: number,
  event: string,
  meta: Record<string, any> = {},
): Promise<void> {
  if (!userId || points <= 0) return
  const supabase = createServiceClient()
  try {
    await supabase.from('user_xp_events').insert({ user_id: userId, event, points, meta })
    await supabase.rpc('add_xp', { uid: userId, amount: points })
    await updateStreak(userId)
  } catch {
    // Non-critical — never block the primary flow on gamification errors.
  }
}

/**
 * Update current/longest streak based on consecutive days of activity.
 */
export async function updateStreak(userId: string): Promise<void> {
  if (!userId) return
  const supabase = createServiceClient()
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('current_streak, longest_streak, last_activity_date')
      .eq('id', userId)
      .single()

    const today = todayISO()
    const last = profile?.last_activity_date || null
    let current = profile?.current_streak || 0

    if (last === today) return // already counted today

    if (last === daysAgoISO(1)) {
      current += 1
    } else {
      current = 1
    }

    const longest = Math.max(profile?.longest_streak || 0, current)
    await supabase
      .from('profiles')
      .update({ current_streak: current, longest_streak: longest, last_activity_date: today })
      .eq('id', userId)
  } catch {
    // Non-critical.
  }
}

/**
 * Fetch a user's gamification summary (XP, streaks, recent events, weekly totals).
 */
export async function getGamification(userId: string) {
  const supabase = createServiceClient()
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('xp_points, current_streak, longest_streak')
      .eq('id', userId)
      .single()

    const since = new Date()
    since.setDate(since.getDate() - 6)
    const { data: events } = await supabase
      .from('user_xp_events')
      .select('event, points, created_at')
      .eq('user_id', userId)
      .gte('created_at', since.toISOString().slice(0, 10))
      .order('created_at', { ascending: true })

    // Aggregate XP per day for the last 7 days.
    const days: { day: string; xp: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      const label = d.toLocaleDateString('en-US', { weekday: 'short' })
      const xp = (events || [])
        .filter((e: any) => e.created_at.slice(0, 10) === key)
        .reduce((sum: number, e: any) => sum + (e.points || 0), 0)
      days.push({ day: label, xp })
    }

    return {
      xp_points: profile?.xp_points || 0,
      current_streak: profile?.current_streak || 0,
      longest_streak: profile?.longest_streak || 0,
      recent_events: (events || []).slice(-10).reverse(),
      weekly: days,
    }
  } catch {
    return { xp_points: 0, current_streak: 0, longest_streak: 0, recent_events: [], weekly: [] }
  }
}
