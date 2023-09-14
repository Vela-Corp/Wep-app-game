import { useContext, useState, useEffect } from "react";
import "../style/style.css";
import { AuthContext } from "./contetx/Context";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { Modal } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
const Pk_Map = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // id phòng
  const roomCode = id; // id phòng
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user_info_firebase = useContext(AuthContext);
  const [info_RoomPk, setInfo_RoomPk] = useState<any>([]);
  console.log(info_RoomPk);
  const user_info = JSON.parse(localStorage.getItem("dataFigure") || "{}");
  const user_info2 = JSON.parse(localStorage.getItem("dataFigure2") || "{}");

  useEffect(() => {
    const fetchRoomInfo = async () => {
      try {
        // Tạo một tham chiếu đến tài liệu phòng trong Firestore
        const roomRef = doc(db, "roomPk", roomCode || "");

        // Lấy thông tin phòng từ Firestore
        const roomSnapshot = await getDoc(roomRef);

        if (roomSnapshot.exists()) {
          // Dữ liệu phòng đã được tìm thấy
          const roomData = roomSnapshot.data();
          setInfo_RoomPk(roomData);
        } else {
          // Phòng không tồn tại
          console.error("Phòng không tồn tại.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin phòng:", error);
      }
    };
    fetchRoomInfo();
  }, []);

  const handleJoinRoom = async (item: any) => {
    try {
      localStorage.setItem("dataFigure2", JSON.stringify(item));
      const roomRef = doc(db, "roomPk", roomCode || "");
      await updateDoc(roomRef, {
        id_user_guest: item?.id,
        item_guest: { ...item, my_id: item?.id },
      });
      toast.success("Thêm người chơi thành công");
      console.log("Room updated!");
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  useEffect(() => {
    const roomRef = doc(db, "roomPk", roomCode || "");
    // Lắng nghe sự thay đổi trong dữ liệu phòng
    const unsubscribe = onSnapshot(roomRef, (roomSnapshot) => {
      if (roomSnapshot.exists()) {
        const roomData = roomSnapshot.data();
        setInfo_RoomPk(roomData);
      } else {
        console.error("Phòng không tồn tại.");
        navigate("/main");
      }
    });
    return () => {
      // Hủy đăng ký lắng nghe khi component unmount
      unsubscribe();
    };
  }, [roomCode]);
  // Tính toán máu của nhân vật sau khi tấn công
  // const  physics // Sát thương vật lý
  // const  public // Sát thương phép
  // const  physicalArmor // Giáp vật lý
  // const  magicArmor// Giáp phép
  // const  penetratesPhysicalArmor // Xuyên giáp vật lý
  // const  magicPenetration // Xuyên giáp phép
  const MaxHp: any = user_info_firebase?.filter(
    (item: any) => item?.my_id == info_RoomPk?.item_host?.my_id
  );
  const calculateRemainingBlood = (
    blood: number,
    physics: any,
    publics: any,
    physicalArmor: any,
    magicArmor: any,
    penetratesPhysicalArmor: any,
    magicPenetration: any
  ) => {
    const damage = physics + publics;
    const totalArmor = physicalArmor + magicArmor;
    const totalPenetration = penetratesPhysicalArmor + magicPenetration;
    const totalBlood = damage - totalArmor + totalPenetration;
    const remainingBlood = blood - totalBlood;
    return remainingBlood;
  };
  const handlActtack = async (idAttack: any) => {
    // sửa máu trên firebase
    console.log(idAttack);
    console.log(info_RoomPk?.item_host?.my_id);
    try {
      const roomRef = doc(db, "roomPk", roomCode || "");
      if (idAttack == info_RoomPk?.item_host?.my_id) {
        console.log("tấng công người chơi 2");
        const remainingBlood = calculateRemainingBlood(
          info_RoomPk?.item_guest?.character?.blood,
          info_RoomPk?.item_host?.character?.physics,
          info_RoomPk?.item_host?.character?.public,
          info_RoomPk?.item_guest?.character?.physicalArmor,
          info_RoomPk?.item_guest?.character?.magicArmor,
          info_RoomPk?.item_host?.character?.penetratesPhysicalArmor,
          info_RoomPk?.item_host?.character?.magicPenetration
        );

        await updateDoc(roomRef, {
          item_guest: {
            ...info_RoomPk?.item_guest,
            character: {
              ...info_RoomPk?.item_guest?.character,
              blood: remainingBlood,
            },
          },
        });
      }
      if (idAttack == info_RoomPk?.item_guest?.my_id) {
        console.log("tấng công người chơi 1");
        const remainingBlood = calculateRemainingBlood(
          info_RoomPk?.item_host?.character?.blood,
          info_RoomPk?.item_guest?.character?.physics,
          info_RoomPk?.item_guest?.character?.public,
          info_RoomPk?.item_host?.character?.physicalArmor,
          info_RoomPk?.item_host?.character?.magicArmor,
          info_RoomPk?.item_guest?.character?.penetratesPhysicalArmor,
          info_RoomPk?.item_guest?.character?.magicPenetration
        );

        await updateDoc(roomRef, {
          item_host: {
            ...info_RoomPk?.item_host,
            character: {
              ...info_RoomPk?.item_host?.character,
              blood: remainingBlood,
            },
          },
        });
      }
    } catch (error) {
      console.log(error, "lỗi cập nhật máu");
    }
  };
  // Tính phần trăm máu
  const Blood = (blood: number, maxBlood: number) => {
    console.log(blood, maxBlood);
    const percent = (blood / maxBlood) * 100;
    return percent;
  };
  // Người chiến thắng
  useEffect(() => {
    if (info_RoomPk?.item_host?.character?.blood <= 0) {
      toast.success("Người chơi 2 thắng");
    }
    if (info_RoomPk?.item_guest?.character?.blood <= 0) {
      toast.success("Người chơi 1 thắng");
    }
  }, [info_RoomPk]);

  return (
    <>
      <div className="box-container w-screen max-h-screen">
        <ToastContainer />
        <div className="pk_number text-center ">
          <h1 className="text-xl font-medium ring w-32 h-10 mx-auto bg-red-500 text-white mt-20 rounded-sm">
            {info_RoomPk.name}
          </h1>
        </div>
        <div className="box relative w-full ">
          <div className=" pt-20 relative">
            <div className="figure__boold absolute top-10 left-10">
              <h1 className="">{user_info.name}</h1>
              <progress
                max={100}
                value={
                  user_info2.character?.blood
                    ? Blood(
                        info_RoomPk?.item_host?.character?.blood,
                        user_info?.character?.blood
                      )
                    : Blood(
                        info_RoomPk?.item_guest?.character?.blood,
                        user_info?.character?.blood
                      )
                }
              >
                <div className="progress-bar "></div>
              </progress>
              <h1>Hệ : {user_info.class}</h1>
              <div className="image_figure w-72">
                <img src="../../src/assets/nv1.webp" alt="" />
              </div>
              <div className="skills text-center mt-10">
                <div className="skill">
                  <button
                    onClick={() => handlActtack(user_info?.my_id)}
                    className="w-32 h-10 text-white font-medium bg-blue-500 ring active:bg-blue-600"
                  >
                    Tấn công
                  </button>
                </div>
              </div>
            </div>
            {info_RoomPk.id_user_guest !== "" ? (
              <div className="figure__boold absolute top-10 right-10">
                <h1>{user_info2.name || info_RoomPk?.item_host?.name}</h1>
                <progress
                  max={100}
                  value={
                    user_info2.character?.blood
                      ? Blood(
                          info_RoomPk?.item_guest?.character?.blood,
                          user_info2?.character?.blood
                        )
                      : Blood(
                          info_RoomPk?.item_host?.character?.blood,
                          MaxHp[0]?.character?.blood
                        )
                  }
                >
                  <div className="progress-bar "></div>
                </progress>
                <h1>Hệ :{user_info2.class || info_RoomPk?.item_host?.class}</h1>
                <div className="image_figure w-72">
                  <img src="../../src/assets/nv2.webp" alt="" />
                </div>
              </div>
            ) : (
              <div className="figure__boold absolute  right-10">
                <h1 className="text-center text-lg font-medium">
                  Đang chờ người chơi...
                </h1>
                <div className="image_figure w-72 mr-20">
                  <img src="../../src/assets/nv2.webp" alt="" />
                </div>
                <div className="add__player text-center mt-5">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-32 h-10 text-white font-medium bg-blue-500 ring active:bg-blue-600"
                  >
                    Thêm người chơi
                  </button>
                </div>
                <Modal
                  title="Danh sách Hero"
                  open={isModalOpen}
                  closeIcon={false}
                  onOk={() => setIsModalOpen(false)}
                  cancelButtonProps={{ style: { display: "none" } }}
                  okButtonProps={{
                    style: { backgroundColor: "#FBB42F", width: "100px" },
                  }}
                >
                  <div className="list bg-white rounded-md ring pl-3 pr-10 py-3">
                    {user_info_firebase &&
                      user_info_firebase?.map((item: any, index) => {
                        if (item?.my_id != user_info?.my_id) {
                          return (
                            <div
                              onClick={() => handleJoinRoom(item)}
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
                          );
                        }
                      })}
                  </div>
                </Modal>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Pk_Map;
