import PropTypes from "prop-types"


export default function VideoGrid({ videos, className, style }) {

    return <div className={className} style={style} >
        <div className={`flex flex-wrap flex-row place-content-center gap-2 ${videos.length <= 6 ? 'h-full' : 'h-5/6'} ${videos.length <= 2 ? 'flex-col flex-nowrap items-center lg:flex-row lg:flex-wrap' : ''}` } >
            {videos.map((video, index) => {
                if (index < 6) {
                    return (<div key={index} className={`aspect-video flex justify-center items-center rounded-lg ${videos.length > 4 ? 'video-grid-56' : 'video-grid-35'} ${videos.length <= 2 ? 'flex-grow h-1/2 lg:h-full w-full lg:w-0' : ''} `}  >
                        {video}
                    </div>)
                }
            }
            )}
        </div>
        <div id="parallelVideo" className={`flex ${videos.length <= 6 ? 'hidden' : 'h-1/6'} items-center gap-3 overflow-hidden overflow-x-auto`} >
            {videos.map((video, index) => {
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
    videos: PropTypes.arrayOf(PropTypes.object).isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
}