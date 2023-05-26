import { Button, DatePicker, Form, Input, Select, message } from "antd";
import { useState } from "react";
import TableUser from "./Table";
const { Option } = Select;
import axios from "axios";
const App = () => {
  const [form] = Form.useForm();
  const [toggle, setToggle] = useState(false);

  const onFinish = (values) => {
    console.log(values);
    values.createTime = new Date(values.createTime);
    values.createTime = values.createTime
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    axios
      .post("http://localhost:2002/users", values)
      .then((respone) => {
        message.success("Thêm mới thành công");
        form.resetFields();
        setToggle(!toggle);
      })
      .catch((error) => {
        console.error("Error adding note:", error);
        message.error("Failed to add note. Please try again later.");
      });
  };

  return (
    <>
      <Form
        form={form}
        name="customized_form_controls"
        layout="inline"
        onFinish={onFinish}
      >
        <Form.Item
          name="coure"
          rules={[
            {
              required: true,
              message: "Please enter the course",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="createTime"
          rules={[
            {
              required: true,
              message: "Please enter the course",
            },
          ]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="status"
          label="Select"
          rules={[
            {
              required: true,
              message: "Please enter the course",
            },
          ]}
        >
          <Select placeholder="Select an option" style={{ width: 200 }}>
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="fulfill">Fulfill</Select.Option>
            <Select.Option value="reject">Reject</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="nameUser"
          rules={[
            {
              required: true,
              message: "Please enter the course",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <TableUser toggle={toggle} />
    </>
  );
};
export default App;
