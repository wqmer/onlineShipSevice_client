import { FileAddOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Typography, Button, Col, Row, Input, Select, Collapse, Steps, Divider } from 'antd';
import React, { Component } from 'react';
import { Redirect, Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import _ from "lodash";
import ShortUniqueId from 'short-unique-id';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import Parcel_component from './parcel_form'

import { actions as single_order_form } from '../../../../../reducers/shipping_platform/single_order_form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const uid = new ShortUniqueId();
const { Text } = Typography;
const { Panel } = Collapse;


const content = {
    form: [
        { "label": '相同多件', "key": "same_pack", "is_required": false, "message": undefined, "placehold": '默认一件', "span_value": 4, type: 'input', },
        { "label": '重量', "key": "weight", "is_required": true, "message": undefined, "placehold": '重量', "span_value": 5, type: 'input', },
        { "label": '长', "key": "length", "is_required": true, "message": undefined, "placehold": '长度', "span_value": 5, type: 'input', },
        { "label": '宽', "key": "width", "is_required": true, "message": undefined, "placehold": '宽度', "span_value": 5, type: 'input', },
        { "label": '高', "key": "height", "is_required": true, "message": undefined, "placehold": '高度', "span_value": 5, type: 'input', },
        { "label": '订单号', "key": "order_id", "is_required": false, "message": undefined, "placehold": '自定义单号，选填，如不填写，系统自动完成', "span_value": 14, type: 'input', },
        { "label": '备注信息', "key": "reference", "is_required": false, "message": undefined, "placehold": '运单上自定义信息，选填', "span_value": 10, type: 'input', },
        // { "label": 'sku', "key": "sku", "is_required": false, "message": undefined, "placehold": '产品的sku', "span_value": 9, type: 'input', },
    ],
    action: [
        // { "key": "save_link", "placehold": '保存', "span_value": 2, type: 'save_link', },
        // { "key": "reset_link", "placehold": '重置', "span_value": 2, type: 'reset_link', },
    ]
}

const merge_parcel_info = (data) => {
    let title = undefined
    let font_type = undefined


    let total_weight = 0
    let array_finished = data.filter(item => item.panel_title != '编辑中' && item.panel_title != '未录入')
    let array_unfinished = data.filter(item => item.panel_title == '编辑中' || item.panel_title == '未录入')

    let is_ready = array_finished.length == data.length

    if (array_finished.length > 0) {
        total_weight = array_finished.reduce((accumulator, currentValue) => {
            // console.log(Number(currentValue.pack_info.weight))
            return (accumulator + Number(currentValue.pack_info.weight))
        }, 0)
    }
    //如果只有一个包裹时，或在编辑 或已完成
    if (array_unfinished.length + array_finished.length == 1) {
        title = array_finished.length == 1 ? `当前录入1个包裹，重量${total_weight} , 尺寸为${data[0].pack_info.length} x ${data[0].pack_info.width} x ${data[0].pack_info.height}` : "1个包裹正在编辑"
    } else {
        title = array_unfinished.length == 0 ? `当前录入${array_finished.length}个包裹，总重量${total_weight}` : `当前录入${array_finished.length}个包裹，总重量${total_weight}，${array_unfinished.length}个正在编辑`
    }

    font_type = array_unfinished.length > 0 ? "warning" : 'strong'
    return {
        title,
        font_type,
        is_ready
    }
}

class Parcel extends React.Component {
    constructor(props) {
        super(props)
    }

    submit_info = (data) => {
        let update_data = this.props.parcel_information.parcel_list.map(item => {
            if (item.key == data.key) {
                item = data
            }
            return item
        })
       
        // console.log(update_data)
        // merge_parcel_info(update_data).title
        if (!merge_parcel_info(update_data).is_ready) {
            //信息处于未完成状态时 如果面板打开或者已经选择服务，就强制收起和修改
            if (this.props.setting.open_panel.includes('service_information') || this.props.service_information.service_name) {
                let update_obj = { service_information: {}, setting: {} }
                update_obj['service_information'] = {
                    is_select: false,
                    service_name: undefined,
                    panel_title: '请先完成输入信息',
                    font_type: 'secondary',
                }
                update_obj['setting']['open_panel'] = this.props.setting.open_panel.filter(item => item != 'service_information')
                this.props.update_form_info(update_obj)
            }
        }

        let obj = {
            parcel_information: {
                is_ready: merge_parcel_info(update_data).is_ready,
                panel_title: merge_parcel_info(update_data).title,
                font_type: merge_parcel_info(update_data).font_type,
                parcel_list: update_data
            },
        }
        obj['service_information'] = {}
        //递交到redux
        obj['service_information']['is_required_fetch'] = true
        this.props.set_form_info(obj)
        //输入完毕需要去考虑改动标题
    }

    add_one_package() {
        let data = {
            key: uid.randomUUID(6),
            panel_title: '未录入',
            font_type: 'warning',
            pack_info: undefined,
            is_panel_opened: true,
        }
        let obj = {
            'parcel_information': {
                "parcel_list": []
            }
        }
        //增加一个包裹不需要考虑标题
        obj['service_information'] = {}
        obj['parcel_information']['parcel_list'] = this.props.parcel_information.parcel_list.concat(data)
        obj['service_information']['is_required_fetch'] = true
        this.props.set_form_info(obj)
    }

    remove_one_pack = (id_no) => {
        let update_data = this.props.parcel_information.parcel_list.filter(item => item.key != id_no)
          // 删除一个包裹时 要去修改总标题
        let obj = {
            'parcel_information': {
                is_ready: merge_parcel_info(update_data).is_ready,
                panel_title: merge_parcel_info(update_data).title,
                font_type: merge_parcel_info(update_data).font_type,
                parcel_list: update_data
            }
        }
        obj['service_information'] = {}
        obj['service_information']['is_required_fetch'] = true   
        this.props.update_form_info(obj)
    }

    handle_panel = (e, key) => {
        let update_data = this.props.parcel_information.parcel_list.map(item => {
            if (item.key == key) {
                item.is_panel_opened = e.length > 0 ? true : false
            }
            return item
        })

        let obj = {
            parcel_information: {
                parcel_list: update_data
            },
        }
        this.props.set_form_info(obj)
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        const current_form = this.props.parcel_information
        const next_form = nextProps.parcel_information
        if(_.isEqual(current_form ,next_form)) return false
        return true
    }

    render() {
        // console.log('parcel_form form did render')
        return (
            <div>
                {this.props.parcel_information.parcel_list.map((item, index) =>
                    <Parcel_component
                        handle_panel={(e, key) => this.handle_panel(e, key)}
                        parcel={item}
                        data={item.pack_info}
                        content={content}
                        submit_info={(data) => this.submit_info(data)}
                        //为什么不能传key作为标识
                        //`key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop
                        title={item.panel_title}
                        font_type={item.font_type}
                        key={item.key}
                        id_no={item.key}
                        tag={index + 1}
                        remove={(id_no) => this.remove_one_pack(id_no)} />)}
                <div><a onClick={() => this.add_one_package()} ><FileAddOutlined /> 添加一个包裹</a></div>
            </div>
        );
    }
}





function mapStateToProps(state) {
    return {
        parcel_information: state.shipping_platform_single_order.form.parcel_information,
        service_information: state.shipping_platform_single_order.form.service_information,
        setting: state.shipping_platform_single_order.form.setting
    }
}

function mapDispatchToProps(dispatch) {
    return {
        set_form_info: bindActionCreators(single_order_form.get_form_info, dispatch),
        update_form_info: bindActionCreators(single_order_form.update_form_info, dispatch),
        
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Parcel)
