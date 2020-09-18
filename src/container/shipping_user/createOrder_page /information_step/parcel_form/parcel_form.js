// import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Form, Typography, Button, Col, Row, Input, Select, Collapse, Steps, Divider } from 'antd';
import React, { Component } from 'react';
import { Redirect, Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import _ from "lodash";
import ShortUniqueId from 'short-unique-id';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';

import { actions as single_order_form } from '../../../../../reducers/shipping_platform/single_order_form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
const uid = new ShortUniqueId();

const { Panel } = Collapse
const { Text } = Typography;
const { Title } = Typography;

// 创建form 
const select_compoment = (props, item, parcel) => {
    // let test_data = props.data? props.data[item.key]: undefined 
    // console.log(test_data)
    let form_item_content = undefined
    switch (item.type) {
        case "input":
            form_item_content = (<Input placeholder={item.placehold} />)
            break;
        case "select":
            form_item_content =
                (<Select placeholder={item.placehold}  >
                    <Select.Option value="default_state1">1</Select.Option>
                    <Select.Option value="default_state2">2</Select.Option>
                    <Select.Option value="default_state3">3</Select.Option>
                    <Select.Option value="default_state3">4</Select.Option>
                    <Select.Option value="default_state3">5</Select.Option>
                </Select>)
            break;
        // case "save_link":
        //     form_item_content = (<a onClick={() => { compoment.submit_info(getFieldsValue(), compoment.props.profile, compoment.props.id_no) }} disabled={!is_ready(compoment)} style={{ fontSize: '16px' }}> {item.placehold}</a>)
        //     break;
        // case "reset_link":
        //     form_item_content = (<a onClick={() => { compoment.reset_info(compoment.props.profile) }} style={{ fontSize: '16px' }}> {item.placehold}</a>)
        //     break;
    }

    let content =
        <Form.Item
            name={item.key}
            key={uid}
            // hasFeedback={true}
            // validateStatus="warning"
            label={item.label}
            rules={[
                { required: item.is_required },
                { max: 35 }
            ]}
            initialValue = {parcel ? parcel[item.key] : undefined}
            validateTrigger =  {["onBlur" ]}
        >
          {form_item_content}
        </Form.Item>

    return content
}

const display_form = (props) => {
    let parcel = props.parcel
    let content_form = props.asset.form
    // let content_action = content_form.action
    let result = []
    let row_content = []
    let curent_row_length = 0

    for (var i = 0; i < content_form.length; i++) {
        row_content.push(content_form[i])
        curent_row_length = curent_row_length + content_form[i].span_value
        if (curent_row_length == 24 || (curent_row_length < 24 && i == content_form.length - 1)) {
            let element = <Row key={i} gutter={24}> {row_content.map((item, index) => { return (<Col key={item.key} span={item.span_value} >{select_compoment(props, item, parcel)} </Col>) })} </Row>
            row_content = []
            curent_row_length = 0
            result.push(element)
        }
    }
    // let action_element = <Row key={i} gutter={24}> {content_action.map((item, index) => { return (<Col key={item.key} span={item.span_value} >{select_compoment(this, item)} </Col>) })} </Row>
    // result.push(action_element)
    return result
}

const is_ready_form = (content, form) => {
    const { getFieldDecorator, getFieldsError, getFieldsValue } = form;
    const is_rendered = _.isEmpty(getFieldsError()) ? false : true
    // const has_error = !_.isEmpty(_.pickBy(getFieldsError(), _.identity))

    const has_error = !_.isEmpty(_.pickBy(getFieldsError().filter(item => !_.isEmpty(item.errors)), _.identity))
    const is_filled = _.difference(content.form.filter(item => item.is_required == true).map(item => item.key), _.keys((_.pickBy(getFieldsValue(), _.identity)))).length === 0
    return is_rendered && !has_error && is_filled
}

// const Parcel_form = Form.create({
//     onFieldsChange(props, changedValues, allValues) {
//         props.onChange(props.form, props.form.getFieldsValue());
//     },
// })(props => { return (<Form layout = 'vertical' >{display_form(props)} </Form>) })

const Parcel_form = (props) => {
    const [form] = Form.useForm();
    // console.log(props)
    return (
        <Form
            layout='vertical'
            form={form}
            onFieldsChange={(changedFields, allFields) => {
                // this.props.onChangeValue(changedFields)              
              props.onChange(form, form.getFieldsValue())
            }}
        >
            {display_form(props)}
        </Form>
    );
};


// 创建component
class Parcel_component extends React.Component {
    constructor(props) {
        super(props)
    }

    //每一个包裹完输入完毕后，递交到外层
    onchange_data = (form, data) => {
        console.log('包裹输入')
        let parcel_data = {
            key: this.props.id_no,
            panel_title: undefined,
            font_type: undefined,
            pack_info: data,
        }
        if (is_ready_form(this.props.content, form)) {
            //如果完成设置 title 
            parcel_data.panel_title = `重量 ：${data.weight} ,  长宽高 ： ${data.length} x ${data.width} x ${data.height}`
            parcel_data.font_type = 'strong'

        } else {
            parcel_data.panel_title = '编辑中'
            parcel_data.font_type = 'warning'
        }
        //传输到外层 汇总，保存至redux
        this.props.submit_info(parcel_data)
    };

    render() {
        // console.log(this.props.data)
        return (
            <div>
                <Collapse
                    key={this.props.id_no}
                    style={{ marginBottom: 12, background: '#f7f7f7', }}
                    defaultActiveKey={this.props.parcel.is_panel_opened ? [this.props.id_no] : []}
                    onChange={(e) => this.props.handle_panel(e, this.props.id_no)}
                >
                    <Panel
                        forceRender
                        style={{ background: '#f7f7f7', }}
                        key={this.props.id_no}
                        header={
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span><Text  style={{ fontWeight: 500, marginTop: 2 }}>包裹{this.props.tag} - </Text> <Text style={{ fontSize: 11 }} type={this.props.font_type} strong >  {this.props.title}</Text></span>
                                <IconButton
                                    hidden={this.props.id_no == 'first_pak' ? true : false}
                                    size='small'
                                    aria-label="delete"
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        this.props.remove(this.props.id_no)
                                    }}
                                >
                                    <DeleteOutlineOutlinedIcon fontSize='small' />
                                </IconButton>
                            </div>}
                    >

                        <div style={{ border: "1px dashed rgb(232,232,232)", background: '#F8F8F8', padding: " 16px 32px 0px 32px" }}>
                            <Select key={this.props.id_no} defaultValue="选择一个产品，或者添加新产品" style={{ marginBottom: 16, width: 300 }} >
                                <Select.Option value="default">默认产品</Select.Option>
                                <Select.Option value="product1">默认产品1</Select.Option>
                                <Select.Option value="product2">默认产品2</Select.Option>
                            </Select>
                            <Parcel_form
                                parcel={this.props.data}
                                asset={this.props.content}
                                onChange={(form, data) => this.onchange_data(form, data)}
                            />
                        </div>
                    </Panel>
                </Collapse>
            </div>
        )
    }
}





export default Parcel_component