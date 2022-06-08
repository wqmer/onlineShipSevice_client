import {
  PrinterOutlined,
  RollbackOutlined,
  SmileTwoTone,
} from "@ant-design/icons";
import { Result, Button, Space } from "antd";
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
import XLSX from "xlsx";
import { Spin } from "antd";
import { readExcel } from "../../../util/sheet";
import { post } from "../../../util/fetch";
import NewWindow from "react-new-window";

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

class Display extends React.Component {
  state = {
    loading: true,
    tracking: [],
    urls: [],
  };

  fetch = async () => {
    try {
      let result = await post("/user/read_sheet");
      return result.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  //无法使用此方法
  componentDidMount = async () => {
    let urls = JSON.parse(localStorage.getItem(this.props.batch_id)).urls;
    console.log("Get url " + urls);
  };

  render() {
    let urls = JSON.parse(localStorage.getItem(this.props.batch_id)).urls;

    return (
      <Spin size="large" tip="生成PDF中，请稍后" spinning={this.state.loading}>
        <PDFViewer style={{ width: "100vw", height: "100vh" }}>
          <Document
            onRender={() => {
              this.setState({ loading: false });
              setTimeout(() => {
                localStorage.removeItem(this.props.batch_id);
              }, 2000);
            }}
            title={this.props.batch_id}
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
              {urls.map((e) => (
                <View key={e} style={styles.view}>
                  <Image
                    // fixed={true}
                    style={styles.image}
                    // debug={true}
                    key={e}
                    src={e}
                    // src="https://ship-service.s3.us-west-2.amazonaws.com/labels/2021-08-21/282825766118.png"
                  />
                </View>
              ))}
            </Page>
          </Document>
        </PDFViewer>
      </Spin>
    );
  }
}

export default Display;
