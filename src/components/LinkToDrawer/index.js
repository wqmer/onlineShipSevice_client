import React, { useState } from "react";
import { Modal, Button, Typography, Drawer } from "antd";
import { CloseOutlined } from "@ant-design/icons";

class App extends React.Component {
  state = { visible: false, placement: "left" };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  //   onChange = (e) => {
  //     this.setState({
  //       placement: e.target.value,
  //     });
  //   };

  render() {
    const { placement, visible } = this.state;
    return (
      <div>
        {/* <Space>
          <Radio.Group value={placement} onChange={this.onChange}>
            <Radio value="top">top</Radio>
            <Radio value="right">right</Radio>
            <Radio value="bottom">bottom</Radio>
            <Radio value="left">left</Radio>
          </Radio.Group>
          <Button type="primary" onClick={this.showDrawer}>
            Open
          </Button>
        </Space> */}

        <a type="primary" onClick={this.showDrawer}>
          {this.props.link}
        </a>
        <Drawer
          //   title="Basic Drawer"
          bodyStyle={{ background: "#f5f7fd" , maginTop :64, paddingTop:72}}
          style={{ position: "absolute" }}
          getContainer={"#Page"}
          placement="right"
          width={1325}
          closable={false}
          onClose={this.onClose}
          visible={visible}
          key="right"
          zIndex = {90}
          // mask={false}
 
        >
          {this.props.content}
        </Drawer>
      </div>
    );
  }
}

export default App;
