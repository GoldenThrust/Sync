import PropTypes from "prop-types"


export default function VideoGrid({ videos, localVideo, className = '', style }) {

    return <div className={`relative ${className}`} style={style} >
        <div className={`overflow-hidden rounded-lg shadow-slate-900 shadow-lg object-cover ${Object.entries(videos).length ? 'absolute bottom-28 right-5 w-1/3 sm:w-1/6 rounded-2xl z-10' : 'w-screen h-screen'} bg-slate-900`} id='localhost'>
            {localVideo}
        </div>

        <div className={`h-screen w-screen items-center justify-center gap-5 flex-col lg:flex-row ${Object.entries(videos).length ? 'flex' : 'hidden'}`} >
            {Object.values(videos).map((video, index) => {
                if (index < 6) {
                    return (<div key={index} className={`overflow-hidden aspect-video rounded-lg shadow-slate-900 shadow-lg`}  >
                        {video}
                    </div>)
                }
            }
            )}
        </div>
        <div id="parallelVideo" className={`flex ${videos.length <= 6 ? 'hidden' : 'h-1/6'} items-center gap-3 overflow-hidden overflow-x-auto`} >
            {Object.values(videos).map((video, index) => {
                if (index > 6) {
                    return (<div key={index} className="h-full aspect-video rounded-lg bg-black"  >
                        {video}
                    </div>)
                }
            }
            )}
        </div>
    </div>
}

VideoGrid.propTypes = {
    videos: PropTypes.object.isRequired,
    localVideo: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object,
}