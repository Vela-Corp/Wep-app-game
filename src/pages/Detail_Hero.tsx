import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "./contetx/Context";
import { Modal } from "antd";
import { ICharacter } from "../interface/characters";

const Detail_Hero = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const [detailHero, setDetailHero] = useState<any>([]);
  console.log(detailHero);
  const user_info_firebase = useContext(AuthContext);
  useEffect(() => {
    const detailHero = user_info_firebase.filter((item: any) => {
      return item.id === id;
    });
    setDetailHero(detailHero[0]);
  }, [id]);
  return (
    <>
      <Modal
        title={
          <>
            <h1 className="text-xl font-semibold text-[#FBB42F]">
              Thông tin nhân vật
            </h1>
          </>
        }
        maskClosable={true}
        closeIcon={false}
        open={open}
        onOk={() => {
          setOpen(false);
          setTimeout(() => {
            navigate("/main");
          }, 300);
        }}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{
          style: { backgroundColor: "#FBB42F", width: "100px" },
        }}
        bodyStyle={{ backgroundColor: "#FBB42F", borderRadius: "10px" }}
      >
        <div className="box-user  mx-auto">
          <div className="info-user p-5 bg-[#FBB42F] rounded-md">
            <div className="info-header flex items-center justify-between">
              <div className="name_user">
                <h3 className="text-white text-xl font-medium ">
                  {detailHero?.name}
                </h3>
              </div>
              <div className="image_avatar w-32">
                <img src="../../src/assets/Rectangle 507.png" alt="" />
              </div>
            </div>
            <div className="content-character bg-white rounded-md p-3 mt-3">
              <div className="box flex items-start gap-3">
                <div className="big-image w-2/3">
                  <img
                    className="w-full object-cover"
                    src="../../src/assets/Rectangle 512.png"
                    alt=""
                  />
                </div>
                <div className="info-character w-1/3 pr-2">
                  <h1 className="text-center text-xl font-semibold">
                    {detailHero?.class}
                  </h1>
                  <div className="character flex items-start gap-5 mt-5">
                    <div className="cols-1 flex flex-col gap-2">
                      <span className="flex items-center gap-2 text-lg font-medium">
                        <img
                          className="w-6"
                          src="../../src/assets/image 39.png"
                          alt=""
                        />
                        {detailHero?.character?.physics}
                      </span>
                      <span className="flex items-center gap-2 text-lg font-medium">
                        <img
                          className="w-6"
                          src="../../src/assets/image 41.png"
                          alt=""
                        />
                        {detailHero?.character?.blood}
                      </span>
                      <span className="flex items-center gap-2 text-lg font-medium">
                        <img
                          className="w-6"
                          src="../../src/assets/image 40 (1).png"
                          alt=""
                        />
                        {detailHero?.character?.physicalArmor}
                      </span>
                      <span className="flex items-center gap-2 text-lg font-medium">
                        <img
                          className="w-6"
                          src="../../src/assets/image 47.png"
                          alt=""
                        />
                        {detailHero?.character?.penetratesPhysicalArmor}
                      </span>
                      <span className="flex items-center gap-2 text-lg font-medium">
                        <img
                          className="w-6"
                          src="../../src/assets/image 48.png"
                          alt=""
                        />
                        {detailHero?.character?.attackSpeed}
                      </span>
                    </div>
                    <div className="cols-2 flex flex-col gap-2">
                      <span className="flex items-center gap-2 text-lg font-medium">
                        <img
                          className="w-6"
                          src="../../src/assets/image 45.png"
                          alt=""
                        />
                        {detailHero?.character?.magicArmor}
                      </span>
                      <span className="flex items-center gap-2 text-lg font-medium">
                        <img
                          className="w-6"
                          src="../../src/assets/image 42.png"
                          alt=""
                        />
                        {detailHero?.character?.runningSpeed}
                      </span>
                      <span className="flex items-center gap-2 text-lg font-medium">
                        <img
                          className="w-6"
                          src="../../src/assets/image 40.png"
                          alt=""
                        />
                        {detailHero?.character?.magicArmor}
                      </span>
                      <span className="flex items-center gap-2 text-lg font-medium">
                        <img
                          className="w-6"
                          src="../../src/assets/image 46.png"
                          alt=""
                        />
                        {detailHero?.character?.magicPenetration}
                      </span>
                      <span className="flex items-center gap-2 text-lg font-medium">
                        <img
                          className="w-6"
                          src="../../src/assets/image 49.png"
                          alt=""
                        />
                        {detailHero?.character?.cooldown}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Detail_Hero;
