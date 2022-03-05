import React, { Component, PropTypes } from "react";
import Animate from "rc-animate";
import { Space, Layout, Row, Col } from "antd";

import Demo_avatar from "../Avatar";
import Demo_notification from "../Notification";
import Balance from "../Balacne";
import { get, post } from "../../util/fetch";
import axios from "axios";

const { Header, Sider, Content, Footer } = Layout;
const siderWidth = 256;
class CustomHeader extends Component {
  constructor(props) {
    super(props);
    this.mounted = false;
    // this.eventSource = new EventSource("events");
    // this.test = this.test.bind(this);
    // this.eventSource = new EventSource("http://localhost:8081/api/forwarder/event");
  }

  state = {
    header_hidden: false,
    balance: 0,
    updated: false,
  };

  handleScroll = (e) => {
    // console.log(e)
    const currentStatus = this.state.header_hidden;
    if (e.target.className == "ant-layout-content") {
      if (e.srcElement.scrollTop > 64 && !currentStatus)
        this.setState({ header_hidden: true });
      if (e.srcElement.scrollTop <= 64 && currentStatus)
        this.setState({ header_hidden: false });
    }
  };

  fetchData = async (cancelToken) => {
    // console.log('request to data')
    const result = await get("/user/userInfo", cancelToken);
    return result;
  };

  componentDidMount = () => {
    console.log("it refresh");
    this.mounted = true;
    this.axiosCancelSource = axios.CancelToken.source();
    // document
    //   .getElementById("content")
    //   .addEventListener("scroll", this.handleScroll.bind(this), true);
  };

  // componentDidUpdate = async (prevProps, prevState, snapshot) => {
  //     if (this.props.requiredToRefresh && !this.state.updated) {
  //         const result = await this.fetchData({ cancelToken: this.axiosCancelSource.token })

  //         this.setState({updated : true})
  //     //    if() this.setState({ balance: result.data.balance })
  //     }
  //     console.log("prevState is " + prevState.updated)
  //     console.log("currentState is " + this.state.updated)
  //     console.log('it triggle from componentDidUpdate')
  // }

  componentWillReceiveProps = async (prevProps) => {
    // console.log('prevProps ' + prevProps.requiredToRefresh)
    // console.log('current props ' + this.props.requiredToRefresh)
    try {
      // console.log(this.props)
      // this.axiosCancelSource = axios.CancelToken.source()
      if (prevProps.requiredToRefresh) {
        // console.log('it works on http request')
        const result = await this.fetchData({
          cancelToken: this.axiosCancelSource.token,
        });
        if (result.data.balance != this.state.balance)
          this.setState({ balance: result.data.balance });
      }

      // this.setState({ balance: result.data.balance })
    } catch (error) {
      this.axiosCancelSource.cancel("Axios request canceled.");
      // console.log(error)
      // this.setState({ balance: result.data.balance })
    }
  };

  componentWillUnmount() {
    this.mounted = false;
    this.axiosCancelSource.cancel("Axios request canceled.");

    // this.eventSource.close()
    // console.log('i triggered by componentWillUnmount in homepage')

    // SourceCancel()
    // document
    //   .getElementById("content")
    //   .removeEventListener("scroll", this.handleScroll);
  }

  render() {
    return (
      <div>
        <Animate transitionName="fade">
          {!this.state.header_hidden ? (
            <Header
              style={{
                height: '64px',
                // left: siderWidth,
                // borderBottom: '1px solid rgb(235, 237, 240)',
                boxShadow: "1px 1px 5px rgba(0,21,41,.1)",
                // boxShadow: 'rgb(204, 204, 204) 0px 0px 10px',
                // position: "absolute",
                position: "relative",
                zIndex: 100,
                // width: '100%',
                background: "#ffffff",
                padding: 0,
                paddingRight: 64,
                // boxShadow: "rgb(217, 217, 217) 1px 1px 7px 0px",
              }}
            >
              {/* <div
                style={{
                  textAlign: "right",
                  display: "inline-block",
                  position: "fixed",
                  top: "0px",
                  right: "24px",
                  width: "800px",
                  height: "16px",
                }}
              > */}
              <Row span={24}>
                <Col span={12}>
                  {" "}
                  <span> {this.props.page_header_title}</span>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  {" "}
                  <Space align="baseline" size={1}>
                    <Balance balance={this.state.balance} />
                    <Demo_notification />
                    <Demo_avatar
                      name="kimi"
                      logout={() => this.props.logout()}
                    />
                  </Space>
                </Col>
              </Row>

              {/* </div> */}
            </Header>
          ) : null}
        </Animate>
      </div>
    );
  }
}

export default CustomHeader;
