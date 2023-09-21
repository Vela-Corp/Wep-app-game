import { useState, useContext, useEffect } from "react";
import { Modal } from "antd";
import { ICharacter } from "../../interface/characters";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contetx/Context";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Invitation from "./components/Invitation";
import Detail_Hero from "./components/Detail_Hero";
import List_Hero from "./components/List_Hero";
import List_Room from "./components/List_Room";
const MainLobby = () => {
  const navigate = useNavigate();
  const [nameHero, setNameHero] = useState<any>(""); // tìm kiếm theo tên hero
  const user_info_firebase = useContext(AuthContext || []); // list hero trên firebase
  const [listRoom, setListRoom] = useState<any>([]); // danh sách phòng
  const [open, setOpen] = useState(false); // mở thông tin nhân vật
  const [openCreateRoom, setOpenCreateRoom] = useState(false); // mở tạo phòng
  const [NameRoom, setNameRoom] = useState<any>(""); // tên phòng
  const user_info = JSON.parse(localStorage.getItem("dataFigure") || "null");
  const character: ICharacter | any = user_info?.character;
  const checknv: any = user_info_firebase?.filter(
    (item: any) => item?.my_id == user_info?.my_id
  );
  // Tạo phòng mới
  const createRoom = async (regime: string, info_room: any) => {
    if (info_room == "" || info_room.trim() == "") {
      toast.error("Vui lòng nhập tên phòng");
      return;
    }
    if (!!user_info?.name) {
      const info_RoomPk: any = {
        nameRoom: info_room,
        name: regime,
        id_user_host: checknv[0]?.id,
        id_user_guest: null,
        item_host: user_info,
        item_guest: null,
        result_dice_nv1: null,
        result_dice_nv2: null,
        isActtack_nv1: false,
        start: false,
        current_turn: 1,
        timeLast: 120,
        times_host: 0,
        times_guest: 0,
        timer_host: 5,
        timer_guest: 5,
      };
      try {
        await addDoc(collection(db, "roomPk"), info_RoomPk);
        setOpenCreateRoom(false);
        setNameRoom("");
        toast.success("Tạo phòng thành công");
        await updateDoc(doc(db, "dataFigure", checknv[0]?.id), {
          status: true,
        });
      } catch (error) {
        console.log(error);
      }
    }
    if (!user_info) {
      toast.error("Vui lòng đăng nhập \n chuyển trang sau 2 giây", {
        autoClose: 1000,
      });
      setTimeout(() => {
        navigate("/create");
      }, 2000);
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
    const check: any = user_info_firebase?.filter(
      (item: any) => item?.name == nameHero
    );
    if (check.length > 0) {
      navigate(`/detail-hero/${check[0]?.id}`);
      toast.success(`Tìm thấy hero ${nameHero}`);
      return;
    }
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
      const user = doc(db, "dataFigure", checknv[0]?.id || "");
      await updateDoc(user, {
        status: false,
      });
      toast.success("Xoá phòng thành công");
    } catch (error) {
      console.log(error);
      toast.error("Xoá phòng thất bại");
    }
  };
  // hàm đồng ý vào phòng
  const acceptInvitation = async () => {
    try {
      const roomRef = doc(db, "roomPk", checknv[0]?.invitation?.idRoom);
      // nếu phòng đã đủ người thì không cho vào
      if (checknv[0]?.invitation?.idRoom) {
        const room = await getDoc(roomRef);
        const data = room.data();
        if (data?.id_user_guest != null) {
          toast.error("Phòng đã đủ người");
          return;
        }
      }
      await updateDoc(roomRef, {
        id_user_guest: checknv[0]?.id,
        item_guest: user_info,
        start: true,
      });
      const user = doc(db, "dataFigure", checknv[0]?.id || "");
      await updateDoc(user, {
        invitation: null,
        status: true,
      });
      navigate(`/pk_map/${checknv[0]?.invitation?.idRoom}`);
      toast.success("Tham gia phòng thành công");
    } catch (error) {
      console.log(error);
      toast.error("Tham gia phòng thất bại");
    }
  };
  const unAccepInvitation = async () => {
    try {
      const user = doc(db, "dataFigure", checknv[0]?.id || "");
      await updateDoc(user, {
        invitation: null,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container-box">
      <ToastContainer />
      <Invitation // mở thông báo lời mời
        accept={acceptInvitation}
        unAccep={unAccepInvitation}
        checknv={checknv[0]}
      />
      <Modal // thông tin nhân vật bản thân
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
        <div className="detail">
          <Detail_Hero // hiển thị thông tin nhân vật
            user_info={user_info}
            character={character}
            handlIncrease={handlIncrease}
          />
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
          <img
            className="w-full h-full object-cover"
            src="https://tophinhanhdep.com/wp-content/uploads/2021/10/Kimetsu-No-Yaiba-Computer-Wallpapers.jpg"
            alt=""
          />
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
                  className="w-full object-cover rounded-full"
                  src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className="list-hero absolute top-10 left-10">
            <div className="list bg-white rounded-md ring pl-3  py-3 min-w-[300px] max-w-[400px] ">
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
              <div className="max-h-[400px]  overflow-auto pr-3">
                {user_info_firebase &&
                  user_info_firebase?.map((item: any, index) => {
                    if (item?.my_id != user_info?.my_id) {
                      return <List_Hero item={item} index={index} />;
                    }
                  })}
              </div>
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
                      <List_Room
                        item={item}
                        index={index}
                        checknv={checknv[0]}
                        handlDeleteRoom={handlDeleteRoom}
                      />
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
