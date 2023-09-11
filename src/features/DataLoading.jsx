import ReactLoading from 'react-loading'

const DataLoading = ({height = 64, width = 64}) => {
    const style = {
        height,
        width
    }
    return (
        <div className="flex items-start justify-center max-h-screen">
            <ReactLoading type="cylon" className='fill-primary' style={style} />
        </div>
    )
}

export default DataLoading;