import { useState, useContext } from "react";
import { Modal } from "antd";
import { ICharacter } from "../interface/characters";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./contetx/Context";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const MainLobby = () => {
  const navigate = useNavigate();
  const user_info_firebase = useContext(AuthContext);
  console.log(user_info_firebase);
  const [open, setOpen] = useState(false);
  const user_info = JSON.parse(localStorage.getItem("dataFigure") || "{}");
  const character: ICharacter = user_info?.character;
  // Tạo phòng mới
  const createRoom = async (info_room: any) => {
    const info_RoomPk = {
      nameRoom: info_room,
      id_user_host: user_info?.my_id,
      id_user_guest: "",
      character_host: user_info?.character,
      character_guest: "",
    };
    try {
      await addDoc(collection(db, "roomPk"), info_RoomPk);
      toast.success("Tạo phòng thành công");
    } catch (error) {}
  };
  return (
    <div className="container-box">
      <ToastContainer />
      <Modal
        title={
          <>
            <h1 className="text-xl font-semibold text-[#FBB42F]">
              Thông tin nhân vật
            </h1>
          </>
        }
        maskClosable={true}
        closeIcon={false}
        centered
        open={open}
        onOk={() => setOpen(false)}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{
          style: { backgroundColor: "#FBB42F", width: "100px" },
        }}
        bodyStyle={{ backgroundColor: "#FBB42F", borderRadius: "10px" }}
      >
        <div className="box-user ">
          <div className="info-user p-5 ">
            <div className="info-header flex items-center justify-between">
              <div className="name_user">
                <h3 className="text-white text-xl font-medium ">
                  {user_info?.name}
                </h3>
              </div>
              <div className="image_avatar w-32">
                <img src="../../src/assets/Rectangle 507.png" alt="" />
              </div>
            </div>
            <div className="content-character bg-white rounded-md p-3 mt-3">
              <div className="box flex items-start gap-3">
                <div className="big-image w-2/3">
                  <img
                    className="w-full object-cover"
                    src="../../src/assets/Rectangle 512.png"
                    alt=""
                  />
                </div>
                <div className="info-character w-1/3 pr-2">
                  <h1 className="text-center text-xl font-semibold">
                    {user_info?.class}
                  </h1>
                  <div className="character flex items-start gap-5 mt-5">
                    <div className="cols-1 flex flex-col gap-2">
                      <span className="flex items-center gap-2 text-lg font-medium">
                        <img
                          className="w-6"
                          src="../../src/assets/image 39.png"
                          alt=""
                        />
                        {character?.physics}
                      </span>
                      <span className="flex items-center gap-2 text-lg font-medium">
                        <img
                          className="w-6"
                          src="../../src/assets/image 41.png"
                          alt=""
                        />
                        {character?.blood}
                      </span>
                      <span className="flex items-center gap-2 text-lg font-medium">
                        <img
                          className="w-6"
                          src="../../src/assets/image 40 (1).png"
                          alt=""
                        />
                        {character?.physicalArmor}
                      </span>
                      <span className="flex items-center gap-2 text-lg font-medium">
                        <img
                          className="w-6"
                          src="../../src/assets/image 47.png"
                          alt=""
                        />
                        {character?.penetratesPhysicalArmor}
                      </span>
                      <span className="flex items-center gap-2 text-lg font-medium">
                        <img
                          className="w-6"
                          src="../../src/assets/image 48.png"
                          alt=""
                        />
                        {character?.attackSpeed}
                      </span>
                    </div>
                    <div className="cols-2 flex flex-col gap-2">
                      <span className="flex items-center gap-2 text-lg font-medium">
                        <img
                          className="w-6"
                          src="../../src/assets/image 45.png"
                          alt=""
                        />
                        {character?.public}
                      </span>
                      <span className="flex items-center gap-2 text-lg font-medium">
                        <img
                          className="w-6"
                          src="../../src/assets/image 42.png"
                          alt=""
                        />
                        {character?.runningSpeed}
                      </span>
                      <span className="flex items-center gap-2 text-lg font-medium">
                        <img
                          className="w-6"
                          src="../../src/assets/image 40.png"
                          alt=""
                        />
                        {character?.magicArmor}
                      </span>
                      <span className="flex items-center gap-2 text-lg font-medium">
                        <img
                          className="w-6"
                          src="../../src/assets/image 46.png"
                          alt=""
                        />
                        {character?.magicPenetration}
                      </span>
                      <span className="flex items-center gap-2 text-lg font-medium">
                        <img
                          className="w-6"
                          src="../../src/assets/image 49.png"
                          alt=""
                        />
                        {character?.cooldown}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <div className="box-video w-screen h-screen">
        <div className="video w-full h-full relative">
          <video
            autoPlay={true}
            loop={true}
            className="w-full h-full"
            style={{
              objectFit: "cover", // Đảm bảo video lấp đầy khung
              width: "100%", // Kích thước video chiều rộng 100%
              height: "100%", // Kích thước video chiều cao 100%
            }}
          >
            <source src="../../public/Video-intro.mp4" type="video/mp4" />
          </video>
          <div className="content-box absolute w-full h-full top-0">
            <div className="button__countervailing flex gap-10 absolute bottom-10 left-1/2 -translate-x-1/2">
              <div className="button__1vs1">
                <button
                  onClick={() => createRoom("1 vs 1")}
                  className="px-14 py-3 bg-blue-500 text-white font-bold rounded-md"
                >
                  1 vs 1
                </button>
              </div>
              <div className="button__3vs3">
                <button className="px-14 py-3 bg-blue-500 text-white font-bold rounded-md">
                  3 vs 3
                </button>
              </div>
              <div className="button__5vs5">
                <button className="px-14 py-3 bg-blue-500 text-white font-bold rounded-md">
                  5 vs 5
                </button>
              </div>
            </div>
            <div className="avatar-user absolute right-10 top-5">
              <div
                onClick={() => setOpen(true)}
                className="image w-20 cursor-pointer "
              >
                <img
                  className="w-full object-cover"
                  src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className="list-hero absolute top-10">
            <div className="list bg-white rounded-md ring pl-3 pr-10 py-3">
              <h1 className="text-xl font-normal">Danh sách hero</h1>
              {user_info_firebase &&
                user_info_firebase?.map((item: any, index) => {
                  if (item?.my_id != user_info?.my_id) {
                    return (
                      <Link key={index} to={`/detail-hero/${item.id}`}>
                        <div
                          key={index}
                          className="hero flex items-center gap-3 border-b-2 border-yellow-500 border-s-2 p-2 cursor-pointer"
                        >
                          <div className="image w-14">
                            <img
                              src="../../src/assets/Rectangle 507.png"
                              alt=""
                            />
                          </div>
                          <div className="info-character">
                            <h2 className="text-lg font-medium">
                              Name:{" "}
                              <span className="text-md font-normal">
                                {item?.name}
                              </span>
                            </h2>
                            <span>
                              Class:{" "}
                              <span className="text-md font-normal">
                                {item?.class}
                              </span>
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  }
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLobby;
