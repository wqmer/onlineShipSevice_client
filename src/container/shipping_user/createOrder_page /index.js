import Icon, {
  MoneyCollectTwoTone,
  UpOutlined,
  FileTextTwoTone,
} from "@ant-design/icons";
import {
  Space,
  message,
  Drawer,
  Checkbox,
  Alert,
  Button,
  Typography,
  Select,
  Collapse,
  Steps,
  Divider,
  Col,
  Row,
  List,
  Popover,
  Spin,
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
// import Address_form from './address_form'
// import Parcel_form from './parcel_form'
// import Carrier_form from './carrier_form'
// import Finish_form from './finish_form'
import Information from "./information_step";
import Finish from "./finish_step";
import LocalAtmOutlinedIcon from "@material-ui/icons/LocalAtmOutlined";
import { get, post } from "../../../util/fetch";
import {
  handle_surcharge,
  handle_total_charge,
  handle_ups_extra_surcharge,
} from "../../../util/carrier";
import { actions as single_order_form } from "../../../reducers/shipping_platform/single_order_form";
import { actions as user_account_actions } from "../../../reducers/shipping_platform/user";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const { Panel } = Collapse;
const { Text, Title } = Typography;
const { Step } = Steps;

const Sender = () => (
  <svg
    t="1578568585168"
    className="icon"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="2803"
    width="24"
    height="24"
  >
    <path
      d="M 699 213.55 L 513.55 90.07 a 9.39 9.39 0 0 0 -10.39 0 L 317.73 213.55 a 9.35 9.35 0 0 0 5.2 17.13 h 68.35 V 459 a 28.28 28.28 0 0 0 28.1 28.44 h 178 A 28.28 28.28 0 0 0 625.43 459 V 230.68 h 68.35 a 9.35 9.35 0 0 0 5.22 -17.13 Z m -148.5 17.13 V 413.6 h -84.29 V 204.08 a 9.36 9.36 0 0 1 3.89 -7.59 l 33.71 -24.25 a 7.53 7.53 0 0 1 8.74 0 l 34 24.27 a 9.36 9.36 0 0 1 3.92 7.61 Z"
      fill="#1296db"
      p-id="2804"
    ></path>
    <path
      d="M 893.09 593.4 L 834.5 310.23 a 37.15 37.15 0 0 0 -7.27 -17.11 c -0.14 -0.19 -0.28 -0.37 -0.43 -0.55 l -0.59 -0.73 c -0.28 -0.34 -0.58 -0.68 -0.88 -1 l -0.19 -0.23 a 37.07 37.07 0 0 0 -27.53 -12.21 h -105 a 37.46 37.46 0 0 0 -37.46 37.46 a 37.46 37.46 0 0 0 37.46 37.46 h 74.85 l 44.87 216.88 H 692.52 a 38.81 38.81 0 0 0 -30.87 15.65 l -56.75 80.49 H 419.32 l -56.81 -80.5 a 39.11 39.11 0 0 0 -31 -15.62 H 212.39 l 44.16 -217 h 73.9 a 37.47 37.47 0 0 0 37.47 -37.46 a 37.47 37.47 0 0 0 -37.47 -37.46 H 229.66 a 37.66 37.66 0 0 0 -40.75 29.53 l -58.22 286.1 a 37.09 37.09 0 0 0 -1.69 22.26 l 70.1 290.21 a 37.82 37.82 0 0 0 42.63 28.6 l 542 0.22 a 37.82 37.82 0 0 0 41.21 -28.83 L 895 616.21 a 37 37 0 0 0 -1.91 -22.81 Z m -135.2 267.11 l -491.82 -0.2 l -52 -215.14 h 98.8303 l 53.94 76.43 a 37.43 37.43 0 0 0 33 19.69 h 224.7 A 37.45 37.45 0 0 0 658 720.71 l 53.27 -75.54 h 98.6297 Z"
      fill="#108ee9"
      p-id="2805"
    ></path>
  </svg>
);

const Recepiant = () => (
  <svg
    t="1578569888016"
    className="icon"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="936"
    width="24"
    height="24"
  >
    <path
      d="M879.098 877.875H146.807c-81.365 0-81.366-81.365-81.366-81.365V511.73l203.414-366.146H757.05L960.464 511.73v284.78c0 81.366-81.366 81.365-81.366 81.365zM716.367 226.95H309.538l-142.39 284.78h183.073s81.366 0 81.366 81.366v40.683h162.731v-40.683s0-81.366 81.366-81.366h183.073l-142.39-284.78z m162.731 366.145H685.493c-5.696 10.679-9.809 23.543-9.809 40.683 0 81.366-81.366 81.366-81.366 81.366H431.587s-81.366 0-81.366-81.366c0-17.14-4.113-30.004-9.809-40.683H146.807V796.51h732.291V593.095zM329.88 389.681h366.146l20.341 40.683H309.538l20.342-40.683z m40.683-81.366h284.78l20.341 40.683H350.221l20.342-40.683z"
      p-id="937"
      fill="#8a8a8a"
    ></path>
  </svg>
);

const MyFirstIcon = (props) => <Icon component={Sender} {...props} />;

const RecepiantIcon = (props) => <Icon component={Recepiant} {...props} />;

const layout = ["发件人", "收件人", "包裹信息"];

const current_step = ["information", "finished"];

class Create_order_page extends React.Component {
  onChange = (current) => {
    console.log("onChange:", current);
    this.setState({ current });
  };

  state = {
    isRequriedFetchAddress: false,
    step_status: undefined,
    current: 0,
    childrenDrawer: false,
    is_loading: false,
    is_expand: false,
    visible: false,
    bill_total: 0,
    drawer_padding_Left: 256,
    status: ["process", "wait", "wait"],
    disabled: [false, true, true, true],
    current_form: undefined,
    labels: [],
    master_trcking_nubmer: undefined,
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
        content: this.props.form.parcel_information.parcel_list.length + " 件",
      },
      {
        label: "寄件人",
        key: "sender",
        content: this.props.form.sender_information.panel_title,
        span: 3,
      },
      {
        label: "收件人",
        key: "receipant",
        content: this.props.form.receipant_information.panel_title,
        span: 3,
      },
    ],
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
        label: "物流",
        content: undefined,
        span: 3,
      },
    ],
  };

  onRef = (ref) => {
    this.child = ref;
  };

  onChildrenDrawerClose = () => {
    this.setState({
      childrenDrawer: false,
    });
  };

  showChildrenDrawer = () => {
    this.setState({
      childrenDrawer: true,
    });
  };

  showDrawer = () => {
    let currentStatus = this.state.visible;
    this.setState({
      visible: !currentStatus,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  changeHeight = () => {
    this.setState({
      is_expand: !this.state.is_expand,
    });
  };

  set_current_form = (form) => {
    this.setState({ current_form: form });
  };

  handle_redirect = (current) => {
    const current_url =
      step_array[current] == "single_order" ? "" : step_array[current];
    this.props.history.push(`/user/create/single_order/${current_url}`);
  };

  onChange = (current) => {
    let current_step = step_object[this.getKeyOfSubMenus().LastChildOfUrl];
    if (current_step < current) {
      this.state.current_form.validateFields((err, values) => {
        if (!err) this.handle_redirect(current);
      });
    } else this.handle_redirect(current);
  };

  set_all_disabled = () => {
    let all_disabled = [true, true, true, true];
    let list_status = this.state.status.map((item, index) => {
      if (index == 3) {
        item = "process";
      }
      if (index == 2) {
        item = "finish";
      }
      return item;
    });
    this.setState({ status: list_status, disabled: all_disabled });
  };

  set_finished = (current_step, next_step) => {
    let current_index = step_object[current_step];
    let next_index = step_object[next_step];
    let list_status = this.state.status.map((item, index) => {
      if (index == current_index) {
        item = "finish";
      }
      if (index == next_index && item != "finish") {
        item = "process";
      }
      return item;
    });

    let list_disabled = this.state.disabled.map((item, index) => {
      if (index == next_index) {
        item = false;
      }
      return item;
    });
    this.setState({ status: list_status, disabled: list_disabled });
  };

  getKeyOfSubMenus = () => {
    var str =
      this.props.history.location.pathname.substring("/user/".length) || "/"; //  /seller/order/new   --->  order/new
    var result = {
      parent: undefined,
      childern: [],
    };
    let initial = 0;
    for (var i = 0; i < str.length; i++) {
      if (str[i] == "/") {
        !result.parent
          ? (result.parent = str.substring(initial, i))
          : result.childern.push(str.substring(initial, i));
        initial = i + 1;
      }
      if (str.lastIndexOf("/") == i && str.substring(initial, str.length)) {
        result.childern.push(str.substring(initial, str.length));
      }
    }
    return {
      Parent: result.parent, //order/new   --> order
      Children: result.childern, //order/new   --> new
      //   LastChildOfUrl: '/' + result.childern[0]
      // 设置为0 表示如果有大于1个子类，都不继续向下映射 暂时只允许一个子类出现在面包屑中，防止对应边栏key和面包屑等不能对应问题。
      LastChildOfUrl: result.childern[result.childern.length - 1],
    };
  };

  display_content = (current) => {
    switch (current) {
      case "information":
        return (
          <Information
            isRequriedFetchAddress={this.state.isRequriedFetchAddress}
            postBill={(rate) => this.postBill(rate)}
            onRef={this.onRef}
          />
        );
        break;
      case "finished":
        return (
          <Finish
            labels={this.state.labels}
            master_trcking_nubmer={this.state.master_trcking_nubmer}
            parcel_information={this.state.parcel_information}
            service_information={this.state.service_information}
            tracking_information={this.state.tracking_information}
            reset={() => this.reset()}
            resetWithRepeat={() => this.resetWithRepeat()}
          />
        );
        break;
    }
  };

  next = () => {
    const current = this.state.current + 1;
    this.setState({ current, step_status: "process" });
    window.scrollTo(0, 0);
  };

  pervious = () => {
    const current = this.state.current - 1;
    this.setState({ current, step_status: "process" });
    window.scrollTo(0, 0);
  };

  populatePack(parcel_list) {
    let myarr = [];
    for (let n = 0; n < parcel_list.length; n++) {
      let new_fill = new Array(Number(parcel_list[n].pack_info.same_pack)).fill(
        parcel_list[n]
      );
      myarr = myarr.concat(new_fill);
    }

    let update_array = myarr.map((item, index) => {
      let newkey = item.key + "_" + index;
      return {
        ...item,
        key: newkey,
      };
    });
    return update_array;
  }

  pay = async () => {
    // console.log(this.props.form.parcel_information.parcel_list)
    let { unit_length, unit_weight } = this.props.form.parcel_information;
    let new_parcel_list = this.populatePack(
      this.props.form.parcel_information.parcel_list
    );
    // console.log(new_parcel_list)
    let update_form_information = {
      ...this.props.order_form,
      parcel_information: {
        unit_length,
        unit_weight,
        parcel_list: new_parcel_list,
      },
    };
    let select_service =
      this.props.form.service_information.service_content.filter(
        (item) => item.check == true
      );

    let update_form = {
      ...this.props.form,
      ...update_form_information,
      service_information: { service_content: select_service },
    };

    // console.log(this.props.form.service_information)
    // console.log(update_form)

    const current = this.state.current + 1;
    this.setState({ is_loading: true });

    try {
      message.loading({
        content: "正在生成运单",
        key: "pay",
        duration: 0,
      });
      console.log(update_form);
      let response = await post("/user/create_shipment", update_form);
      // console.log(response);
      let labels = response.data.parcel.parcelList.map((item) => {
        return {
          type: response.data.service.carrier_type,
          key: item["_id"],
          url: item.label[0],
          tracking_numbers: item.tracking_numbers[0],
        };
      });
      let { service_information, parcel_information, tracking_information } =
        this.state;
      service_information = [
        {
          label: "状态",
          content: "完成",
        },

        {
          label: "渠道",
          content: response.data.service.carrier_type,
          span: 2,
        },

        {
          label: "订单号",
          content: response.data.customer_order_id,
          span: 3,
        },

        {
          label: "总费用",
          content: "$ " + response.data.postage.billing_amount.total,
          span: 3,
        },
      ];
      parcel_information = [
        {
          label: "重量",
          key: "weight",
          content: response.data.parcel.weight,
        },
        {
          label: "尺寸",
          key: "size",
          content: undefined,
        },
        {
          label: "件数",
          key: "quantity",
          content:
            this.props.form.parcel_information.parcel_list.length + " 件",
        },
        {
          label: "寄件人",
          key: "sender",
          content: this.props.form.sender_information.panel_title,
          span: 3,
        },
        {
          label: "收件人",
          key: "receipant",
          content: this.props.form.receipant_information.panel_title,
          span: 3,
        },
      ];
      tracking_information = [
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
          content: response.data.parcel.parcelList[0].tracking_numbers[0],
          span: 3,
        },
        {
          label: "状态",
          content: "运单已创建",
          span: 3,
        },
      ];
      let master_trcking_nubmer =
        response.data.parcel.parcelList[0].tracking_numbers[0];
      this.props.refreshBalance();
      this.setState({
        current,
        is_loading: false,
        step_status: "finish",
        master_trcking_nubmer,
        labels,
        parcel_information,
        service_information,
        tracking_information,
      });

      message.success({
        content: "运单完成",
        key: "pay",
        duration: 0.5,
        // style: { marginLeft: 200 },
      });

      let obj = {
        payment_information: {
          // is_required_fetch:true,
          is_finished: false,
          payment_method: undefined,
          panel_title: "请先完成输入信息",
          font_type: "secondary",
          payment_content: [],
        },
        setting: {
          open_panel: [],
        },
        billing_information: { on_display: false },
      };
      this.props.update_form_info(obj);
    } catch (error) {
      this.setState({ is_loading: false });
      console.log(error);
      message.error({
        content:
          error.response && error.response.data
            ? error.response.data.message ||
              "创建未成功，远程服务器报错"
            : "远程服务器没响应",
        key: "pay",
        duration: 5,
      });
    }
  };

  reset = (isWithButton = false) => {
    this.setState({
      current: 0,
      step_status: "process",
    });
    //判断 reset 是否来自 重置所有 按钮 ， 保留信息有所不同。
    if (isWithButton) {
      this.props.reset_all_info_with_buttom();
      this.child.resetAllForm();
    } else {
      this.props.reset_all_info();
    }
  };

  resetWithRepeat = () => {
    let obj = {
      service_information: {
        is_required_fetch: true,
        is_select: false,
        service_name: undefined,
        panel_title: "请先完成输入信息",
        font_type: "secondary",
        service_content: [],
      },
    };
    this.props.set_form_info(obj);
    this.setState({ current: 0, step_status: "process" });
    message.success({
      content: "加载相同信息",
      duration: 1,
    });
  };

  show_action = (current) => {
    let Button_props = [
      {
        aciton_one: this.pay,
        label_one: "递交",
        aciton_two: () => this.reset(true),
        label_two: "重置所有",
      },
      {
        aciton_one: this.pay,
        label_one: "付款",
        aciton_two: this.pervious,
        label_two: "上一步",
      },
      {
        aciton_one: undefined,
        label_one: "打印",
        aciton_two: undefined,
        label_two: "重新创建",
      },
    ];

    return (
      <div>
        <Text style={{ fontSize: "16px", fontWeight: 700 }}>服务条款</Text>
        <Divider style={{ marginTop: 6, marginBottom: 6 }}></Divider>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <Checkbox>
              请确认以地址信息，都真实有效。如不符实，本平台对任何造成服务的影响没有法律责任
            </Checkbox>
          </div>
          <div>
            <Space>
              {/* <Button
                loading={this.state.is_loading}
                onClick={() => Button_props[current].aciton_one()}
                type="primary"
                style={{ width: 120 }}
              >
                {Button_props[current]["label_one"]}
              </Button> */}

              <Button
                disabled={this.state.is_loading}
                onClick={() => Button_props[current].aciton_two()}
                style={{ marginRight: 2 }}
              >
                {Button_props[current]["label_two"]}
              </Button>
            </Space>
          </div>
        </div>
      </div>
    );
  };

  display_total_detail = () => {
    let { detail, carrier } = this.props.billing_information;
    console.log(detail);
    return (
      <span
        style={{
          position: "fixed",
          top: 98,
          left: "50.5%",
          textAlign: "right",
        }}
      >
        <span style={{ marginLeft: 84, marginTop: 12 }}>
          {" "}
          <Text style={{ fontSize: 12 }}>基础运费</Text> -
          <Text strong style={{ fontSize: 13 }}>
            $ {handle_total_charge(carrier, detail).total_base_amount}
          </Text>
          <Divider type="vertical" />
          <Text style={{ fontSize: 12 }}>附加费</Text> -
          <Text strong style={{ fontSize: 13 }}>
            $ {handle_total_charge(carrier, detail).total_surcharge_amount}
          </Text>
          {this.props.billing_information.SurchargeTotal &&
          handle_ups_extra_surcharge(
            carrier,
            this.props.billing_information.SurchargeTotal
          ).total != 0 ? (
            <span>
              {" "}
              <Divider type="vertical" />
              <Text style={{ fontSize: 12 }}>额外附加费</Text> -
              <Text strong style={{ fontSize: 13 }}>
                ${" "}
                {
                  handle_ups_extra_surcharge(
                    carrier,
                    this.props.billing_information.SurchargeTotal
                  ).total
                }
              </Text>
              <Popover
                overlayInnerStyle={{
                  width: 240,
                  height: 125,
                  overflow: "auto",
                }}
                // overlayStyle={{ width: 150, height: 25 }}
                placement="rightBottom"
                // title={"detail"}
                content={
                  <div>
                    <Row gutter={[24, 2]}>
                      {handle_ups_extra_surcharge(
                        carrier,
                        this.props.billing_information.SurchargeTotal
                      ).items.length > 0
                        ? handle_ups_extra_surcharge(
                            carrier,
                            this.props.billing_information.SurchargeTotal
                          ).items.map((e, index) => (
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
                                  {e.name}
                                </Text>
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                  $ {e.amount}
                                </Text>
                              </div>
                              <Divider
                                style={{ marginTop: 2, marginBottom: 2 }}
                                dashed
                              />
                            </Col>
                          ))
                        : undefined}
                    </Row>
                  </div>
                }
                trigger="hover"
              >
                <FileTextTwoTone style={{ fontSize: 11, marginLeft: 6 }} />
              </Popover>
            </span>
          ) : undefined}
        </span>
        <Divider style={{ marginTop: 8, marginBottom: 8 }} />
        <span style={{ marginLeft: 84 }}>
          {" "}
          <Text style={{ fontSize: 12 }}>服务费</Text> -
          <Text strong style={{ fontSize: 13 }}>
            $ 0.00
          </Text>
        </span>
        <Divider style={{ marginTop: 8, marginBottom: 8 }} />
        <span style={{ marginLeft: 84 }}>
          {" "}
          <Text style={{ fontSize: 14 }}>总运费</Text> -
          <Text strong style={{ fontSize: 16 }}>
            $ {this.props.billing_information.NegotiateTotal}
          </Text>{" "}
          <Text
            delete={this.props.billing_information.NegotiateTotal != undefined}
            strong
            style={{
              fontSize:
                this.props.billing_information.NegotiateTotal != undefined
                  ? 13
                  : 16,
            }}
          >
            {(
              parseFloat(handle_total_charge(carrier, detail).total_amount) +
              parseFloat(
                handle_ups_extra_surcharge(
                  carrier,
                  this.props.billing_information.SurchargeTotal
                ).total
              )
            ).toFixed(2)}
          </Text>
        </span>
        <Divider style={{ marginTop: 8, marginBottom: 8 }} />
      </span>
    );
  };

  display_billing_detail = () => {
    let { unit_weight, carrier } = this.props.billing_information;
    let billingDetail = this.props.billing_information.detail;

    let result = (
      <List
        size="small"
        itemLayout="horizontal"
        style={{ width: 450 }}
        dataSource={billingDetail}
        // bordered
        // split = {false}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              description={
                <span>
                  <Text style={{ fontSize: 14 }}>包裹</Text>{" "}
                  <Text strong style={{ fontSize: 14 }}>
                    {" "}
                    {index + 1}
                  </Text>
                  <Text style={{ fontSize: 12 }}>: 计费重量 -</Text>
                  <Text strong style={{ fontSize: 13 }}>
                    {item.weight} {unit_weight}
                  </Text>
                  <Divider type="vertical" />
                  <Text style={{ fontSize: 12 }}>计费分区 - zone</Text>
                  <Text strong style={{ fontSize: 13 }}>
                    {item.zone}
                  </Text>
                  <Divider type="vertical" />
                  <Text style={{ fontSize: 12 }}>费用 -</Text>
                  <Text strong style={{ fontSize: 16 }}>
                    $ {item.price}
                  </Text>
                  <span>
                    <Popover
                      overlayInnerStyle={{
                        width: 240,
                        height: 125,
                        overflow: "auto",
                      }}
                      // overlayStyle={{ width: 150, height: 25 }}
                      placement="rightBottom"
                      // title={"detail"}
                      content={
                        <div>
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
                                  $ {item.basePrice}
                                </Text>
                              </div>
                              <Divider
                                style={{ marginTop: 2, marginBottom: 2 }}
                                dashed
                              />
                            </Col>

                            {Array.isArray(item.surCharges)
                              ? item.surCharges.length > 0
                                ? item.surCharges.map((e, index) => (
                                    <Col key={index + "1"} span={24}>
                                      {" "}
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        {" "}
                                        <Text
                                          type="secondary"
                                          style={{ fontSize: 11 }}
                                        >
                                          {handle_surcharge(carrier, e).name}
                                        </Text>
                                        <Text
                                          type="secondary"
                                          style={{ fontSize: 11 }}
                                        >
                                          ${" "}
                                          {handle_surcharge(carrier, e).amount}
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
                        </div>
                      }
                      trigger="hover"
                    >
                      <FileTextTwoTone
                        style={{ fontSize: 11, marginLeft: 6 }}
                      />
                    </Popover>
                  </span>
                </span>
              }
            />
          </List.Item>
        )}
      />
    );

    return result;
  };

  shouldComponentUpdate(nextProps, nextState) {
    // console.log('nextprops is ' + nextProps.header_hidden)
    // console.log('this props is ' + this.props.header_hidden)
    if (this.props.header_hidden != nextProps.header_hidden) return false;
    if (this.props.collapsed != nextProps.collapsed) return false;
    return true;
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    //  this.props.reset();
  }

  render() {
    const { carrier, detail } = this.props.billing_information;
    const { current, is_loading } = this.state;
    return (
      <div id="create_order">
        <Spin indicator={<span></span>} spinning={is_loading}>
          <div style={{ background: "#F8F8F8", marginTop: 16 }}>
            {this.display_content(current_step[current])}
          </div>

          <div style={{ marginTop: 32 }}>
            {current == 1 ? null : this.show_action(current)}
          </div>

          <Drawer
            // style ={{overflow: 'hidden',}}
            title={
              <div>
                <Row align="middle">
                  <Col span={8} style={{ paddingLeft: 12, fontSize: 18 }}>
                    {/* <MoneyCollectTwoTone
                      style={{ display: "inline-block", fontSize: "18px" }}
                    /> */}
                    <Space size={48} align="baseline">
                      <Title level={4}>
                        <Text style={{ fontSize: 16 }} strong>
                          支付费用 ：
                        </Text>{" "}
                        ${" "}
                        {this.props.billing_information.NegotiateTotal
                          ? this.props.billing_information.NegotiateTotal
                          : this.props.billing_information.total}{" "}
                      </Title>
                      <Button
                        loading={this.state.is_loading}
                        size="small"
                        style={{ width: 100 }}
                        type="primary"
                        disabled={
                          !this.props.payment_information.is_finished &&
                          this.props.billing_type != "prepaid"
                        }
                        onClick={() => this.pay()}
                      >
                        购买
                      </Button>{" "}
                    </Space>
                  </Col>
                  <Col style={{ textAlign: "center" }} span={8}>
                    {" "}
                    <UpOutlined
                      style={{
                        color: "#40a9ff",
                        textAlign: "center",
                        fontSize: 18,
                        width: 150,
                      }}
                      rotate={this.state.is_expand ? 180 : 0}
                      onClick={this.changeHeight}
                    />{" "}
                  </Col>
                  <Col style={{ textAlign: "right" }} span={8}>
                    {" "}
                  </Col>
                </Row>
              </div>
            }
            headerStyle={{
              height: 64,
              // paddingLeft: 225,
              background: "#ffffff",
            }}
            bodyStyle={{
              background: "#ffffff",
              paddingLeft: 48,
              // paddingLeft: 273,
              // paddingRight: 0,
              direction: "rtl",
            }}
            destroyOnClose={true}
            drawerStyle={{ overflow: "hidden", background: "#fafafa" }}
            getContainer={"#content"}
            // getContainer={"#Page"}
            // getContainer={"#Home"}
            style={{
              position: "absolute",
              // marginLeft: 215,
              // paddingLeft: 215,
              // paddingRight: 215,
              // overflow: "hidden",
            }}
            // style={{ paddingLeft: this.props.collapsed ? 80 : 256 }}
            placement="bottom"
            zIndex={1000}
            mask={false}
            closable={false}
            visible={this.props.billing_information.on_display}
            // visible={true}
            height={this.state.is_expand ? 256 : 64}
          >
            <Row gutter={24}>
              <Col span={10} style={{ direction: "ltr" }}>
                {this.props.billing_information.detail
                  ? this.display_total_detail()
                  : undefined}
              </Col>
              <Col span={2}>
                <Divider
                  style={{
                    top: 96,
                    left: "49.44%",
                    position: "fixed",
                    borderColor: "#f0f0f0",
                    height: 110,
                  }}
                  type="vertical"
                />
              </Col>
              <Col span={9} style={{ direction: "ltr" }}>
                <div>
                  {this.props.billing_information.detail
                    ? this.display_billing_detail()
                    : undefined}
                </div>
                {/* <Divider style={{ marginTop: 0, marginBottom: 8 }} /> */}
              </Col>
            </Row>
          </Drawer>
        </Spin>
      </div>
    );
  }
}

function mapStateToProps(state) {
  // console.log(state.shipping_platform_single_order.form)
  return {
    billing_type: state.shipping_platform_user.account.user_info.billing_type,
    billing_information:
      state.shipping_platform_single_order.form.billing_information,
    payment_information:
      state.shipping_platform_single_order.form.payment_information,
    form: state.shipping_platform_single_order.form,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    reset_all_info: bindActionCreators(
      single_order_form.reset_all_info,
      dispatch
    ),
    reset_all_info_with_buttom: bindActionCreators(
      single_order_form.reset_all_info_with_buttom,
      dispatch
    ),
    set_form_info: bindActionCreators(
      single_order_form.get_form_info,
      dispatch
    ),
    user_auth: bindActionCreators(user_account_actions.user_auth, dispatch),
    update_form_info: bindActionCreators(
      single_order_form.update_form_info,
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Create_order_page);
