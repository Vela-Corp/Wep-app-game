import { useContext, useState, useEffect } from "react";
import "../../style/style.css";
import { AuthContext } from "../contetx/Context";
import {
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { Modal } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Dice from "../../components/Dice";
import Invite_ListHero from "./components/Invite_ListHero";
const Pk_Map = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // id phòng
  const roomCode = id; // id phòng
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user_info_firebase = useContext(AuthContext);
  const [info_RoomPk, setInfo_RoomPk] = useState<any>([]);
  const user_info = JSON.parse(localStorage.getItem("dataFigure") || "{}");
  const user_info2 = JSON.parse(localStorage.getItem("dataFigure2") || "{}");
  const checknv: any = user_info_firebase?.filter(
    (item: any) => item?.my_id == user_info?.my_id
  );
  const minutes = Math.floor(info_RoomPk?.timeLast / 60);
  const seconds = info_RoomPk?.timeLast % 60;
  useEffect(() => {
    const fetchRoomInfo = async () => {
      try {
        const roomRef = doc(db, "roomPk", roomCode || "");
        const roomSnapshot = await getDoc(roomRef);
        if (roomSnapshot.exists()) {
          const roomData = roomSnapshot.data();
          setInfo_RoomPk(roomData);
        } else {
          console.error("Phòng không tồn tại.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin phòng:", error);
      }
    };
    fetchRoomInfo();
  }, []);

  const handleJoinRoom = async (item: any) => {
    const invitationMessage = "Bạn có muốn tham gia phòng không ?";
    try {
      localStorage.setItem("dataFigure2", JSON.stringify(item));
      const roomRef = doc(db, "dataFigure", item?.id || "");
      await updateDoc(roomRef, {
        invitation: {
          idRoom: roomCode,
          message: invitationMessage,
          inviter: user_info?.name,
        },
      });
      setIsModalOpen(false);
      toast.success("Gửi lời mời thành công", {
        autoClose: 1000,
      });
      console.log("Room updated!");
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };
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
    try {
      const roomRef = doc(db, "roomPk", roomCode || "");
      if (
        idAttack == info_RoomPk?.item_host?.my_id &&
        info_RoomPk?.result_dice_nv1 - info_RoomPk?.result_dice_nv2 > 0 &&
        info_RoomPk?.isActtack_nv1
      ) {
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
          result_dice_nv1: null,
          result_dice_nv2: null,
          current_turn: 1,
          isActtack_nv1: false,
        });
      }
      if (
        idAttack == info_RoomPk?.item_guest?.my_id &&
        info_RoomPk?.result_dice_nv1 - info_RoomPk?.result_dice_nv2 < 0 &&
        info_RoomPk?.isActtack_nv1
      ) {
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
          result_dice_nv1: null,
          result_dice_nv2: null,
          current_turn: 1,
          isActtack_nv1: false,
        });
      }
    } catch (error) {
      console.log(error, "lỗi cập nhật máu");
    }
  };

  const Blood = (blood: number, maxBlood: number) => {
    const percent = (blood / maxBlood) * 100;
    return percent;
  };
  // Người chiến thắng
  useEffect(() => {
    const handlePlayerWin = async (playerName: string) => {
      setTimeout(async () => {
        try {
          const roomRef = doc(db, "roomPk", roomCode || "");
          await deleteDoc(roomRef);
          const user = doc(db, "dataFigure", checknv[0]?.id || "");
          await updateDoc(user, {
            status: false,
          });
        } catch (error) {
          console.log("xoá phòng thất bại");
        }
        localStorage.removeItem("dataFigure2");
        toast.success(`Người chơi ${playerName} thắng`);
        navigate("/main");
      }, 2000);
    };

    if (info_RoomPk?.item_host?.character?.blood <= 0) {
      handlePlayerWin(info_RoomPk?.item_guest?.name);
    }

    if (info_RoomPk?.item_guest?.character?.blood <= 0) {
      handlePlayerWin(info_RoomPk?.item_host?.name);
    }
  }, [info_RoomPk]);
  const checkPlayer = () => {
    if (info_RoomPk?.result_dice_nv1 && info_RoomPk?.result_dice_nv2) {
      const check_point =
        info_RoomPk?.result_dice_nv1 - info_RoomPk?.result_dice_nv2;
      if (check_point > 0) {
        return `Lượt chơi này là của ${info_RoomPk?.item_host?.name} `;
      }
      if (check_point < 0) {
        return `Lượt chơi này là của ${info_RoomPk?.item_guest?.name} `;
      }
      if (check_point == 0) {
        return `Hoà`;
      }
    }
  };
  // Thoát khỏi phòng pk
  // const handlExits = async () => {
  //   if (
  //     window.confirm(
  //       "Bạn có muốn thoát khỏi phòng không ? \n Nếu thoát khỏi phòng bạn sẽ bị xử thua"
  //     )
  //   ) {
  //     try {
  //       const roomRef = doc(db, "roomPk", roomCode || "");
  //       await deleteDoc(roomRef);
  //       const user = doc(db, "dataFigure", checknv[0]?.id || "");
  //       await updateDoc(user, {
  //         status: false,
  //       });
  //       localStorage.removeItem("dataFigure2");
  //       navigate("/main");
  //     } catch (error) {
  //       console.log("xoá phòng thất bại");
  //     }
  //   }
  // };
  useEffect(() => {
    if (info_RoomPk?.start) {
      const interval = setInterval(() => {
        if (info_RoomPk?.timeLast > 0) {
          const roomRef = doc(db, "roomPk", roomCode || "");
          updateDoc(roomRef, {
            timeLast: info_RoomPk?.timeLast - 1,
          });
        } else {
          clearInterval(interval);
          (async () => {
            try {
              const user = doc(db, "dataFigure", checknv[0]?.id || "");
              await updateDoc(user, {
                status: false,
              });
              const roomRef = doc(db, "roomPk", roomCode || "");
              await deleteDoc(roomRef);
              localStorage.removeItem("dataFigure2");
              if (
                info_RoomPk?.item_host?.character?.blood -
                  info_RoomPk?.item_guest?.character?.blood <
                0
              ) {
                toast.success(
                  `Hết thời gian người thắng là ${info_RoomPk?.item_guest?.name}`
                );
              }
              if (
                info_RoomPk?.item_guest?.character?.blood -
                  info_RoomPk?.item_host?.character?.blood <
                0
              ) {
                toast.success(
                  `Hết thời gian người thắng là ${info_RoomPk?.item_host?.name}`
                );
              }
              if (
                info_RoomPk?.item_guest?.character?.blood -
                  info_RoomPk?.item_host?.character?.blood ==
                0
              ) {
                toast.success(`Hết thời gian cả 2 hoà`);
              }

              navigate("/main");
            } catch (error) {
              console.log("Xoá phòng thất bại");
            }
          })();
        }
      }, 1000); // Đếm thời gian mỗi giây
      return () => clearInterval(interval);
    }
  }, [info_RoomPk?.timeLast, roomCode, checknv, navigate]);
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
      unsubscribe();
    };
  }, [roomCode]);
  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (info_RoomPk?.isActtack_nv1 && info_RoomPk?.result_dice_nv1) {
        // Trường hợp không đánh, mất lượt
        const roomRef = doc(db, "roomPk", roomCode || "");
        try {
          await updateDoc(roomRef, {
            result_dice_nv1: null,
            result_dice_nv2: null,
            current_turn: 1, // Đặt lượt cho người chơi tiếp theo
            isActtack_nv1: false, // Đặt lại trạng thái tấn công
          });
          toast.warning(`Người chơi mất lượt tấn công`, {
            autoClose: 2000,
          });
        } catch (error) {
          console.log(error, "lỗi cập nhật máu và lượt");
        }
      }
    }, 5000);

    // Xóa interval khi component unmount
    return () => clearInterval(intervalId);
  }, [info_RoomPk?.isActtack_nv1]);
  return (
    <>
      <div className="box-container w-screen max-h-screen">
        <ToastContainer />
        <div className="pk_number text-center ">
          <h1 className="text-xl font-medium ring w-32 h-10 mx-auto bg-red-500 text-white mt-5  rounded-sm">
            {info_RoomPk?.nameRoom}
          </h1>
          <h1 className="text-xl font-medium mx-auto  rounded-sm pt-5">
            {checkPlayer()} <br />
          </h1>
        </div>
        <div className="box relative w-full ">
          {/* Thời gian phòng*/}
          <div className="time_room absolute -top-20 left-10 bg-red-500 w-32 h-10 rounded-md ">
            <button className="text-white   m-auto w-full h-full font-medium">
              {`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
            </button>
          </div>
          {/* Rời phòng */}
          {/* <div className="button_exits absolute -top-10 right-10 bg-red-500 w-32 h-10 rounded-md ">
            <button
              onClick={handlExits}
              className="text-white m-auto w-full h-full font-medium"
            >
              Rời khỏi phòng
            </button>
          </div> */}
          <div className=" pt-20 relative">
            <div className="figure__boold absolute top-10 left-10">
              <div className="flex justify-between">
                {" "}
                <h1 className="">{user_info.name}</h1>
                <span>
                  Bỏ lượt{" "}
                  {user_info2?.my_id
                    ? info_RoomPk?.times_host
                    : info_RoomPk?.times_guest}{" "}
                  lần
                </span>
              </div>
              <progress
                max={100}
                value={
                  user_info2?.character?.blood
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
              <div className="flex justify-between">
                <h1>Hệ : {user_info?.class}</h1>
                <span>
                  Số điểm gieo xúc xắc :{" "}
                  {user_info2?.my_id
                    ? info_RoomPk?.result_dice_nv1
                    : info_RoomPk?.result_dice_nv2}
                </span>
              </div>
              <div className="image_figure w-64 xl:w-72">
                {user_info2?.my_id ? (
                  <img src="/nv1.webp" alt="" />
                ) : (
                  <img src="/nv2.webp" alt="" />
                )}
              </div>
              <div className="skills text-center mt-10">
                <div className={`skill`}>
                  {!user_info2?.my_id &&
                    info_RoomPk?.result_dice_nv1 &&
                    info_RoomPk?.result_dice_nv2 &&
                    info_RoomPk?.result_dice_nv1 -
                      info_RoomPk?.result_dice_nv2 <
                      0 && (
                      <button
                        onClick={() => handlActtack(user_info?.my_id)}
                        className="w-32 h-10 text-white font-medium bg-blue-500 ring active:bg-blue-600"
                      >
                        Tấn công
                      </button>
                    )}
                  {user_info2?.my_id &&
                    info_RoomPk?.result_dice_nv1 &&
                    info_RoomPk?.result_dice_nv2 &&
                    Number(
                      info_RoomPk?.result_dice_nv1 -
                        info_RoomPk?.result_dice_nv2 >
                        0
                    ) && (
                      <button
                        onClick={() => handlActtack(user_info?.my_id)}
                        className="w-32 h-10 text-white font-medium bg-blue-500 ring active:bg-blue-600"
                      >
                        Tấn công
                      </button>
                    )}
                </div>
              </div>
            </div>
            <div className="dices text-center w-full mx-auto">
              {/* Gieo xúc xắc */}
              <Dice
                roomCode={id}
                info_RoomPk={info_RoomPk}
                checknv={checknv[0]}
              />
            </div>
            {info_RoomPk.id_user_guest !== null ? (
              <div className="figure__boold absolute top-10 right-10">
                <div className="flex justify-between">
                  {" "}
                  <h1>{user_info2.name || info_RoomPk?.item_host?.name}</h1>
                  <span>
                    Bỏ lượt{" "}
                    {user_info2?.my_id
                      ? info_RoomPk?.times_guest
                      : info_RoomPk?.times_host}
                    lần
                  </span>
                </div>
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
                <div className="flex justify-between">
                  <h1>
                    Hệ :{user_info2.class || info_RoomPk?.item_host?.class}
                  </h1>
                  <span>
                    Số điểm gieo xúc xắc :{" "}
                    {user_info2?.my_id
                      ? info_RoomPk?.result_dice_nv2
                      : info_RoomPk?.result_dice_nv1}
                  </span>
                </div>

                <div className="image_figure w-64 xl:w-72">
                  {user_info2?.my_id ? (
                    <img src="/nv2.webp" alt="" />
                  ) : (
                    <img src="/nv1.webp" alt="" />
                  )}
                </div>
                <div className="skills text-center mt-10">
                  <div className={`skill`}>
                    {user_info2?.my_id &&
                      info_RoomPk?.result_dice_nv1 &&
                      info_RoomPk?.result_dice_nv2 &&
                      Number(
                        info_RoomPk?.result_dice_nv1 -
                          info_RoomPk?.result_dice_nv2 <
                          0
                      ) && (
                        <button
                          onClick={() => handlActtack(user_info?.my_id)}
                          className="w-32 h-10 text-white font-medium bg-blue-500 ring active:bg-blue-600"
                        >
                          Tấn công
                        </button>
                      )}
                    {!user_info2?.my_id &&
                      info_RoomPk?.result_dice_nv1 &&
                      info_RoomPk?.result_dice_nv2 &&
                      info_RoomPk?.result_dice_nv1 -
                        info_RoomPk?.result_dice_nv2 >
                        0 && (
                        <button
                          onClick={() => handlActtack(user_info?.my_id)}
                          className="w-32 h-10 text-white font-medium bg-blue-500 ring active:bg-blue-600"
                        >
                          Tấn công
                        </button>
                      )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="figure__boold absolute top-10 right-10">
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
                {/* Danh sách Hero */}
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
                  <div className="list bg-white rounded-md ring pl-3 pr-10 py-3 max-h-[500px] overflow-auto">
                    {user_info_firebase &&
                      user_info_firebase?.map((item: any, index) => {
                        if (item?.my_id != user_info?.my_id && !item?.status) {
                          return (
                            <Invite_ListHero
                              item={item}
                              index={index}
                              handleJoinRoom={handleJoinRoom}
                            />
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
