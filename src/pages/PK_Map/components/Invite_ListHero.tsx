const Invite_ListHero = ({item, index, handleJoinRoom}:any) => {
  return (
    <div
      onClick={() => handleJoinRoom(item)}
      key={index}
      className="hero flex items-center gap-3 border-b-2 border-yellow-500 border-s-2 p-2 cursor-pointer"
    >
      <div className="image w-14">
        <img src={`/Rectangle507.png`} alt="" />
      </div>
      <div className="info-character">
        <h2 className="text-lg font-medium">
          Name: <span className="text-md font-normal">{item?.name}</span>
        </h2>
        <span>
          Class: <span className="text-md font-normal">{item?.class}</span>
        </span>
      </div>
    </div>
  );
};

export default Invite_ListHero;
