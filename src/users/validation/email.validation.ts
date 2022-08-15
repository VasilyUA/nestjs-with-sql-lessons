import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class CustomEmailValidation implements ValidatorConstraintInterface {
  async validate(text: string, args: ValidationArguments): Promise<boolean> {
    const body: any = args.object;

    return body.email === text;
  }

  defaultMessage(args: ValidationArguments) {
    console.log(args); // eslint-disable-line no-console
    // here you can provide default error message if validation failed
    return 'Text ($value) is too short or too long!';
  }
}
