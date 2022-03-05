import { Form } from "@ant-design/compatible";
import "@ant-design/compatible/assets/index.css";
import {
  message,
  Card,
  Space,
  Tag,
  Typography,
  Button,
  Col,
  Row,
  Input,
  Select,
  Collapse,
  Steps,
  Divider,
  Checkbox,
  Skeleton,
  Empty,
  Switch,
} from "antd";
import React, { Component } from "react";
import _ from "lodash";
import ShortUniqueId from "short-unique-id";
import My_service_card from "./service_element";

import { get, post } from "../../../../../util/fetch";
import { actions as single_order_form } from "../../../../../reducers/shipping_platform/single_order_form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import numeral from "numeral";

const uid = new ShortUniqueId();
const { Text } = Typography;
const { Panel } = Collapse;
const { Meta } = Card;

const service_array = [
  {
    image_src:
      "https://logo-logos.com/wp-content/uploads/2016/10/Fedex_Express_logo_logotype.png",
    service_name: "FedEx 2-Day",
    service_description: "2个工作日投递",
    rate: "9.81",
    tag: (
      <Tag style={{ fontSize: 12 }} color="blue">
        最快
      </Tag>
    ),
    check: false,
  },
  {
    image_src:
      "https://logo-logos.com/wp-content/uploads/2016/10/USPS_logo_logotype.png",
    service_name: "USPS First-Class",
    service_description: "3-5个工作日投递",
    rate: "3.5",
    check: false,
    tag: (
      <Tag style={{ fontSize: 12 }} color="green">
        推荐
      </Tag>
    ),
  },
  {
    image_src:
      "https://logo-logos.com/wp-content/uploads/2016/10/UPS_logo_logotype.png",
    service_name: "UPS Ground",
    service_description: "1-5个工作日投递",
    check: false,
    rate: "6.7",
  },
];

const compareToSuccess = (a, b) => {
  if (a.isSuccess === b.isSuccess) {
    return 0;
  } else {
    return a.isSuccess ? -1 : 1;
  }
};

const Service_form = Form.create()(
  class extends React.Component {
    constructor(props) {
      super(props);
    }

    state = {
      is_fetching: false,
      service_content: [],
      carrier_filter: ["UPS", "FEDEX"],
      // isUpsOn:true,
      // isFedexOn:true,
    };

    handle_select = (key) => {
      let update_service = this.props.service_information.service_content.map(
        (item) => {
          item.check = item.code == key ? true : false;
          return item;
        }
      );
      let {
        NegotiateTotal,
        SurchargeTotal,
        code,
        rate,
        packageList,
        unit_weight,
        service_name,
        carrier,
      } = update_service.find((item) => item.check == true);

      let obj = {
        service_information: {},
        billing_information: {
          carrier,
          unit_weight,
          total: rate,
          NegotiateTotal,
          SurchargeTotal,
          detail: packageList,
          on_display: true,
        },
      };
      //   console.log(packageList);
      obj["service_information"]["panel_title"] = "当前选择 " + service_name;
      obj["service_information"]["service_name"] = service_name;
      obj["service_information"]["code"] = code;
      obj["service_information"]["is_select"] = true;
      obj["service_information"]["service_content"] = update_service;
      // console.log(obj);
      this.props.update_form_info(obj);

      // console.log(this.props.order_form)
      // this.props.postBill(update_service.find(item => item.check == true).rate)
    };

    //如果是一票多件则最终递交数据populate多个包裹，此方法需要判断渠道支持
    populatePack(parcel_list) {
      console.log(parcel_list);
      let myarr = [];
      for (let n = 0; n < parcel_list.length; n++) {
        // console.log(parcel_list[n].pack_info.same_pack)
        let new_fill = new Array(
          Number(parcel_list[n].pack_info.same_pack)
        ).fill(parcel_list[n]);
        // console.log('test data is' + new_fill)
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

    reset_payment_and_billing = () => {
      let obj = {
        service_information: this.props.service_information,

        billing_information: {},
        payment_information: {},
      };
      obj["service_information"]["is_select"] = false;
      obj["billing_information"]["on_display"] = false;
      obj["payment_information"]["is_finished"] = false;
      obj["payment_information"]["payment_method"] = false;
      obj["payment_information"]["panel_title"] = "请选择渠道";
      obj["payment_information"]["font_type"] = false;
      obj["payment_information"]["payment_content"] = [];

      this.props.update_form_info(obj);
    };

    fetch_service() {
      this.setState({ is_fetching: true });
      let { unit_length, unit_weight } =
        this.props.order_form.parcel_information;
      let new_parcel_list = this.populatePack(
        this.props.order_form.parcel_information.parcel_list
      );

      //   console.log('this is the data  '   + new_parcel_list)
      let update_form_information = {
        ...this.props.order_form,
        parcel_information: {
          unit_length,
          unit_weight,
          parcel_list: new_parcel_list,
        },
      };
      // console.log(update_form_information);
      // console.log(update_parcel_information)
      let obj = {
        service_information: {},
        billing_information: {},
        payment_information: {},
      };
      try {
        message.loading({ content: "获取报价中", key: "rating", duration: 0 });
      } catch (error) {}

      this.reset_payment_and_billing();
      post("/user/get_rate", update_form_information)
        .then((payload) => {
          //   console.log(payload);

          let services = payload.data;
          let service_content = [];

          if (services.length > 0) {
            // console.log(services);
            //-----------------------暂时判断IB USPS服务第一个包裹的成功做为所有成功判断，将来修改
            service_content = services.map((item) => {
              // console.log(Array.isArray(item));
              let serviceInfo;
              let element = Array.isArray(item) ? item[0] : item;
              let isSuccess = element.status == 200 ? "success" : "failed";
              if (element.status == 503) {
                serviceInfo = {
                  isSuccess: "timeout",
                  code: element.data._id,
                  message: "超时，请重试",
                  image_src: element.data.asset.logo_url,
                  service_name: element.data.asset.name,
                };
                return serviceInfo;
              }
              if (isSuccess === "success") {
                // two type of calculation at fee
                let total_rate = Array.isArray(item)
                  ? parseFloat(
                      item
                        .map((e) => e.data.price.total)
                        .reduce((a, c) => a + c)
                    ).toFixed(2)
                  : item.data.price.total;

                let NegotiateTotal = item.data.price.NegotiateTotal; //ups
                let SurchargeTotal = item.data.price.SurchargeTotal; //ups
                let RateType = item.data.price.rateType
                  ? item.data.price.rateType
                  : "package"; //fedex

                // 如果是IB 一样的 同步多次请求价格，先判断是否为数组再进行对应转化，如果是 UPS 直接返回多个包裹价格，则直接进行封装返回。如果是DEFT只返回总价，则也只返回总价
                let packageList = Array.isArray(item)
                  ? item.map((e) => {
                      return {
                        package_key: e.data.package_key,
                        weight: e.data.weight,
                        zone: e.data.zone,
                        price: e.data.price.total,
                      };
                    })
                  : element.data.price.detail
                  ? element.data.price.detail.map((e, index) => {
                      return {
                        package_key: new_parcel_list[index].key,
                        weight: e.BillingWeight,
                        zone: e.zone,
                        price: e.totalCharges,
                        basePrice: e.baseCharges,
                        surCharges: e.surCharges,
                      };
                    })
                  : [
                      {
                        package_key: element.data.package_key,
                        weight: element.data.weight,
                        zone: element.data.zone,
                        price: element.data.price.total,
                      },
                    ];
                serviceInfo = {
                  isSuccess,
                  message: element.message,
                  image_src: element.data.asset.logo_url,
                  carrier: element.data.carrier,
                  service_name: element.data.mail_class,
                  service_description: element.data.description,
                  service_source: element.data.asset.name,
                  agent:element.data.agent,
                  code: element.data._id,
                  zone: element.data.zone,
                  unit_weight: element.data.unit_weight,
                  isDisplayOnly: false,
                  check: false,
                  rate: total_rate,
                  RateType, // fedex
                  NegotiateTotal, //ups
                  SurchargeTotal, //ups
                  packageList,
                };
              } else {
                serviceInfo = {
                  isSuccess,
                  code: element.data._id,
                  message: element.message,
                  image_src: element.data.asset.logo_url,
                  carrier: element.data.carrier,
                  service_name: element.data.mail_class,
                  service_description: element.data.description,
                  service_source: element.data.asset.name,
                  agent:element.data.agent,
                };
              }
              return serviceInfo;
            });
            message.success({
              content: "报价完成",
              key: "rating",
              duration: 1,
            });
          } else {
            message.warning({
              content: "无报价可用，请检查包裹输入参数",
              key: "rating",
              duration: 5,
            });
          }

          //   console.log(service_content.sort(compareToOrder));
          service_content
            .sort(
              (a, b) =>
                numeral(a.NegotiateTotal ? a.NegotiateTotal : a.rate).value() -
                numeral(b.NegotiateTotal ? b.NegotiateTotal : b.rate).value()
            )
            .sort(compareToSuccess);

          //   console.log(array);

          obj["service_information"]["is_required_fetch"] = false;
          obj["service_information"]["service_content"] = service_content;

          this.props.update_form_info(obj);
          this.setState({ is_fetching: false });
          // this.setState({ is_fetching: false, service_content: service_content });
        })
        // .catch(error => { notification.error(format.notfication_remote_server_error(handle_error(error).message)) })
        .catch((error) => {
          console.log(error);
          if (error.response) {
            if (error.response.status == 404) {
              message.warning({
                content: "暂无可用渠道",
                key: "rating",
              });
            } else {
              message.error({
                content: error.response.data
                  ? error.response.data.message || "无法获取报价,远程服务器报错"
                  : "远程服务器没响应",
                key: "rating",
              });
            }
          } else {
            message.error({
              content: "无法获取报价，远程服务器出错或无响应",
              key: "rating",
            });
          }

          this.setState({ is_fetching: false });
        });
      // .finally(this.props.get_order_count())
    }

    display_carrier_filter = () => {
      let carrier = ["UPS", "FEDEX"];

      return carrier.map((e, index) => (
        <div key={e + "div"}>
          <Space key={e + "s"} size={6}>
            <Switch
              key={e + "switch"}
              loading={this.state.is_fetching}
              checked={this.state.carrier_filter.includes(e)}
              onChange={(checked) => {
                this.reset_payment_and_billing();
                this.setState({
                  carrier_filter: checked
                    ? this.state.carrier_filter.concat([e])
                    : this.state.carrier_filter.filter((item) => item != e),
                });
              }}
            />
            <span key={e + "span"}>{e}</span>
          </Space>
          <Divider
            key={e + "d"}
            hidden={index == carrier.length - 1}
            style={{ marginTop: 13, marginBottom: 13 }}
          />
        </div>
      ));
    };
    // UNSAFE_componentWillReceiveProps = (nextProps) => {
    //     // 当传进来的参数 地址，包裹 重量数量 都有变化时 重新获取服务 fetch
    //     console.log(this.props.is_all_set())
    //     if (this.props.is_all_set() && this.props.service_information.is_required_fetch) {
    //         this.fetch_service()
    //     }
    // }

    shouldComponentUpdate(nextProps, nextState) {
      return (
        !_.isEqual(
          this.props.service_information,
          nextProps.service_information
        ) ||
        this.state.is_fetching != nextState.is_fetching ||
        this.state.carrier_filter != nextState.carrier_filter
      );
    }

    // componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    // console.log(prevProps.service_information.is_required_fetch)
    // if (this.props.is_all_set() && this.props.service_information.is_required_fetch) {
    //     this.fetch_service()
    // }
    // }

    componentDidMount = () => {
      //首次获取服务 fetch 服务
      //console.log('did redner from componentDidMount')

      if (this.props.service_information.is_required_fetch)
        this.fetch_service();
    };

    render() {
      console.log("service_form did render");
      const service_content = this.props.service_information.service_content;
      // console.log(this.props.service_information);
      if (service_content) {
        console.log(
          service_content.filter((item) =>
            this.state.carrier_filter.includes(item.carrier)
          )
        );
      }

      const isGetService = () => {
        // if service is not undefined ,
        if (service_content) return service_content.length == 0;
        return true;
      };

      return (
        <div>
          <Row gutter={24} style={{ paddingLeft: 12 }}>
            <Col
              key="carrier_filter"
              xxl={{ span: 2 }}
              xl={{ span: 24 }}
              lg={{ span: 24 }}
              style={{ marginTop: 24 }}
            >
              {this.display_carrier_filter()}
            </Col>
            <Col key="service_card" span={22}>
              <Row
                // style={{ paddingLeft: 8 }}
                gutter={24}
                justify={isGetService() ? "center" : undefined}
              >
                {this.state.is_fetching ? (
                  ["1", "2", "3", "4"].map((item) => (
                    <Col
                      xxl={{ span: 6 }}
                      xl={{ span: 8 }}
                      lg={{ span: 12 }}
                      style={{ marginTop: 24 }}
                      key={item}
                    >
                      <Card
                        key={item}
                        size="small"
                        style={{
                          // width: 285,
                          // minWidth: "50%",
                          width: "92.5%",
                          border: "1px solid #d9d9d9",
                          //   boxShadow: "rgb(204, 204, 204) 0px 0px 9px",
                        }}
                      >
                        <Skeleton
                          // style={{
                          //   width: "92.5%",
                          // }}
                          loading={this.state.is_fetching}
                          avatar
                          active
                        />
                      </Card>
                    </Col>
                  ))
                ) : isGetService() ? (
                  <Empty description="没有可用服务" />
                ) : (
                  service_content
                    .filter((item) =>
                      this.state.carrier_filter.includes(item.carrier)
                    )
                    .map((item) => (
                      <Col
                        xxl={{ span: 6 }}
                        xl={{ span: 8 }}
                        lg={{ span: 12 }}
                        style={{ marginTop: 24 }}
                        key={item.code}
                      >
                        <My_service_card
                          isDisplayOnly={item.isDisplayOnly}
                          isSuccess={item.isSuccess}
                          isAuth={item.isSuccess}
                          errorMessage={item.message}
                          loading={this.state.is_fetching}
                          select={(key) => this.handle_select(key)}
                          source={item.service_source}
                          agent={item.agent}
                          // key={item.service_name}
                          key={item.code}
                          service={item}
                          check={
                            this.props.service_information.code == item.code &&
                            this.props.service_information.is_select
                          }
                        />
                      </Col>
                    ))
                )}
              </Row>
            </Col>
          </Row>
        </div>
      );
    }
  }
);

function mapStateToProps(state) {
  return {
    order_form: state.shipping_platform_single_order.form,
    receipant_information:
      state.shipping_platform_single_order.form.receipant_information,
    parcel_information:
      state.shipping_platform_single_order.form.parcel_information,
    sender_information:
      state.shipping_platform_single_order.form.sender_information,
    service_information:
      state.shipping_platform_single_order.form.service_information,
    setting: state.shipping_platform_single_order.form.setting,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    get_form_info: bindActionCreators(
      single_order_form.get_form_info,
      dispatch
    ),
    update_form_info: bindActionCreators(
      single_order_form.update_form_info,
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Service_form);
