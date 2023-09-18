import { useEffect, useState } from "react";
import "../style/Dice.css";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import Animated3D from "./Animated3D";
function Dice({ roomCode, info_RoomPk }: any) {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(null as any);
  console.log(result);

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
    setResult(randomResult);
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
      if (info_RoomPk?.current_turn == 1) {
        const dice = doc(db, "roomPk", roomCode || "");
        await updateDoc(dice, {
          result_dice_nv1: randomResult,
          current_turn: 2,
        });
        return;
      }
      if (info_RoomPk?.result_dice_nv1 && info_RoomPk?.current_turn == 2) {
        const dice = doc(db, "roomPk", roomCode || "");
        await updateDoc(dice, {
          result_dice_nv2: randomResult,
          current_turn: 1,
          isActtack_nv1: true,
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
          });
          return;
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  }, [info_RoomPk?.result_dice_nv1, info_RoomPk?.result_dice_nv2]);
  return (
    <div>
      <button
        id="roll"
        className="bg-[#FBB42F] px-5 py-3 ring"
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
