import { message, Modal, Form, Button } from "antd";
import React, { useState } from "react";
import CarrierForm from "./CarrierForm";
import { get, post } from "../../util/fetch";
import { EditFilled, PlusOutlined, DeleteFilled } from "@ant-design/icons";

const asset = {
  add: {
    title: "添加服务",
    text1: "添加成功",
    button: <PlusOutlined />,
  },
  edit: {
    title: "修改服务",
    text1: "编辑成功",
    button: <EditFilled />,
  },
};

const CollectionCreateForm = ({
  content,
  action,
  confirmLoading,
  visible,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      getContainer={() => document.getElementById("Page")}
      maskClosable={false}
      visible={visible}
      destroyOnClose={true}
      bodyStyle={{ height: 400 }}
      width={1000}
      title={asset[action]["title"]} // to fill
      cancelText="Cancel"
      confirmLoading={confirmLoading}
      destroyOnClose={true}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onCreate(values);
            // form.resetFields()
          })
          .then(() => setTimeout(() => form.resetFields(), 1000))
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      {action == "edit" ? (
        <CarrierForm
          action={action}
          form={form}
          content={{
            id: content._id,
            ...content.asset.account_information,
            nick_name: content.asset.nick_name,
            type: content.type,
          }}
        />
      ) : (
        <CarrierForm action={action} form={form} />
      )}
    </Modal>
  );
};

const CollectionsPage = (props) => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setLoading] = useState(false);

  const onCreate = async (values) => {
    //这里加入服务器的api请求处理，并异步处理返回，关闭对话框
    let { type, nick_name, ...rest } = values; //表格数据

    try {
      setLoading(true);

      let requestBody = {
        type,
        asset: {
          account_information: {
            ...rest,
          },
          nick_name,
        },
      };

      // console.log(requestBody);

      if (props.action == "edit") {
        let { _id, asset } = props.content; //上层传入

        requestBody = {
          _id,
          type,
          asset: {
            ...asset,
            account_information: {
              ...asset.account_information,
              ...rest,
            },
            nick_name,
          },
        };
      }
      let result = await post(props.url, requestBody);
      //   console.log(result)
      if (result.code == 0) {
        setLoading(false);
        setVisible(false);
        setTimeout(() => message.success(asset[props.action]["text1"]), 500);
      } else {
        setTimeout(() => message.error(result.message, 500));
      }
    } catch (error) {
      setTimeout(() => message.error("error happened !", 500));
      console.log(error);
    } finally {
      setTimeout(() => props.tirggleFetchingData(), 100);
    }
    // console.log('Received values of form: ', values);
  };

  return (
    <div>
      <Button
        type="primary"
        // disabled
        disabled = {props.isDisabled}
        shape={props.buttonShape ? props.buttonShape : "circle"}
        onClick={() => {
          setVisible(true);
        }}
        icon={asset[props.action]["button"]}
      />
      <CollectionCreateForm
        action={props.action}
        content={props.content}
        confirmLoading={confirmLoading}
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </div>
  );
};

export default CollectionsPage;
