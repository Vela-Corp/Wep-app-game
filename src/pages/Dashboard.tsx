import { Link } from "react-router-dom";
const Dashboard = () => {
  const user_info = JSON.parse(localStorage.getItem("dataFigure") || "null");
  return (
    <>
      <div className="box-container w-screen h-screen">
        <div className="background-image relative w-full h-full">
          <img
            className="w-full h-full object-cover"
            src="./background.jpg"
            alt=""
          />
          <Link to={`${user_info?.my_id ? "/main" : "/create"}`}>
            {" "}
            <button className="absolute top-1/2 left-1/2 -translate-x-1/2 text-2xl text-white py-3 px-16 bg-red-600 hover:bg-red-500 rounded-md">
              Bắt Đầu
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
