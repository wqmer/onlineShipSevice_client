import {
  Typography,
  Skeleton,
  Switch,
  Card,
  Avatar,
  Tag,
  Button,
  Checkbox,
  Row,
  Col,
  Space,
} from "antd";
import React, { Component } from "react";
import { Redirect, Router, Route, Link, NavLink } from "react-router-dom";
import ShortUniqueId from "short-unique-id";
import IconButton from "@material-ui/core/IconButton";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import FreightIcon from "../../../../../components/CustomIcon/Freight";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  ReloadOutlined,
  ClockCircleTwoTone,
} from "@ant-design/icons";
import _ from "lodash";
import { Spin } from "antd";
import {
  WarningOutlined,
  WarningTwoTone,
  CloseCircleTwoTone,
  PhoneTwoTone,
} from "@ant-design/icons";
import Item from "antd/lib/list/Item";
import AdminIcon from "../../../../../components/CustomIcon/AdminSmall";

const origin_style = {
  width: "92%",
  border: "1px solid #d9d9d9",
  // boxShadow: "rgb(204, 204, 204) 0px 0px 9px",
};

const statusMapAsset = (status, message) => {
  let opition = {
    success: {
      type: "link",
      indicator: <PhoneTwoTone />,
      text: "请联系我们开通渠道",
    },
    failed: {
      type: "danger",
      indicator: <CloseCircleTwoTone twoToneColor="#f5222d" />,
      text: message,
    },
    timeout: {
      type: "warning",
      indicator: <ClockCircleTwoTone twoToneColor="#faad14" />,
      // indicator: <span><Button type="primary" shape="circle" icon={<ReloadOutlined />} /></span>,
      // indicator: <span style = {{fontsize : 24 ,color :'#1890ff'}}><ReloadOutlined /></span> ,
      text: (
        <span>
          请求超时，请点击
          <span style={{ marginRight: 6, marginLeft: 6 }}>
            <Button shape="circle" icon={<ReloadOutlined />} size="small" />
          </span>
          重试
        </span>
      ),
    },
  };

  return opition[`${status}`];
};
const { Text, Paragraph } = Typography;
const uid = new ShortUniqueId();
const { Meta } = Card;
class My_service_card extends React.Component {
  state = {
    loading: true,
    style: origin_style,
  };

  render() {
    const asset = statusMapAsset(this.props.isSuccess, this.props.errorMessage);
    const { loading } = this.props;
    const {
      image_src,
      check,
      code,
      service_name,
      zone,
      service_description,
      rate,
      NegotiateTotal,
      RateType,
      tag,
      messsage,
      service_source,
      agent,
    } = this.props.service;
    const description =
      zone == undefined
        ? `${service_description}`
        : `分区${zone}，${service_description}`;
    // console.log(loading)
    return (
      <div>
        <Spin
          style={{ width: "92%", textAlign: "center" }}
          spinning={
            !this.props.isSuccess == "success" || this.props.isDisplayOnly
          }
          indicator={asset.indicator}
          tip={
            <Paragraph
              type={asset.type}
              ellipsis={{
                rows: 2,
              }}
              style={{
                fontSize: 12,
                width: "100%",
                color: asset.type == "link" ? "#40a9ff" : undefined,
              }}
            >
              {asset.text}
            </Paragraph>
          }
        >
          <Card
            onMouseEnter={() =>
              this.setState({
                style: { transform: "scale(1.10)", ...origin_style },
              })
            }
            onMouseLeave={() => this.setState({ style: origin_style })}
            onClick={() => this.props.select(code)}
            headStyle={{ background: "#F8F8F8", height: 36 }}
            hoverable={true}
            size="small"
            style={
              this.props.check
                ? {
                    transform: "scale(1.11)",
                    ...origin_style,
                    boxShadow: "rgb(204, 204, 204) 0px 0px 9px",
                  }
                : this.state.style
            }
            extra={loading ? undefined : tag}
            title={
              loading ? undefined : this.props.isSuccess == "success" ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    <Text style={{ fontSize: 13 }} type="secondary">
                      {description}
                    </Text>
                  </span>
                  <Space size={5} align="end">
                    {RateType == "shipment" ? <FreightIcon /> : undefined}{" "}
                    <Text
                      style={{ fontSize: 18, fontWeight: 500, color: "black" }}
                    >
                      $ {NegotiateTotal ? NegotiateTotal : rate}
                    </Text>
                  </Space>
                </div>
              ) : (
                "无法估价"
              )
            }
          >
            <Meta
              title={
                <span style={{ paddingLeft: "15%" }}>
                  <Avatar
                    style={{ marginTop: 4 }}
                    shape="square"
                    size={56}
                    src={image_src}
                  />
                  <span style={{ fontSize: 14, marginLeft: 16 }}>
                    {service_name}
                  </span>
                </span>
              }
              description={
                <Row justify="space-between" align="middle">
                  <Col style={{ fontSize: 9 }}>
                    <Space>
                      {agent == "Smartship" ? (
                        <AdminIcon />
                      ) : (
                        <span>来源:</span>
                      )}
                      <span> {service_source} </span>
                    </Space>
                  </Col>
                  <Col>
                    <Checkbox
                      style={{ fontSize: 12 }}
                      checked={
                        !this.props.isSuccess == "success"
                          ? false
                          : this.props.check
                      }
                    />
                  </Col>
                </Row>
              }
            />
          </Card>
        </Spin>
      </div>
    );
  }
}

export default My_service_card;
