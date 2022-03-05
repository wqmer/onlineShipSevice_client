import { message, Modal, Form, Button, Switch, Space } from "antd";
import React, { useState, useEffect } from "react";
import { get, post, put } from "../../util/fetch";
import { EditFilled, PlusOutlined, DeleteFilled } from "@ant-design/icons";

const CustomerSwitch = ({ status, _id, agent, isInActivatedGroup }) => {
  const [loading, setLoading] = useState(false);
  const [status_a, setStatus] = useState(status);
  const [status_b, setAcitavedGroup] = useState(isInActivatedGroup);
  return (
    <Switch
      size="small"
      // checkedChildren="启用"
      // unCheckedChildren="停用"
      checked={agent == "Smartship" ? status_b : status_a == "activated"}
      loading={loading}
      onChange={async (checked) => {
        try {
          setLoading(true);
          let result = await put("/user/update_carrier_status", {
            _id,
            status: checked ? "activated" : "unactivated",
            agent,
          });
          if (result.code == 0) {
            agent == "Smartship"
              ? setAcitavedGroup(checked ? true : false)
              : setStatus(checked ? "activated" : "unactivated");
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
