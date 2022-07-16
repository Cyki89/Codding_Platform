export const INITIAL_CODE = `def main:
pass`;

export const SAMPLE_TESTS = `from test_framework import assert_equals, code_test
from solution import main


@code_test()
def sample_tests():
assert_equals(main, None, 1, 1)
assert_equals(main, None, 1, 1)
assert_equals(main, None, 1, 1)
assert_equals(main, None, 1, 1)`;

export const SUBMISSION_TESTS = `from test_framework import assert_equals, code_test
from solution import main


@code_test()
def submission_tests():
assert_equals(main, None, 1, 1)
assert_equals(main, None, 1, 1)
assert_equals(main, None, 1, 1)
assert_equals(main, None, 1, 1)`;

export const LANGUAGE_OPTIONS = [
  { value: "", label: "Select Language" },
  { value: "Python", label: "Python" },
  { value: "JavaScript", label: "JavaScript" },
];

export const LEVEL_OPTIONS = [
  { value: 0, label: "Select Level" },
  { value: 1, label: "Easy" },
  { value: 2, label: "Medium" },
  { value: 3, label: "Hard" },
];

export const LEVEL_MAPPING = {
  1: "Easy",
  2: "Medium",
  3: "Hard",
};

export const QUESTION_ENDPOINT = "/questions";

export const PAGE_LIMIT = 10;
