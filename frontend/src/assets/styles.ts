//#231136 

export const WelcomPageCSS = `
  flex flex-col justify-center items-center
  px-16
  text-lx
  gap-5
  mx-auto
`;

export const ButtonClick = `
  flex items-center justify-center
  bg-transparent
  border-1 border-[#B39BE3]
  text-[#B39BE3]
  font-medium
  py-2
  px-8
  rounded-xl
  transition-all
  duration-300
  cursor-pointer
  shadow-sm
  hover:bg-[#482A69]
  hover:text-white
  hover:border-white
  hover:shadow-md
  hover:scale-[1.03]
`;

export const RegisterLoginPageCSS = `
  flex flex-col items-center justify-center 
  min-h-screen bg-gray-50 p-8  text-[#482A69]
  text-[Sofia-Sans] font-semibold
`;

export const FormCSS = `
  rounded-xl
  shadow-xl
  border-t-5
  border-[#482A69]
  w-xl
  px-25
  py-12
  flex flex-col justify-center
`

export const Field = `
border-b-2 border-[#482A69]/50 focus:border-[#482A69]
outline-none 
py-3 w-full text-md
placeholder:text-[#482A69]/70
focus:placeholder:text-[#482A69]
`


export const ButtonRegisterTelegramm = `
  flex items-center justify-center
  bg-transparent
  border-2 border-[#482A69]/30
  text-[#482A69]/40
  rounded-full
  px-10
  pt-1.5
  pb-2
  transition-all
  duration-300
  cursor-pointer
  hover:bg-[#482A69]
  hover:text-white
`;

export const ButtonRegisterSubmit = `
  bg-[#482A69] hover:shadow-xl text-white
  text-base font-semibold mt-5
  pt-2.5
  pb-3
  px-4 
  rounded-full 
  transition duration-300 cursor-pointer `

export const ButtonDisabled = `
  bg-[#482A69]/30 text-white
  text-base font-semibold mt-5
  pt-2.5
  pb-3
  px-4 
  rounded-full 
  opacity-50 `