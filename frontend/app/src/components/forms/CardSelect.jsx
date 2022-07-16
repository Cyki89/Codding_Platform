import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

const CardSelect = ({ title, name, value, setValue, options, error }) => {
  return (
    <Card bg="dark" className="m-2">
      <Card.Header className="fg-white mb-0">{title}</Card.Header>
      <Form.Select
        className="card-input bg-secondary"
        name={name}
        value={value}
        onChange={setValue}
        isInvalid={error}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Card>
  );
};

export default CardSelect;
