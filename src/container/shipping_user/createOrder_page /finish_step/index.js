import { PrinterOutlined, RollbackOutlined, SmileTwoTone } from '@ant-design/icons';
import { Result, Button } from 'antd';
import React, { Component } from 'react';
import { Redirect, Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import ReactToPrint from "react-to-print";
import { PDFViewer, Image, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Img from 'react-image'


const styles = StyleSheet.create({
    page: {
        // flexDirection: 'row',
        // backgroundColor: '#E4E4E4'
    },
    box: { width: '100%', marginBottom: 30, borderRadius: 5 },
    pageNumbers: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        textAlign: 'center'
    },
});


const MyDocument = () => (
    <Document title='测试label'>
        <Page wrap style={styles.page}>
            <View key='1' style={styles.box}>
                <Image
                    key='23'
                    // style={styles.image}
                    src="/test.png"
                />
            </View>
            <View key='2' style={styles.box}>
                <Image
                    key='12'
                    // style={styles.image}
                    src="/test.png"
                />
            </View>
            <Text style={styles.pageNumbers} render={({ pageNumber, totalPages }) => (
                `${pageNumber} / ${totalPages}`
            )} fixed />
        </Page>
    </Document>
)

class ComponentToPrint extends React.Component {
    render() {
        return (
            <PDFViewer width={400} height={600}>
                <MyDocument />
            </PDFViewer>
        );
    }
}

class ComponentToPrint_alt extends React.Component {
    render() {
        return (
            <div>
                <Img
                    width={400}
                    height={580}
                    src={[
                        '/test.png',
                    ]}
                />
            </div>
        );
    }
}




class Finish_step extends Component {
    constructor(props) {
        super(props);
    }

    state = { loading: false }

    // componentWillUnmount(){
    //     this.props.reset()
    // }


    render() {
        // const { url } = this.props.match;

        return (
            <div>
                <Result
                    icon={<SmileTwoTone />}
                    title="订单完成"
                    subTitle={<span>系统订单号为xxxxxxxx，总运费为10.23 usd 。 由FedDex提供运输服务。点击按钮直接打印pdf 或在<a>已完成</a>中查看 </span>}
                    extra={[

                        <ReactToPrint
                            key="console"
                            onBeforeGetContent ={() =>this.setState({ loading: true }) }
                            onAfterPrint ={() =>this.setState({ loading: false }) }
                            trigger={() =>
                                <Button
                                    // onClick={() => this.setState({ loading: true })}
                                    loading={this.state.loading}
                                    icon={<PrinterOutlined />}
                                    type="primary"
                                    key="console">
                                    打印运单
                                </Button>

                            }
                            content={() => this.componentRef}
                        />,
                        <Button
                            icon={<RollbackOutlined />}
                            onClick={() => {
                                this.props.reset()
                            }}
                            key="buy">继续创建
                        </Button>
                    ]}
                />
                {/* <ComponentToPrint ref={el => (this.componentRef = el)} /> */}
                <div hidden> <ComponentToPrint_alt ref={el => (this.componentRef = el)} /> </div>

                {/* <PDFViewer ref={el => (this.componentRef = el)} width={400} height={600}>
                    <MyDocument />
                </PDFViewer> */}
            </div>
        );
    }
}
export default Finish_step