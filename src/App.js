import React, { useState } from "react";
import { Tabs, Button, Form, Input, Select, Space, Card } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import "./App.css";

const { TabPane } = Tabs;
const { Option } = Select;

const initialData = [
  {
    id: "1",
    name: "field1",
    type: "string",
    value: "",
  },
];

const App = () => {
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState("1");

  const generateJSON = () => {
    const buildObject = (items) => {
      const result = {};
      items.forEach((item) => {
        if (item.type === "nested" && item.children) {
          result[item.name] = buildObject(item.children);
        } else {
          result[item.name] = item.type === "number" ? 0 : "";
        }
      });
      return result;
    };

    return JSON.stringify(buildObject(data), null, 2);
  };

  const handleNameChange = (id, value) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: value } : item))
    );
  };

  const handleTypeChange = (id, value) => {
    if (value === "nested") {
      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, type: value, children: [] } : item
        )
      );
    } else {
      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, type: value, children: undefined } : item
        )
      );
    }
  };

  const addField = (parentId = null) => {
    const newField = {
      id: Date.now().toString(),
      name: "newField",
      type: "string",
      value: "",
    };

    if (parentId) {
      setData((prev) =>
        prev.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              children: [...(item.children || []), newField],
            };
          }
          return item;
        })
      );
    } else {
      setData((prev) => [...prev, newField]);
    }
  };

  const deleteField = (id, parentId = null) => {
    if (parentId) {
      setData((prev) =>
        prev.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              children: item.children.filter((child) => child.id !== id),
            };
          }
          return item;
        })
      );
    } else {
      setData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const renderFields = (fields, parentId = null) => {
    return fields.map((field) => (
      <div key={field.id} className="field-container">
        <Card className="field-card">
          <Space>
            <Form.Item>
              <Input
                value={field.name}
                onChange={(e) => handleNameChange(field.id, e.target.value)}
                placeholder="Field name"
              />
            </Form.Item>
            <Form.Item>
              <Select
                value={field.type}
                style={{ width: 120 }}
                onChange={(value) => handleTypeChange(field.id, value)}
              >
                <Option value="string">String</Option>
                <Option value="number">Number</Option>
                <Option value="nested">Nested</Option>
              </Select>
            </Form.Item>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() =>
                addField(field.type === "nested" ? field.id : null)
              }
            />
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => deleteField(field.id, parentId)}
            />
          </Space>
        </Card>
        {field.type === "nested" && field.children && (
          <div className="nested-fields">
            {renderFields(field.children, field.id)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="app-container">
      <h1>JSON Schema Builder</h1>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Builder" key="1">
          <div className="builder-container">
            {renderFields(data)}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => addField()}
              style={{ marginTop: 16 }}
            >
              Add Field
            </Button>
          </div>
        </TabPane>
        <TabPane tab="JSON" key="2">
          <pre className="json-preview">{generateJSON()}</pre>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default App;
