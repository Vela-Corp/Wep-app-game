import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Detail_Hero = ({ user_info, character, handlIncrease }: any) => {
  return (
    <div>
      <div className="box-user ">
        <div className="info-user p-5 ">
          <div className="info-header flex items-center justify-between">
            <div className="name_user">
              <h3 className="text-white text-xl font-medium ">
                {user_info?.name}
              </h3>
            </div>
            <div className="image_avatar w-32">
              <img src="../../src/assets/Rectangle507.png" alt="" />
            </div>
          </div>
          <div className="content-character bg-white rounded-md p-3 mt-3">
            <div className="box flex items-start justify-center md:justify-normal gap-3">
              <div className="big-image md:block hidden w-2/5">
                <img
                  className="w-full object-cover"
                  src="https://thuthuatnhanh.com/wp-content/uploads/2022/12/hinh-anh-tanjiro.jpg"
                  alt=""
                />
              </div>
              <div className="info-character w-2/3 pr-2">
                <h1 className="text-center text-xl font-semibold">
                  {user_info?.class}
                </h1>
                <div className="character flex items-start justify-between gap-5 mt-5">
                  <div className="cols-1 flex flex-col gap-2">
                    <span className="flex items-center gap-2 text-lg font-medium w-24">
                      <img
                        className="w-6"
                        src="../../src/assets/image39.png"
                        alt=""
                      />
                      <b> {character?.physics}</b>

                      <i
                        onClick={() => handlIncrease("physics")}
                        className="cursor-pointer w-full text-right"
                      >
                        <FontAwesomeIcon
                          className="text-sm ring-2 ring-black active:ring-2 active:ring-yellow-400 rounded-sm p-[1px]"
                          icon={faPlus}
                        />
                      </i>
                    </span>
                    <span className="flex items-center gap-2 text-lg font-medium w-24">
                      <img
                        className="w-6"
                        src="../../src/assets/image41.png"
                        alt=""
                      />
                      <b> {character?.blood}</b>
                      <i
                        onClick={() => handlIncrease("blood")}
                        className="cursor-pointer w-full text-right"
                      >
                        <FontAwesomeIcon
                          className="text-sm ring-2 ring-black active:ring-2 active:ring-yellow-400 rounded-sm p-[1px]"
                          icon={faPlus}
                        />
                      </i>
                    </span>
                    <span className="flex items-center gap-2 text-lg font-medium">
                      <img
                        className="w-6"
                        src="../../src/assets/image40(1).png"
                        alt=""
                      />
                      {character?.physicalArmor}
                      <i
                        onClick={() => handlIncrease("physicalArmor")}
                        className="cursor-pointer w-full text-right"
                      >
                        <FontAwesomeIcon
                          className="text-sm ring-2 ring-black active:ring-2 active:ring-yellow-400 rounded-sm p-[1px]"
                          icon={faPlus}
                        />
                      </i>
                    </span>
                    <span className="flex items-center gap-2 text-lg font-medium">
                      <img
                        className="w-6"
                        src="../../src/assets/image47.png"
                        alt=""
                      />
                      {character?.penetratesPhysicalArmor}
                      <i
                        onClick={() => handlIncrease("penetratesPhysicalArmor")}
                        className="cursor-pointer w-full text-right"
                      >
                        <FontAwesomeIcon
                          className="text-sm ring-2 ring-black active:ring-2 active:ring-yellow-400 rounded-sm p-[1px]"
                          icon={faPlus}
                        />
                      </i>
                    </span>
                    <span className="flex items-center gap-2 text-lg font-medium">
                      <img
                        className="w-6"
                        src="../../src/assets/image48.png"
                        alt=""
                      />
                      {character?.attackSpeed}
                      <i
                        onClick={() => handlIncrease("attackSpeed")}
                        className="cursor-pointer w-full text-right"
                      >
                        <FontAwesomeIcon
                          className="text-sm ring-2 ring-black active:ring-2 active:ring-yellow-400 rounded-sm p-[1px]"
                          icon={faPlus}
                        />
                      </i>
                    </span>
                  </div>
                  <div className="cols-2 flex flex-col gap-2">
                    <span className="flex items-center gap-2 text-lg font-medium">
                      <img
                        className="w-6"
                        src="../../src/assets/image45.png"
                        alt=""
                      />
                      {character?.public}
                      <i
                        onClick={() => handlIncrease("public")}
                        className="cursor-pointer w-full text-right"
                      >
                        <FontAwesomeIcon
                          className="text-sm ring-2 ring-black active:ring-2 active:ring-yellow-400 rounded-sm p-[1px]"
                          icon={faPlus}
                        />
                      </i>
                    </span>
                    <span className="flex items-center gap-2 text-lg font-medium">
                      <img
                        className="w-6"
                        src="../../src/assets/image42.png"
                        alt=""
                      />
                      {character?.runningSpeed}
                      <i
                        onClick={() => handlIncrease("runningSpeed")}
                        className="cursor-pointer w-full text-right"
                      >
                        <FontAwesomeIcon
                          className="text-sm ring-2 ring-black active:ring-2 active:ring-yellow-400 rounded-sm p-[1px]"
                          icon={faPlus}
                        />
                      </i>
                    </span>
                    <span className="flex items-center gap-2 text-lg font-medium">
                      <img
                        className="w-6"
                        src="../../src/assets/image40.png"
                        alt=""
                      />
                      {character?.magicArmor}
                      <i
                        onClick={() => handlIncrease("magicArmor")}
                        className="cursor-pointer w-full text-right"
                      >
                        <FontAwesomeIcon
                          className="text-sm ring-2 ring-black active:ring-2 active:ring-yellow-400 rounded-sm p-[1px]"
                          icon={faPlus}
                        />
                      </i>
                    </span>
                    <span className="flex items-center gap-2 text-lg font-medium">
                      <img
                        className="w-6"
                        src="../../src/assets/image46.png"
                        alt=""
                      />
                      {character?.magicPenetration}
                      <i
                        onClick={() => handlIncrease("magicPenetration")}
                        className="cursor-pointer w-full text-right"
                      >
                        <FontAwesomeIcon
                          className="text-sm ring-2 ring-black active:ring-2 active:ring-yellow-400 rounded-sm p-[1px]"
                          icon={faPlus}
                        />
                      </i>
                    </span>
                    <span className="flex items-center gap-2 text-lg font-medium">
                      <img
                        className="w-6"
                        src="../../src/assets/image49.png"
                        alt=""
                      />
                      {character?.cooldown}
                      <i
                        onClick={() => handlIncrease("cooldown")}
                        className="cursor-pointer w-full text-right"
                      >
                        <FontAwesomeIcon
                          className="text-sm ring-2 ring-black active:ring-2 active:ring-yellow-400 rounded-sm p-[1px]"
                          icon={faPlus}
                        />
                      </i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail_Hero;
