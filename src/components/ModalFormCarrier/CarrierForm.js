import { ThumbUpSharp } from "@material-ui/icons";
import {
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  Collapse,
  Steps,
  Divider,
  Avatar,
  Typography,
  Space,
  Spin,
} from "antd";
import { render } from "less";
import React, { Component } from "react";

import FedExIcon from "../CustomIcon/FedEx";
import UpsIcon from "../CustomIcon/Ups";
import UspsIcon from "../CustomIcon/Usps";
import { get, post } from "../../util/fetch";
import { supportsHistory } from "history/DOMUtils";

const { Text, Link } = Typography;

const selectIconByCarrier = {
  FEDEX: <FedExIcon style={{ fontSize: "24px" }} />,
  UPS: <UpsIcon style={{ fontSize: "24px" }} />,
  USPS: <UspsIcon style={{ fontSize: "24px" }} />,
};

const content = {
  asset: {
    UPS: [
      {
        label: "Username",
        key: "Username",
        is_required: true,
        message: undefined,
        // placehold: "公司名字，选填",
        span_value: 12,
        type: "input",
      },
      {
        label: "Password",
        key: "Password",
        is_required: true,
        message: undefined,
        // placehold: "备注名",
        span_value: 12,
        type: "input",
      },
      {
        label: "AccessKey",
        key: "AccessKey",
        is_required: true,
        message: undefined,
        // placehold: "发件人姓，暂时不支持中文",
        span_value: 12,
        type: "input",
      },
      {
        label: "AccountNo",
        key: "AccountNo",
        is_required: true,
        message: undefined,
        // placehold: "发件人名，暂时不支持中文",
        span_value: 12,
        type: "input",
      },
      {
        label: "自定义名称",
        key: "nick_name",
        is_required: false,
        message: undefined,
        // placehold: "发件人名，暂时不支持中文",
        span_value: 12,
        type: "input",
      },
      //   {
      //     label: "电话",
      //     key: "phone_number",
      //     is_required: true,
      //     message: undefined,
      //     placehold: "美国电话,必填",
      //     span_value: 8,
      //     type: "input",
      //   },
      //   // { "label": '邮件地址', "key": "sender_email", "is_required": false, "message": undefined, "placehold": 'Email地址, 选填', "span_value": 12, type: 'input', },
      //   {
      //     label: "地址",
      //     key: "address_one",
      //     is_required: true,
      //     message: undefined,
      //     placehold: "街道号码，路名，必填项",
      //     span_value: 24,
      //     type: "input",
      //   },
      //   {
      //     label: "门牌号码",
      //     key: "address_two",
      //     is_required: false,
      //     message: undefined,
      //     placehold: "门牌号，选填",
      //     span_value: 8,
      //     type: "input",
      //   },
      //   {
      //     label: "邮编",
      //     key: "zip_code",
      //     is_required: true,
      //     message: undefined,
      //     placehold: "必填项",
      //     span_value: 6,
      //     type: "input",
      //   },
      //   {
      //     label: "城市",
      //     key: "city",
      //     is_required: true,
      //     message: undefined,
      //     placehold: "必填项",
      //     span_value: 6,
      //     type: "input",
      //   },
      //   {
      //     label: "州",
      //     key: "state",
      //     is_required: true,
      //     message: undefined,
      //     placehold: "选择州",
      //     span_value: 4,
      //     type: "select",
      //   },
    ],

    FEDEX: [
      {
        label: "Key",
        key: "Key",
        is_required: true,
        message: undefined,
        // placehold: "公司名字，选填",
        span_value: 12,
        type: "input",
      },
      {
        label: "Password",
        key: "Password",
        is_required: true,
        message: undefined,
        // placehold: "备注名",
        span_value: 12,
        type: "input",
      },
      {
        label: "Account Number",
        key: "AccountNumber",
        is_required: true,
        message: undefined,
        // placehold: "发件人姓，暂时不支持中文",
        span_value: 12,
        type: "input",
      },
      {
        label: "Meter Number",
        key: "MeterNumber",
        is_required: true,
        message: undefined,
        // placehold: "发件人名，暂时不支持中文",
        span_value: 12,
        type: "input",
      },
      {
        label: "自定义名称",
        key: "nick_name",
        is_required: false,
        message: undefined,
        // placehold: "发件人名，暂时不支持中文",
        span_value: 12,
        type: "input",
      },
      {
        label: "HubId",
        key: "HubId",
        is_required: false,
        message: undefined,
        placehold: "smartpost服务-hubid",
        span_value: 6,
        type: "input",
      },
    ],
  },

  sender_extra: [],
  receipant_extra: [],
  action: [
    // { "key": "save_link", "placehold": '保存', "span_value": 2, type: 'save_link', },
    // { "key": "reset_link", "placehold": '重置', "span_value": 2, type: 'reset_link', },
  ],
};

const OP = [
  {
    key: "ups",
    name: "UPS",
    icon: "https://ship-service.s3-us-west-2.amazonaws.com/logo/UPS_TRANSPARNT.png",
  },
  {
    key: "fedex",
    name: "FEDEX",
    icon: "https://ship-service.s3-us-west-2.amazonaws.com/logo/FEDEX_TRANSPARENT.png",
  },
];

const show_form_item = (keyMapContent = undefined, type = "UPS") => {
  let content_form = content.asset[type];
  let content_action = content.action;
  let result = [];
  let row_content = [];
  let curent_row_length = 0;
  // setFieldsValue({ sender_add1: { value: props.googlePlace.sender_add1 } })

  for (var i = 0; i < content_form.length; i++) {
    row_content.push(content_form[i]);
    curent_row_length = curent_row_length + content_form[i].span_value;
    if (
      curent_row_length == 24 ||
      (curent_row_length < 24 && i == content_form.length - 1)
    ) {
      let element = (
        <Row key={i} gutter={24}>
          {" "}
          {row_content.map((item, index) => {
            return (
              <Col key={item.key} span={item.span_value}>
                {nameMapCompoment(keyMapContent, item)}{" "}
              </Col>
            );
          })}{" "}
        </Row>
      );
      row_content = [];
      curent_row_length = 0;
      result.push(element);
    }
  }
  // let action_element = <Row key={i} gutter={24}> {content_action.map((item, index) => { return (<Col key={item.key} span={item.span_value} >{select_compoment(props, item)} </Col>) })} </Row>
  // result.push(action_element)
  return result;
};

const nameMapCompoment = (keyMapContent, item) => {
  let value = "";
  let form_item_content = undefined;

  switch (item.type) {
    case "input":
      form_item_content = (
        <Input
          placeholder={item.placehold}
          allowClear={item.key != "address_one"}
        />
      );
      break;
    case "select":
      form_item_content = (
        <Select placeholder={item.placehold}>
          <Select.Option value="default_state1">州一</Select.Option>
        </Select>
      );
      break;
  }
  return (
    <Form.Item
      // hasFeedback={true}
      // validateStatus="warning"
      key={item.key}
      name={item.key}
      label={item.label}
      rules={[{ required: item.is_required }, { max: 35, type: "string" }]}
      initialValue={keyMapContent ? keyMapContent[item.key] : undefined}
      validateTrigger={item.key == "state" ? undefined : ["onBlur"]}
    >
      {form_item_content}
    </Form.Item>
  );
};

class CarrierForm extends React.Component {
  constructor(props) {
    super(props);
    this.autocomplete = null;
  }
  state = {
    content: undefined,
    loading: true,
    carrier: this.props.content ? this.props.content.type : "UPS",
  };
  onFinish = (values) => {
    console.log("Success:", values);
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  onSelect = (value) => {
    console.log(value);
    //  this.props.form.resetFields();
    this.props.form.resetFields(
      content.asset[this.state.carrier].map((item) => item.key)
    );
    this.setState({ carrier: value });
  };

  componentDidMount = async () => {
    //请求拿账号
    // console.log(this.props.content);
    try {
      // console.log(this.props.content.id);
      if (this.props.action == "edit") {
        let result = await post("/user/get_carrier", {
          _id: this.props.content.id,
        });
        if (result.code == 0) {
          let form_item = {
            ...this.props.content,
            ...result.data.asset.account_information,
          };
          // console.log(r);
          this.props.form.setFieldsValue({ ...form_item });
          this.setState({
            // content: r,
            loading: false,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <Spin spinning={this.state.loading && this.props.action == "edit"}>
        <Form
          form={this.props.form}
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Form.Item
            label={"服务商"}
            key="type"
            name="type"
            initialValue={this.state.carrier}
            rules={[{ required: true }]}
          >
            <Select
              value={this.state.carrier}
              disabled={this.props.action == "edit"}
              // size="large"
              style={{ width: "10%", textAlign: "center" }}
              placeholder={""}
              onSelect={(value) => this.onSelect(value)}
            >
              {OP.map((item) => (
                <Select.Option
                  key={item.key}
                  value={item.name}
                  style={{ textAlign: "center" }}
                >
                  <Space size="small" style={{ textAlign: "center" }}>
                    {selectIconByCarrier[item.name]}
                    {/* <Text style={{ fontSize: 14 }} strong>
                    {item.name}
                  </Text> */}
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Divider dashed />

          {show_form_item(undefined, this.state.carrier)}
        </Form>
      </Spin>
    );
  }
}

export default CarrierForm;
