import {
  PrinterOutlined,
  RollbackOutlined,
  SmileTwoTone,
} from "@ant-design/icons";
import { Result, Button, Space, Row, Col } from "antd";
import React, { Component } from "react";
import {
  Redirect,
  Router,
  Route,
  Switch,
  Link,
  NavLink,
} from "react-router-dom";
import ReactToPrint from "react-to-print";
import ReactPDF, {
  Canvas,
  PDFViewer,
  Image,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import LabelGallery from "../../../../components/Labelgallery";
import OrderDetial from "../../../../components/OrderDetail";


const styles = StyleSheet.create({
  page: {
    // clipPath: "inset(10% 0% 0% 0%)",
    // flexDirection: 'row',
  },
  body: {
    // padding: 0,
    // marginBottom : -50,
    // marginVertical :0,
    // clipPath: "inset(10% 0% 0% 0%)",
    // transform: "rotate(90deg)",
    // paddingTop: 10,
    // paddingBottom: 65,
    // paddingHorizontal: 35,
    // backgroundColor: '#E4E4E4'
  },
  view: {
    // padding: 5,
  },
  image: {
    height: 600,
    // clipPath: "inset(15 0% 0% 0%)"
    // transform: "rotate(90deg)",
    // clipPath: "inset(0% 0% 0% 0%)"
    // height: 600,
    // width:1000,
    // minWidth: 525,
    // boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.12)",
    // marginRight: "25%",
    // marginLeft: "-7.5%",
  },
  // box: { width: "100%", marginBottom: 0, borderRadius: 5 },
  // header: {
  //   fontSize: 12,
  //   marginBottom: 0,
  //   textAlign: "center",
  //   color: "grey",
  // },
  // pageNumbers: {
  //   position: "absolute",
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  //   textAlign: "center",
  // },
});
const arrayLabel = [];
for (let i = 0; i <= 2; i++) {
  let label = (
    // <View style={styles.view}>
    <Image
      // fixed={true}
      style={styles.image}
      // debug={true}
      key={i}
      src="https://ship-service.s3-us-west-2.amazonaws.com/labels/2021-01-30/9205500000000000091566.png"
      // src="https://ship-service.s3-us-west-2.amazonaws.com/labels/2021-01-31/1Z6132W20397246182.png"
      // src="https://ship-service.s3-us-west-2.amazonaws.com/labels/2021-01-30/1Z6132W20392674611.jpg"
      // src="https://ship-service.s3-us-west-2.amazonaws.com/labels/2021-01-31/1Z1931WE0324074588.jpg"

      // source = "https://ship-service.s3-us-west-2.amazonaws.com/labels/2021-01-30/1Z1931WE0318596893TESTTYPE.gif"
      // src="https://ship-service.s3-us-west-2.amazonaws.com/labels/2021-01-30/test-corp.png"
    />
    // </View>
  );
  arrayLabel.push(label);
}

class ComponentToPrint extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.labels.map((item) => (
          <img key={item.key} src={item.url} />
        ))}

        {/* <img src="https://ship-service.s3-us-west-2.amazonaws.com/labels/2021-01-30/1Z6132W20392674611.jpg" />
        <img src='/test.png' /> */}
      </div>
    );
  }
}

class Finish_step extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    resetType: "default",
    loading: false,
    currentTrackingNumbers: this.props.master_trcking_nubmer,
  };

  componentWillUnmount() {
    // this.props.reset();
    // console.log(this.state.resetType);
    if (this.state.resetType === "default") this.props.reset();
    // this.props.resetWithRepeat();
  }

  // componentDidMount(){
  //     this.setState({currentTrackingNumbers : this.props.parcel_information.})
  // }

  render() {
    // const { url } = this.props.match;
    // console.log(this.props)
    return (
      <Row
        span={24}
        justify="space-between"
        style={{ background: "#f0f5ff", marginTop: 32, paddingLeft: 32 }}
      >
        <Col
          span={12}
          style={{
            // width: "50%",
            display: "inline-block",
            textAlign: "left",
            verticalAlign: "top",
          }}
        >
          <div hidden={true}>
            <ComponentToPrint
              labels={this.props.labels}
              ref={(el) => (this.componentRef = el)}
            />
          </div>
          <Space size={12}>
            <ReactToPrint
              key="console"
              onBeforeGetContent={() => this.setState({ loading: true })}
              onAfterPrint={() => this.setState({ loading: false })}
              trigger={() => (
                <Button
                  // onClick={() => this.setState({ loading: true })}
                  style={{
                    borderRadius: "3px",
                    boxShadow: "rgb(204, 204, 204) 0px 0px 10px",
                  }}
                  loading={this.state.loading}
                  icon={<PrinterOutlined />}
                  type="primary"
                  key="console"
                >
                  打印运单
                </Button>
              )}
              content={() => this.componentRef}
            />
            <Button
              style={{
                borderRadius: "3px",
                boxShadow: "rgb(204, 204, 204) 0px 0px 10px",
              }}
              // href = {`/user/create/single_order`}
              type="primary"
              // icon={<RollbackOutlined />}
              onClick={() => {
                this.setState({ resetType: "default" }, () => {
                  this.props.reset();
                });
              }}
              key="new"
            >
              新运单
            </Button>
  
              <Button
                style={{
                  borderRadius: "3px",
                  boxShadow: "rgb(204, 204, 204) 0px 0px 10px",
                }}
                type="primary"
                // icon={<RollbackOutlined />}
                onClick={() => {
                  this.setState({ resetType: "repeat" }, () => {
                    this.props.resetWithRepeat();
                  });
                }}
                key="buy"
              >
                相同单
              </Button>
           
            {/* <Button
              style={{
                borderRadius: "3px",
                boxShadow: "rgb(204, 204, 204) 0px 0px 10px",
              }}
              type="primary"
              // icon={<RollbackOutlined />}
              onClick={() => {
                this.props.reset();
              }}
              key="buy"
            >
              打印运单
            </Button> */}
            <Button
              style={{
                borderRadius: "3px",
                // boxShadow: "rgb(204, 204, 204) 0px 0px 10px",
              }}
              disabled
              type="primary"
              danger
              // onClick={() => {
              //   this.props.reset();
              // }}
              key="buy"
            >
              退单作废
            </Button>
          </Space>

          <div style={{ marginTop: 16 }}>
            <OrderDetial
              data={this.props.parcel_information}
              title="包裹信息"
            />
          </div>
          <div style={{ marginTop: 24 }}>
            <OrderDetial
              data={this.props.service_information}
              title="订单信息"
            />
          </div>
          <div style={{ marginTop: 24 }}>
            <OrderDetial
              currentTrackingNumbers={this.state.currentTrackingNumbers}
              data={this.props.tracking_information}
              title="物流信息"
            />
          </div>
        </Col>
        <Col span={12}>
          <LabelGallery
            setCurrentTrackingNumbers={(item) =>
              this.setState({ currentTrackingNumbers: item })
            }
            labels={this.props.labels}
          />
        </Col>
      </Row>
    );
  }
}
export default Finish_step;
