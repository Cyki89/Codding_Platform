class Text(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate


    @classmethod
    def validate(cls, v):
        if not isinstance(v, str):
            raise ValueError("Invalid data type")
        if len(v) <= 0:
            raise ValueError("This field is required")

        return v
