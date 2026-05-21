export const DEFAULT_PLAYER_VOLUME = 1

export const normalizePlayerVolume = (volume) => {
  const numericVolume = Number(volume)
  if (!Number.isFinite(numericVolume)) {
    return null
  }

  const normalizedVolume = numericVolume > 1 ? numericVolume / 100 : numericVolume
  return Math.max(0, Math.min(1, normalizedVolume))
}

export const getReactPlayerVolume = (player) => {
  try {
    const internalPlayer = player?.getInternalPlayer?.()
    if (!internalPlayer) {
      return null
    }

    if (typeof internalPlayer.getVolume === 'function') {
      return normalizePlayerVolume(internalPlayer.getVolume())
    }

    if (typeof internalPlayer.volume !== 'undefined') {
      return normalizePlayerVolume(internalPlayer.volume)
    }
  } catch {
    return null
  }

  return null
}
