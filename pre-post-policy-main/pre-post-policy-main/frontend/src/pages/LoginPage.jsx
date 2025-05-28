import React, { useState } from 'react'
import InputField from '../component/InputField'
import SignInButton from '../component/SignInButton'
import logInPage from '../assets/log in page.png'
import logo from '../assets/logo.png'
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate=useNavigate();

  // Update state based on e.target.value
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const res = await fetch('http://localhost:8080/auth/data',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({username,password}),
        }
      );
      const data = await res.json();
      if(data.status==="client"){
        return navigate("/client")
      }else if(data.status==="support"){
        navigate('/support')
      }
    }catch(error){
      console.log("error")
    }
  };
  return (
    <main className="flex overflow-hidden flex-col justify-center items-center px-20 py-32 text-xl  max-md:px-5 max-md:py-24 bg-gradient-to-r from-[#0CA98F] to-[#5DB6BD] h-screen w-screen ">
    <section className="flex relative flex-col items-end px-16  w-full max-w-[1221px]  rounded-[32px]  max-md:px-5 max-md:max-w-full object-cover ">
      <img loading="lazy" src={logInPage } alt="" className="object-cover absolute inset-0 size-full " />
      <header className=" relative top-2 right-30 md:top-2 md:right-14 items-start text-sm md:text-lg md:font-medium text-white">
       <h2>Close To Your Home Close To Your Heart</h2>
      </header>
      <form className="flex relative flex-col px-20 pt-22 pb-20 mt-2 mb-2 max-w-full text-lg font-bold border-2 border-fuchsia-100 border-solid bg-white bg-opacity-40 rounded-[32px] shadow-[3px_6px_14px_rgba(0,0,0,0.25)] w-[400px]   lg:w-[488px]   max-md:px-5">
        <img loading="lazy" src={logo} alt="Company Logo" className="object-contain self-center max-w-full aspect-[0.92] w-[50px] md:w-[100px] "/>
        <h1 className="mt-5 text-center  md:ml-4 text-2xl md:text-4xl text-teal-700 max-md:mr-2 max-md:ml-2.5">
          Welcomes you!
        </h1>
        <InputField type="text" placeholder="Username" onChange={handleUsernameChange} />
        <InputField type="password" placeholder="Password" onChange={handlePasswordChange}/>
        <SignInButton onClick={handleSubmit}/>
      </form>
      <footer className="relative  md:mt-2.5 mr-16 right-20 bottom-3 text-white max-md:mr-2.5  text-sm md:text-lg ">
      copyright@checkmed
      </footer>
    </section>
  </main>
  )
}

export default LoginPage
