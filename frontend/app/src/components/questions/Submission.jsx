import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";

import { dracula } from "@uiw/codemirror-theme-dracula";

import CodeMirror from "@uiw/react-codemirror";

const Submission = ({
  code,
  user,
  executionTime,
  submissionDate,
  extension,
}) => {
  return (
    <Card bg="dark" className="p-3 mx-2 my-3">
      <Stack direction="horizontal" className="mb-3 justify-content-between">
        <div>
          User: <span className="fg-white ml-1">{user}</span>
        </div>
        <div>
          Execution Time:{" "}
          <span className="fg-white ml-1">{executionTime}ms</span>
        </div>
        <div>
          Submited: <span className="fg-white ml-1">{submissionDate}</span>
        </div>
      </Stack>
      <CodeMirror
        readOnly={true}
        editable={false}
        value={code}
        maxHeight="250px"
        theme={dracula}
        extensions={[extension()]}
      />
    </Card>
  );
};

export default Submission;
