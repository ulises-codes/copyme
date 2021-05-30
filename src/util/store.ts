import { writable } from 'svelte/store'

export const isPlaying = writable<boolean>(false)
export const isDemonstrating = writable<boolean>(false)
export const activePad = writable<number | undefined>(undefined)
export const score = writable<number>(0)
export const bestScore = writable<number>(0)
