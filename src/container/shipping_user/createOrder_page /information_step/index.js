
import Icon, { CaretLeftOutlined } from '@ant-design/icons';
import {
    Drawer,
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
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as single_order_form } from '../../../../reducers/shipping_platform/single_order_form'
// import {SendTwoTone} from '@material-ui/icons'
// import CardGiftcardTwoToneIcon from '@material-ui/icons/CardGiftcardTwoTone'
import _ from "lodash";
import Fab from '@material-ui/core/Fab';
import LocalShippingOutlinedIcon from '@material-ui/icons/LocalShippingOutlined';
import SendTwoToneIcon from '@material-ui/icons/SendTwoTone';
import ReceiptTwoToneIcon from '@material-ui/icons/ReceiptTwoTone';
import CardGiftcardTwoToneIcon from '@material-ui/icons/CardGiftcardTwoTone';
import AddIcon from '@material-ui/icons/Add';
import AddToQueueIcon from '@material-ui/icons/AddToQueue';
import Sender_address_form from './sender_address_form'
import Receipant_address_form from './receipant_address_form'
import Parcel_form from './parcel_form'
import Service_form from './service_form'

const { Panel } = Collapse;
const { Text } = Typography;
const { Step } = Steps;

const form_content = (component) => {
    return ([
        {
            key: 'sender_information',
            label: '发件信息',
            Icon: <SendTwoToneIcon />,
            form: <Sender_address_form
                profile='sender_information'
                reset_info={step => component.reset_info(step)}
                get_title={(step) => component.set_title(step)}
            />
        },
        {
            key: 'receipant_information',
            label: '收件信息',
            Icon: <ReceiptTwoToneIcon />,
            form: <Receipant_address_form
                profile='receipant_information'
                reset_info={step => component.reset_info(step)}
                get_info={(data, step) => component.set_info(data, step)} />
        },
        {
            key: 'parcel_information',
            label: '包裹信息',
            Icon: <CardGiftcardTwoToneIcon />,
            form: <Parcel_form
                get_info={(data, step) => component.set_info(data, step)}
                delete_info_parcel={(id_no) => component.delete_info_parcel(id_no)}
            />
        },
        {
            key: 'service_information',
            label: '选择渠道',
            Icon: <LocalShippingOutlinedIcon />,
            form: <Service_form
                is_all_set={() => component.is_all_set()}
                postBill={(rate) => component.postBill(rate)}
            // get_info={(data, step) => component.set_info(data, step)}
            // delete_info_parcel={(id_no) => component.delete_info_parcel(id_no)}
            />
        }
    ]
    )
}
const Sender = () => (
    <svg t="1578568585168" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2803" width="24" height="24"><path d="M 699 213.55 L 513.55 90.07 a 9.39 9.39 0 0 0 -10.39 0 L 317.73 213.55 a 9.35 9.35 0 0 0 5.2 17.13 h 68.35 V 459 a 28.28 28.28 0 0 0 28.1 28.44 h 178 A 28.28 28.28 0 0 0 625.43 459 V 230.68 h 68.35 a 9.35 9.35 0 0 0 5.22 -17.13 Z m -148.5 17.13 V 413.6 h -84.29 V 204.08 a 9.36 9.36 0 0 1 3.89 -7.59 l 33.71 -24.25 a 7.53 7.53 0 0 1 8.74 0 l 34 24.27 a 9.36 9.36 0 0 1 3.92 7.61 Z" fill="#1296db" p-id="2804"></path><path d="M 893.09 593.4 L 834.5 310.23 a 37.15 37.15 0 0 0 -7.27 -17.11 c -0.14 -0.19 -0.28 -0.37 -0.43 -0.55 l -0.59 -0.73 c -0.28 -0.34 -0.58 -0.68 -0.88 -1 l -0.19 -0.23 a 37.07 37.07 0 0 0 -27.53 -12.21 h -105 a 37.46 37.46 0 0 0 -37.46 37.46 a 37.46 37.46 0 0 0 37.46 37.46 h 74.85 l 44.87 216.88 H 692.52 a 38.81 38.81 0 0 0 -30.87 15.65 l -56.75 80.49 H 419.32 l -56.81 -80.5 a 39.11 39.11 0 0 0 -31 -15.62 H 212.39 l 44.16 -217 h 73.9 a 37.47 37.47 0 0 0 37.47 -37.46 a 37.47 37.47 0 0 0 -37.47 -37.46 H 229.66 a 37.66 37.66 0 0 0 -40.75 29.53 l -58.22 286.1 a 37.09 37.09 0 0 0 -1.69 22.26 l 70.1 290.21 a 37.82 37.82 0 0 0 42.63 28.6 l 542 0.22 a 37.82 37.82 0 0 0 41.21 -28.83 L 895 616.21 a 37 37 0 0 0 -1.91 -22.81 Z m -135.2 267.11 l -491.82 -0.2 l -52 -215.14 h 98.8303 l 53.94 76.43 a 37.43 37.43 0 0 0 33 19.69 h 224.7 A 37.45 37.45 0 0 0 658 720.71 l 53.27 -75.54 h 98.6297 Z" fill="#108ee9" p-id="2805"></path></svg>
);

const Recepiant = () => (
    <svg t="1578569888016" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="936" width="24" height="24"><path d="M879.098 877.875H146.807c-81.365 0-81.366-81.365-81.366-81.365V511.73l203.414-366.146H757.05L960.464 511.73v284.78c0 81.366-81.366 81.365-81.366 81.365zM716.367 226.95H309.538l-142.39 284.78h183.073s81.366 0 81.366 81.366v40.683h162.731v-40.683s0-81.366 81.366-81.366h183.073l-142.39-284.78z m162.731 366.145H685.493c-5.696 10.679-9.809 23.543-9.809 40.683 0 81.366-81.366 81.366-81.366 81.366H431.587s-81.366 0-81.366-81.366c0-17.14-4.113-30.004-9.809-40.683H146.807V796.51h732.291V593.095zM329.88 389.681h366.146l20.341 40.683H309.538l20.342-40.683z m40.683-81.366h284.78l20.341 40.683H350.221l20.342-40.683z" p-id="937" fill="#8a8a8a"></path></svg>
)

const MyFirstIcon = props => <Icon component={Sender} {...props} />;

const RecepiantIcon = props => <Icon component={Recepiant} {...props} />

const display_parcel_title = (data) => {
    let content = undefined
    if (data.length > 1) {
        let total_weight = data.reduce((accumulator, currentValue) => {
            return (accumulator + Number(currentValue.weight))
        }, 0)
        // console.log(total_weight)
        content = `当前录入${data.length}个包裹，总重量${total_weight}`
    } else {
        content = `当前录入1个包裹， 重量: ${data[0].weight}，尺寸：${data[0].length} x ${data[0].width} x ${data[0].height}`
    }
    return content
}

class Information_page extends React.Component {
    constructor(props) {
        super(props)
    }

    state = {
         setting : { ...this.props.setting}
    }

    postBill = (rate) => this.props.postBill(rate)

    reset_info = (step) => {
        let reset_data = {}
        reset_data[step] = {}
        reset_data[step + '_title'] = '未完成'
        // this.setState({ ...reset_data })
    }

    delete_info_parcel = (id_no) => {
        let update_data = this.state.parcel_information.filter(item => item.id_no != id_no)
        let updata_title = display_parcel_title(update_data)
        this.setState({ parcel_information: update_data, parcel_information_title: updata_title })
    }

    service_panel_status = () => {
        let obj = {}
        const is_all_set = this.props.sender_information.is_ready && this.props.receipant_information.is_ready && this.props.parcel_information.is_ready
        //如果前面信息都好了 就显示服务面板，否则显示默认信息
        if (is_all_set) {
            //选择渠道后 选用渠道名作为 panel title ，否则用 钱选择渠道
            if (this.props.service_information.is_select) {
                obj.font_type = 'strong'
                obj.title = this.props.service_information.panel_title
            } else {
                obj.font_type = 'warning'
                obj.title = '请选择渠道'
            }
        } else {
            //如果信息不完整且面服务面板处于打开状态，就强制关闭
            obj.font_type = "secondary"
            obj.title = '请先完成输入信息'
        }
        return obj
    }

    is_all_set = () => this.props.sender_information.is_ready && this.props.receipant_information.is_ready && this.props.parcel_information.is_ready

    is_required_recalculate = () => { }

    componentDidMount = () => this.props.get_form_info()

    // shouldComponentUpdate(nextProps, nextState) {
    //     const current_form = this.props.setting
    //     const next_form = nextProps.setting
    //     console.log('crrent is ' + JSON.stringify(current_form))
    //     console.log('next is ' + JSON.stringify(next_form))
    //     if(_.isEqual(current_form ,next_form)) return false
    //     return true
    // }
    

    render() {
        // console.log(this.state.setting.open_panel)
        // console.log('infomation step did renedered')
        const is_all_set = this.props.sender_information.is_ready && this.props.receipant_information.is_ready && this.props.parcel_information.is_ready
        // const is_all_set = true
        const getStyle = (key) => {
            if (key == "parcel_information" || key == "service_information") {
                return ({ padding: " 16px 32px 16px 32px" })
            } else {
                return ({ border: "1px dashed rgb(232,232,232)", background: '#F8F8F8', padding: " 16px 32px 16px 32px" })
            }
        }

        return (
            <Collapse
                expandIcon={({ isActive }) => <span><CaretLeftOutlined rotate={isActive ? -90 : 0} /></span>}
                // destroyInactivePanel = {true}
                style={{ padding: 0, background: '#fff', boxShadow: 'rgb(217, 217, 217) 1px 1px 7px 0px', }}
                // style={{   background: '#fff', }}
                // bordered={false}

                // --------------------------------------------todo 默认展开key的逻辑。表格完成后的字体改变。 完成service的可选逻辑 ， 完成包裹信息的输入部分
                expandIconPosition="right"
                activeKey={this.props.setting.open_panel}
                // activeKey={this.state.setting.open_panel}
                // defaultActiveKey={this.props.setting.open_panel}
                onChange={(e) => {
                    // console.log(e)
                    let obj = { setting: {} }
                    obj['setting']['open_panel'] = e
                    // this.setState({ ...obj })
                    this.props.update_form_info(obj)         
                }}
                ghost
            >
                {form_content(this).map((item, index) =>
                    <Panel
                        forceRender = {item.key != 'service_information' }
                        disabled={item.key == 'service_information' && !is_all_set}
                        style={{

                            background: '#fff',
                            // marginBottom: 12,
                            // marginBottom: 12,
                            // border: 0,
                            // background: '#F8F8F8',
                            overflow: 'hidden',
                            // padding:0
                            // border:"1px solid black",
                        }}
                        header={
                            <div>
                                <Steps size="small" status='wait' initial={0} >
                                    <Step
                                        status={item.key == 'service_information' && !is_all_set ? "wait" : "process"}
                                        icon={item.Icon}
                                        title={
                                            <span style={{ fontSize: '17px', fontWeight: 500 }}> {item.label}
                                                <span >
                                                    <Text
                                                        disabled={item.key == 'service_information' && !is_all_set ? true : false}
                                                        style={{ marginLeft: 12, fontSize: '12px', fontWeight: 500 }}
                                                        strong
                                                        // keyboard
                                                        type={item.key == 'service_information' ? this.service_panel_status().font_type : this.props[`${item.key}`]['font_type']}
                                                    // strong = {item.key == 'service_information'? is_all_set == true : this.props[`${item.key}`]['font_type'] == 'strong'}
                                                    // strong

                                                    >
                                                        {item.key == 'service_information' ? this.service_panel_status().title : this.props[`${item.key}`]['panel_title']}

                                                    </Text>
                                                </span>
                                            </span>} />
                                </Steps>
                            </div>}
                        showArrow={true}
                        key={item.key}
                    >
                        <div
                            style={getStyle(item.key)}
                        // style={item.key == 'parcel_information' || item.key == 'service_information' ? { padding: " 16px 32px 16px 32px" } : { border: "1px dashed rgb(232,232,232)", background: '#F8F8F8', padding: " 16px 32px 16px 32px" } }
                        >{item.form}</div>
                    </Panel>
                )}
            </Collapse>
        );
    }
}

function mapStateToProps(state) {
    // console.log(state)
    return {
        // form: state.shipping_platform_single_order.form,
        sender_information: state.shipping_platform_single_order.form.sender_information,
        receipant_information: state.shipping_platform_single_order.form.receipant_information,
        parcel_information: state.shipping_platform_single_order.form.parcel_information,
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
)(Information_page)