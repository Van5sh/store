"use client"

import React from "react"
import { getRecentActivity, type RecentActivityItem } from "@/app/actions/activity/get-recent-activity"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function formatWhen(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString()
}

function formatDay(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}

function prettyType(type: string) {
  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function badgeClasses(type: string) {
  if (type.includes("order")) return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-900/40"
  if (type.includes("product")) return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-200 dark:border-emerald-900/40"
  if (type.includes("inventory")) return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-900/40"
  return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-200 dark:border-gray-900/40"
}

export default function VendorActivityPage() {
  const [items, setItems] = React.useState<RecentActivityItem[]>([])
  const [nextCursor, setNextCursor] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [loadingMore, setLoadingMore] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [typeFilter, setTypeFilter] = React.useState<string>("all")
  const sentinelRef = React.useRef<HTMLDivElement | null>(null)

  const load = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getRecentActivity({ limit: 20 })
      setItems(data.activities ?? [])
      setNextCursor(data.nextCursor ?? null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load recent activity")
    } finally {
      setLoading(false)
    }
  }, [])

  const loadMore = React.useCallback(async () => {
    if (!nextCursor || loadingMore) return
    setLoadingMore(true)
    try {
      const data = await getRecentActivity({ limit: 20, cursor: nextCursor })
      setItems((prev) => [...prev, ...(data.activities ?? [])])
      setNextCursor(data.nextCursor ?? null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load more activity")
    } finally {
      setLoadingMore(false)
    }
  }, [nextCursor, loadingMore])

  React.useEffect(() => {
    load()
  }, [load])

  React.useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) loadMore()
      },
      { root: null, threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [loadMore])

  const types = React.useMemo(() => {
    const unique = new Set(items.map((i) => i.type).filter(Boolean))
    return Array.from(unique).sort()
  }, [items])

  const filtered = React.useMemo(() => {
    if (typeFilter === "all") return items
    return items.filter((i) => i.type === typeFilter)
  }, [items, typeFilter])

  const grouped = React.useMemo(() => {
    const map = new Map<string, RecentActivityItem[]>()
    for (const item of filtered) {
      const key = formatDay(item.createdAt)
      const list = map.get(key) ?? []
      list.push(item)
      map.set(key, list)
    }
    return Array.from(map.entries())
  }, [filtered])

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#203A43] dark:text-[#F5F7FA]">Recent Activity</h1>
          <p className="text-sm text-gray-500 dark:text-gray-300">Latest changes and events for your vendor account</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Filter type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {types.map((t) => (
                <SelectItem key={t} value={t}>
                  {prettyType(t)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={load} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      {loading && items.length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-gray-300">Loading activity...</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-gray-300">No activity yet.</div>
      ) : (
        <div className="space-y-6">
          {grouped.map(([day, list]) => (
            <div key={day}>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-300 mb-2">{day}</div>
              <div className="space-y-3">
                {list.map((a) => (
                  <div
                    key={a.id}
                    className="border rounded-xl p-4 bg-white/70 dark:bg-[#1B3138]/70 dark:border-[#254757]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full border ${badgeClasses(a.type)}`}>
                            {prettyType(a.type)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-200 mt-2">{a.message}</div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-300 whitespace-nowrap">
                        {formatWhen(a.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        {nextCursor ? (
          <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? "Loading..." : "Load more"}
          </Button>
        ) : null}
      </div>

      <div ref={sentinelRef} className="h-8" />
    </div>
  )
}
