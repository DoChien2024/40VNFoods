import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

function PasswordInput({ 
  value, 
  onChange, 
  onBlur, 
  hasError, 
  placeholder, 
  disabled 
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={hasError ? 'form-input-error pr-12' : 'form-input pr-12'}
        placeholder={placeholder}
        disabled={disabled}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
        disabled={disabled}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}

export default PasswordInput;
