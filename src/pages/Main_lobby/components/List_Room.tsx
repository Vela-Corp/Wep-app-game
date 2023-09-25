import { Link } from "react-router-dom";
const List_Room = ({ item, index, checknv, handlRequestRoom }: any) => {
  return (
    <div
      key={index}
      className="hero flex items-center justify-between  xl:gap-3 border-b-2 border-blue-500 border-s-2 xl:p-2 cursor-pointer"
    >
      {item?.id_user_host != checknv?.id ||
      item?.id_user_guest != checknv?.id ? (
        <>
          <div
            onClick={() => handlRequestRoom(item?.id)}
            key={index}
            className="w-full"
          >
            <div className="flex items-center gap-2 w-full">
              <div className="image w-14">
                <img className="w-full" src={`/Rectangle507.png`} alt="" />
              </div>
              <div className="info-character">
                <h2 className="text-lg font-medium">
                  Name:{" "}
                  <span className="text-md font-normal">{item?.nameRoom}</span>
                </h2>
                <span className="font-medium p">
                  Host:{" "}
                  <span className="italic font-normal">{checknv?.name}</span>{" "}
                </span>
              </div>
            </div>
          </div>
          <div
            className={`${
              item?.id_user_host != checknv?.id ? "hidden" : ""
            } btn_delete_room mt-2 text-right`}
          >
            {/* <button
              onClick={() => handlDeleteRoom(item?.id)}
              className="px-4 py-1 bg-red-500 text-white font-semibold rounded-md"
            >
              Xoá
            </button> */}
          </div>
        </>
      ) : (
        <Link to={`/pk_map/${item?.id}`} className="w-full">
          <div className="flex items-center gap-2 w-full">
            <div className="image w-14">
              <img className="w-full" src={`/Rectangle507.png`} alt="" />
            </div>
            <div className="info-character">
              <h2 className="text-lg font-medium">
                Name:{" "}
                <span className="text-md font-normal">{item?.nameRoom}</span>
              </h2>
              <span className="font-medium">
                Chủ phòng:{" "}
                <span className="italic font-normal">{checknv?.name}</span>{" "}
              </span>
            </div>
            <div
              className={`${
                item?.id_user_host != checknv?.id ? "hidden" : ""
              } btn_delete_room mt-2 text-right`}
            >
              {/* <button
                onClick={() => handlDeleteRoom(item?.id)}
                className="px-4 py-1 bg-red-500 text-white font-semibold rounded-md"
              >
                Xoá
              </button> */}
            </div>
          </div>
        </Link>
      )}
    </div>
  );
};

export default List_Room;
