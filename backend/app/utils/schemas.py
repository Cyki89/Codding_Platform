from enum import IntEnum

class ValidatedEnum:
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if v == None:
            raise ValueError("This field is required")
        if not v in cls._value2member_map_:
            raise ValueError("Invalid Choice")
        return v


class IntValidatedEnum(ValidatedEnum, IntEnum):
    @classmethod
    def validate(cls, v): 
        try: 
            parsed_value = int(v)
        except ValueError:
            raise ValueError("Int type is required")
        return super().validate(parsed_value)


class Status(IntValidatedEnum):
    failed = 0
    passed = 1