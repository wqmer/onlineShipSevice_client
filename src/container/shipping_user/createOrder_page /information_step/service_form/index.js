import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
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
} from 'antd';
import React, { Component } from 'react';
import { Redirect, Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import _ from "lodash";
import ShortUniqueId from 'short-unique-id';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import My_service_card from "./service_element"
import { TimeoutError } from 'bluebird';
import {
    get,
    post
} from '../../../../../util/fetch';

import { actions as single_order_form } from '../../../../../reducers/shipping_platform/single_order_form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const uid = new ShortUniqueId();
const { Text } = Typography;
const { Panel } = Collapse;

const service_array = [
    {
        image_src: "https://logo-logos.com/wp-content/uploads/2016/10/Fedex_Express_logo_logotype.png",
        service_name: "FedEx 2-Day",
        service_description: "2个工作日投递",
        rate: '9.81',
        tag: <Tag style={{ fontSize: 12 }} color="blue">最快</Tag>,
        check: false,
    },
    {
        image_src: "https://logo-logos.com/wp-content/uploads/2016/10/USPS_logo_logotype.png",
        service_name: "USPS First-Class",
        service_description: "3-5个工作日投递",
        rate: '3.5',
        check: false,
        tag: <Tag style={{ fontSize: 12 }} color="green">推荐</Tag>
    },
    {
        image_src: "https://logo-logos.com/wp-content/uploads/2016/10/UPS_logo_logotype.png",
        service_name: "UPS Ground",
        service_description: "1-5个工作日投递",
        check: false,
        rate: '6.7',
    },
]
const Service_form = Form.create()(
    class extends React.Component {
        constructor(props) {
            super(props)
        }

        state = {
            is_fetching: false,
            service_content: []
        }

        handle_select = (key) => {
            let update_service = this.props.service_information.service_content.map(item => {
                item.check = item.service_name == key ? true : false
                return item
            })

            let select_total_rate = update_service.find(item => item.check == true).rate
            let select_total_billing_detail = update_service.find(item => item.check == true).packageList
            // this.setState({
            //     service_content: update_service
            // })
        
            let obj = { 
                'service_information': {} ,
                'billing_information':{
                    'total':select_total_rate,
                    "detail":select_total_billing_detail,
                    'on_display' :true
                }
            }
            obj['service_information']['panel_title'] = '当前选择 ' + key
            obj['service_information']['service_name'] = key
            obj['service_information']['is_select'] = true
            obj['service_information']['service_content'] = update_service

            this.props.get_form_info(obj)
            // this.props.postBill(update_service.find(item => item.check == true).rate)
        }

        fetch_service() {
            this.setState({ is_fetching: true });
            post('/user/get_rate', this.props.order_form)
                .then(payload => {
                    let services = payload.data
                    let service_content = []
                    if (services.length > 0) {
                        service_content = services.map(item => {
                            let serviceInfo = {
                                image_src: item[0].data.asset.logo_url,
                                service_name: item[0].data.asset.name,
                                service_description: item[0].data.asset.description,
                                code: item[0].data.asset.code,
                                zone:item[0].data.zone,
                                check: false,
                                rate: parseFloat(item.map(e => e.data.price.total).reduce((a, c) => a + c)),
                                packageList: item.map(e => { return { package_key: e.data.package_key, weight: e.data.weight, zone: e.data.zone, price: e.data.price.total } })
                            }
                            return serviceInfo
                        })
                    }
                    let obj = { 'service_information': {} }
                    obj['service_information']['is_required_fetch'] = false
                    obj['service_information']['service_content'] = service_content
                    this.props.update_form_info(obj)
                    this.setState({ is_fetching: false });
                    // this.setState({ is_fetching: false, service_content: service_content });
                })
                // .catch(error => { notification.error(format.notfication_remote_server_error(handle_error(error).message)) })
                .catch(error => { console.log(error) })
            // .finally(this.props.get_order_count())
        }

        // UNSAFE_componentWillReceiveProps = (nextProps) => {
        //     // 当传进来的参数 地址，包裹 重量数量 都有变化时 重新获取服务 fetch
        //     console.log(this.props.is_all_set())
        //     if (this.props.is_all_set() && this.props.service_information.is_required_fetch) {
        //         this.fetch_service()
        //     }
        // }

        shouldComponentUpdate(nextProps, nextState) {
            return (!_.isEqual(this.props.service_information, nextProps.service_information) || this.state.is_fetching != nextState.is_fetching)
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
            //fetch shipping mehtod
            console.log('did redner from componentDidMount')
            console.log(this.props.service_information.service_content)
            if(this.props.service_information.is_required_fetch)this.fetch_service()
        }

        render() {
            console.log('service_form did render')
            const service_content = this.props.service_information.service_content
            const isGetService = () => {
                  if(service_content){
                      return (service_content.length == 0)
                  }
                  return true 
            }


            return (
                <div>
                    <Row type="flex" justify="center">
                        <Skeleton loading={this.state.is_fetching} active>
                            {isGetService()? <Empty description='没有可用服务' /> :
                                <Space size={32}>
                                    {service_content.map(item =>
                                        <Col style={{ marginTop: 24, }} key={item.service_name} >
                                            <My_service_card
                                                loading={this.state.is_fetching}
                                                select={(key) => this.handle_select(key)}
                                                // key={item.service_name}
                                                service={item}
                                                check={this.props.service_information.service_name == item.service_name}
                                            />
                                        </Col>)}
                                </Space>}
                        </Skeleton>
                    </Row>
                </div>
            )
        }
    }
)


function mapStateToProps(state) {
    return {
        order_form: state.shipping_platform_single_order.form,
        receipant_information: state.shipping_platform_single_order.form.receipant_information,
        parcel_information: state.shipping_platform_single_order.form.parcel_information,
        sender_information: state.shipping_platform_single_order.form.sender_information,
        service_information: state.shipping_platform_single_order.form.service_information,
        setting: state.shipping_platform_single_order.form.setting,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        get_form_info: bindActionCreators(single_order_form.get_form_info, dispatch),
        update_form_info: bindActionCreators(single_order_form.update_form_info, dispatch),
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Service_form)


