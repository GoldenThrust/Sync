import PropTypes from "prop-types"
import { useState, useEffect, useRef, useCallback } from "react"

/**
 * Finds the optimal tile size to fill the container while maintaining
 * 16:9 aspect ratio. Tries every column count from 1..n and picks
 * whichever gives the largest tile area that still fits vertically.
 */
function calcTileSize(numTiles, containerW, containerH, gap = 4) {
    if (numTiles === 0) return { tileW: containerW, tileH: containerH, cols: 1 }

    const aspect = 16 / 9
    let bestArea = 0
    let best = { cols: 1, tileW: containerW, tileH: containerW / aspect }

    for (let cols = 1; cols <= numTiles; cols++) {
        const rows = Math.ceil(numTiles / cols)
        const tileW = (containerW - gap * (cols - 1)) / cols
        const tileH = tileW / aspect
        const totalH = tileH * rows + gap * (rows - 1)

        if (totalH > containerH) continue   // doesn't fit vertically

        const area = tileW * tileH
        if (area > bestArea) {
            bestArea = area
            best = { cols, tileW: Math.floor(tileW), tileH: Math.floor(tileH) }
        }
    }

    // Fallback: if nothing fits, squeeze tiles to at least be visible
    if (bestArea === 0) {
        const tileW = Math.max(80, Math.floor((containerW - gap * (numTiles - 1)) / numTiles))
        best = { cols: numTiles, tileW, tileH: Math.floor(tileW / aspect) }
    }

    return best
}

const MAX_ON_SCREEN = 49   // grid tiles (plus local = 50 total)

export default function VideoGrid({ videos, localVideo, className = '', style }) {
    const gridRef = useRef(null)
    const [tileSize, setTileSize] = useState({ tileW: 0, tileH: 0 })

    const videoList = Object.keys(videos)
    const numRemote = videoList.length
    const hasRemote = numRemote > 0

    const recalc = useCallback(() => {
        if (!gridRef.current) return
        const { clientWidth: W, clientHeight: H } = gridRef.current
        if (W === 0 || H === 0) return
        const size = calcTileSize(
            Math.min(numRemote, MAX_ON_SCREEN),
            W, H,
            4   // gap in px — keep in sync with gap-1 (4px)
        )
        setTileSize(size)
    }, [numRemote])

    useEffect(() => {
        recalc()
        const ro = new ResizeObserver(recalc)
        if (gridRef.current) ro.observe(gridRef.current)
        return () => ro.disconnect()
    }, [recalc])

    return (
        <div className={`relative w-screen h-screen overflow-hidden bg-slate-950 ${className}`} style={style}>

            {/* ── Local (self) video ── */}
            <div
                className={[
                    'overflow-hidden rounded-md shadow-lg border border-blue-500/40 bg-slate-900 z-10',
                    hasRemote
                        ? 'absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-1/4 sm:w-1/5 max-w-[180px]'
                        : 'w-full h-full'
                ].join(' ')}
            >
                {localVideo}
            </div>

            {/* ── Remote video grid ── */}
            {hasRemote && (
                <div
                    ref={gridRef}
                    className="w-full h-full flex flex-wrap content-center justify-center gap-1 p-1"
                >
                    {videoList.slice(0, MAX_ON_SCREEN).map((email, index) => (
                        <div
                            key={email}
                            className="relative overflow-hidden rounded-md flex-shrink-0 bg-slate-900"
                            style={{ width: tileSize.tileW, height: tileSize.tileH }}
                        >
                            {videos[email]}
                            <span className="absolute bottom-2 right-2 text-xs">{email}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Overflow strip (participants beyond MAX_ON_SCREEN) ── */}
            {videoList.length > MAX_ON_SCREEN && (
                <div className="absolute bottom-0 left-0 right-0 h-20 flex items-center gap-2 px-3 overflow-x-auto bg-slate-950/80 backdrop-blur-sm">
                    {videoList.slice(MAX_ON_SCREEN).map((email) => (
                        <div
                            key={email}
                            className="h-full aspect-video flex-shrink-0 rounded-md overflow-hidden bg-slate-900 relative"
                        >
                            {videos[email]}
                            <span className="absolute bottom-1 right-1">{email}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

VideoGrid.propTypes = {
    videos: PropTypes.object.isRequired,
    localVideo: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
}