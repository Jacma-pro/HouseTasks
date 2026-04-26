import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          className={[
            'h-11 w-full rounded-xl border bg-white px-4 text-base sm:text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-150',
            'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
            error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200',
            icon ? 'pl-10' : '',
            className,
          ].join(' ')}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';
export default Input;
