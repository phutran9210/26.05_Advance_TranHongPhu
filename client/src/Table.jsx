import {
  Form,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Input,
  message,
} from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
const originData = [];
for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
    name: `Edward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const TableUser = ({ toggle }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record) => record.key === editingKey;

  useEffect(() => {
    console.log("running");
    axios
      .get("http://localhost:2002/users")
      .then((response) => {
        if (Array.isArray(response.data)) {
          if (response.data.length === 0) {
            message.info("No task to display");
          } else {
            const dataWithKey = response.data.map((item) => ({
              ...item,
              key: item.userID.toString(),
            }));
            setData(dataWithKey);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
        message.error("Failed to fetch notes from server");
      });
  }, [toggle]);
  console.log(data);
  const edit = (record) => {
    form.setFieldsValue({
      userID: "",
      coure: "",
      nameUser: "",
      createTime: "",
      status: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    console.log(key);
    try {
      const row = await form.validateFields();
      const newData = [...data];
      console.log(newData);
      const index = newData.findIndex(
        (item) => String(key) === String(item.userID)
      );

      console.log(index);
      if (index > -1) {
        const item = newData[index];
        console.log("item là ", item);
        newData.splice(index, 1, { ...item, ...row });

        axios
          .put(`http://localhost:2002/users/${key}`, row)
          .then((response) => {
            setData(newData);
            setEditingKey("");
          })
          .catch((error) => {
            console.error("Error updating note:", error);
            message.error("Failed to update note. Please try again later.");
          });
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const deleteRecord = (key) => {
    axios
      .delete(`http://localhost:2002/users/${key}`)
      .then((response) => {
        const newData = data.filter((item) => item.key !== key);
        setData(newData);
        message.success("Record deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting note:", error);
        message.error("Failed to delete note. Please try again later.");
      });
  };

  const columns = [
    {
      title: "User ID",
      dataIndex: "userID",
      width: "10%",
      editable: false, // User ID should not be editable
    },
    {
      title: "Course",
      dataIndex: "coure",
      width: "20%",
      editable: true,
    },
    {
      title: "User Name",
      dataIndex: "nameUser",
      width: "20%",
      editable: true,
    },
    {
      title: "Create Time",
      dataIndex: "createTime",
      width: "25%",
      editable: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "15%",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
              style={{
                marginRight: 8,
              }}
            >
              Edit
            </Typography.Link>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => deleteRecord(record.key)} // Change to call deleteRecord function
            >
              <a>Delete</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};
export default TableUser;
