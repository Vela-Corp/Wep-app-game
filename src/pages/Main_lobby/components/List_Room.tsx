import { Link } from "react-router-dom";

const List_Room = ({ item, index, checknv, handlDeleteRoom }: any) => {
  return (
    <div
      key={index}
      className="hero flex items-center justify-between  gap-3 border-b-2 border-blue-500 border-s-2 p-2 cursor-pointer"
    >
      <Link key={index} to={`/pk_map/${item?.id}`} className="w-full">
        <div className="flex items-center gap-2 w-full">
          <div className="image w-14">
            <img src={`/Rectangle507.png`} alt="" />
          </div>
          <div className="info-character">
            <h2 className="text-lg font-medium">
              Name:{" "}
              <span className="text-md font-normal">{item?.nameRoom}</span>
            </h2>
            <span>Status:</span>
          </div>
        </div>
      </Link>
      <div
        className={`${
          item?.id_user_host != checknv?.id ? "hidden" : ""
        } btn_delete_room mt-2 text-right`}
      >
        <button
          onClick={() => handlDeleteRoom(item?.id)}
          className="px-4 py-1 bg-red-500 text-white font-semibold rounded-md"
        >
          Xoá
        </button>
      </div>
    </div>
  );
};

export default List_Room;
