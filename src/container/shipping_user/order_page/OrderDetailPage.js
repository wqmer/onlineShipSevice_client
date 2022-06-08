import {
  PrinterOutlined,
  RollbackOutlined,
  SmileTwoTone,
  FileTextTwoTone,
  FilePdfOutlined,
} from "@ant-design/icons";
import {
  Skeleton,
  Result,
  Button,
  Space,
  Row,
  Col,
  Avatar,
  Typography,
  Popover,
  List,
  Divider,
} from "antd";
import React, { Component } from "react";
import {
  Redirect,
  Router,
  Route,
  Switch,
  Link,
  NavLink,
} from "react-router-dom";
import { useLocation } from "react-router-dom";
import ReactToPrint from "react-to-print";
import ReactPDF, {
  Canvas,
  PDFViewer,
  Image,
  Document,
  Page,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import LabelGallery from "../../../components/Labelgallery";
import OrderDetial from "../../../components/OrderDetail";
import { get } from "../../../util/fetch";
import { get_address_title } from "../../../util/address";
import {
  handle_surcharge,
  handle_total_charge,
  handle_ups_extra_surcharge,
} from "../../../util/carrier";
const { Text } = Typography;
const styles = StyleSheet.create({
  page: {
    clipPath: "inset(10% 0% 0% 0%)",
    flexDirection: "row",
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
    // height: 600,
    // clipPath: "inset(15 0% 0% 0%)"
    // transform: "rotate(90deg)",
    // clipPath: "inset(0% 0% 0% 0%)"
    height: 600,
    width: 400,
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

const MyDoc = (props) => (
  <Document>
    <Page size={[400, 600]}>
      {props.labels.map((e) => (
        <View key={e.key} style={styles.view}>
          <Image key={e.key} style={styles.image} src={e.url} />
        </View>
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
          <img key={item.key} src={item.url} />
        ))}

        {/* <img src="https://ship-service.s3-us-west-2.amazonaws.com/labels/2021-01-30/1Z6132W20392674611.jpg" />
          <img src='/test.png' /> */}
      </div>
    );
  }
}

class PDFlink extends React.Component {
  constructor(props) {
    super(props);
  }

  state = { loading: false, disabled: false };

  render() {
    return (
      <div>
        <PDFDownloadLink
          document={<MyDoc labels={this.props.labels} />}
          fileName={`${
            this.props.labels[0] ? this.props.labels[0].key : "unknown"
          }.pdf`}
        >
          {({ blob, url, loading, error }) =>
            loading ? (
              "Loading document..."
            ) : (
              <Button
                style={{
                  borderRadius: "3px",
                  boxShadow: "rgb(204, 204, 204) 0px 0px 10px",
                }}
                loading={this.state.loading}
                icon={<FilePdfOutlined />}
                type="primary"
                key="console"
                disabled={this.state.disabled}
                onClick={() => {
                  this.setState({ loading: true, disabled: true });
                  setTimeout(() => {
                    this.setState({ loading: false, disabled: false });
                  }, 1000);
                }}
              >
                PDF下载
              </Button>
            )
          }
        </PDFDownloadLink>
      </div>
    );
  }
}

class DetailPage extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    resetType: "default",
    loading: false,
    fetching: true,
    fetch_data: "123",
    currentTrackingNumbers: undefined,
    service_information: [
      {
        label: "状态",
        content: "完成",
      },

      {
        label: "渠道",
        content: undefined,
        span: 2,
      },

      {
        label: "订单号",
        content: undefined,
        span: 3,
      },

      {
        label: "总费用",
        content: "$ " + 0,
        span: 3,
      },
    ],
    parcel_information: [
      {
        label: "重量",
        key: "weight",
        content: undefined,
      },
      {
        label: "尺寸",
        key: "size",
        content: undefined,
      },
      {
        label: "件数",
        key: "quantity",
        content: 1 + " 件",
      },
      {
        label: "寄件人",
        key: "sender",
        content: undefined,
        span: 3,
      },
      {
        label: "收件人",
        key: "receipant",
        content: undefined,
        span: 3,
      },
    ],
    tracking_information: [
      {
        label: "预上网",
        content: undefined,
      },
      {
        label: "scan_form",
        content: undefined,
        span: 2,
      },
      {
        label: "运单号",
        content: undefined,
        span: 3,
      },
      {
        label: "状态",
        content: "运单已创建",
        span: 3,
      },
    ],
    labels: [],
  };

  displayDescription() {
    const {
      parcel_information,
      service_information,
      tracking_information,
      labels,
      loading,
    } = this.state;

    const content = [
      { title: "包裹信息", data: parcel_information },
      { title: "订单信息", data: service_information },
      {
        title: "物流信息",
        data: tracking_information,
        currentTrackingNumbers: this.state.currentTrackingNumbers,
      },
    ];

    return (
      <div>
        {content.map((item, index) => (
          <div key={item.title} style={{ marginTop: index == 0 ? 16 : 24 }}>
            {this.state.fetching ? (
              <div
                style={{
                  boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.12)",
                  padding: "18px",
                  paddingRight: "2px",
                  background: "#ffffff",
                }}
              >
                <Skeleton active />
              </div>
            ) : (
              <OrderDetial {...item} />
            )}
          </div>
        ))}
      </div>
    );
  }

  displayButtom() {
    const { labels } = this.state;
    return (
      <div>
        <div hidden={true}>
          <ComponentToPrint
            labels={labels}
            ref={(el) => (this.componentRef = el)}
          />
        </div>

        <Row justify="space-between" align="bottom">
          <Col>
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
              <PDFlink labels={labels} />
              <Link
                to={{ pathname: `/user/create/single_order` }}
                // params={{ test: "hello" }}
              >
                <Button
                  style={{
                    borderRadius: "3px",
                  }}
                  // disabled
                  type="primary"
                  icon={<RollbackOutlined />}
                  onClick={() => {
                    localStorage.setItem(
                      "repeat_order",
                      JSON.stringify({
                        data: this.state.fetch_data,
                      })
                    );
                  }}
                  key="buy"
                >
                  创建相同
                </Button>
              </Link>
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
          </Col>

          {/* <Col> */}

          {/* <Button
              style={{
                borderRadius: "3px",
                textAlign: "left",
              }}
              type="link"
              onClick={() => this.props.history.goBack()}
            >
              <Text style={{ color: "#1890ff" }} underline>
                返回前页
              </Text>
            </Button> */}
          {/* </Col> */}
        </Row>
      </div>
    );
  }

  componentWillUnmount() {
    // this.props.reset();
    // console.log(this.state.resetType);
    // if (this.state.resetType === "default") this.props.reset();
    // this.props.resetWithRepeat();
  }

  componentDidMount = async () => {
    // if (this.props.match.params && this.props.match.params.id) {
    //   console.log(
    //     "I am fetching data from trakcing number : " +
    //       this.props.match.params.id
    //   );
    // }
    // let result = await get(`user/get_order/${this.props.match.params.id}`);
    let result = await get(`user/get_order/${this.props.tracking}`);
    // console.log(result);
    this.setState({ fetch_data: result.data });
    let labels;
    let parcel_information;
    let service_information;
    let tracking_information;
    //only show detial for one package shipment
    let billingDetailPackages =
      result.data.parcel.parcelList[0].postage.billing_amount;
    // for ups charge display
    let billingSurchargeExtra =
      result.data.service.carrier_type == "UPS"
        ? result.data.postage.billing_amount.total_surcharge
        : undefined;
    let surCharges = billingDetailPackages.surCharges;

    //fix if surcharges is object only

    Array.isArray(surCharges) ? undefined : (surCharges = [surCharges]);

    surCharges = billingSurchargeExtra
      ? surCharges.concat(billingSurchargeExtra)
      : surCharges;
    let surchargeDetial = (
      <Row gutter={[24, 2]}>
        <Col span={24}>
          {" "}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Text type="secondary" style={{ fontSize: 11 }}>
              基础
            </Text>
            <Text type="secondary" style={{ fontSize: 11 }}>
              $ {billingDetailPackages.baseCharges}
            </Text>
          </div>
          <Divider style={{ marginTop: 2, marginBottom: 2 }} dashed />
        </Col>

        {Array.isArray(surCharges)
          ? surCharges.length > 0
            ? surCharges.map((e, index) => (
                <Col key={index + "1"} span={24}>
                  {" "}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    {" "}
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {
                        handle_surcharge(result.data.service.carrier_type, e)
                          .name
                      }
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      ${" "}
                      {
                        handle_surcharge(result.data.service.carrier_type, e)
                          .amount
                      }
                    </Text>
                  </div>
                  <Divider
                    style={{
                      marginTop: 2,
                      marginBottom: 2,
                    }}
                    dashed
                  />
                </Col>
              ))
            : undefined
          : undefined}
      </Row>
    );

    if (result.code == 0) {
      labels = result.data.parcel.parcelList.map((item) => {
        return {
          key: item.tracking_numbers[0],
          url: item.label[0],
          type: result.data.service.carrier_type,
          tracking_numbers: item.tracking_numbers[0],
        };
      });
      parcel_information = [
        {
          label: "重量",
          key: "weight",
          content: result.data.parcel.weight,
        },
        {
          label: "尺寸",
          key: "size",
          content: undefined,
        },
        {
          label: "件数",
          key: "quantity",
          content: result.data.parcel.parcelList.length + " 件",
        },
        {
          label: "寄件人",
          key: "sender",
          content: get_address_title(result.data.sender),
          span: 3,
        },
        {
          label: "收件人",
          key: "receipant",
          content: get_address_title(result.data.recipient),
          span: 3,
        },
      ];
      service_information = [
        {
          label: "状态",
          content: "完成",
        },

        {
          label: "渠道",
          content: (
            <span>
              {" "}
              <Avatar size={36} src={result.data.service.asset.logo_url} />{" "}
              {result.data.service.mail_class}{" "}
            </span>
          ),
          // result.data.service.carrier_type +
          // " " +
          // result.data.service.mail_class,
          span: 2,
        },

        {
          label: "系统订单号",
          content: result.data.order_id,
          span: 3,
        },

        {
          label: "总费用",
          content: (
            <span>
              {" "}
              $
              {parseFloat(result.data.postage.billing_amount.original_charge) >
              parseFloat(result.data.postage.billing_amount.total) ? (
                <span>
                  {" "}
                  <Text strong>
                    {" "}
                    {result.data.postage.billing_amount.total}
                  </Text>
                  <Text delete style={{ fontSize: 12, marginLeft: 4 }}>
                    {" "}
                    {result.data.postage.billing_amount.original_charge}
                  </Text>
                </span>
              ) : (
                <Text strong> {result.data.postage.billing_amount.total}</Text>
              )}{" "}
              {Array.isArray(result.data.parcel.parcelList) ? (
                result.data.parcel.parcelList.length == 1 ? (
                  <Popover
                    overlayInnerStyle={{
                      width: 300,
                      height: 125,
                      overflow: "auto",
                    }}
                    placement="rightTop"
                    arrowPointAtCenter
                    content={<div>{surchargeDetial}</div>}
                    // trigger="click"
                    // title="Title"
                  >
                    <FileTextTwoTone style={{ fontSize: 12, marginLeft: 6 }} />
                  </Popover>
                ) : (
                  <FileTextTwoTone
                    twoToneColor="#d9d9d9"
                    style={{ fontSize: 12, marginLeft: 6 }}
                  />
                )
              ) : undefined}
            </span>
          ),
          span: 3,
        },
      ];
      this.setState({
        fetching: false,
        labels,
        parcel_information,
        service_information,
        // currentTrackingNumbers: this.props.match.params.id,
        currentTrackingNumbers: this.props.tracking,
      });

      //fetch data
      //change state
    }
  };

  render() {
    // console.log(this.props)
    const {
      parcel_information,
      service_information,
      tracking_information,
      labels,
    } = this.state;
    return (
      <Row
        span={24}
        // justify="space-between"
        style={{ background: "#f5f7fd", marginTop: 16 }}
      >
        <Col
          // push={1}
          span={12}
          style={{
            // width: "50%",
            display: "inline-block",
            textAlign: "left",
            verticalAlign: "top",
          }}
        >
          {this.displayButtom()}
          {this.displayDescription()}
        </Col>
        <Col span={12} pull={1}>
          <LabelGallery
            setCurrentTrackingNumbers={(item) =>
              this.setState({ currentTrackingNumbers: item })
            }
            labels={labels}
          />
        </Col>
      </Row>
    );
  }
}
export default DetailPage;
