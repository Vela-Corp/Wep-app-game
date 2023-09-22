import { useEffect, useState } from "react";
import "../style/Dice.css";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import Animated3D from "./Animated3D";
import { toast } from "react-toastify";
function Dice({ roomCode, info_RoomPk, checknv }: any) {
  const [rolling, setRolling] = useState(false);
  // const [timer, setTimer] = useState(5);
  // const [times, setTimes] = useState(0);
  const user_info2 = JSON.parse(localStorage.getItem("dataFigure2") || "{}");
  const rollDice = async () => {
    if (rolling) return;
    if (
      info_RoomPk?.result_dice_nv1 &&
      info_RoomPk?.result_dice_nv2 &&
      info_RoomPk?.result_dice_nv1 != info_RoomPk?.result_dice_nv2
    ) {
      alert("Đã có kết quả");
      return;
    }
    if (
      info_RoomPk?.id_user_guest == "" ||
      info_RoomPk?.id_user_guest == null
    ) {
      alert("Chưa có người chơi");
      return;
    }
    // xác minh người chơi hiện tại đã gieo xúc xắc chưa
    if (info_RoomPk?.current_turn == 1 && !user_info2?.my_id) {
      alert("Chưa đến lượt bạn");
      return;
    }
    if (user_info2?.my_id && info_RoomPk?.current_turn == 2) {
      alert("Bạn đã hết lượt");
      return;
    }
    setRolling(true);
    const randomResult = Math.floor(Math.random() * 6 + 1);
    // setResult(randomResult);
    for (var k = 1; k <= 6; k++) {
      const elDiceTwo = document.getElementById("dice2");
      elDiceTwo?.classList.remove(`show-` + k);
      if (randomResult == k) {
        elDiceTwo?.classList.add(`show-` + k);
      }
    }
    setTimeout(() => {
      setRolling(false);
    }, 1000);
    try {
      // gieo xúc xắc , thay đổi dữ liệu ở firebase
      if (info_RoomPk?.current_turn == 1 && !info_RoomPk?.result_dice_nv2) {
        const dice = doc(db, "roomPk", roomCode || "");
        await updateDoc(dice, {
          result_dice_nv1: randomResult,
          current_turn: 2,
          // times_host: 0,
          timer: 5,
        });
        return;
      }
      if (info_RoomPk?.current_turn == 2) {
        if (!info_RoomPk?.result_dice_nv1) {
          const dice = doc(db, "roomPk", roomCode || "");
          await updateDoc(dice, {
            result_dice_nv1: 0,
          });
        }
        const dice = doc(db, "roomPk", roomCode || "");
        await updateDoc(dice, {
          result_dice_nv2: randomResult,
          current_turn: 1,
          isActtack_nv1: true,
          // times_guest: 0, // bỏ lượt
          timer_host: 5, // reset timer
        });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      if (info_RoomPk?.result_dice_nv1 - info_RoomPk?.result_dice_nv2 == 0) {
        setTimeout(async () => {
          const dice = doc(db, "roomPk", roomCode || "");
          await updateDoc(dice, {
            current_turn: 1,
            result_dice_nv1: null,
            result_dice_nv2: null,
            timer_guest: 5,
            isActtack_nv1: false,
          });

          return;
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  }, [info_RoomPk?.result_dice_nv1, info_RoomPk?.result_dice_nv2]);
  // kiểm tra gieo xúc xắc và mất lượt
  useEffect(() => {
    if (info_RoomPk?.start === true) {
      (async () => {
        try {
          // const hostBlood = info_RoomPk?.item_host?.character?.blood || 0;
          // const guestBlood = info_RoomPk?.item_guest?.character?.blood || 0;

          if (info_RoomPk?.times_host >= 3) {
            const user = doc(db, "dataFigure", checknv?.id || "");
            await updateDoc(user, {
              status: false,
              request: null,
            });
            const dice = doc(db, "roomPk", roomCode || "");
            await deleteDoc(dice);
            localStorage.removeItem("dataFigure2");
            toast(
              `Người chơi ${info_RoomPk?.item_host?.name} đã bỏ 3 lượt và bị xử thua `
            );
            return;
          }
          if (info_RoomPk?.times_guest >= 3) {
            const user = doc(db, "dataFigure", checknv?.id || "");
            await updateDoc(user, {
              status: false,
              request: null,
            });
            const dice = doc(db, "roomPk", roomCode || "");
            await deleteDoc(dice);
            localStorage.removeItem("dataFigure2");
            toast(
              `Người chơi ${info_RoomPk?.item_guest?.name} đã bỏ 3 lượt liên tiếp và bị xử thua `
            );
            return;
          }
        } catch (error) {
          console.log(error);
        }
      })();

      if (info_RoomPk?.timer_host <= 0 || info_RoomPk?.timer_guest <= 0) {
        (async () => {
          try {
            if (
              user_info2?.my_id &&
              info_RoomPk?.current_turn == 1 &&
              !info_RoomPk?.result_dice_nv2
            ) {
              const dice = doc(db, "roomPk", roomCode || "");
              await updateDoc(dice, {
                result_dice_nv1: null,
                current_turn: 2,
                times_host: info_RoomPk?.times_host + 1,
                timer_host: 5,
              });

              return;
            }
            if (!user_info2?.my_id && info_RoomPk?.current_turn == 2) {
              const dice = doc(db, "roomPk", roomCode || "");
              await updateDoc(dice, {
                current_turn: 1,
                result_dice_nv1: null,
                result_dice_nv2: null,
                times_guest: info_RoomPk?.times_guest + 1,
                timer_guest: 5,
              });
              return;
            }
          } catch (error) {
            console.log(error);
          }
        })();
      }

      const interval = setInterval(async () => {
        if (info_RoomPk?.timer_host > 0 || info_RoomPk?.timer_guest > 0) {
          if (
            user_info2?.my_id &&
            info_RoomPk?.current_turn == 1 &&
            !info_RoomPk?.result_dice_nv2
          ) {
            const dice = doc(db, "roomPk", roomCode || "");
            await updateDoc(dice, {
              timer_host: info_RoomPk?.timer_host - 1,
            });
            return;
          }
          if (!user_info2?.my_id && info_RoomPk?.current_turn == 2) {
            const dice = doc(db, "roomPk", roomCode || "");
            await updateDoc(dice, {
              timer_guest: info_RoomPk?.timer_guest - 1,
            });
            return;
          }
        }
      }, 1000);

      // Xóa interval khi component bị hủy
      return () => clearInterval(interval);
    }
  }, [rolling, roomCode, info_RoomPk]);

  return (
    <div>
      <h3 className="text-lg font-normal italic text-center -mt-10 pb-5">
        {!info_RoomPk?.result_dice_nv2
          ? info_RoomPk?.current_turn == 1
            ? `Lượt của ${
                info_RoomPk?.item_host?.name +
                ":" +
                info_RoomPk?.timer_host +
                "s"
              }  `
            : `Lượt của ${
                info_RoomPk?.item_guest?.name +
                ":" +
                info_RoomPk?.timer_guest +
                "s"
              }  `
          : ""}
      </h3>
      <button
        id="roll"
        className="bg-[#FBB42F] px-5 py-3 ring "
        onClick={rollDice}
        disabled={rolling}
      >
        {rolling ? "Đang gieo xúc xắc" : "Gieo xúc xắc"}
      </button>
      {/* Thêm id cho phần tử xúc xắc */}
      <div className="absolute left-1/2 -top-1/2">
        <Animated3D />
      </div>
    </div>
  );
}

export default Dice;
