import { Skeleton, Switch, Card, Avatar, Tag, Checkbox } from 'antd';
import React, { Component } from 'react';
import { Redirect, Router, Route, Link, NavLink } from 'react-router-dom';
import _ from "lodash";
import ShortUniqueId from 'short-unique-id';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
const uid = new ShortUniqueId();

const { Meta } = Card;
class My_service_card extends React.Component {
    state = {
        loading: false,
    };

    render() {
        const { loading } = this.state;
        const { image_src, check, service_name, service_description, rate, tag } = this.props.service

        return (
            <div>
                <Card
                    onClick={() => this.props.select(service_name)}
                    headStyle={{ height: 16 }}
                    hoverable={true}
                    size='small'
                    style={{ width: 250 , border:"1px solid rgb(200,200,200)"}}
                    extra={this.state.loading ? undefined : tag}
                    title={this.state.loading ? undefined : <span style={{ paddingLeft: 12 }}>折扣价：$ {rate} </span>}
                >
                    <Skeleton loading={this.state.loading} avatar active>
                        <Meta
                            title={
                                <span style={{ paddingLeft: 12 }}>
                                    <Avatar
                                        shape="square"
                                        size={56}
                                        src={image_src}
                                    />
                                    <span style={{ marginLeft: 16 }}>{service_name}</span>
                                </span>}
                            description={
                                <div
                                    style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ paddingLeft: 12 }}>{service_description}</span>
                                    <Checkbox
                                        style={{ paddingRight: 12 }}
                                        checked={this.props.check}
                                    />
                                </div>}
                        />
                    </Skeleton>
                </Card>
            </div>
        );
    }
}


export default My_service_card