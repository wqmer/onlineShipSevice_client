import React, { useState } from "react";
import { Modal, Button, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
const { Text, Link } = Typography;
const App = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <a type="primary" onClick={showModal}>
        {props.link}
      </a>
      <Modal
        bodyStyle={{ background: "#f5f7fd" , paddingBottom :36}}
        // centered
        style={{ top: 42, left: 96 }}
        // title={props.link}
        width={1500}
        visible={isModalVisible}
        destroyOnClose
        // onOk={handleOk}
        onCancel={handleCancel}
        keyboard
        maskClosable
        footer={null}
        // closeIcon={
        //   <Text keyboard>
        //     ESC
        //   </Text>
        // }
      >
        {props.content}
      </Modal>
    </div>
  );
};

export default App;
