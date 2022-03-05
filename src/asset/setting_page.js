import React, { Component, PropTypes } from "react";
import {
  HomeFilled,
  EditFilled,
  PrinterFilled,
  DeleteFilled,
  SettingFilled,
} from "@ant-design/icons";
import { Space, Slider, Button, Avatar, Typography, Divider } from "antd";
import { message, Badge } from "antd";
import { Tag, Switch } from "antd";
import { get, post, remove, put } from "../util/fetch";
import ModalUpdateAddress from "../components/ModalUpdateAddress";
import ModalAddAddress from "../components/ModalAddAddress";
import ModalFormCarrier from "../components/ModalFormCarrier";
import CustomerSwitch from "../components/CustomerSwitch";
import BottonToDrawer from "../components/ButtonToDrawer";
import { get_full_address } from "../util/address";
import FedExIcon from "../components/CustomIcon/FedEx";
import UpsIcon from "../components/CustomIcon/Ups";
import UspsIcon from "../components/CustomIcon/Usps";
import AdminIcon from "../components/CustomIcon/Smartship";
const width_colum = {
  longest: 300,
  long: 225,
  medium: 150,
  short: 125,
};

const selectIconByCarrier = {
  FEDEX: <FedExIcon style={{ fontSize: "32px" }} />,
  UPS: <UpsIcon style={{ fontSize: "32px" }} />,
  USPS: <UspsIcon style={{ fontSize: "32px" }} />,
};

const alignProp = "left";
const mapTabToContent = (ref) => [
  {
    key: "address",
    title: "地址管理",
    router: "address",
    component: {
      type: "table",
      prop: {
        api_url: {
          get_data_pignate: "/user/get_address",
        },
        row_key: "_id",
        checkBox: false,
        table_content: [
          {
            title: "操作",
            key: "action",
            width: width_colum.medium,
            align: "center",

            render: (text, record) => (
              <Space size={1}>
                <ModalUpdateAddress
                  content={record}
                  tirggleFetchingData={() => ref.child.fetch_data()}
                />
                <Divider type="vertical" />
                <Button
                  disabled={text.type == "default" ? true : false}
                  type="link"
                  icon={<HomeFilled />}
                  onClick={async () => {
                    try {
                      let result = await put("/user/set_default_address", {
                        _id: record._id,
                      });
                      if (result.code == 0)
                        message.success({
                          content: "设置成功",
                          duration: 0.5,
                          key: "set_default_address",
                        });
                      ref.child.fetch_data();
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                />
                <Divider type="vertical" />

                <Button
                  type="link"
                  danger
                  icon={<DeleteFilled />}
                  onClick={async () => {
                    // console.log(text)
                    try {
                      let result = await post("/user/delete_address", {
                        _id: record._id,
                      });
                      if (result.code == 0)
                        message.success({
                          content: "删除成功",
                          duration: 0.5,
                          key: "set_default_address",
                        });
                      ref.child.fetch_data();
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                />
                {/* <a> <Text disabled><HomeFilled style={{ fontSize: '16px', }} /></Text> </a> */}
                {/* <a><HomeFilled style={{ fontSize: '16px', }} /></a> */}
              </Space>
            ),
          },
          {
            title: "类型",
            width: width_colum.short,
            dataIndex: "type",
            align: alignProp,
            key: "type",
            render: (text, record) =>
              text == "default" ? (
                <span>
                  sender <Tag color="green">默认</Tag>
                </span>
              ) : (
                text
              ),
          },

          {
            title: "备注名",
            width: width_colum.short,
            dataIndex: "nickname",
            align: alignProp,
            key: "nickname",
          },
          {
            title: "地址",
            width: 300,
            // dataIndex: "address_one",
            align: alignProp,
            key: "full_address",
            render: (text, record) => {
              return get_full_address(record);
            },
          },

          // {
          //   title: "地址一",
          //   width: width_colum.long,
          //   dataIndex: "address_one",
          //   align: alignProp,
          //   key: "address_one",
          // },
          // {
          //   title: "地址二",
          //   width: width_colum.long,
          //   dataIndex: "address_two",
          //   align: alignProp,
          //   key: "address_two",
          // },
          // {
          //   title: "城市",
          //   width: width_colum.medium,
          //   dataIndex: "city",
          //   align: alignProp,
          //   key: "city",
          // },
          // {
          //   title: "州",
          //   width: width_colum.short,
          //   dataIndex: "state",
          //   align: alignProp,
          //   key: "state",
          // },
          // { title: '创建时间', width: width_colum.medium, dataIndex: 'created_at', align: alignProp, key: 'created_at', },
        ],
        style: { size: "middle", button_position: "left" },
        page_name: "address",
        buttons: [
          {
            key: "add_address",
            component: (
              <ModalAddAddress
                key="add_address"
                tirggleFetchingData={() => ref.child.fetch_data()}
              />
            ),
          },
          // { "key": "add", 'content': '添加地址', "type": "primary", "icon": undefined, "isBatchAction": false },
        ],
      },
    },
  },

  {
    key: "carriers",
    title: "服务商管理",
    router: "carriers",
    component: {
      type: "table",
      prop: {
        api_url: {
          get_data_pignate: "/user/get_carriers",
        },
        row_key: "_id",
        checkBox: false,
        table_content: [
          {
            title: "操作",
            width: 150,
            // dataIndex: "created_at",
            align: "center",
            key: "action",
            render: (text, record) => (
              <Space size={1}>
                <ModalFormCarrier
                  isDisabled={record.agent == "Smartship"}
                  buttonShape="link"
                  action="edit"
                  content={record}
                  url="/user/update_carrier"
                  tirggleFetchingData={() => ref.child.fetch_data()}
                />
                <Divider type="vertical" />
                <BottonToDrawer
                  user_obj_id={ref.props.user_info.user_object_id}
                  carrier={record}
                />
                <Divider type="vertical" />
                <Button
                  type="link"
                  disabled={record.agent == "Smartship"}
                  danger
                  icon={<DeleteFilled />}
                  onClick={async () => {
                    // console.log(text)
                    try {
                      let result = await post("/user/delete_carrier", {
                        _id: record._id,
                      });
                      if (result.code == 0) message.success("删除成功");
                      ref.child.fetch_data();
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                />
              </Space>
            ),
          },
          {
            title: "状态",
            width: 125,
            dataIndex: "status",
            align: "left",
            key: "status",
            render: (text, record) => (
              <Space>
                <CustomerSwitch
                  isInActivatedGroup={
                    record.activated_group
                      ? record.activated_group.includes(
                          ref.props.user_info.user_object_id
                        )
                      : false
                  }
                  status={record.status}
                  agent={record.agent}
                  _id={record._id}
                />
              </Space>
            ),
          },

          {
            title: "类型",
            width: 125,
            dataIndex: ["asset", "logo_url"],
            align: "left",
            key: "logo_url",
            render: (text, record) => {
              return selectIconByCarrier[record.type];
              // <Avatar
              //   shape="square"
              //   size={record.type == "FEDEX" ? 42 : 36}
              //   src={text}
              // />
            },
          },
          {
            title: "来源",
            width: 150,
            dataIndex: ["asset", "nick_name"],
            align: "left",
            key: "nick_name",
            render: (text, record) => {
              return record.agent == "Smartship" ? (
                <Space align="start">
                  {text} <AdminIcon />
                </Space>
              ) : (
                text
              );
            },
          },

          {
            title: "ID",
            width: 150,
            dataIndex: ["asset", "code"],
            align: "left",
            key: "carrier_code",
          },
        ],
        style: { size: "middle", button_position: "left" },
        page_name: "carriers",
        alert: false,
        buttons: [
          {
            key: "add_carrier",
            component: (
              <ModalFormCarrier
                key="add_carrier"
                action="add"
                url="/user/add_carrier"
                tirggleFetchingData={() => ref.child.fetch_data()}
              />
            ),
          },
        ],
      },
    },
  },

  {
    key: "ledger",
    title: "账单管理",
    router: "ledger",
    component: {
      type: "table",
      prop: {
        api_url: {
          get_data_pignate: "/user/get_ledgers",
        },
        row_key: "order_id",
        checkBox: false,
        table_content: [
          {
            title: "类型",
            width: width_colum.short,
            dataIndex: "type",
            align: "center",
            key: "type",
          },
          {
            title: "交易金额",
            width: width_colum.short,
            dataIndex: "amount",
            align: "left",
            key: "amount",
            render: (amount) => "$ " + amount.toFixed(2),
          },
          {
            title: "账户余额",
            width: width_colum.short,
            dataIndex: "balance",
            align: alignProp,
            key: "balance",
            render: (amount) => "$ " + amount.toFixed(2),
          },
          {
            title: "交易时间",
            width: width_colum.short,
            dataIndex: "created_at",
            align: "left",
            key: "created_at",
          },
          {
            title: "系统订单号",
            width: width_colum.short,
            dataIndex: "order_id",
            align: "left",
            key: "order_id",
          },
        ],
        style: { size: "small", button_position: "left" },
        page_name: "ledgers",
        filter_content: [
          {
            component: "range_picker",
            tag: "创建日期",
            value: [undefined, undefined],
            api_request_payload: function (start = undefined, end = undefined) {
              return { created_at: { $gte: start, $lte: end } };
            },
            poperty: { placeholder: ["开始时间", "结束时间"] },
          },
          {
            component: "search_bar",
            tag: "自定义搜索",
            value: { test: undefined },
            api_request_payload: function (start = undefined, end = undefined) {
              return { created_at: { $gte: start, $lte: end } };
            },
            poperty: { placeholder: "搜索任意。。" },
          },
          // { component: 'select_tag', tag: '发货渠道', poperty: { placeholder: "选择渠道，可多选" } },
          // { component: 'select_tag', tag: '渠道', poperty : { placeholder: '' } }
        ],
        alert: false,
        // 'buttons': [

        //     // { "key": "export", 'content': '导出', "type": "primary", "icon": undefined },
        // ]
      },
    },
  },
  // {
  //     "key": "api",
  //     "title": "API账户",
  //     "component": undefined
  // },
];

export default mapTabToContent;
