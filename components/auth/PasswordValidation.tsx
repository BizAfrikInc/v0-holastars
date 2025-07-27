
interface PasswordValidationProps {
  password: string;
  validation: {
    minLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumbers: boolean;
    hasSpecialChar: boolean;
    isValid: boolean;
  };
}

const PasswordValidation = ({ password, validation }: PasswordValidationProps) => {
  if (!password) return null;

  return (
    <div className="text-xs space-y-1 mt-2">
      <div className={`flex items-center ${validation.minLength ? 'text-green-600' : 'text-red-500'}`}>
        <span className="mr-2">{validation.minLength ? '✓' : '✗'}</span>
        At least 8 characters
      </div>
      <div className={`flex items-center ${validation.hasUpperCase ? 'text-green-600' : 'text-red-500'}`}>
        <span className="mr-2">{validation.hasUpperCase ? '✓' : '✗'}</span>
        One uppercase letter
      </div>
      <div className={`flex items-center ${validation.hasLowerCase ? 'text-green-600' : 'text-red-500'}`}>
        <span className="mr-2">{validation.hasLowerCase ? '✓' : '✗'}</span>
        One lowercase letter
      </div>
      <div className={`flex items-center ${validation.hasNumbers ? 'text-green-600' : 'text-red-500'}`}>
        <span className="mr-2">{validation.hasNumbers ? '✓' : '✗'}</span>
        One number
      </div>
      <div className={`flex items-center ${validation.hasSpecialChar ? 'text-green-600' : 'text-red-500'}`}>
        <span className="mr-2">{validation.hasSpecialChar ? '✓' : '✗'}</span>
        One special character
      </div>
    </div>
  );
};

export default PasswordValidation;