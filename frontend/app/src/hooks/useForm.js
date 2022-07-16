import { useState } from "react";

function useForm(initial_values = {}) {
  const [data, setData] = useState(() => initial_values);

  const handleInputChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleEditorChange = (name, value) => {
    setData({ ...data, [name]: value });
  };

  return [data, handleInputChange, handleEditorChange];
}

export default useForm;
