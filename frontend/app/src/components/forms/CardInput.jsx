import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

const CardInput = ({
  title,
  name,
  value,
  setValue,
  placeholder,
  type = "text",
  error,
  ...extra
}) => {
  return (
    <Card bg="dark" className="m-2">
      <Card.Header className="fg-white mb-0">{title}</Card.Header>
      <Form.Control
        onChange={setValue}
        name={name}
        defaultValue={value}
        className="card-input bg-secondary"
        placeholder={placeholder}
        type={type}
        isInvalid={error}
        {...extra}
      />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Card>
  );
};

export default CardInput;
