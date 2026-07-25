import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsOptionalDateString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isOptionalDateString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          // Allow undefined, null, or empty string
          if (value === undefined || value === null || value === '') {
            return true;
          }
          // Otherwise, validate as ISO 8601 date string
          const iso8601Regex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?)?$/;
          return iso8601Regex.test(value) && !isNaN(Date.parse(value));
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid ISO 8601 date string or empty`;
        },
      },
    });
  };
}
