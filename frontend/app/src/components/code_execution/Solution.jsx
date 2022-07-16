import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";

import { dracula } from "@uiw/codemirror-theme-dracula";

import CodeMirror from "@uiw/react-codemirror";

import { STATUS_MAPPING } from "../../constants/code";

const Solution = ({
  code,
  executionTime,
  submissionDate,
  status,
  extension,
}) => {
  return (
    <Card bg="dark" className="p-3 mx-2 my-3">
      <Stack direction="horizontal" className="mb-3 justify-content-between">
        <div>
          Status:{" "}
          <span className={`${STATUS_MAPPING[status]} ml-1`}>
            {STATUS_MAPPING[status].toUpperCase()}
          </span>
        </div>
        <div>
          Execution: <span className="fg-white ml-1">{executionTime}ms</span>
        </div>
        <div>
          <span className="fg-white ml-1">{submissionDate}</span>
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

export default Solution;
