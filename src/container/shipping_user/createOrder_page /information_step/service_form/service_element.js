import { Typography , Skeleton, Switch, Card, Avatar, Tag, Checkbox } from 'antd';
import React, { Component } from 'react';
import { Redirect, Router, Route, Link, NavLink } from 'react-router-dom';
import ShortUniqueId from 'short-unique-id';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import _ from "lodash";

const { Text} = Typography;
const uid = new ShortUniqueId();
const { Meta } = Card;
class My_service_card extends React.Component {
    state = {
        loading: true,
    };

    render() {
        const { loading } = this.props;
        const { image_src, check, service_name, zone, service_description, rate, tag } = this.props.service
        const description = `分区${zone}，${service_description}`
        // console.log(loading)
        return (
            <div>
                <Card
                    onClick={() => this.props.select(service_name)}
                    headStyle={{ background:'#F8F8F8' , height: 36 }}
                    hoverable={true}
                    size='small'
                    style={{ width: 300, border: "1px solid rgb(200,200,200)" }}
                    extra={loading ? undefined : tag}
                    title={loading ? undefined : <div style={{display: 'flex', justifyContent: 'space-between'}}><span> <Text style ={{fontSize: 12}} type="secondary"> {description} </Text></span> <span> <Text style ={{fontSize: 18, fontWeight :500  ,color :'black'}}>$ {rate}</Text></span> </div>}
                >
                    <Skeleton loading={loading} avatar active>
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
                                    style={{ textAlign :'right' }}>
                                    {/* <span style={{ paddingLeft: 12 }}>{description}</span> */}
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