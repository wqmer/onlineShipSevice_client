
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
    Radio,
    Drawer,
    Col,
    Row,
    message,
    Checkbox,
    Alert,
    Button,
    Typography,
    Select,
    Collapse,
    Steps,
    Divider,
} from 'antd';
import React, { Component } from 'react';
import { Redirect, Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import _ from "lodash";
import Fab from '@material-ui/core/Fab';
import LocalShippingOutlinedIcon from '@material-ui/icons/LocalShippingOutlined';
import SendTwoToneIcon from '@material-ui/icons/SendTwoTone';
import ReceiptTwoToneIcon from '@material-ui/icons/ReceiptTwoTone';
import CardGiftcardTwoToneIcon from '@material-ui/icons/CardGiftcardTwoTone';
import AddIcon from '@material-ui/icons/Add';
import AddToQueueIcon from '@material-ui/icons/AddToQueue';
// import Radio from '@material-ui/core/Radio';


const { Panel } = Collapse;
const { Title, Text } = Typography;
const { Step } = Steps;

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
};

const payment_method = [
    { title: '余额支付', key: 'balance', Icon: undefined, content: '当前余额xxxx' },
    { title: 'Paypal', key: "paypal", Icon: undefined, content: "paypal information form" },
    { title: '信用卡', key: "credit", Icon: undefined, content: undefined },
]

class Payment_page extends React.Component {
    constructor(props) {
        super(props)
    }
    state = {
        active_key: ['balance'],
        checked: 'balance',
        disabled_method: ["credit"]
    }

    set_info = (data, step) => {
    }

    reset_info = (step) => {
    }

    get_payment_method = (method) => {


    }

    render() {
        return (
            <div >
                <Collapse
                    activeKey={this.state.active_key}
                    // accordion
                    // expandIcon={({ isActive }) => <span><Icon type="caret-left" rotate={isActive ? -90 : 0} /></span>}
                    // style={{ background: '#fff', }}
                    style={{ background: '#fff', boxShadow: 'rgb(217, 217, 217) 1px 1px 7px 0px', }}
                    // bordered={false}
                    // expandIconPosition="right"
                    // defaultActiveKey={['sender_information']}
                    ghost
                >

                    {payment_method.map(item =>
                        <Panel
                            key={item.key}
                            disabled={this.state.disabled_method.includes(item.key)}
                            style={{
                                // background: '#f7f7f7',
                                // background: '#fff',
                                // marginBottom: 12,
                                // marginBottom: 12,
                                // border: 0,
                                // overflow: 'hidden',
                            }}
                            header={
                                <div>
                                    <Radio
                                        disabled={this.state.disabled_method.includes(item.key)}
                                        style={{ display: 'inline', }}
                                        onChange={(e) => {
                                            let update_value = e.target.value
                                            this.setState({
                                                active_key: [update_value],
                                                checked: update_value
                                            })
                                        }}
                                        checked={this.state.checked == item.key}
                                        value={item.key}
                                    >
                                    </Radio>
                                    <Title
                                        style={{ display: 'inline', marginLeft: '8px', fontSize: '18px' }}
                                        level={4}
                                        type={this.state.disabled_method.includes(item.key) ? "secondary" : "strong"}
                                    >
                                        {item.title}
                                    </Title>
                                </div>}
                            showArrow={false}
                        // key={item.key}
                        >
                            <div style={{ border: "1px dashed rgb(232,232,232)", background: '#F8F8F8',  padding: " 16px 32px 16px 32px" }}>{item.content}</div>
                        </Panel>
                    )}
                </Collapse>


            </div>
        )
    }
}



export default Payment_page