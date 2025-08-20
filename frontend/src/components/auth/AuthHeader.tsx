interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <img 
            src="/img/favicon-32x32.png" 
            alt="H-task logo" 
            className="w-8 h-8"
          />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
        H-task
      </h1>
      
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {title}
      </h2>
      
      {subtitle && (
        <p className="text-gray-600 text-sm">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default AuthHeader;
