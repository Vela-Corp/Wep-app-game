import { Modal } from "antd";

const Invitation = ({ accept, unAccep, checknv }: any) => {
  return (
    <>
      <Modal
        title={<h1 className="text-xl">Lời mời</h1>}
        open={checknv?.invitation}
        okButtonProps={{ style: { backgroundColor: "blue" } }}
        onOk={() => accept()}
        onCancel={unAccep}
        style={{ top: "30%" }}
      >
        <div className="box-invitation">
          <h1>
            Bạn có muốn tham gia phòng từ{" "}
            <span className="text-lg font-medium">
              {checknv?.invitation?.inviter}
            </span>{" "}
            không
          </h1>
        </div>
      </Modal>
    </>
  );
};

export default Invitation;
