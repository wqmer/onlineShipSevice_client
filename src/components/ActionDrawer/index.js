import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import {
  PrinterOutlined,
  RollbackOutlined,
  SmileTwoTone,
} from "@ant-design/icons";
import {
  PDFDownloadLink,
  Page,
  Canvas,
  PDFViewer,
  Image,
  Document,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import ReactDOM from "react-dom";
import QueueAnim from "rc-queue-anim";
import "antd/dist/antd.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  DeleteOutlined,
  UploadOutlined,
  SelectOutlined,
} from "@ant-design/icons";
import ShortUniqueId from "short-unique-id";

import { Space, Typography, Button, Divider, Drawer, Row, Col } from "antd";
const { Title } = Typography;
import ReactToPrint from "react-to-print";
import { post } from "../../util/fetch";
import {
  MinusCircleTwoTone,
  FilePdfOutlined,
  FilePdfFilled,
  EyeTwoTone,
  PrinterTwoTone,
  EyeOutlined,
  MinusCircleOutlined,
  EyeFilled,
  PrinterFilled,
  MinusCircleFilled,
  FilePdfTwoTone,
} from "@ant-design/icons";
const uid = new ShortUniqueId();
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
const ImageToPdf = (props) => (
  <Document
    title="test"
    // style={{ padding: 0 }}
  >
    <Page
      // orientation = 'landscape'
      // wrap={false}
      // debug={true}
      style={styles.page}
      size={[400, 600]}
      // size="B6"
    >
      {/* <Image
        // fixed={true}
        style={styles.image}
        // debug={true}
        key={"test"}
        src="https://ship-service.s3.us-west-2.amazonaws.com/labels/2021-08-21/282825766118.png"
      /> */}
      {props.urls.map((e) => (
        <Image
          // fixed={true}
          style={styles.image}
          // debug={true}
          key={e}
          src={e}
        />
      ))}
    </Page>
  </Document>
);

class ComponentToPrint extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.labels.map((item) => (
          <img key={item} src={item} />
        ))}
        {/* <img src="https://ship-service.s3-us-west-2.amazonaws.com/labels/2021-01-30/1Z6132W20392674611.jpg" />
        <img src="/test.png" /> */}
      </div>
    );
  }
}

class ActionDrawer extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    loading_print: false,
    loading_pdf: false,
    labels: [],
  };
  action1() {}

  action2() {}

  action3() {}

  fetch_label = async () => {
    this.setState;
  };

  displayAction() {
    const action_content = [
      <ReactToPrint
        key="console"
        onBeforeGetContent={async () => {
          this.setState({ loading_print: true });
          let result = await post("/user/get_urls", {
            orders_id: this.props.check_data,
          });
          let urls;
          if (result.code == 0) {
            urls = result.data
              .map((e) => e.urls)
              .flat()
              .map((e) => e.toString());
          }
          this.setState({ labels: urls });
        }}
        onAfterPrint={() => this.setState({ loading_print: false })}
        trigger={() => (
          <Button
            // onClick={() => this.setState({ loading: true })}
            disabled={this.props.check_data.length > 100}
            // size="small"
            // style={{ width: 100 }}
            loading={this.state.loading_print}
            icon={<PrinterOutlined />}
            type="primary"
            key="console"
          >
            批量打印
          </Button>
        )}
        content={() => {
          return this.componentRef;
        }}
      />,
      <Divider key="console_pdf" type="vertical" />,
      <Button
        loading={this.state.loading_pdf}
        key="pdf"
        // size="small"
        // style={{ width: 100 }}
        type="primary"
        icon={<FilePdfOutlined />}
        disabled={this.props.check_data.length > 1000}
        onClick={async () => {
          this.setState({ loading_pdf: true });
          let result = await post("/user/get_urls", {
            orders_id: this.props.check_data,
          });
          let urls;
          if (result.code == 0) {
            urls = result.data
              .map((e) => e.urls)
              .flat()
              .map((e) => e.toString());
          }
          // console.log(urls);

          let batch_id = uid.randomUUID(6);
          localStorage.setItem(
            batch_id,
            JSON.stringify({
              urls,
            })
          );
          this.setState({ loading_pdf: false });
          const win = window.open(`/label/${batch_id}`, "_blank");
          win.focus();
        }}
      >
        {/* {this.state.labels.length > 0 ? (
          <PDFDownloadLink
            document={<ImageToPdf urls={this.state.labels} />}
            fileName="somename.pdf"
          >
            {({ blob, url, loading, error }) => {
              console.log(loading);
              return loading ? "Loading document..." : "下载PDF";
            }}
          </PDFDownloadLink>
        ) : (
          "下载PDF"
        )} */}
        获取PDF
      </Button>,
      <Divider key="pdf_void" type="vertical" />,
      <Button
        // loading={this.state.is_loading}
        key="void"
        // size="small"
        // style={{ width: 100 }}
        danger
        type="primary"
        disabled={true}
        icon={<DeleteOutlined />}
        // onClick={() => this.pay()}
      >
        批量退单
      </Button>,
    ];
    return (
      <Space size={12} align="baseline">
        <Title level={5}>
          已选择{" "}
          <a style={{ marginLeft: "5px", marginRight: "5px" }}>
            {this.props.check_data.length}
          </a>
          条记录 ：
        </Title>
        <Space size={6} align="baseline">
          {action_content.map((e) => e)}
        </Space>
      </Space>
    );
  }

  render() {
    return (
      <div>
        <div hidden={true}>
          <ComponentToPrint
            labels={this.state.labels}
            ref={(el) => (this.componentRef = el)}
          />
        </div>
        <Drawer
          //   headerStyle={{ height: 64, background: "#ffffff" }}
          bodyStyle={{
            // height:32,
            background: "#ffffff",
            paddingLeft: 48,
            paddingRight: 48,
            overflow: "hidden",
          }}
          destroyOnClose={true}
          drawerStyle={{ overflow: "hidden", background: "#fafafa" }}
          height={72}
          zIndex={200}
          getContainer="#content"
          style={{ position: "absolute" }}
          placement={"bottom"}
          closable={false}
          mask={false}
          // onClose={this.onClose}
          visible={this.props.visible}
          key={"key"}
        >
          {this.displayAction()}
        </Drawer>
      </div>
    );
  }
}

export default ActionDrawer;
