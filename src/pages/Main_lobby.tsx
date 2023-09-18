import { useState, useContext, useEffect } from "react";
import { Modal } from "antd";
import { ICharacter } from "../interface/characters";
import { Link } from "react-router-dom";
import { AuthContext } from "./contetx/Context";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const MainLobby = () => {
  const [nameHero, setNameHero] = useState<any>(""); // tìm kiếm theo tên hero
  const user_info_firebase = useContext(AuthContext || []); // list hero trên firebase
  const [listRoom, setListRoom] = useState<any>([]); // danh sách phòng
  const [open, setOpen] = useState(false); // mở thông tin nhân vật
  const [openCreateRoom, setOpenCreateRoom] = useState(false); // mở tạo phòng
  const [NameRoom, setNameRoom] = useState<any>(""); // tên phòng
  const user_info = JSON.parse(localStorage.getItem("dataFigure") || "{}");
  const character: ICharacter | any = user_info?.character;
  const checknv: any = user_info_firebase?.filter(
    (item: any) => item?.my_id == user_info?.my_id
  );
  // Tạo phòng mới
  const createRoom = async (regime: string, info_room: any) => {
    if (!!user_info?.name) {
      const info_RoomPk = {
        nameRoom: info_room,
        name: regime,
        id_user_host: checknv[0]?.id,
        id_user_guest: null,
        item_host: user_info,
        item_guest: null,
        result_dice_nv1: null,
        result_dice_nv2: null,
        isActtack_nv1: false,
        isActtack_nv2: false,
        current_turn: 1,
      };
      try {
        await addDoc(collection(db, "roomPk"), info_RoomPk);
        setOpenCreateRoom(false);
        setNameRoom("");
        toast.success("Tạo phòng thành công");
      } catch (error) {
        console.log(error);
      }
    }
    if (!user_info) {
      toast.error("Vui lòng đăng nhập");
    }
  };
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "roomPk"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setListRoom(data);
    });
    return () => unsubscribe();
  }, []);
  const hanldSearch = (e: any) => {
    e.preventDefault();
    if (nameHero == "") {
      toast.error("Vui lòng nhập tên hero");
      return;
    }
    const check = user_info_firebase?.filter(
      (item: any) => item?.name == nameHero
    );
    if (check?.length == 0) {
      toast.error("Không tìm thấy hero");
      return;
    }
  };
  //  tăng chỉ số ở thông tin nhân vật
  const handlIncrease = async (properties: any) => {
    character[properties] += 100;
    try {
      // cập nhật lại chỉ số
      const userRef = doc(db, "dataFigure", checknv[0]?.id);
      await updateDoc(userRef, {
        character: character,
      });
    } catch (error) {
      console.log(error);
    }
  };
  // lắng nghe sự thay đổi chỉ số nhân vật
  useEffect(() => {
    if (checknv[0]?.id) {
      const userRef = doc(db, "dataFigure", checknv[0]?.id);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        const data = doc.data();
        localStorage.setItem("dataFigure", JSON.stringify(data));
      });
      return () => unsubscribe();
    }
  }, [checknv[0]?.id]);
  // Delete room
  const handlDeleteRoom = async (id: any) => {
    try {
      const roomRef = doc(db, "roomPk", id);
      await deleteDoc(roomRef);
      toast.success("Xoá phòng thành công");
    } catch (error) {
      console.log(error);
      toast.error("Xoá phòng thất bại");
    }
  };
  return (
    <div className="container-box">
      <ToastContainer />
      <Modal // thông tin nhân vật
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
                <div className="info-character w-2/3 pr-2">
                  <h1 className="text-center text-xl font-semibold">
                    {user_info?.class}
                  </h1>
                  <div className="character flex items-start justify-between gap-5 mt-5">
                    <div className="cols-1 flex flex-col gap-2">
                      <span className="flex items-center gap-2 text-lg font-medium">
                        <img
                          className="w-6"
                          src="../../src/assets/image 39.png"
                          alt=""
                        />
                        {character?.physics}
                        <i
                          onClick={() => handlIncrease("physics")}
                          className="cursor-pointer "
                        >
                          <FontAwesomeIcon
                            className="text-sm ring-2 ring-black active:ring-2 active:ring-yellow-400 rounded-sm p-[1px]"
                            icon={faPlus}
                          />
                        </i>
                      </span>
                      <span className="flex items-center gap-2 text-lg font-medium">
                        <img
                          className="w-6"
                          src="../../src/assets/image 41.png"
                          alt=""
                        />
                        {character?.blood}
                        <i
                          onClick={() => handlIncrease("blood")}
                          className="cursor-pointer "
                        >
                          <FontAwesomeIcon
                            className="text-sm ring-2 ring-black active:ring-2 active:ring-yellow-400 rounded-sm p-[1px]"
                            icon={faPlus}
                          />
                        </i>
                      </span>
                      <span className="flex items-center gap-2 text-lg font-medium">
                        <img
                          className="w-6"
                          src="../../src/assets/image 40 (1).png"
                          alt=""
                        />
                        {character?.physicalArmor}
                        <i
                          onClick={() => handlIncrease("physicalArmor")}
                          className="cursor-pointer "
                        >
                          <FontAwesomeIcon
                            className="text-sm ring-2 ring-black active:ring-2 active:ring-yellow-400 rounded-sm p-[1px]"
                            icon={faPlus}
                          />
                        </i>
                      </span>
                      <span className="flex items-center gap-2 text-lg font-medium">
                        <img
                          className="w-6"
                          src="../../src/assets/image 47.png"
                          alt=""
                        />
                        {character?.penetratesPhysicalArmor}
                        <i
                          onClick={() =>
                            handlIncrease("penetratesPhysicalArmor")
                          }
                          className="cursor-pointer "
                        >
                          <FontAwesomeIcon
                            className="text-sm ring-2 ring-black active:ring-2 active:ring-yellow-400 rounded-sm p-[1px]"
                            icon={faPlus}
                          />
                        </i>
                      </span>
                      <span className="flex items-center gap-2 text-lg font-medium">
                        <img
                          className="w-6"
                          src="../../src/assets/image 48.png"
                          alt=""
                        />
                        {character?.attackSpeed}
                        <i
                          onClick={() => handlIncrease("attackSpeed")}
                          className="cursor-pointer "
                        >
                          <FontAwesomeIcon
                            className="text-sm ring-2 ring-black active:ring-2 active:ring-yellow-400 rounded-sm p-[1px]"
                            icon={faPlus}
                          />
                        </i>
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
                        <i
                          onClick={() => handlIncrease("public")}
                          className="cursor-pointer "
                        >
                          <FontAwesomeIcon
                            className="text-sm ring-2 ring-black active:ring-2 active:ring-yellow-400 rounded-sm p-[1px]"
                            icon={faPlus}
                          />
                        </i>
                      </span>
                      <span className="flex items-center gap-2 text-lg font-medium">
                        <img
                          className="w-6"
                          src="../../src/assets/image 42.png"
                          alt=""
                        />
                        {character?.runningSpeed}
                        <i
                          onClick={() => handlIncrease("runningSpeed")}
                          className="cursor-pointer "
                        >
                          <FontAwesomeIcon
                            className="text-sm ring-2 ring-black active:ring-2 active:ring-yellow-400 rounded-sm p-[1px]"
                            icon={faPlus}
                          />
                        </i>
                      </span>
                      <span className="flex items-center gap-2 text-lg font-medium">
                        <img
                          className="w-6"
                          src="../../src/assets/image 40.png"
                          alt=""
                        />
                        {character?.magicArmor}
                        <i
                          onClick={() => handlIncrease("magicArmor")}
                          className="cursor-pointer "
                        >
                          <FontAwesomeIcon
                            className="text-sm ring-2 ring-black active:ring-2 active:ring-yellow-400 rounded-sm p-[1px]"
                            icon={faPlus}
                          />
                        </i>
                      </span>
                      <span className="flex items-center gap-2 text-lg font-medium">
                        <img
                          className="w-6"
                          src="../../src/assets/image 46.png"
                          alt=""
                        />
                        {character?.magicPenetration}
                        <i
                          onClick={() => handlIncrease("magicPenetration")}
                          className="cursor-pointer "
                        >
                          <FontAwesomeIcon
                            className="text-sm ring-2 ring-black active:ring-2 active:ring-yellow-400 rounded-sm p-[1px]"
                            icon={faPlus}
                          />
                        </i>
                      </span>
                      <span className="flex items-center gap-2 text-lg font-medium">
                        <img
                          className="w-6"
                          src="../../src/assets/image 49.png"
                          alt=""
                        />
                        {character?.cooldown}
                        <i
                          onClick={() => handlIncrease("cooldown")}
                          className="cursor-pointer "
                        >
                          <FontAwesomeIcon
                            className="text-sm ring-2 ring-black active:ring-2 active:ring-yellow-400 rounded-sm p-[1px]"
                            icon={faPlus}
                          />
                        </i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal // tạo phòng
        open={openCreateRoom}
        onOk={() => createRoom("1 vs 1", NameRoom)}
        onCancel={() => setOpenCreateRoom(false)}
        closeIcon={false}
        okButtonProps={{ style: { backgroundColor: "blue" } }}
      >
        <input
          type="text"
          className="w-full h-10 border-2  border-blue-400 focus:border-blue-600 outline-none rounded-md pl-2"
          name=""
          id=""
          value={NameRoom}
          onChange={(e) => setNameRoom(e.target.value)}
        />
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
                  onClick={() => setOpenCreateRoom(true)}
                  className="px-14 py-3 bg-blue-500 text-white font-bold rounded-md"
                >
                  Tạo Phòng
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
          <div className="list-hero absolute top-10 left-10">
            <div className="list bg-white rounded-md ring pl-3 pr-10 py-3 max-h-[500px] overflow-auto ">
              <h1 className="text-xl font-bold">Danh sách hero khác</h1>
              <div className="search">
                <form onSubmit={hanldSearch}>
                  <input
                    className="w-full outline-none border-2  border-yellow-300 focus:border-yellow-500 pl-2"
                    placeholder="Tìm kiếm tên Hero"
                    value={nameHero}
                    onChange={(e) => setNameHero(e.target.value)}
                    type="text"
                    name=""
                    id=""
                  />
                </form>
              </div>
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
          <div className="list-room absolute top-32 right-10 ">
            <div className="list bg-white rounded-md ring-4 pl-3 pr-5 py-3 max-h-[500px] overflow-auto">
              <h1 className="text-xl font-bold">Danh sách Room của bạn</h1>
              {listRoom &&
                listRoom?.map((item: any, index: any) => {
                  if (
                    item?.id_user_host == checknv[0]?.id ||
                    item?.id_user_guest == checknv[0]?.id
                  ) {
                    return (
                      <div
                        key={index}
                        className="hero flex items-center justify-between  gap-3 border-b-2 border-blue-500 border-s-2 p-2 cursor-pointer"
                      >
                        <Link
                          key={index}
                          to={`/pk_map/${item?.id}`}
                          className="w-full"
                        >
                          <div className="flex items-center gap-2 w-full">
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
                                  {item?.nameRoom}
                                </span>
                              </h2>
                              <span>Status:</span>
                            </div>
                          </div>
                        </Link>
                        <div className="btn_delete_room mt-2 text-right">
                          <button
                            onClick={() => handlDeleteRoom(item?.id)}
                            className="px-4 py-1 bg-red-500 text-white font-semibold rounded-md"
                          >
                            Xoá
                          </button>
                        </div>
                      </div>
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
