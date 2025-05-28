import React from 'react';
import lock from '../assets/lock.png'

function InputField({ type, placeholder, onChange  }) {
  const isPassword = type === 'password';
  return (
    <div className={`flex ${isPassword ? 'justify-center items-center' : ''}  p-6 mt-7 w-full font-normal  md:font-medium whitespace-nowrap bg-gray-100 rounded-[34px] text-zinc-500 max-md:px-5`}>
      {isPassword ? (
        <div className="">
          <label htmlFor={`input-${placeholder.toLowerCase()}`} className="sr-only"><img loading="lazy" src={lock} alt="" className="object-contain shrink-0  aspect-[1.05] w-[22px]"/>{placeholder}</label>
        </div>
      ) : (
        <label htmlFor={`input-${placeholder.toLowerCase()}`} className="sr-only">{placeholder}</label>
      )}
      <input
        type={type}
        id={`input-${placeholder.toLowerCase()}`}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none placeholder:text-center"
        aria-label={placeholder}
        onChange={ onChange }
      />
    </div>
  );
}

export default InputField;