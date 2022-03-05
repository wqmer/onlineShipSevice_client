import {
  message,
  Modal,
  Form,
  Button,
  Switch,
  Space,
  Drawer,
  Avatar,
  Typography,
  Row,
  Col,
  Divider,
} from "antd";
import React, { useState, useEffect } from "react";
import { get, post, put } from "../../util/fetch";
import {
  EditFilled,
  PlusOutlined,
  DeleteFilled,
  SettingFilled,
} from "@ant-design/icons";
import CustomerSwitch from "./switch";
import ServiceList from "../../asset/carrier_service_list";

const { Title, Text } = Typography;

const asset = ServiceList;

const ButtonToDrawer = ({ carrier, user_obj_id }) => {
  const [loading, setLoading] = useState(false);
  const [drawer, changeDrawer] = useState(false);
  const [service, getService] = useState(asset[carrier.type]);
  // // const [isActivated, setActivated] = useState(asset[carrier.type]);
  const addService = (newService) => {
    let updateService = service.map((item) => {
      if (item.mail_class == newService.mail_class) return newService;
      return item;
    });
    getService(updateService);
  };
  console.log(service);
  return (
    <div>
      <Button
        type="link"
        loading={loading}
        icon={<SettingFilled />}
        onClick={async () => {
          setLoading(true);
          try {
            const result = await post("/user/get_service", {
              carrier: carrier._id,
              agent: carrier.agent,
            });
            let updatService;
            let serviceFromFetch = result.data.service;
            console.log(serviceFromFetch);
            // if(carrier.angent == 'Smartship')
            if (serviceFromFetch.length > 0) {
              getService(serviceFromFetch);
              // if (carrier.agent == "Smartship") {

              // } else {
              //   updatService = asset[carrier.type].map((item) => {
              //     let matchedMailClass = serviceFromFetch.find(
              //       ({ mail_class }) => mail_class == item.mail_class
              //     );
              //     let newItem = matchedMailClass ? matchedMailClass : item;

              //     return newItem;
              //   });
              //   getService(updatService);
              // }
            } else {
            }
          } catch (error) {
            console.log(error);
          }
          changeDrawer(true);
        }}
      />

      <Drawer
        title={
          <div>
            <Title level={4}>配置服务</Title>
          </div>
        }
        //   placement={placement}
        style={{ position: "absolute", paddingTop: 64 }}
        // headerStyle={{ maginTop: 64 }}
        getContainer={"#Page"}
        width={375}
        closable={true}
        onClose={() => {
          setLoading(false);
          changeDrawer(false);
        }}
        destroyOnClose
        visible={drawer}
        zIndex={90}
        // key={placement}
        //   mask={false}
        maskClosable={true}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Space align="baseline">
              <Avatar shape="square" size={42} src={carrier.asset.logo_url} />
              <Title level={5}>{carrier.asset.nick_name}</Title>
            </Space>
          </Col>
          {/* <Col>
            <Switch checkedChildren="全启用" unCheckedChildren="全停用" />
          </Col> */}
        </Row>
        <Divider />

        {service.map((item) => (
          <Row
            key={item.mail_class}
            style={{ marginBottom: 24 }}
            justify="space-between"
            align="middle"
          >
            <Col>
              <Space align="baseline">
                <Text strong>{item.mail_class}</Text>
              </Space>
            </Col>
            <Col>
              <CustomerSwitch
                key={item.mail_class}
                service_id={item._id}
                carrier_id={carrier._id}
                type={carrier.type}
                description={item.description}
                mail_class={item.mail_class}
                agent={carrier.agent}
                addService={(new_service) => addService(new_service)}
                // isDisabled={
                //   (item.auth_group && carrier.agent == "Smartship")
                //     ? !item.auth_group.includes(user_obj_id)
                //     : false
                // }
                checked={
                  carrier.agent == "Smartship"
                    ? item.activated_group
                      ? item.activated_group.includes(user_obj_id)
                      : false
                    : !["uncreated", "unactivated"].includes(item.status)
                }
              />
            </Col>
          </Row>
        ))}
      </Drawer>
    </div>
  );
};

// function mapStateToProps(state) {
//   // console.log(state)
//   return {
//     balance: state.shipping_platform_user.account.user_info.balance,
//     status_code: state.globalState.status_code,
//     message: state.globalState.message,
//     // order: state.shipping_platform_user.order.result,
//     isFetching: state.globalState.isFetching,
//     // order_count: state.shipping_platform_user.order.count
//   };
// }
// function mapDispatchToProps(dispatch) {
//   return {
//     logout: bindActionCreators(user_account_actions.get_logout, dispatch),
//     // get_all_order: bindActionCreators(actions_user_order.get_all_order, dispatch),
//     // get_order_count: bindActionCreators(actions_user_order.get_order_count, dispatch),
//     user_auth: bindActionCreators(user_account_actions.user_auth, dispatch),
//   };
// }

// export default connect(mapStateToProps, mapDispatchToProps)(ButtonToDrawer);

export default ButtonToDrawer;
