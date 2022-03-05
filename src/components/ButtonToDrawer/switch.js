import { message, Modal, Form, Button, Switch, Space } from "antd";
import React, { useState, useEffect } from "react";
import { get, post, put } from "../../util/fetch";
import { EditFilled, PlusOutlined, DeleteFilled } from "@ant-design/icons";

const CustomerSwitch = ({
  checked,
  service_id,
  carrier_id,
  type,
  mail_class,
  addService,
  description,
  agent,
  // isDisabled,
}) => {
  const [loading, setLoading] = useState(false);
  const [isChecked, setCheck] = useState(checked);
  return (
    <Switch
      size="small"
      checked={isChecked}
      loading={loading}
      // disabled={isDisabled}
      onChange={async (checked) => {
        try {
          let result;
          setLoading(true);
          if (agent == "Smartship") {
            result = await put("/user/enable_service", {
              _id: service_id,
              action: checked ? "enable" : "disable",
            });
          } else {
            result = service_id
              ? await put("/user/update_service", {
                  _id: service_id,
                  status: checked ? "activated" : "unactivated",
                })
              : await post("/user/add_service", {
                  carrier: carrier_id,
                  mail_class,
                  type,
                  description,
                });
          }
          if (result.code == 0) {
            if (result.data._id) addService(result.data); //put back to parent
            setCheck(checked);
          }
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.log(error);
        }
      }}
    />
  );
};

export default CustomerSwitch;
