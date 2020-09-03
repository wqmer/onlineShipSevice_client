import React, { Component, PropTypes } from 'react'
import { Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Icon as LegacyIcon } from '@ant-design/compatible';
import DemoSearchBar from '../../components/HeaderSearch'
import {
  Space,
  Drawer,
  Row,
  Statistic,
  BackTop,
  notification,
  Tabs,
  PageHeader,
  Input,
  Dropdown,
  Button,
  Avatar,
  Layout,
  Menu,
  Breadcrumb,
  Badge,
  Divider,
} from 'antd';
import Animate from 'rc-animate'
import Pusher from 'pusher-js';


// import HeaderSearch from 'ant-design-pro/lib/HeaderSearch';


import { Popconfirm, message } from 'antd';
import { ControlTwoTone, ControlOutlined, SearchOutlined } from '@ant-design/icons';

import Demo_avatar from '../../components/Avatar'
import Demo_notification from '../../components/Notification'
import Balance from '../../components/Balacne'
import Menu_top from '../../components/Menu_Top'
import InputWithoutBorder from '../../components/InputNoBorder'


// import draft_page from './draft_page'
import Order_page from './order_page'
import Client_page from './client_page'
import Dashboard_page from './dashborad_page'

import CreateOrder_page from './createOrder_page '
import rate_estimate_page from './rate_estimate_page'
import pagesSwitchRouter from '../../asset/home_page'
// import single_order_page from './single_order_page'
// import completed_order_page from './completed_order_page'
import tracking_page from './tracking_page'


import checkForm from './components/checkForm'
import test from './components/motion/QueueAnim'
import NotFound from '../../components/notFound'

import { actions } from '../../reducers/order'
import { actions as actions_user_order } from '../../reducers/shipping_platform/user/order'
import { actions as user_account_actions } from '../../reducers/shipping_platform/user'

import { Typography } from 'antd';

const { Title } = Typography;

const { Header, Sider, Content, Footer } = Layout;
const { SubMenu } = Menu;

const PUSHER_APP_KEY = 'a02e0dd4b8d8317e5b47';
const PUSHER_APP_CLUSTER = 'us3';

const siderWidth = 256
//  <Breadcrumb separator=">" style={{ margin: '64px 0px 0px',  boxShadow: '0 1px 10px rgba(0,21,41,.12)', padding: '16px 30px 24px', background: '#fff' }}>
//   <Breadcrumb.Item><a href="/user/order/draft">首页</a></Breadcrumb.Item>
//   {getParentName ? <Breadcrumb.Item><span>{getParentName}</span></Breadcrumb.Item> : undefined}
//   {getchildrenName ? <Breadcrumb.Item><span>{getchildrenName}</span></Breadcrumb.Item> : undefined}
// </Breadcrumb> 
const { Search } = Input;
const { TabPane } = Tabs;

const submenus = [

  { name: '创建运单', iconType: 'file-add', key: 'create', url: '/create', children: [{ url: '/single_order', iconType: "edit", name: '寄单件' }, { url: '/batch', iconType: "form", name: '传批量' }] },
  {
    name: '订单管理', iconType: 'database', key: 'order_log', url: '/order_log', children: [ { url: '/ready_to_ship', iconType: 'pushpin', name: '待处理' }, { url: '/completed', iconType: 'carry-out', name: '已完成' }, { iconType: 'exclamation-circle', url: '/problem', name: '问题单' }]
  },
  { name: '便捷工具', iconType: 'tool', key: 'tool', url: '/tool', children: [{ url: '/rate_estimate', iconType: 'calculator', name: '运费试算' }, { url: '/tracking', iconType: 'file-search', name: '轨迹查询' }] },
  { name: '店铺管理', iconType: 'shopping-cart', key: 'store', url: '/store', children: [{ url: '/amazon', iconType: 'amazon', name: '亚马逊' }] },
];

class user extends Component {
  container = React.createRef();
  constructor(props) {
    super(props);
    // this.eventSource = new EventSource("events");
    // this.test = this.test.bind(this);
    // this.eventSource = new EventSource("http://localhost:8081/api/forwarder/event");
  }

  state = {
    searching_value: '',
    childrenDrawer: false,
    visible: false,
    height: 64,
    searching_string: undefined,
    collapsed: false,
    header_hidden: false,
    processing: false,
  };


  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  changeHeight = () => {
    this.setState({
      height: 350,
    });
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }


  getKeyOfSubMenus = () => {
    var str = this.props.history.location.pathname.substring('/user/'.length) || '/' //  /seller/order/new   --->  order/new 
    var result = {
      parent: undefined,
      childern: []
    }
    let initial = 0
    for (var i = 0; i < str.length; i++) {
      if (str[i] == '/') {
        !result.parent ? result.parent = str.substring(initial, i) : result.childern.push(str.substring(initial, i))
        initial = i + 1;
      }
      if (str.lastIndexOf('/') == i && str.substring(initial, str.length)) {
        result.childern.push(str.substring(initial, str.length))
      }
    }
    return {
      Parent: result.parent,  //order/new   --> order
      Children: result.childern, //order/new   --> new 
      // 设置为0 表示如果有大于1个子类，都不继续向下映射 暂时只允许一个子类出现在面包屑中，防止对应边栏key和面包屑等不能对应问题。
      // LastChildOfUrl: '/' + result.childern[result.childern.length - 1]
      LastChildOfUrl: '/' + result.childern[0]
    }
  }

  offset = (count) => {
    //一位10（小于10），两位15（大于9，小于100），三位（大于999，小于10000）24，超四位（大于9999）27
    if (count < 10) {
      return 10
    } else if (count > 9 && count < 100) {
      return 15
    } else if (count > 99 & count < 1000) {
      return 19
    } else if (count > 999 && count < 10000) {
      return 24
    } else {
      return 27
    }
  }

  onRef = (ref) => {
    this.child = ref
  }

  handle_search = (value) => {
    value.length != 0 ? this.child.handle_search(value) : this.child.handle_clear_search()
    this.setState({ searching_value: value })
  }

  clear_search_bar = () => this.setState({ searching_value: '', })


  handleScroll = e => {
    if (e.srcElement.scrollingElement.scrollTop > 64 && this.state.header_hidden == false) {
      this.setState({ header_hidden: true })
    } else if (e.srcElement.scrollingElement.scrollTop <= 64 && this.state.header_hidden == true) {
      this.setState({ header_hidden: false })
    }
  }

  showSiderMenu = (parentRouter, menuItem) => {
    const { porcessing } = this.state
    const { history } = this.props
    //显示带菜单menu
    function display_menu(parentRouter, menuItem) {
      return (
        <Menu.Item
          key={menuItem.url}
          danger={menuItem.url == '/failed' ? true : false}
        >
          <Link to={`/user/${parentRouter}${menuItem.url}`} >
            <LegacyIcon type={porcessing && menuItem.iconType == "loading-3-quarters" ? "loading" : menuItem.iconType} />
            {menuItem.name}
          </Link>
          {/* <span  ><LegacyIcon type={porcessing && menuItem.iconType == "loading-3-quarters" ? "loading" : menuItem.iconType} />{menuItem.name}</span> */}
          {/* <Link to={`/user${parentRouter.url}${child.url}`}><Icon type={child.iconType} /><span>{child.name}</span></Link> */}
        </Menu.Item>
      );
    }
    //显示带有子菜单menu


    function display_submenu(parentRouter, menuItem) {
      return (
        <SubMenu
          key={menuItem.parent.key}
          title={<span><LegacyIcon type={menuItem.parent.iconType} /><span>{menuItem.parent.name}</span></span>}
        >
          {menuItem.parent.children.map((childMenuItem, index) => display_menu(menuItem.parent.url, childMenuItem))}
        </SubMenu>
      )
    }
    return menuItem.parent ? display_submenu(parentRouter, menuItem) : display_menu(parentRouter, menuItem)

    // pagesSwitchRouter('user').content.map((menuItem, index) => this.showSiderMenu(current_parent, menuItem))
  }

  display_submenu = (parent, child) => {
    return (
      <Menu.Item
        key={child.url}
      // onClick={() => this.props.history.push(`/user${parent.url}${child.url}`)} 
      >

        {/* <span>{child.name}</span> */}
        <Link to={`/user${parent.url}${child.url}`}><span>{child.name}</span></Link>

      </Menu.Item>
    );

  }

  componentDidMount() {
    this.props.user_auth()
    window.scrollTo(0, 0)
    // this.eventSource.onmessage = e => {
    //   let current = JSON.parse(e.data).processingOrder != 0
    //   if (this.state.processing != current) this.setState({ processing: current })
    // }

    // this.pusher = new Pusher('a02e0dd4b8d8317e5b47', { cluster: 'us3', useTLS: true, });
    // this.channel = this.pusher.subscribe("orders");
    // this.channel.bind("inserted", (data) => { console.log(data) });
    // console.log(this.channel)
    window.addEventListener('scroll', this.handleScroll.bind(this))
  }

  // componentWillMount() {
  //   console.log('i triggered by componentWillMount in homepage') 
  // }

  // componentDidUpdate() {
  //   this.props.user_auth()
  //   console.log('i triggered by componentDidUpdate in homepage') 
  // }

  componentWillUnmount() {
    // this.eventSource.close()
    // console.log('i triggered by componentWillUnmount in homepage') 
    window.removeEventListener('scroll', this.handleScroll);
  }

  test = () => {
    console.log('test toggle')
    // this.setState({ collapsed: true})
  }

  // componentWillUpdate(){
  //   console.log('i triggered by componentWillUpdate in homepage')
  // }

  render() {
    const { url } = this.props.match;
    const current_page = this.getKeyOfSubMenus().Children[0]
    const current_parent = this.getKeyOfSubMenus().Parent
    const childMapToName = (submenus) => {
      const children = submenus.find(i => i.key == current_parent).children
      const child = children.find(i => i.url == '/' + current_page)
      const chineseName = child?child.name : undefined
      return chineseName ? chineseName : '错误页404'
    }

    // console.log(this.props)
 

    // console.log('current_parent is ' + current_parent)  //http://localhost:8082/user/order/completed  => order
    // console.log('current_page is ' + current_page) //http://localhost:8082/user/order/completed  => completed 
    // console.log('childMapToName is ' + childMapToName(submenus) )//http://localhost:8082/user/order/completed  => completed => 已完成


    // console.log("parent is " + parent)
    // console.log('I am rendered')


    const get_order_count = this.props.order_count == undefined ? 0 : this.props.order_count[current_page]
    const show_number = get_order_count == undefined ? 0 : get_order_count

    const get_draft_count = this.props.order_count == undefined ? 0 : this.props.order_count.draft
    const get_ready_count = this.props.order_count == undefined ? 0 : this.props.order_count.ready_to_ship
    const get_completed_count = this.props.order_count == undefined ? 0 : this.props.order_count.completed


    const page_header_title = () => {
      let icon_type
      // 错误路由找不到对应资源
      // try {
      //   icon_type = page_content.find(item => item.name == childeren_name).iconType
      // } catch (error) {
      //   icon_type = undefined
      // }

      return (
        <div style={{ paddingTop: 16, marginLeft: '32px', }} >
          {/* <LegacyIcon style={{ marginRight: '8px' }} type={icon_type} />   */}
          <Title level={4} >{childMapToName(submenus)}</Title>
        </div>
      );
    }

    const page_header_footer = (parent) => {
      if (parent == 'order') {
        return (
          <div>
            <Tabs
              style={{ paddingLeft: 36, }}
              defaultActiveKey="1">
              <TabPane tab={"本土派送" + " (" + show_number + ")"} key="1" />
              <TabPane tab="跨境小包" key="2" disabled />
            </Tabs>
          </div>
        )
      }
    }

    const { logout } = this.props;
    return (
      <div>
        <BackTop visibilityHeight={800} />
        {/* <ControlTwoTone onClick = {() => console.log (123)} style={{ fontSize: '46px',  position: 'fixed', top: "23%", bottom: 0, right: -3, zIndex : 8}} /> */}
        {/* <Button
        // size ='large'
        type="primary"
        icon = {<ControlOutlined style={{ fontSize: '20px' }}/>}
        style={{ height: 48 , width: 48 , position: 'fixed', top: "15%", bottom: 0, right: 0, zIndex : 8}}
        /> */}


        <Layout style={{ minHeight: 1000 }}>
          <Sider
            style={{
              overflow: 'auto',
              // height: '100vh',
              // position: 'fixed',
              // borderColor: '#ddd',
              boxShadow: 'rgb(204, 204, 204) 0px 0px 10px',
              // boxShadow: '1px 1px 5px rgba(0,21,41,.1)',
              left: 0,
            }}
            theme="dark"
            trigger={null}
            // collapsible
            // onCollapse={this.onCollapse}
            collapsed={this.state.collapsed}
            width={siderWidth}
          >
            <div style={{ padding: "16px 16px 16px 16px", width: siderWidth, height: "64px", float: "left", }} />
            <Menu
              theme="dark"
              mode="inline"
              forceSubMenuRender={true}
              selectedKeys={[this.getKeyOfSubMenus().LastChildOfUrl]}
              defaultOpenKeys={[this.getKeyOfSubMenus().Parent]}
              style={{ paddingTop: 64, height: '100%', }}
            >

              {submenus.map((parent, index) =>
                <SubMenu key={parent.key}
                  title={<span><LegacyIcon type={parent.iconType} /><span>{parent.name}</span></span>}
                >
                  {parent.children.map((child, index) => this.display_submenu(parent, child))}
                </SubMenu>)
              }
            </Menu>
          </Sider>
          <Animate transitionName="fade">
            {!this.state.header_hidden ?
              <Header
                style={{
                  boxShadow: 'rgb(204, 204, 204) 0px 0px 10px',
                  height: '64px',
                  left: siderWidth,
                  // borderBottom: '1px solid rgb(235, 237, 240)',
                  position: 'fixed',
                  zIndex: 1,
                  width: '100%',
                  background: '#fff',
                  padding: 0,
                }}>

                {/* <LegacyIcon
                    className="trigger"
                    // style={{ lineHeight: '64px' }}
                    style={{ padding: "0 24px", fontSize: 21, cursor: 'pointer' }}
                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle}
                  /> */}

                {/* <Menu_top {...this.props} current_selected={current_parent} /> */}

                {page_header_title()}
                <div
                  style={{
                    textAlign: 'right',
                    // boxShadow: '0 1px 4px rgba(0,21,41,.12)',
                    display: 'inline-block',
                    position: 'fixed',
                    top: '0px',
                    right: '48px',
                    width: '800px',
                    height: '48px'
                  }}>
                    
                  {/* <Demo_search_bar_top /> */}
                  <Space align="baseline" size={1}>
                    {/* <InputWithoutBorder/> */}
                    <Balance value ={this.props.balance} />
                    <Demo_notification />
                    <Demo_avatar name = 'kimi' logout={() => logout()} />
                  </Space>
                </div>
              </Header> : null}
          </Animate>
          {/* <Layout style={{ background: '#fff', overflow: 'visible' }}>
            <Layout style={{ background: '#fff', marginTop: 64, }}> */}
          <Layout style={{ marginTop: 64 }}>
            <Content style={{ background: '#F8F8F8', overflow: 'scroll', minHeight: 800 }}>
              <Switch>
                <Route path={`${url}/create/single_order`}
                  render={(props) => (
                    <div style={{ padding: "48px", paddingTop: 16 }}>
                      <CreateOrder_page
                        collapsed={this.state.collapsed}
                        header_hidden={this.state.header_hidden}
                      />
                    </div>
                  )}
                />

                <Route path={`${url}/order_log`}
                  render={(props) => (
                    <div style={{ padding: "48px", paddingTop: 16 }}>
                      <Order_page
                        {...props}
                        header_hidden={this.state.header_hidden}
                        onRef={this.onRef}
                        handle_search={(value) => this.handle_search(value)}
                        clear_search_bar={() => this.clear_search_bar()}
                      />
                    </div>
                  )}
                />
                {/* <Route path={`${url}/tool/rate_estimate`} component={rate_estimate_page} />
                  <Route path={`${url}/tool/tracking`} component={tracking_page} /> */}
                <Route component={NotFound} />
              </Switch>
            </Content>
          </Layout>
        </Layout>

        {/* <Footer style={{ textAlign: 'center' }}>
              SmartShip LLC ©2019 Created by Kimmy Wang
            </Footer> */}
        {/* </Layout>
        </Layout> */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  // console.log(state)
  return {
    balance : state.shipping_platform_user.account.user_info.balance,
    status_code: state.globalState.status_code,
    message: state.globalState.message,
    // order: state.shipping_platform_user.order.result,
    isFetching: state.globalState.isFetching,
    // order_count: state.shipping_platform_user.order.count
  }
}

function mapDispatchToProps(dispatch) {
  return {
    logout: bindActionCreators(user_account_actions.get_logout, dispatch),
    // get_all_order: bindActionCreators(actions_user_order.get_all_order, dispatch),
    // get_order_count: bindActionCreators(actions_user_order.get_order_count, dispatch),
    user_auth : bindActionCreators(user_account_actions.user_auth, dispatch),

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(user)

