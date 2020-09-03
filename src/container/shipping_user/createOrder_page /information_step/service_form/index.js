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
            service_content: service_array
        }

        handle_select = (key) => {
            let update_service = this.state.service_content.map(item => {
                item.check = item.service_name == key ? true : false
                return item
            })
            this.setState({
                service_content: update_service
            })

            let obj = { 'service_information': {} }
            obj['service_information']['panel_title'] = '当前选择 ' + key
            obj['service_information']['service_name'] = key
            obj['service_information']['is_select'] = true

            this.props.get_form_info(obj)
            this.props.postBill(update_service.find(item => item.check == true).rate)
        }

        fetch_service() {
            // this.setState({ is_fetching: true });
            post('/user/get_service_rate')
                .then(payload => {
                    console.log(payload)
                    let obj = { 'service_information': {} }
                    obj['service_information']['is_required_fetch'] = false
                    this.props.get_form_info(obj)
                    // this.setState({ is_fetching: false });
                    // this.setState({})
                })
                // .catch(error => { notification.error(format.notfication_remote_server_error(handle_error(error).message)) })
                .catch(error => { console.log(error) })
            // .finally(this.props.get_order_count())
        }

        // componentWillReceiveProps = (nextProps) => {
        //     // todo 当传进来的参数 地址，包裹 重量数量 都有变化时 重新获取服务 fetch
        //     // console.log(nextProps )
        //     // console.log(this.props.is_all_set() == nextProps.is_all_set())
        //     // console.log(nextProps.is_all_set())
        //     // nextProps.is_all_set() && 
        //     // this.fetch_service()
        //     // console.log('did test from componentWillReceiveProps')
        // }
        shouldComponentUpdate(nextProps, nextState) {
            const current_form = this.props.service_information
            const next_form = nextProps.service_information
            if(_.isEqual(current_form ,next_form)) return false
            return true
        }
        
        componentDidUpdate(prevProps) {
            // Typical usage (don't forget to compare props):
            // console.log(prevProps.service_information.is_required_fetch)
            if (this.props.is_all_set() && this.props.service_information.is_required_fetch) {
                this.fetch_service()
            }
        }


        componentDidMount = () => {
            //首次获取服务 fetch 服务
            this.fetch_service()
            // console.log('did test from componentDidMount')
            //fetch shipping mehtod
        }

        render() {
            // console.log('service_form did render')
            return (
                <div>
                    <Row type="flex" justify="center">
                        <Space size = {32}>
                            {this.state.service_content.map(item =>
                                <Col style={{ marginTop: 24, }} key={item.service_name} >
                                    <My_service_card
                                        select={(key) => this.handle_select(key)}
                                        // key={item.service_name}
                                        service={item}
                                        check={this.props.service_information.service_name == item.service_name}
                                    />
                                </Col>)}
                        </Space>
                    </Row>
                </div>
            )
        }
    }
)


function mapStateToProps(state) {
    return {
        service_information: state.shipping_platform_single_order.form.service_information,
        setting: state.shipping_platform_single_order.form.setting,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        get_form_info: bindActionCreators(single_order_form.get_form_info, dispatch),
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Service_form)


