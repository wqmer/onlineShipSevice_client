import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { Popconfirm, message } from 'antd';
import Login from "../../../components/Login/loginForm";
import { Logined } from "../../../components/Logined";
import { actions as user_account_actions } from '../../../reducers/shipping_platform/user'

class UserLogin extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { login, register } = this.props;
        return (
            <div className='login'>
                {this.props.user_info.user_id ? <Logined history={this.props.history} user_info={this.props.user_info} />
                    : <Login login={(data) => login(data)}
                    />}
            </div>
        )
    }
    componentDidMount() {
        this.props.auth()
    }
}

function mapStateToProps(state) {
    return {
        status_code: state.globalState.status_code,
        user_info: state.shipping_platform_user.account.user_info
    }
}

function mapDispatchToProps(dispatch) {
    return {
        login: bindActionCreators(user_account_actions.get_login, dispatch),
        auth: bindActionCreators(user_account_actions.user_auth, dispatch),
        // register: bindActionCreators(IndexActions.get_register, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserLogin)