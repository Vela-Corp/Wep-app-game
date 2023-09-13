import { useContext, useState, useEffect } from "react";
import "../style/style.css";
import { ICharacter } from "../interface/characters";
import { AuthContext } from "./contetx/Context";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { Modal } from "antd";
const Pk_Map = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user_info_firebase = useContext(AuthContext);
  const [info_RoomPk, setInfo_RoomPk] = useState<any>([]);
  console.log(info_RoomPk);
  const user__nv2 = user_info_firebase.filter(
    (item: any) => item?.id == "tTegohSKnqd6VqNaiekU" // id người chơi 2
  );

  const roomCode = "OzoDE7jooleyQLot4Pdb"; // id phòng
  useEffect(() => {
    const fetchRoomInfo = async () => {
      try {
        // Tạo một tham chiếu đến tài liệu phòng trong Firestore
        const roomRef = doc(db, "roomPk", roomCode);

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
  const handleJoinRoom = async (id_user: string) => {
    try {
      const roomRef = doc(db, "roomPk", roomCode);
      await updateDoc(roomRef, {
        id_user_guest: id_user, // id người chơi 2
        character_guest: user__nv2[0].character,
      });
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };
  const [blood_nv2, setBlood_nv2] = useState<any>();
  const maxBlood_nv2 = user__nv2[0]?.character?.blood;
  const user_info = JSON.parse(localStorage.getItem("dataFigure") || "{}");
  const character_nv1: ICharacter = info_RoomPk.character_host;
  const character_nv2: ICharacter = info_RoomPk.character_guest;
  const blood2 = character_nv2?.blood; // máu người bị tấn công
  const physical = character_nv1?.physics; // sát thương người tấn công
  const magic = character_nv1?.public; // sát thương phép người tấn công
  const armor = character_nv2?.physicalArmor; // giáp của người bị tấn công
  const magicArmor = character_nv2?.magicArmor; // giáp phép của người bị tấn công
  const penetratesPhysicalArmor = character_nv1?.penetratesPhysicalArmor; // xuyên giáp vật lý của người tấn công
  const penetratesMagicArmor = character_nv1?.magicPenetration; // xuyên giáp phép của người tấn công
  useEffect(() => {
    const roomRef = doc(db, "roomPk", roomCode);
    // Lắng nghe sự thay đổi trong dữ liệu phòng
    const unsubscribe = onSnapshot(roomRef, (roomSnapshot) => {
      if (roomSnapshot.exists()) {
        const roomData = roomSnapshot.data();
        setInfo_RoomPk(roomData);
      } else {
        console.error("Phòng không tồn tại.");
      }
    });

    return () => {
      // Hủy đăng ký lắng nghe khi component unmount
      unsubscribe();
    };
  }, [roomCode]);
  const handlActtack = async () => {
    const damage = physical - armor;
    const damageMagic = magic - magicArmor;
    const totalDamage =
      damage + damageMagic + penetratesPhysicalArmor + penetratesMagicArmor;
    const totalBlood = Math.max(blood2 - totalDamage, 0);
    setBlood_nv2(totalBlood);
    // sửa máu trên firebase
    try {
      const roomRef = doc(db, "roomPk", roomCode);
      await updateDoc(roomRef, {
        character_guest: {
          ...character_nv2,
          blood: totalBlood,
        },
      });
    } catch (error) {
      console.log(error, "lỗi cập nhật máu");
    }
  };
  // tinhs máu theo phân trăm
  const Blood = (blood: number, maxBlood: number) => {
    const bloodPercent = (blood / maxBlood) * 100;
    return bloodPercent;
  };

  return (
    <>
      <div className="box-container w-screen max-h-screen">
        <div className="pk_number text-center ">
          <h1 className="text-xl font-medium ring w-32 h-10 mx-auto bg-red-500 text-white mt-20 rounded-sm">
            {info_RoomPk.nameRoom}
          </h1>
        </div>
        <div className="box relative w-full ">
          <div className=" pt-20 relative">
            {user_info.role && (
              <div className="figure__boold absolute top-10 left-10">
                <h1>{user_info.name}</h1>
                <progress max={100} value={100}>
                  <div className="progress-bar "></div>
                </progress>
                <div className="image_figure w-72">
                  <img src="../../src/assets/nv1.webp" alt="" />
                </div>
                <div className="skills text-center mt-10">
                  <div className="skill">
                    <button
                      onClick={handlActtack}
                      className="w-32 h-10 text-white font-medium bg-blue-500 ring active:bg-blue-600"
                    >
                      Tấn công
                    </button>
                  </div>
                </div>
              </div>
            )}
            {info_RoomPk.id_user_guest && info_RoomPk?.id_user_guest !== "" ? (
              <div className="figure__boold absolute top-10 right-10">
                <h1>{user__nv2[0]?.name}</h1>
                <progress max={100} value={Blood(blood2, maxBlood_nv2)}>
                  <div className="progress-bar "></div>
                </progress>
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
                              onClick={() => handleJoinRoom(item.id!)}
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
