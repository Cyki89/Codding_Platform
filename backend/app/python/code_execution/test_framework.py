import sys, subprocess, traceback
from timeit import default_timer as timer


TEST_STATUS_PASS = 1
TEST_STATUS_FAIL = -1
TEST_STATUS_INFO = 0


class TimeLimitException(Exception):
    ...


def get_user_tests_response(test_file, run_command='python'):
    response = {
        'tests': [],
        'tests_passed': 0,
        'tests_failed': 0,
        'passed': None,
        'error': None
    }

    with subprocess.Popen([run_command, test_file], stdout=subprocess.PIPE, stderr=subprocess.PIPE) as process:
        output = process.communicate()[0].decode("utf-8")
        error = process.communicate()[1].decode("utf-8")
    
    for line in output.strip('\n').split('\n'):
        status, msg = line.split(';')
        status = int(status)
        if status == TEST_STATUS_INFO:
            response['execution_time'] = round(float(msg) *1000)
            continue

        response['tests'].append({'status': status, 'msg': msg.strip()})
        response['tests_passed'] += int(status == TEST_STATUS_PASS)
        response['tests_failed'] += int(status == TEST_STATUS_FAIL)
    
    if error:
        response['error'] = error.strip()
    
    response['passed'] = not response['tests_failed'] and not response['error']
    
    return response


def assert_equals(func, params, expected, time_limit=None):
    start_time = timer()
    tested = func(*params) if params else func()
    if time_limit and timer() - start_time > time_limit:
        raise TimeLimitException('Exceeded time limit of {:.3f} seconds'.format(time_limit))
    if tested != expected:
        print(f'{TEST_STATUS_FAIL}; Test Fail - {tested} should equal {expected}')
        return
    print(f'{TEST_STATUS_PASS}; Test Pass')


def code_test():
    def wrapper(func):
        time = timer()
        try:
            func()
        except TimeLimitException as exc:
            print(f'{TEST_STATUS_FAIL}; Test Fail - {str(exc)}')
        except Exception:
            print(f'{TEST_STATUS_FAIL}; Test Fail - Unexpected Exception')
            sys.stderr.write(traceback.format_exc())
        finally:
            print('{:d};{:.2f}'.format(TEST_STATUS_INFO, (timer() - time) * 1000))
    return wrapper
