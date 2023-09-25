import { Modal } from "antd";

const Request_Hero = ({ info_RoomPk, handleAccept, handlExits }: any) => {
  return (
    <>
      <Modal
        title={<h1 className="text-xl">Yêu cầu</h1>}
        okButtonProps={{ style: { backgroundColor: "blue" } }}
        style={{ top: "30%" }}
        open={info_RoomPk?.request}
        onOk={() => handleAccept()}
        onCancel={() => handlExits()}
      >
        <div className="box-invitation">
          <span className="text-lg font-medium">
            {info_RoomPk?.request?.message}
          </span>
        </div>
      </Modal>
    </>
  );
};

export default Request_Hero;
