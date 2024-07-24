import { InputHTMLAttributes, Ref, forwardRef } from "react";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, IProps>(({ error, helperText, ...rest }: IProps, ref: Ref<HTMLInputElement>) => {
  return (
    <div className="relative">
      <input
        ref={ref}
        className={`border-[1px] ${error ? 'border-red-500' : 'border-gray-300'} shadow-lg focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 rounded-lg px-2 py-3 text-md w-full bg-transparent`}
        {...rest}
      />
      {error && helperText && (
        <p className="text-red-500 text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
});

export default Input;
