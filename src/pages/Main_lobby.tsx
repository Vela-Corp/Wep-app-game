const MainLobby = () => {
    return (
        <div className="container-box">
            <div className="box-video w-screen h-screen">
                <div className="video w-full h-full relative">
                    <video
                        autoPlay={true}
                        loop={true}
                        controls
                        className="w-full h-full"
                        style={{
                            objectFit: 'cover', // Đảm bảo video lấp đầy khung
                            width: '100%', // Kích thước video chiều rộng 100%
                            height: '100%', // Kích thước video chiều cao 100%
                        }}
                    >
                        <source src="../../public/Video-intro.mp4" type="video/mp4" />
                    </video>
                    <div className="content-box absolute w-full h-full top-0">
                        <div className="button__countervailing flex gap-10 absolute bottom-10 left-1/2 -translate-x-1/2">
                            <div className="button__1vs1">
                                <button className="px-14 py-3 bg-blue-500 text-white font-bold rounded-md">1 vs 1</button>
                            </div>
                            <div className="button__3vs3">
                                <button className="px-14 py-3 bg-blue-500 text-white font-bold rounded-md">3 vs 3</button>
                            </div>
                            <div className="button__5vs5">
                                <button className="px-14 py-3 bg-blue-500 text-white font-bold rounded-md">5 vs 5</button>
                            </div>
                        </div>
                        <div className="avatar-user absolute right-10 top-5">
                            <div className="image w-20 cursor-pointer">
                                <img className="w-full object-cover" src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000" alt="" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MainLobby;