import { Link } from "react-router-dom";

const List_Hero = ({ item, index }: any) => {
  return (
    <Link key={index} to={`/detail-hero/${item.id}`}>
      <div
        key={index}
        className="hero flex items-center justify-start gap-3 border-b-2 border-yellow-500 border-s-2 p-2 cursor-pointer"
      >
        <div className="image  w-14  ">
          <img src={`/Rectangle507.png`} alt="" />
        </div>
        <div className="info-character ">
          <h2 className="text-lg font-medium">
            Name: <span className="text-md font-normal">{item?.name}</span>
          </h2>
          <span className="flex items-start font-medium">
            Class: <span className="text-md font-normal">{item?.class}</span>
            <span className="ml-2 text-blue-500">
              {item?.status ? "Status:Đang chơi" : ""}
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default List_Hero;
