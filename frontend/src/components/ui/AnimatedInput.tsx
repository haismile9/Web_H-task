interface AnimatedInputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string[];
  icon?: string;
}

const AnimatedInput = ({ type, placeholder, value, onChange, error, icon }: AnimatedInputProps) => {
  return (
    <div className="form-control mb-4">
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-lg">{icon}</span>
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={`input input-bordered w-full bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 transition-all duration-200 ${
            icon ? 'pl-12' : ''
          } ${
            error 
              ? 'input-error border-red-500 focus:border-red-600' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white'
          }`}
          value={value}
          onChange={onChange}
        />
      </div>
      {error && (
        <div className="text-red-500 text-sm mt-1 animate-fade-in-up">
          {error.map((errorMsg, index) => (
            <div key={index} className="flex items-center gap-1">
              <span className="text-red-500">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnimatedInput;
