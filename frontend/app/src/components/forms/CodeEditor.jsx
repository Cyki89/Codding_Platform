import { dracula } from "@uiw/codemirror-theme-dracula";

import CodeMirror from "@uiw/react-codemirror";

import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

const CodeEditor = ({
  title,
  extension,
  name,
  value,
  setValue,
  height,
  error,
}) => {
  return (
    <Card bg="dark" className="m-2">
      <Card.Header className="fg-white mb-0">{title}</Card.Header>
      <CodeMirror
        value={value}
        height={error ? `${height - 40}px` : `${height}px`}
        theme={dracula}
        onChange={(val) => setValue(name, val)}
        extensions={[extension()]}
        className={error ? "form-control is-invalid" : ""}
      />
      <Form.Control.Feedback type="invalid" className="display-block">
        {error}
      </Form.Control.Feedback>
    </Card>
  );
};

export default CodeEditor;
