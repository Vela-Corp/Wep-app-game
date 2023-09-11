import { Link } from 'react-router-dom'
const Dashboard = () => {
    return (
        <>
            <div className="box-container w-full">
                <div className="background-image relative w-full h-auto">
                    <img className='w-full h-auto' src="./background.jpg" alt="" />
                    <Link to={"/create"}> <button className='absolute top-1/2 left-1/2 -translate-x-1/2 text-2xl text-white py-3 px-16 bg-red-600 hover:bg-red-500 rounded-md'>Bắt Đầu</button></Link>
                </div>
            </div>
        </>
    )
}

export default Dashboard