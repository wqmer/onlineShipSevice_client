import { Skeleton, Switch, Card, Avatar, Tag, Checkbox } from 'antd';
import React, { Component } from 'react';
import { Redirect, Router, Route, Link, NavLink } from 'react-router-dom';
import _ from "lodash";
import ShortUniqueId from 'short-unique-id';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
const uid = new ShortUniqueId();


const { Meta } = Card;

class Payment_element extends React.Component {
    state = {
        loading: false,
    };

    render() {
        const { loading } = this.state;
        const { image_src, check, service_name, service_description, rate, tag } = this.props.service

        return (
            <div>
                    <Skeleton loading={this.state.loading} avatar active>
          
                    </Skeleton>
            </div>
        );
    }
}


export default My_service_card