import { Skeleton, Pagination, Spin } from "antd";
import React, { Component } from "react";
import { LoadingOutlined } from "@ant-design/icons";
// import sample from './sample.png'
import {
  HomeOutlined,
  SettingFilled,
  SmileOutlined,
  SyncOutlined,
} from "@ant-design/icons";

const labelPattern = {
  InternationalBridge: {
    // marginTop: "22.5%",
    // filter: "blur(4.5px)",
    height: "auto",
    width: "60%",
    minWidth: 525,
    boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.12)",
  },

  UPS: {
    // clipPath: "inset(0% 14% 0% 0%)",
    // filter: "blur(6px)",
    height: "auto",
    width: "60%",
    minWidth: 525,
    // maxWidth: 525,
    boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.12)",
    // transform: "rotate(90deg)",
    // marginTop: "25%",
    // marginLeft: "-7.5%",
  },

  FEDEX: {
    // clipPath: "inset(0% 14% 0% 0%)",
    // filter: "blur(6px)",
    height: "auto",
    width: "60%",
    minWidth: 525,
    // maxWidth: 525,
    boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.12)",
    // transform: "rotate(90deg)",
    // marginTop: "25%",
    // marginLeft: "-7.5%",
  },
};

const placeholder = {
  InternationalBridge: "/usps.png",
  FEDEX: "/fedex.png",
  UPS: "/ups.jpg",
};
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
class Labelgallery extends React.Component {
  constructor(props) {
    super(props);
  }

  state = { loading: true, current: 1 };

  displayLabel() {
    return this.props.labels.map((item, index) => {
      let carrier_type = item.type ? item.type : "InternationalBridge";
      if (index == this.state.current - 1) {
        return (
          <div
            key={item.key}
            style={{
              // height: "auto",
              width: "50%",
              minWidth: 525,
              minHeight: 800,
              // textAlign :'center'
              // boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.12)",
            }}
          >
            <Spin
              style={{ marginTop: "25%" }}
              key={item.key}
              indicator={antIcon}
              // spinning={false}
              spinning={this.state.loading}
              size="large"
            >
              <img
                hidden={!this.state.loading}
                // hidden ={false} //调试
                style={{
                  // clipPath: "inset(0% 14% 0% 0%)",
                  filter: "blur(0.4rem)",
                  height: "auto",
                  width: "60%",
                  minWidth: 525,
                  boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.12)",
                  // transform: "rotate(90deg)",
                  // marginTop: "25%",
                  // marginLeft: "-7.5%",
                }}
                key={item.key + item.type}
                // src='/sample.png'
                src={placeholder[carrier_type]}
              />
              <img
                hidden={this.state.loading}
                // hidden ={true} 调试
                style={labelPattern[carrier_type]}
                key={item.key}
                onLoad={() => this.setState({ loading: false })}
                src={item.url}
              />
            </Spin>
          </div>
        );
      }
    });
  }
  render() {
    console.log(this.props.labels);
    return (
      <div style={{ marginLeft: "20%", textAlign: "center" }}>
        {this.props.labels.length == 0 ? (
          <Spin
            style={{ marginTop: "70%" }}
            indicator={antIcon}
            // spinning={false}
            spinning={this.state.loading}
            size="large"
          />
        ) : (
          this.displayLabel()
        )}

        <div style={{ width: "50%", minWidth: 525, textAlign: "center" }}>
          <Pagination
            style={{ marginTop: 16 }}
            simple
            hideOnSinglePage={true}
            pageSize={1}
            defaultCurrent={1}
            current={this.state.current}
            total={this.props.labels.length}
            onChange={(page, pageSize) => {
              this.props.setCurrentTrackingNumbers(
                this.props.labels[page - 1].tracking_numbers
              );
              console.log(this.props.labels[page - 1]);
              this.setState({ loading: true, current: page });
            }}
          />
        </div>
      </div>
    );
  }
}

export default Labelgallery;
