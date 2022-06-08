import {
  Tabs,
  Divider,
  Input,
  BackTop,
  List,
  Avatar,
  Pagination,
  Spin,
  Button,
  Badge,
  DatePicker,
  Select,
  Skeleton,
  Tooltip,
  Drawer,
  Modal,
} from "antd";
import { Router, Route, Switch, Link, NavLink } from "react-router-dom";
import { Space } from "antd";
import React, { Component, PropTypes } from "react";
import { Ref } from "semantic-ui-react";
import {
  MinusCircleTwoTone,
  FilePdfOutlined,
  FilePdfFilled,
  EyeTwoTone,
  PrinterTwoTone,
  EyeOutlined,
  MinusCircleOutlined,
  PrinterOutlined,
  EyeFilled,
  PrinterFilled,
  MinusCircleFilled,
  FilePdfTwoTone,
  SelectOutlined,
  FileImageTwoTone,
} from "@ant-design/icons";
import { refresh } from "less";
import DisplayLabel from "../container/shipping_user/components/shipping_label";
import FedExIcon from "../components/CustomIcon/FedEx";
import UpsIcon from "../components/CustomIcon/Ups";
import UspsIcon from "../components/CustomIcon/Usps";
import PdfIcon from "../components/CustomIcon/PDF";
import ShortUniqueId from "short-unique-id";
import LinkToModal from "../components/LinkToModal";
import LinkToDrawer from "../components/LinkToDrawer";
import OrderDetail from "../container/shipping_user/order_page/OrderDetailPage";
{
  /* <FilePdfFilled />
<MinusCircleTwoTone /> */
}

const uid = new ShortUniqueId();
const width_colum = {
  longest: 300,
  long: 225,
  medium: 175,
  short: 125,
};

const alignProp = "center";

const selectIconByCarrier = {
  FEDEX: <FedExIcon style={{ fontSize: "32px" }} />,
  UPS: <UpsIcon style={{ fontSize: "32px" }} />,
  USPS: <UspsIcon style={{ fontSize: "32px" }} />,
};

const mapRouterToComponent = (Ref) => [
  //url name 对应路由，和分类
  // {
  //     'router': 'draft',
  //     'component': {
  //         "type": 'table',
  //         'prop': {
  //             'api_url': {
  //                 "get_data_pignate": '/user/get_orders'
  //             },
  //             'row_key': 'order_id',
  //             'table_content': [

  //                 {
  //                     title: '参考订单号', width: width_colum.long, dataIndex: 'customer_order_id', key: 'customer_order_id',
  //                     align: alignProp,
  //                     ellipsis: {
  //                         showTitle: false,
  //                     },
  //                     render: orderId => (
  //                         <Tooltip placement="topLeft" title={orderId}>
  //                             {orderId}
  //                         </Tooltip>
  //                     ),
  //                 },
  //                 { title: '渠道', width: width_colum.medium, dataIndex: 'carrier', align: alignProp, key: 'carrier', },
  //                 // { title: '用户名', width: width_colum.medium, dataIndex: ['user', 'user_name'], align: alignProp, key: 'user_name', },

  //                 { title: '重量lb', dataIndex: ['parcel', 'weight'], width: width_colum.short, align: alignProp, key: 'Weight', },
  //                 { title: '收货邮编', width: width_colum.short, dataIndex: ['recipient', 'zipcode'], align: alignProp, key: 'recipient_zipcode', },
  //                 // { title: '产品sku', width: width_colum.medium, dataIndex: ['parcel', 'sku'], align: 'center', key: 'parcel_sku', },

  //                 // { title: '收货城市', width: width_colum.short, dataIndex: ['recipient' , 'city'], align: 'center', key: 'recipient_city', },
  //                 // { title: '收货州', width: width_colum.short, dataIndex: ['recipient' , 'state'], align: 'center', key: 'recipient_state', },
  //                 // {
  //                 //     title: '收货地址',
  //                 //     width: width_colum.medium,
  //                 //     dataIndex: ['recipient' , 'add1'],
  //                 //     align: 'center',
  //                 //     key: 'recipient_add1',
  //                 //     render: (text, row) => { return (text + ' ' + row.recipient.add2) }
  //                 // },
  //                 // { title: '收件人', width: width_colum.short, dataIndex: ['recipient', 'recipient_name'], align: alignProp, key: 'Name' },
  //                 // {
  //                 //     title: '尺寸', width: width_colum.medium,
  //                 //     dataIndex: 'Reference2',
  //                 //     align: 'center',
  //                 //     key: 'Reference2',
  //                 //     render: (text, row) => { return (row.parcel.length + ' x ' + row.parcel.width + ' x ' + row.parcel.height) }
  //                 // },

  //                 { title: '创建时间', width: width_colum.medium, dataIndex: 'created_at', align: alignProp, key: 'created_at', },
  //                 {
  //                     title: '系统订单号', width: width_colum.long, dataIndex: 'order_id', align: alignProp, key: 'order_id',
  //                     ellipsis: {
  //                         showTitle: false,
  //                     },
  //                     render: orderId => (
  //                         <Tooltip placement="topLeft" title={orderId}>
  //                             {orderId}
  //                         </Tooltip>
  //                     ),
  //                 },
  //                 {
  //                     title: '操作', key: 'action', width: width_colum.short, align: 'center',
  //                     fixed: 'right',
  //                     render: (text, record) => (
  //                         <span>
  //                             <a type="defa" onClick={() => {
  //                                 Ref.props.history.push({ pathname: `/forwarder/order/draft/detail/${record.order_id}`, order: record, order_id: record.order_id })
  //                             }

  //                             }>查看</a>
  //                             {/* <Divider type="vertical" />
  //                     <a type="defa" >编辑</a>
  //                     <Divider type="vertical" />
  //                     <a type="defa" onClick={() => this.child.handle_action(record.order_id, 'cancel')} >撤销</a> */}
  //                         </span>
  //                     )
  //                 }
  //             ],
  //             "page_name": "draft",
  //             'filter_content': [
  //                 {
  //                     component: 'range_picker',
  //                     tag: '创建日期',
  //                     value: [undefined, undefined],
  //                     api_request_payload: function (start = undefined, end = undefined) { return ({ "created_at": { "$gte": start, "$lte": end } }) },
  //                     poperty: { placeholder: ['开始时间', '结束时间'] }
  //                 },
  //                 {
  //                     component: 'select_tag',
  //                     tag: '发件地址',
  //                     value: { test: undefined },
  //                     api_request_payload: function (start = undefined, end = undefined) { return ({ "created_at": { "$gte": start, "$lte": end } }) },
  //                     poperty: { placeholder: "发件地址，可多选" }
  //                 },
  //                 {
  //                     component: 'search_bar',
  //                     tag: '自定义搜索',
  //                     value: { test: undefined },
  //                     api_request_payload: function (start = undefined, end = undefined) { return ({ "created_at": { "$gte": start, "$lte": end } }) },
  //                     poperty: { placeholder: "搜索任意。。" }
  //                 },
  //                 {
  //                     component: 'select_tag',
  //                     tag: '发件地址',
  //                     value: { test: undefined },
  //                     api_request_payload: function (start = undefined, end = undefined) { return ({ "created_at": { "$gte": start, "$lte": end } }) },
  //                     poperty: { placeholder: "发件地址，可多选" }
  //                 },

  //                 // { component: 'select_tag', tag: '发货渠道', poperty: { placeholder: "选择渠道，可多选" } },
  //                 // { component: 'select_tag', tag: '渠道', poperty : { placeholder: '' } }
  //             ],
  //             // 'button': {
  //             //     'action': ['submit', 'delete'],
  //             //     'batch': ['批量递交', '批量删除']
  //             // }
  //         }
  //     }
  // },

  {
    router: "processing",
    component: {
      type: "processing_page",
      prop: {
        api_url: {
          get_data_pignate: "/user/get_orders",
          listener_event: "/forwarder/get_orders",
        },
        row_key: "order_id",
        statistic_content: [
          { title: "当前生成中", value: 0, unit: "条" },
          { is_divide: true },
          { title: "平均每秒生成", value: 50, unit: "条" },
          { is_divide: true },
          { title: "生成错误率", value: 2, unit: "%" },
        ],
        table_content: [
          {
            title: "参考订单号",
            width: width_colum.medium,
            dataIndex: "customer_order_id",
            key: "customer_order_id",
            align: alignProp,
            // ellipsis: {
            //     showTitle: false,
            // },
            // render: orderId => (
            //     <Tooltip placement="topLeft" title={orderId}>
            //         {orderId}
            //     </Tooltip>
            // ),
          },
          {
            title: "渠道",
            width: width_colum.medium,
            dataIndex: "carrier",
            align: alignProp,
            key: "carrier",
          },
          // { title: '用户名', width: width_colum.medium, dataIndex: ['user', 'user_name'], align: alignProp, key: 'user_name', },

          {
            title: "重量lb",
            dataIndex: ["parcel", "weight"],
            width: width_colum.short,
            align: alignProp,
            key: "Weight",
          },
          {
            title: "收件人",
            width: width_colum.short,
            dataIndex: ["recipient", "recipient_name"],
            align: alignProp,
            key: "Name",
          },
          {
            title: "收货邮编",
            width: width_colum.short,
            dataIndex: ["recipient", "zipcode"],
            align: alignProp,
            key: "recipient_zipcode",
          },
          // { title: '产品sku', width: width_colum.medium, dataIndex: ['parcel', 'sku'], align: 'center', key: 'parcel_sku', },
          // { title: '收货城市', width: width_colum.short, dataIndex: ['recipient' , 'city'], align: 'center', key: 'recipient_city', },
          // { title: '收货州', width: width_colum.short, dataIndex: ['recipient' , 'state'], align: 'center', key: 'recipient_state', },
          // {
          //     title: '收货地址',
          //     width: width_colum.medium,
          //     dataIndex: ['recipient' , 'add1'],
          //     align: 'center',
          //     key: 'recipient_add1',
          //     render: (text, row) => { return (text + ' ' + row.recipient.add2) }
          // },

          // {
          //     title: '尺寸', width: width_colum.medium,
          //     dataIndex: 'Reference2',
          //     align: 'center',
          //     key: 'Reference2',
          //     render: (text, row) => { return (row.parcel.length + ' x ' + row.parcel.width + ' x ' + row.parcel.height) }
          // },

          {
            title: "创建时间",
            width: width_colum.medium,
            dataIndex: "created_at",
            align: alignProp,
            key: "created_at",
          },
          // {
          //     title: '系统订单号', width: width_colum.long, dataIndex: 'order_id', align: alignProp, key: 'order_id',
          //     ellipsis: {
          //         showTitle: false,
          //     },
          //     render: orderId => (
          //         <Tooltip placement="topLeft" title={orderId}>
          //             {orderId}
          //         </Tooltip>
          //     ),
          // },
        ],
        page_name: "processing",
        filter_content: [
          // {
          //     component: 'range_picker',
          //     tag: '创建日期',
          //     value: [undefined, undefined],
          //     api_request_payload: function (start = undefined, end = undefined) { return ({ "created_at": { "$gte": start, "$lte": end } }) },
          //     poperty: { placeholder: ['开始时间', '结束时间'] }
          // },
          // {
          //     component: 'select_tag',
          //     tag: '发件地址',
          //     value: { test: undefined },
          //     api_request_payload: function (start = undefined, end = undefined) { return ({ "created_at": { "$gte": start, "$lte": end } }) },
          //     poperty: { placeholder: "发件地址，可多选" }
          // },
          // {
          //     component: 'search_bar',
          //     tag: '自定义搜索',
          //     value: { test: undefined },
          //     api_request_payload: function (start = undefined, end = undefined) { return ({ "created_at": { "$gte": start, "$lte": end } }) },
          //     poperty: { placeholder: "搜索任意。。" }
          // },
          // {
          //     component: 'select_tag',
          //     tag: '发件地址',
          //     value: { test: undefined },
          //     api_request_payload: function (start = undefined, end = undefined) { return ({ "created_at": { "$gte": start, "$lte": end } }) },
          //     poperty: { placeholder: "发件地址，可多选" }
          // },
          // { component: 'select_tag', tag: '发货渠道', poperty: { placeholder: "选择渠道，可多选" } },
          // { component: 'select_tag', tag: '渠道', poperty : { placeholder: '' } }
        ],
        // 'button': {
        //     'action': ['submit', 'delete'],
        //     'batch': ['批量递交', '批量删除']
        // }
      },
    },
  },

  {
    router: "ready_to_ship",
    component: {
      type: "table",
      prop: {
        api_url: {
          get_data_pignate: "/user/get_orders",
        },
        row_key: "order_id",
        table_content: [
          {
            title: "操作",
            key: "action",
            width: width_colum.short,
            align: "center",
            fixed: "left",
            render: (text, record) => (
              <span>
                <a
                  type="defa"
                  onClick={() => {
                    Ref.props.history.push({
                      pathname: `/forwarder/order/draft/detail/${record.order_id}`,
                      order: record,
                      order_id: record.order_id,
                    });
                  }}
                >
                  查看
                </a>
                {/* <Divider type="vertical" />
                            <a type="defa" >编辑</a>
                            <Divider type="vertical" />
                            <a type="defa" onClick={() => this.child.handle_action(record.order_id, 'cancel')} >撤销</a> */}
              </span>
            ),
          },
          {
            title: "参考订单号",
            width: width_colum.long,
            dataIndex: "customer_order_id",
            key: "customer_order_id",
            align: alignProp,
            ellipsis: {
              showTitle: false,
            },
            render: (orderId) => (
              <Tooltip placement="topLeft" title={orderId}>
                {orderId}
              </Tooltip>
            ),
          },
          {
            title: "渠道",
            width: width_colum.medium,
            dataIndex: "carrier",
            align: alignProp,
            key: "carrier",
          },
          {
            title: "预估运费",
            width: width_colum.medium,
            dataIndex: ["postage", "estimate_amount"],
            align: alignProp,
            key: "estimate_amount",
          },
          // { title: '用户名', width: width_colum.medium, dataIndex: ['user', 'user_name'], align: alignProp, key: 'user_name', },

          {
            title: "重量lb",
            dataIndex: ["parcel", "weight"],
            width: width_colum.short,
            align: alignProp,
            key: "Weight",
          },
          {
            title: "收货州",
            width: width_colum.short,
            dataIndex: ["recipient", "state"],
            align: alignProp,
            key: "recipient_state",
            render: (text, row) => {
              return text + " " + row.recipient.zipcode;
            },
          },
          {
            title: "收货邮编",
            width: width_colum.short,
            dataIndex: ["recipient", "zipcode"],
            align: alignProp,
            key: "recipient_zipcode",
          },

          // { title: '产品sku', width: width_colum.medium, dataIndex: ['parcel', 'sku'], align: 'center', key: 'parcel_sku', },
          // { title: '收货城市', width: width_colum.short, dataIndex: ['recipient' , 'city'], align: 'center', key: 'recipient_city', },

          // {
          //     title: '收货地址',
          //     width: width_colum.medium,
          //     dataIndex: ['recipient' , 'add1'],
          //     align: 'center',
          //     key: 'recipient_add1',
          //     render: (text, row) => { return (text + ' ' + row.recipient.add2) }
          // },
          // { title: '收件人', width: width_colum.short, dataIndex: ['recipient', 'recipient_name'], align: alignProp, key: 'Name' },
          // {
          //     title: '尺寸', width: width_colum.medium,
          //     dataIndex: 'Reference2',
          //     align: 'center',
          //     key: 'Reference2',
          //     render: (text, row) => { return (row.parcel.length + ' x ' + row.parcel.width + ' x ' + row.parcel.height) }
          // },

          {
            title: "创建时间",
            width: width_colum.medium,
            dataIndex: "created_at",
            align: alignProp,
            key: "created_at",
          },
          {
            title: "系统订单号",
            width: width_colum.long,
            dataIndex: "order_id",
            align: alignProp,
            key: "order_id",
            ellipsis: {
              showTitle: false,
            },
            render: (orderId) => (
              <Tooltip placement="topLeft" title={orderId}>
                {orderId}
              </Tooltip>
            ),
          },
        ],
        page_name: "ready_to_ship",
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
            component: "select_tag",
            tag: "用户名",
            value: { test: undefined },
            api_request_payload: function (start = undefined, end = undefined) {
              return { created_at: { $gte: start, $lte: end } };
            },
            poperty: { placeholder: "用户名，可多选" },
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
          {
            component: "select_tag",
            tag: "发件地址",
            value: { test: undefined },
            api_request_payload: function (start = undefined, end = undefined) {
              return { created_at: { $gte: start, $lte: end } };
            },
            poperty: { placeholder: "发件地址，可多选" },
          },

          // { component: 'select_tag', tag: '发货渠道', poperty: { placeholder: "选择渠道，可多选" } },
          // { component: 'select_tag', tag: '渠道', poperty : { placeholder: '' } }
        ],
        // 'button': {
        //     'action': ['submit', 'delete'],
        //     'batch': ['批量递交', '批量删除']
        // }
      },
    },
  },

  {
    router: "completed",
    component: {
      type: "table",
      prop: {
        api_url: {
          get_data_pignate: "/user/get_orders",
        },
        style: { size: "small" },
        row_key: "order_id",
        table_content: [
          //   {
          //     title: " ",
          //     key: "action",
          //     width: 100,
          //     align: 'right',
          //     // fixed: "left",
          //     render: (text, record) => (
          //       <Space size="middle">
          //         <Button size ='small'> 详情 </Button>
          //         <a type="defa" onClick={() => console.log(123)}><FilePdfFilled style={{ fontSize: '16px', }} /></a>
          //         <a type="defa" onClick={() => console.log(123)}> <MinusCircleFilled style={{ fontSize: '16px', }} /></a>
          //       </Space>
          //     ),
          //   },
          //   {
          //       title: '参考订单号', width: width_colum.longest, dataIndex: 'customer_order_id', key: 'customer_order_id',
          //       align: alignProp,
          //       ellipsis: {
          //           showTitle: false,
          //       },
          //       render: orderId => (
          //           <Tooltip placement="topLeft" title={orderId}>
          //               {orderId}
          //           </Tooltip>
          //       ),
          //   },
          {
            title: "运单号",
            width: 225,
            dataIndex: ["parcel", "parcelList"],
            key: "parcel",
            align: "left",
            // fixed: "left",
            ellipsis: {
              showTitle: false,
            },
            // shouldCellUpdate: (record, prevRecord) => true,
            render: (parcelList, record, index) => {
              return (
                <Space style={{ marginleft: 100 }} size={2}>
                  {/* <Link
                    to={{
                      pathname: `/user/order_log/completed/detail/${parcelList[0].tracking_numbers[0]}`,
                    }}
                  >
                    {parcelList[0].tracking_numbers[0]}
                  </Link> */}
                  {/* <LinkToModal
                    content={
                      <OrderDetail
                        tracking={parcelList[0].tracking_numbers[0]}
                      />
                    }
                    link={parcelList[0].tracking_numbers[0]}
                  /> */}
                  <LinkToDrawer
                    content={
                      <OrderDetail
                        tracking={parcelList[0].tracking_numbers[0]}
                      />
                    }
                    link={parcelList[0].tracking_numbers[0]}
                  />
                  {/* <a
                    onClick ={()=> console.log(123)}
                  >
                    {parcelList[0].tracking_numbers[0]}
                  </a> */}
                </Space>
              );

              //   if (record._id == Ref.child.state.row_shows_icon) {
              //     return (
              //       <Space>
              //         <Tooltip
              //           placement="topLeft"
              //           title={parcelList[0].tracking_numbers[0]}
              //         >
              //           {parcelList[0].tracking_numbers[0]}

              //         </Tooltip>
              //              <a type="defa" onClick={() => console.log(123)}><FilePdfFilled style={{ fontSize: '16px', }} /></a>
              //              {parcelList[0].tracking_numbers[0]}

              //       </Space>
              //     );
              //   } else {
              //     return (
              //       <Space>
              //         <Tooltip
              //           placement="topLeft"
              //           title={parcelList[0].tracking_numbers[0]}
              //         >
              //           {parcelList[0].tracking_numbers[0]}
              //         </Tooltip>
              //         {parcelList[0].tracking_numbers[0]}
              //       </Space>
              //     );
              //   }
            },
          },
          {
            title: "服务",
            width: 225,
            dataIndex: ["service", "asset", "logo_url"],
            align: "left",
            key: "carrier_type",
            render: (text, record) => {
              let logType;
              if (record.service) {
                logType = record.service.carrier_type
                  ? record.service.carrier_type.toUpperCase()
                  : "USPS";
              } else {
                logType = "USPS";
              }

              return (
                <Space>
                  {selectIconByCarrier[logType]}
                  {record.service.mail_class}
                </Space>
              );
            },
            shouldCellUpdate: (record, prevRecord) => false,
          },

          {
            title: "文件",
            width: width_colum.medium,
            dataIndex: ["parcel", "parcelList"],
            align: "left",
            key: "file",
            shouldCellUpdate: (record, prevRecord) => false,
            render: (parcelList, record, index) => {
              return (
                <Space size={2}>
                  <PdfIcon
                    // twoToneColor="#096dd9"
                    // twoToneColor="#f5222d"
                    // twoToneColor="#d9d9d9" 不可用
                    onClick={() => {
                      let bath_id =
                        uid.randomUUID(6) + parcelList[0].tracking_numbers[0];
                      localStorage.setItem(
                        bath_id,
                        JSON.stringify({
                          urls: parcelList.map((item) => item.label[0]),
                        })
                      );
                      const win = window.open(`/label/${bath_id}`, "_blank");
                      win.focus();
                    }}
                    // style={{ fontSize: "16px", color: "#1890ff" }}
                  />
                  {/* <Divider type="vertical" />
                  <FileImageTwoTone style={{ fontSize: "15px" }} /> */}
                </Space>
              );
            },
          },
          {
            title: "运费金额",
            width: width_colum.medium,
            dataIndex: ["postage", "billing_amount", "total"],
            align: "left",
            key: "billing_amount_total",
            render: (amount) => "$ " + amount,
            shouldCellUpdate: (record, prevRecord) => false,
          },

          // { title: '用户名', width: width_colum.medium, dataIndex: ['user', 'user_name'], align: alignProp, key: 'user_name', },
          // {
          //     title: '尺寸', width: width_colum.medium,
          //     dataIndex: 'Reference2',
          //     align: alignProp,
          //     key: 'Reference2',
          //     render: (text, row) => { return (row.parcel.length + ' x ' + row.parcel.width + ' x ' + row.parcel.height) }
          // },
          {
            title: "重量lb",
            dataIndex: ["parcel", "weight"],
            width: width_colum.medium,
            align: "left",
            key: "Weight",
            shouldCellUpdate: (record, prevRecord) => false,
          },
          {
            title: "收货州",
            width: width_colum.medium,
            dataIndex: ["recipient", "state"],
            align: "left",
            key: "recipient_state",
            render: (text, row) => {
              return text + " " + " " + row.recipient.zipcode;
            },
            // shouldCellUpdate: (record, prevRecord) => false,
          },
          // {
          //   title: "收货邮编",
          //   width: width_colum.medium,
          //   dataIndex: ["recipient", "zipcode"],
          //   align: "left",
          //   key: "recipient_zipcode",
          //   shouldCellUpdate: (record, prevRecord) => false,
          // },

          // { title: '产品sku', width: width_colum.medium, dataIndex: ['parcel', 'sku'], align: 'center', key: 'parcel_sku', },
          // { title: '收货城市', width: width_colum.short, dataIndex: ['recipient' , 'city'], align: 'center', key: 'recipient_city', },

          // {
          //     title: '收货地址',
          //     width: width_colum.medium,
          //     dataIndex: ['recipient' , 'add1'],
          //     align: 'center',
          //     key: 'recipient_add1',
          //     render: (text, row) => { return (text + ' ' + row.recipient.add2) }
          // },
          // { title: '收件人', width: width_colum.short, dataIndex: ['recipient', 'recipient_name'], align: alignProp, key: 'Name' },

          {
            title: "创建时间",
            width: width_colum.long,
            dataIndex: "created_at",
            align: "left",
            key: "created_at",
            shouldCellUpdate: (record, prevRecord) => false,
          },
          // {
          //     title: '系统订单号', width: width_colum.long, dataIndex: 'order_id', align: alignProp, key: 'order_id',
          //     ellipsis: {
          //         showTitle: false,
          //     },
          //     render: orderId => (
          //         <Tooltip placement="topLeft" title={orderId}>
          //             {orderId}
          //         </Tooltip>
          //     ),
          // },
        ],
        page_name: "completed",
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
            component: "select_tag",
            tag: "用户名",
            value: { test: undefined },
            api_request_payload: function (start = undefined, end = undefined) {
              return { created_at: { $gte: start, $lte: end } };
            },
            poperty: { placeholder: "用户名，可多选" },
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
          {
            component: "select_tag",
            tag: "发件地址",
            value: { test: undefined },
            api_request_payload: function (start = undefined, end = undefined) {
              return { created_at: { $gte: start, $lte: end } };
            },
            poperty: { placeholder: "发件地址，可多选" },
          },

          // { component: 'select_tag', tag: '发货渠道', poperty: { placeholder: "选择渠道，可多选" } },
          // { component: 'select_tag', tag: '渠道', poperty : { placeholder: '' } }
        ],
        search_bar: false,
        alert: true,
        isRowExpandable: (record) => {
          try {
            if (record.parcel) return record.parcel.parcelList.length > 1;
            return false;
          } catch (error) {
            console.log(error);
            return false;
          }
        },
        // buttons: [
        //   {
        //     key: "print",
        //     content: "打印",
        //     type: "primary",
        //     icon: undefined,
        //     isBatchAction: true,
        //   },
        //   {
        //     key: "delete",
        //     content: "退单",
        //     type: "danger",
        //     icon: undefined,
        //     isBatchAction: true,
        //   },
        // ],
      },
    },
  },

  {
    router: "failed",
    component: {
      type: "table",
      prop: {
        api_url: {
          get_data_pignate: "/user/get_orders",
        },
        row_key: "order_id",
        table_content: [
          {
            title: "参考订单号",
            width: width_colum.longest,
            dataIndex: "customer_order_id",
            key: "customer_order_id",
            align: alignProp,
            ellipsis: {
              showTitle: false,
            },
            render: (orderId) => (
              <Tooltip placement="topLeft" title={orderId}>
                {orderId}
              </Tooltip>
            ),
          },
          {
            title: "错误码",
            width: width_colum.medium,
            dataIndex: "server_status",
            align: alignProp,
            key: "server_status",
          },
          {
            title: "渠道",
            width: width_colum.medium,
            dataIndex: "carrier",
            align: alignProp,
            key: "carrier",
          },
          {
            title: "预估运费",
            width: width_colum.medium,
            dataIndex: ["postage", "estimate_amount"],
            align: alignProp,
            key: "estimate_amount",
          },
          {
            title: "用户名",
            width: width_colum.medium,
            dataIndex: ["user", "user_name"],
            align: alignProp,
            key: "user_name",
          },
          {
            title: "尺寸",
            width: width_colum.medium,
            dataIndex: "Reference2",
            align: alignProp,
            key: "Reference2",
            render: (text, row) => {
              return (
                row.parcel.length +
                " x " +
                row.parcel.width +
                " x " +
                row.parcel.height
              );
            },
          },
          {
            title: "重量lb",
            dataIndex: ["parcel", "weight"],
            width: width_colum.short,
            align: alignProp,
            key: "Weight",
          },
          {
            title: "收件人",
            width: width_colum.short,
            dataIndex: ["recipient", "recipient_name"],
            align: alignProp,
            key: "Name",
          },
          {
            title: "收货地址",
            width: width_colum.long,
            dataIndex: ["recipient", "add1"],
            align: alignProp,
            key: "recipient_add1",
            render: (text, row) => {
              return text + " " + row.recipient.add2;
            },
          },
          {
            title: "收件州",
            width: width_colum.short,
            dataIndex: ["recipient", "state"],
            align: alignProp,
            key: "recipient_state",
            render: (text, row) => {
              return text + " " + row.recipient.add2;
            },
          },
          // {
          //   title: "收货邮编",
          //   width: width_colum.short,
          //   dataIndex: ["recipient", "zipcode"],
          //   align: alignProp,
          //   key: "recipient_zipcode",
          // },
          // { title: '产品sku', width: width_colum.short, dataIndex: ['parcel', 'sku'], align: alignProp, key: 'parcel_sku', },
          // {
          //   title: "收货城市",
          //   width: width_colum.short,
          //   dataIndex: ["recipient", "city"],
          //   align: alignProp,
          //   key: "recipient_city",
          // },

          {
            title: "创建时间",
            width: width_colum.medium,
            dataIndex: "created_at",
            align: alignProp,
            key: "created_at",
          },
          {
            title: "系统订单号",
            width: width_colum.long,
            dataIndex: "order_id",
            align: alignProp,
            key: "order_id",
            ellipsis: {
              showTitle: false,
            },
            render: (orderId) => (
              <Tooltip placement="topLeft" title={orderId}>
                {orderId}
              </Tooltip>
            ),
          },
          {
            title: "操作",
            key: "action",
            width: width_colum.short,
            align: "center",
            fixed: "right",
            render: (text, record) => (
              <span>
                <a
                  type="defa"
                  onClick={() => {
                    Ref.props.history.push({
                      pathname: `/forwarder/order/draft/detail/${record.order_id}`,
                      order: record,
                      order_id: record.order_id,
                    });
                  }}
                >
                  查看
                </a>
                {/* <Divider type="vertical" />
                            <a type="defa" >编辑</a>
                            <Divider type="vertical" />
                            <a type="defa" onClick={() => this.child.handle_action(record.order_id, 'cancel')} >撤销</a> */}
              </span>
            ),
          },
        ],
        page_name: "failed",
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
            component: "select_tag",
            tag: "用户名",
            value: { test: undefined },
            api_request_payload: function (start = undefined, end = undefined) {
              return { created_at: { $gte: start, $lte: end } };
            },
            poperty: { placeholder: "用户名，可多选" },
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
          // {
          //     component: 'select_tag',
          //     tag: '发件地址',
          //     value: { test: undefined },
          //     api_request_payload: function (start = undefined, end = undefined) { return ({ "created_at": { "$gte": start, "$lte": end } }) },
          //     poperty: { placeholder: "发件地址，可多选" }
          // },

          // { component: 'select_tag', tag: '发货渠道', poperty: { placeholder: "选择渠道，可多选" } },
          // { component: 'select_tag', tag: '渠道', poperty : { placeholder: '' } }
        ],
        // 'button': {
        //     'action': ['submit', 'delete'],
        //     'batch': ['批量递交', '批量删除']
        // }
      },
    },
  },

  // {
  //     'name': 'ready_to_ship',
  //     'api': {
  //         "get_data_pignate": '/forwarder/get_orders'
  //     },
  //     'layout': {
  //         'row_key': 'order_id',
  //         'column': [
  //             { title: '参考订单号', width: width_colum.long, dataIndex: 'customer_order_id', key: 'customer_order_id', align: 'center' },
  //             { title: '用户姓名', width: width_colum.medium, dataIndex: ['user', 'user_name'], align: 'center', key: 'user_name', },
  //             { title: '渠道', width: width_colum.medium, dataIndex: 'carrier', align: 'center', key: 'carrier', },
  //             { title: '重量lb', dataIndex: ['parcel', 'weight'], width: width_colum.short, align: 'center', key: 'Weight', },
  //             { title: '产品sku', width: width_colum.medium, dataIndex: ['parcel', 'sku'], align: 'center', key: 'parcel_sku', },

  //             { title: '收货邮编', width: width_colum.short, dataIndex: ['recipient', 'zipcode'], align: 'center', key: 'recipient_zipcode', },
  //             { title: '收货城市', width: width_colum.short, dataIndex: ['recipient', 'city'], align: 'center', key: 'recipient_city', },
  //             { title: '收货州', width: width_colum.short, dataIndex: ['recipient', 'state'], align: 'center', key: 'recipient_state', },
  //             {
  //                 title: '收货地址',
  //                 width: width_colum.medium,
  //                 dataIndex: ['recipient', 'add1'],
  //                 align: 'center',
  //                 key: 'recipient_add1',
  //                 render: (text, row) => { return (text + ' ' + row.recipient.add2) }
  //             },
  //             { title: '收件人', width: width_colum.short, dataIndex: ['recipient', 'recipient_name'], align: 'center', key: 'Name' },
  //             // {
  //             //     title: '尺寸', width: width_colum.medium,
  //             //     dataIndex: 'Reference2',
  //             //     align: 'center',
  //             //     key: 'Reference2',
  //             //     render: (text, row) => { return (row.parcel.length + ' x ' + row.parcel.width + ' x ' + row.parcel.height) }
  //             // },
  //             { title: '系统订单号', width: width_colum.long, dataIndex: 'order_id', align: 'center', key: 'order_id' },
  //             { title: '创建时间', width: width_colum.medium, dataIndex: 'created_at', align: 'center', key: 'created_at', },
  //             {
  //                 title: '操作', key: 'action', width: width_colum.short, align: 'center',
  //                 fixed: 'right',
  //                 render: (text, record) => (
  //                     <span>
  //                         <a type="defa" >查看</a>
  //                         {/* <Divider type="vertical" />
  //                         <a type="defa" >编辑</a>
  //                         <Divider type="vertical" />
  //                         <a type="defa" onClick={() => this.child.handle_action(record.order_id, 'cancel')} >撤销</a> */}
  //                     </span>
  //                 )
  //             }
  //         ],
  //         'filter': [
  //             {
  //                 component: 'range_picker',
  //                 tag: '创建日期',
  //                 value: [undefined, undefined],
  //                 api_request_payload: function (start = undefined, end = undefined) { return ({ "created_at": { "$gte": start, "$lte": end } }) },
  //                 poperty: { placeholder: ['开始时间', '结束时间'] }
  //             },
  //             {
  //                 component: 'select_tag',
  //                 tag: '发件地址',
  //                 value: { test: undefined },
  //                 api_request_payload: function (start = undefined, end = undefined) { return ({ "created_at": { "$gte": start, "$lte": end } }) },
  //                 poperty: { placeholder: "发件地址，可多选" }
  //             },

  //             // { component: 'select_tag', tag: '发货渠道', poperty: { placeholder: "选择渠道，可多选" } },
  //             // { component: 'select_tag', tag: '渠道', poperty : { placeholder: '' } }
  //         ],
  //         'button': {
  //             'action': ['submit', 'delete'],
  //             'batch': ['批量递交', '批量删除']
  //         }
  //     }
  // },

  // {
  //     'name': 'completed',
  //     'api': {
  //         "get_data_pignate": '/forwarder/get_orders'
  //     },
  //     'layout': {
  //         'row_key': 'order_id',
  //         'column': [
  //             { title: '参考订单号', width: width_colum.long, dataIndex: 'customer_order_id', key: 'customer_order_id', align: 'center' },
  //             { title: '用户姓名', width: width_colum.medium, dataIndex: ['user', 'user_name'], align: 'center', key: 'user_name', },
  //             { title: '渠道', width: width_colum.medium, dataIndex: 'carrier', align: 'center', key: 'carrier', },
  //             { title: '运费', width: width_colum.medium, dataIndex: ['postage', 'billing_amount'], align: 'center', key: 'billing_amount', },
  //             { title: '重量lb', dataIndex: ['parcel', 'weight'], width: width_colum.short, align: 'center', key: 'Weight', },
  //             { title: '产品sku', width: width_colum.medium, dataIndex: ['parcel', 'sku'], align: 'center', key: 'parcel_sku', },
  //             { title: '系统订单号', width: width_colum.long, dataIndex: 'order_id', align: 'center', key: 'order_id' },
  //             { title: '创建时间', width: width_colum.medium, dataIndex: 'created_at', align: 'center', key: 'created_at', },
  //             {
  //                 title: '操作', key: 'action', width: width_colum.short, align: 'center',
  //                 fixed: 'right',
  //                 render: (text, record) => (
  //                     <span>
  //                         <a type="defa" >查看</a>
  //                         {/* <Divider type="vertical" />
  //                         <a type="defa" >编辑</a>
  //                         <Divider type="vertical" />
  //                         <a type="defa" onClick={() => this.child.handle_action(record.order_id, 'cancel')} >撤销</a> */}
  //                     </span>
  //                 )
  //             }
  //         ],
  //         'filter': [
  //             {
  //                 component: 'range_picker',
  //                 tag: '创建日期',
  //                 value: [undefined, undefined],
  //                 api_request_payload: function (start = undefined, end = undefined) { return ({ "created_at": { "$gte": start, "$lte": end } }) },
  //                 poperty: { placeholder: ['开始时间', '结束时间'] }
  //             },
  //             {
  //                 component: 'select_tag',
  //                 tag: '发件地址',
  //                 value: { test: undefined },
  //                 api_request_payload: function (start = undefined, end = undefined) { return ({ "created_at": { "$gte": start, "$lte": end } }) },
  //                 poperty: { placeholder: "发件地址，可多选" }
  //             },

  //             // { component: 'select_tag', tag: '发货渠道', poperty: { placeholder: "选择渠道，可多选" } },
  //             // { component: 'select_tag', tag: '渠道', poperty : { placeholder: '' } }
  //         ],
  //         'button': {
  //             'action': ['submit', 'delete'],
  //             'batch': ['批量递交', '批量删除']
  //         }
  //     }
  // },
];

export default mapRouterToComponent;
