

const Error = ( {error }) => {
    console.log(error)
    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold">{error.message}</h1>
                    <p className="py-6">
                        {error.stack}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Error;