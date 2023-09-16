import { useState } from "react";
import "../style/Dice.css";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
function Dice({ roomCode, info_RoomPk }: any) {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(null as any);
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

    setRolling(true);
    const randomResult = Math.floor(Math.random() * 6) + 1;
    setResult(randomResult);
    setTimeout(() => {
      setRolling(false);
    }, 1000);
    try {
      if (info_RoomPk?.result_dice_nv1) {
        const dice = doc(db, "roomPk", roomCode || "");
        await updateDoc(dice, {
          result_dice_nv2: result,
        });
        return;
      }
      // gieo xúc xắc , thay đổi dữ liệu ở firebase
      const dice = doc(db, "roomPk", roomCode || "");
      await updateDoc(dice, {
        result_dice_nv1: result,
      });
    } catch (error) {
      console.log(error);
    }

    // Thêm class 'dice-rolling' để áp dụng animation
    const diceElement = document.getElementById("dice");
    if (diceElement) {
      diceElement.classList.add("dice-rolling");
      setTimeout(() => {
        diceElement.classList.remove("dice-rolling");
      }, 1000);
    }
  };

  return (
    <div>
      <button
        className="bg-[#FBB42F] px-5 py-3 ring"
        onClick={rollDice}
        disabled={rolling}
      >
        {rolling ? "Đang gieo xúc xắc" : "Gieo xúc xắc"}
      </button>
      {/* Thêm id cho phần tử xúc xắc */}
      <div
        id="dice"
        className={`dice-result text-center w-32 mx-auto  pt-10 ${
          rolling ? "dice-rolling" : ""
        } `}
      >
        <img
          width={100}
          className="mx-auto"
          src="https://cdn.pixabay.com/photo/2016/03/31/19/19/dice-1294902_960_720.png"
          alt=""
        />
        {rolling ? (
          <>...</>
        ) : (
          <div>
            <h2 className="text-2xl font-medium">
              {info_RoomPk?.result_dice_nv1}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dice;
