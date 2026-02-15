import { useState, useCallback } from 'react'

const STORAGE_KEY = 'radar-category-order'

function loadOrder(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore parse errors
  }
  return []
}

function saveOrder(order: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(order))
  } catch {
    // ignore storage errors
  }
}

export function useCategoryOrder() {
  const [order, setOrder] = useState<string[]>(loadOrder)

  // Reorder categories based on saved order.
  // Categories not in the saved order are appended at the end (handles new categories from API discovery).
  const applyOrder = useCallback(<T extends { name: string }>(categories: T[]): T[] => {
    if (order.length === 0) return categories

    const byName = new Map(categories.map((c) => [c.name, c]))
    const ordered: T[] = []

    // First: add categories in saved order
    for (const name of order) {
      const cat = byName.get(name)
      if (cat) {
        ordered.push(cat)
        byName.delete(name)
      }
    }

    // Then: append any remaining categories not in saved order
    for (const cat of categories) {
      if (byName.has(cat.name)) {
        ordered.push(cat)
      }
    }

    return ordered
  }, [order])

  // Move category from one index to another and persist
  const saveDragOrder = useCallback(<T extends { name: string }>(categories: T[], fromIndex: number, toIndex: number): void => {
    if (fromIndex === toIndex) return
    const names = categories.map((c) => c.name)
    const [moved] = names.splice(fromIndex, 1)
    names.splice(toIndex, 0, moved)
    setOrder(names)
    saveOrder(names)
  }, [])

  return { applyOrder, saveDragOrder }
}
