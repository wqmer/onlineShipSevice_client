// import { Form } from '@ant-design/compatible';
import "@ant-design/compatible/assets/index.css";
import {
  Radio,
  InputNumber,
  Form,
  Typography,
  Button,
  Col,
  Row,
  Input,
  Select,
  Collapse,
  Steps,
  Divider,
  Space,
  message,
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
import _ from "lodash";
import ShortUniqueId from "short-unique-id";
import IconButton from "@material-ui/core/IconButton";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import CropSquareOutlinedIcon from "@material-ui/icons/CropSquareOutlined";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import {
  CaretRightOutlined,
  DoubleRightOutlined,
  RightOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { actions as single_order_form } from "../../../../../reducers/shipping_platform/single_order_form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ItemMeta } from "semantic-ui-react";
import FedExIcon from "../../../../../components/CustomIcon/FedEx";
import UpsIcon from "../../../../../components/CustomIcon/Ups";
const uid = new ShortUniqueId();

const { Panel } = Collapse;
const { Text } = Typography;
const { Title } = Typography;
const plainOptions = ["lb/in", "oz/in", "kg/cm"];
const PackageType = [
  {
    carrier: "fedex",
    pack_type: "FedEx Envelope",
    label: "FedEx Envelope",
    size: '9-1/2" x 12-1/2"',
    info: {
      PackagingType: "FEDEX_ENVELOPE",
      in: {
        length: "10",
        width: "13",
        height: "1",
      },
      cm: {
        length: "24.13",
        width: "31.75",
        height: "1",
      },
    },
  },
  {
    carrier: "fedex",
    pack_type: "FedEx Pak",
    label: "FedEx Pak",
    size: '12" x 15-1/2"',
    info: {
      PackagingType: "FEDEX_PAK",
      in: {
        length: "12",
        width: "14",
        height: "1",
      },
      cm: {
        length: "30.48",
        width: "39.37",
        height: "2",
      },
    },
  },

  {
    carrier: "ups",
    pack_type: "UPS Letter",
    label: "UPS Letter",
    size: '9-1/2" x 12-1/2"',
    info: {
      PackagingType: "UPS_LETTER",
      in: {
        length: "9.5",
        width: "12.25",
        height: "1",
      },
      cm: {
        length: "24.13",
        width: "38",
        height: "1",
      },
    },
  },

  {
    carrier: "ups",
    pack_type: "UPS Pak",
    label: "UPS Pak",
    size: '12.75" x 16"',
    info: {
      PackagingType: "UPS_PAK",
      in: {
        length: "13",
        width: "16",
        height: "1",
      },
      cm: {
        length: "32.5",
        width: "40.08",
        height: "2",
      },
    },
  },
];

const selectAfterWeight = (
  <Select defaultValue="lb" style={{ width: 60 }}>
    <Option value="oz">oz</Option>
    <Option value="lb">lb</Option>
    <Option value="kg">kg</Option>
    <Option value="g">kg</Option>
  </Select>
);

const selectAfterLength = (
  <Select defaultValue="inch" style={{ width: 80 }}>
    <Option value="inch">inch</Option>
    <Option value="feet">feet</Option>
    <Option value="m">m</Option>
    <Option value="cm">cm</Option>
  </Select>
);
// 创建form
const select_compoment = (props, item, parcel) => {
  // let test_data = props.data? props.data[item.key]: undefined
  // console.log(test_data)
  let form_item_content = undefined;
  switch (item.type) {
    case "unit":
      form_item_content = (
        <Radio.Group defaultValue="lb/in" buttonStyle="solid">
          <Radio.Button value="lb/in">lb/in</Radio.Button>
          <Radio.Button value="oz/in">oz/in</Radio.Button>
          <Radio.Button value="kg/cm">kg/cm</Radio.Button>
        </Radio.Group>
      );
      break;
    case "input":
      form_item_content = <Input placeholder={item.placehold} />;
      break;
    case "numberInput":
      form_item_content = (
        <InputNumber
          precision={item.precision}
          min={item.min}
          max={item.max}
          placeholder={item.placehold}
          style={{ width: "100%" }}
        />
      );
      break;
    case "select":
      form_item_content = (
        <Select placeholder={item.placehold}>
          <Select.Option value="default_state1">1</Select.Option>
        </Select>
      );
      break;
    // case "save_link":
    //     form_item_content = (<a onClick={() => { compoment.submit_info(getFieldsValue(), compoment.props.profile, compoment.props.id_no) }} disabled={!is_ready(compoment)} style={{ fontSize: '16px' }}> {item.placehold}</a>)
    //     break;
    // case "reset_link":
    //     form_item_content = (<a onClick={() => { compoment.reset_info(compoment.props.profile) }} style={{ fontSize: '16px' }}> {item.placehold}</a>)
    //     break;
  }

  let content = (
    <Form.Item
      name={item.key}
      key={uid}
      onBlur={(e) => {
        // console.log(e.target.value);
        let obj = {};
        obj[`${item.key}`] = e.target.value;
        props.onBlurToRedux(obj);
      }}
      // hasFeedback={true}
      // validateStatus="warning"
      // trigger ="onBlur"
      label={item.label}
      rules={item.rule}
      initialValue={parcel ? parcel[item.key] : undefined}
      validateTrigger={["onBlur"]}
    >
      {form_item_content}
    </Form.Item>
  );

  return content;
};

const display_form = (props) => {
  let parcel = props.parcel;
  let content_form = props.asset.form;
  // let content_action = content_form.action
  let result = [];
  let row_content = [];
  let curent_row_length = 0;

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
                {select_compoment(props, item, parcel)}{" "}
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
  // let action_element = <Row key={i} gutter={24}> {content_action.map((item, index) => { return (<Col key={item.key} span={item.span_value} >{select_compoment(this, item)} </Col>) })} </Row>
  // result.push(action_element)
  return result;
};

const is_ready_form = (content, form) => {
  const { getFieldDecorator, getFieldsError, getFieldsValue } = form;
  const is_rendered = _.isEmpty(getFieldsError()) ? false : true;
  const has_error = !_.isEmpty(
    _.pickBy(
      getFieldsError().filter((item) => !_.isEmpty(item.errors)),
      _.identity
    )
  );
  const is_filled =
    _.difference(
      content.form
        .filter((item) => item.is_required == true)
        .map((item) => item.key),
      _.keys(_.pickBy(getFieldsValue(), _.identity))
    ).length === 0;
  return is_rendered && !has_error && is_filled;
};

// 创建component
class Parcel_component extends React.Component {
  constructor(props) {
    super(props);
  }
  formRef = React.createRef();
  state = {
    title: this.props.title,
    value: PackageType.find((e) => e.info.PackagingType == this.props.pack_type)
      ? PackageType.find((e) => e.info.PackagingType == this.props.pack_type)
          .pack_type
      : undefined,
    open: false,
    // value: 'FedEx Envelope',
    label: PackageType.find((e) => e.info.PackagingType == this.props.pack_type)
      ? PackageType.find((e) => e.info.PackagingType == this.props.pack_type)
          .pack_type
      : undefined,
  };

  //自定义包裹
  reset_package_form = (
    value = undefined,
    label = undefined,
    ismessageOn = true,
    reduxOn = true
  ) => {
    this.props.rest_sev_pay_form();

    this.formRef.current.setFieldsValue({
      same_pack: 1,
      weight: undefined,
      length: undefined,
      width: undefined,
      height: undefined,
      order_id: undefined,
      reference_1: undefined,
      reference_2: undefined,
    });

    let parcel_data = {
      key: this.props.id_no,
      panel_title: "编辑中",
      font_type: "warning",
      pack_info: {
        pack_type: "YOUR_PACKAGING",
        ...this.formRef.current.getFieldsValue(),
        // ...data,
      },
    };
    this.props.submit_info(parcel_data);
    message.warning({ content: "已重置", key: "package", duration: 0.5 });
    this.setState({
      title: "编辑中",
      value: "YOUR_PACKAGING",
      label: "YOUR_PACKAGING",
      open: false,
    });

    // current_form.setFieldsValue({ ...obj.receipant_information });
    // if (ismessageOn)
  };

  //解决导致有label 的value值，在undefined情况下， 无法出现placeholder
  getSelectValue = () => {
    let value = this.state.value
      ? this.state.value
      : this.props.pack_type
      ? this.props.pack_type
      : undefined;
    let label = this.state.label
      ? this.state.label
      : this.props.pack_type
      ? this.props.pack_type
      : undefined;
    if (value == undefined && label == undefined) return undefined;
    console.log("value" + value);
    return {
      value,
      label,
    };
  };

  //select 变化 ,选中包裹类型
  handleChange = (value) => {
    console.log("current length unit is " + this.props.unit_length);
    this.props.rest_sev_pay_form();
    let packType = PackageType.find((e) => e.pack_type == value.value);
    let currentUnitLength = this.props.unit_length
      ? this.props.unit_length
      : "in";
    this.formRef.current.setFieldsValue({
      ...packType.info[currentUnitLength],
    });

    //触发验证
    let parcel_data = {
      key: this.props.id_no,
      panel_title: undefined,
      font_type: undefined,
      pack_info: {
        pack_type: packType.info.PackagingType,
        ...this.formRef.current.getFieldsValue(),
        // ...data,
      },
    };

    parcel_data.panel_title = is_ready_form(
      this.props.content,
      this.formRef.current
    )
      ? `重量 ${parcel_data.pack_info.weight} ${this.props.unit_weight},  尺寸 ${parcel_data.pack_info.length}  x  ${parcel_data.pack_info.width}  x  ${parcel_data.pack_info.height} ${this.props.unit_length}`
      : "编辑中";
    parcel_data.font_type = is_ready_form(
      this.props.content,
      this.formRef.current
    )
      ? "strong"
      : "warning";
    // console.log(parcel_data);
    this.setState({
      title: parcel_data.panel_title,
      value: packType.pack_type,
      label: packType.label,
    });
    message.success({ content: "自动填充", key: "package", duration: 0.5 });

    // console.log(parcel_data);
    this.props.submit_info(parcel_data);
    // console.log(this.formRef.current.getFieldsValue());

    // message.success({ content: "自动填充", key: "package", duration: 0.5 });
    // this.props.update_form_info(obj);
  };

  //每一个包裹完输入完毕后，递交到外层
  onchange_data = (
    form,
    data,
    unit_length,
    unit_weight,
    isYourPack = false
  ) => {
    //直接触发重置 付款 和渠道 panel
    //子panel tile 直接改为编辑中
    // console.log("it toggoled by onchagne");
    this.props.rest_sev_pay_form();

    let parcel_data = {
      key: this.props.id_no,
      panel_title: undefined,
      font_type: undefined,
      pack_info: data,
    };

    //console.log("length field is changed ?" + form.isFieldTouched('length') );
    //自定义包裹触发
    if (isYourPack) {
      this.setState({
        value: "YOUR_PACKAGING",
        label: "YOUR_PACKAGING",
      });
      parcel_data.pack_info.pack_type = "YOUR_PACKAGING";

      if (is_ready_form(this.props.content, form)
      ) {
        this.props.submit_info(parcel_data);
      }
      // this.props.submit_info(parcel_data);
      // if (
      //   this.state.title != "编辑中" &&
      //   !is_ready_form(this.props.content, form)
      // ) {
      //   parcel_data.panel_title = "编辑中";
      //   parcel_data.font_type = "warning";
      //   this.setState({
      //     title: "编辑中",
      //   });
      //   this.props.submit_info(parcel_data);
      // }
    }

    //更改后 如果包裹包裹不在编辑中，但是触发验证后转至编辑中状态
    if (
      this.state.title != "编辑中" &&
      !is_ready_form(this.props.content, form)
    ) {
      parcel_data.panel_title = "编辑中";
      parcel_data.font_type = "warning";
      this.setState({
        title: "编辑中",
      });
      this.props.submit_info(parcel_data);
    }
  };

  onBlurToRedux = (data) => {
    let parcel_data = {
      key: this.props.id_no,
      panel_title: undefined,
      font_type: undefined,
      pack_info: {
        ...this.formRef.current.getFieldsValue(),
        ...data,
      },
    };

    parcel_data.panel_title = is_ready_form(
      this.props.content,
      this.formRef.current
    )
      ? `重量 ${parcel_data.pack_info.weight} ${this.props.unit_weight},  尺寸 ${parcel_data.pack_info.length}  x  ${parcel_data.pack_info.width}  x  ${parcel_data.pack_info.height} ${this.props.unit_length}`
      : "编辑中";
    parcel_data.font_type = is_ready_form(
      this.props.content,
      this.formRef.current
    )
      ? "strong"
      : "warning";
    // console.log(parcel_data);
    this.setState({ title: parcel_data.panel_title });
    this.props.submit_info(parcel_data);
  };

  componentWillReceiveProps = (nextProps) => {
    if (
      nextProps.unit_length == this.props.unit_length &&
      nextProps.unit_weight == this.props.unit_weight
    ) {
      console.log("unit is not changed");
    } else {
      // console.log(this.props.data);
      // console.log(nextProps.data);
      console.log("unit changed");
      this.formRef.current.setFieldsValue(nextProps.data);
      let { weight, length, width, height } =
        this.formRef.current.getFieldsValue();

      let panel_title = is_ready_form(this.props.content, this.formRef.current)
        ? `重量 ${parseFloat(weight).toFixed(2)} ${
            nextProps.unit_weight
          }，  尺寸 ${length}  x  ${width}  x  ${height} ${
            nextProps.unit_length
          }`
        : "编辑中";
      this.setState({ title: panel_title });
    }
  };

  reset = () => {
    this.formRef.current.setFieldsValue({
      same_pack: 1,
      weight: undefined,
      length: undefined,
      width: undefined,
      height: undefined,
      order_id: undefined,
      reference_1: undefined,
      reference_2: undefined,
    });
    this.setState({ title: "未录入" });
  };

  componentDidMount = () => {
    console.log("title is " + this.props.title);
    console.log("package_type is " + this.props.pack_type);
    if (this.props.id_no == "first_pak") this.props.onRef(this);
    console.log("i rendered");
  };

  render() {
    const obj = {
      parcel: this.props.data,
      asset: this.props.content,
      onBlurToRedux: (data) => this.onBlurToRedux(data),
    };
    const start_tag =
      Math.ceil(this.props.tag_start) < 0
        ? ""
        : Math.ceil(this.props.tag_start);
    const end_tag =
      Math.ceil(this.props.tag_end) < 0 ? "" : Math.ceil(this.props.tag_end);
    return (
      <div style={{ paddingLeft: 0 }}>
        <Collapse
          key={this.props.id_no}
          style={{
            marginBottom: 12,
            background: "#ffffff",
            boxShadow: "rgb(204, 204, 204) 0px 0px 6px",
          }}
          bordered={false}
          expandIcon={({ isActive }) => {
            if (!this.props.is_mutiple_pack) {
              return <RightOutlined rotate={isActive ? 90 : 0} />;
            } else {
              return <DoubleRightOutlined rotate={isActive ? 90 : 0} />;
            }
          }}
          activeKey={
            this.props.parcel.is_panel_opened ? [this.props.id_no] : []
          }
          onChange={(e) => this.props.handle_panel(e, this.props.id_no)}
        >
          <Panel
            forceRender
            style={{ background: "#f7f7f7", bordered: "0px" }}
            key={this.props.id_no}
            header={
              <span style={{ width: "80%" }}>
                <Text style={{ fontWeight: 500, marginTop: 2 }}>
                  包裹{" "}
                  {start_tag == end_tag
                    ? start_tag
                    : `${start_tag} 至 ${end_tag}  `}{" "}
                </Text>{" "}
                <Text
                  style={{ fontWeight: 500, fontSize: 11, marginLeft: 6 }}
                  type={this.props.font_type}
                >
                  {" "}
                  {/* {this.props.title} */}
                  {this.state.title}
                </Text>
              </span>
            }
            extra={
              <IconButton
                hidden={this.props.id_no == "first_pak" ? true : false}
                size="small"
                aria-label="delete"
                onClick={(event) => {
                  event.stopPropagation();
                  this.props.remove(this.props.id_no);
                }}
              >
                <DeleteForeverIcon fontSize="small" color="error" />
              </IconButton>
            }
          >
            <Divider
              hidden={!this.props.parcel.is_panel_opened}
              dashed
              style={{
                marginTop: 0,
                marginBottom: 1,
              }}
            />
            <div
              style={{ background: "#F8F8F8", padding: " 16px 32px 0px 32px" }}
            >
              <Select
                showSearch
                value={this.getSelectValue()}
                labelInValue={true}
                key={this.props.id_no}
                onChange={this.handleChange}
                open={this.state.open}
                placeholder="选择或者搜索包裹类型"
                style={{ marginBottom: 24, width: 480 }}
                onDropdownVisibleChange={async (open) => {
                  let current = this.state.open;
                  try {
                    this.setState({
                      open: !current,
                    });
                    // if (current == false) {
                    //   this.setState({
                    //     open: !current,
                    //   });
                    // } else {
                    //   this.setState({ open: !current });
                    // }
                  } catch (error) {
                    console.log(error);
                  }

                  // else { this.setState({ open: !current }) }
                  // console.log(result)
                }}
                dropdownRender={(menu) => (
                  <div>
                    {menu}
                    <Divider style={{ margin: "4px 0" }} />
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "nowrap",
                        padding: 8,
                      }}
                    >
                      <a
                        style={{
                          flex: "none",
                          padding: "4px",
                          display: "block",
                          cursor: "pointer",
                        }}
                        onClick={this.reset_package_form}
                      >
                        <PlusOutlined />
                        输入自定义包裹{" "}
                      </a>
                    </div>
                  </div>
                )}
              >
                {/* <Select.Option value="default">默认尺寸1</Select.Option>
                <Select.Option value="product1">默认尺寸2</Select.Option>
                <Select.Option value="product2">默认尺寸3</Select.Option> */}
                {/* <Select.OptGroup
                  key="your_packaging"
                  label="预存"
                ></Select.OptGroup> */}
                <Select.OptGroup
                  key="FEDEX"
                  label={<FedExIcon style={{ fontSize: "16px" }} />}
                >
                  {PackageType.filter((e) => e.carrier == "fedex").map(
                    (item, index) => (
                      <Select.Option
                        key={item.pack_type}
                        value={item.pack_type}
                      >
                        {" "}
                        {/* <Space > */} {/* {item.icon} */}
                        {item.pack_type}
                        <span style={{ fontSize: 12, marginLeft: 25 }}>
                          <Text type="secondary">{item.size}</Text>
                        </span>
                        {/* </Space> */}
                      </Select.Option>
                    )
                  )}
                </Select.OptGroup>

                <Select.OptGroup
                  key="UPS"
                  label={<UpsIcon style={{ fontSize: "16px" }} />}
                >
                  {PackageType.filter((e) => e.carrier == "ups").map(
                    (item, index) => (
                      <Select.Option
                        key={item.pack_type}
                        value={item.pack_type}
                      >
                        {" "}
                        {/* <Space > */} {/* {item.icon} */}
                        {item.pack_type}
                        <span style={{ fontSize: 12, marginLeft: 25 }}>
                          <Text type="secondary">{item.size}</Text>
                        </span>
                        {/* </Space> */}
                      </Select.Option>
                    )
                  )}
                </Select.OptGroup>
              </Select>
              {/* <Parcel_form
                parcel={this.props.data}
                asset={this.props.content}
                onChange={(form, data) => this.onchange_data(form, data)}
              /> */}

              <Form
                ref={this.formRef}
                layout="vertical"
                // form={form}
                // onValuesChange={(changedValues, allValues) => {
                //   if (
                //     ["width", "length", "height"].includes(
                //       Object.keys(changedValues)[0]
                //     )
                //   )
                //     this.onchange_data(
                //       this.formRef.current,
                //       this.formRef.current.getFieldsValue(),
                //       this.props.unit_length,
                //       this.props.unit_weight,
                //       true
                //     );
                // }}
                onFieldsChange={(changedFields, allFields) => {
                  console.log(changedFields);
                  let isYourPak = ["width", "length", "height"].includes(
                    changedFields[0].name[0]
                  );
                  this.onchange_data(
                    this.formRef.current,
                    this.formRef.current.getFieldsValue(),
                    this.props.unit_length,
                    this.props.unit_weight,
                    isYourPak
                  );
                }}
              >
                {display_form(obj)}
              </Form>
            </div>
          </Panel>
        </Collapse>
      </div>
    );
  }
}

export default Parcel_component;
