export const DEFAULT_PLAYER_VOLUME = 1

const clampNormalizedVolume = (volume) => Math.max(0, Math.min(1, volume))

export const normalizePlayerVolume = (volume) => {
  const numericVolume = Number(volume)
  if (!Number.isFinite(numericVolume)) {
    return null
  }

  return clampNormalizedVolume(numericVolume)
}

export const normalizePercentagePlayerVolume = (volume) => {
  const numericVolume = Number(volume)
  if (!Number.isFinite(numericVolume)) {
    return null
  }

  return clampNormalizedVolume(numericVolume / 100)
}

const isPlayerMuted = (internalPlayer) => {
  if (typeof internalPlayer.isMuted === 'function') {
    return internalPlayer.isMuted()
  }

  return internalPlayer.muted === true
}

export const getReactPlayerVolume = (player) => {
  try {
    const internalPlayer = player?.getInternalPlayer?.()
    if (!internalPlayer) {
      return null
    }

    if (isPlayerMuted(internalPlayer)) {
      return 0
    }

    if (typeof internalPlayer.getVolume === 'function') {
      return normalizePercentagePlayerVolume(internalPlayer.getVolume())
    }

    if (typeof internalPlayer.volume !== 'undefined') {
      return normalizePlayerVolume(internalPlayer.volume)
    }
  } catch {
    return null
  }

  return null
}
