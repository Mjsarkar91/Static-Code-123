import React from 'react';

function SignInButton({onClick}) {
  return (
    <button type="submit" className=" px-10 py-5 mt-7 md:px-16 md:py-5 md:mt-7  text-xl md:text-3xl text-white rounded-[34px] shadow-[-3px_-3px_13px_rgba(255,255,255,0.25)] max-md:px-5 bg-gradient-to-r from-[#0E797F] to-[#41BFAA]" onClick={onClick}>
      Sign in
    </button>
  );
}

export default SignInButton;