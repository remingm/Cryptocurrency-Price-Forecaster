import { useState } from "react";

function Navigation() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  return (
    <header className="fixed w-full top-0 z-10  bg-white">
      <nav className=" flex items-stretch mx-auto px-5 relative z-20 justify-between bg-white h-14 border-b border-gray-100 max-w-6xl">
        <div className="flex-shrink-0 flex items-center cursor-pointer">
          <a className="inline-flex">
            <div className="text-blue-700 font-semibold hover:text-indigo-800">
              S t o n k P i x
            </div>
          </a>
        </div>
        <div className="hidden">
          {/* <div className="hidden sm:flex sm:space-x-8"> */}
          {/* Desktop Menu Buttons, hidden for MVP */}
          <a
            href="#"
            className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          >
            Dashboard
          </a>
          <a
            href="#"
            className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          >
            Team
          </a>
          <a
            href="#"
            className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          >
            Projects
          </a>
        </div>

        <div className="hidden">
          {/* Sign up Button, hidden for mvp */}
          {/* <div className="flex-1 justify-end flex items-center"> */}
          <span className="inline-flex">
            <button className="btn-indigo">
              <div className="flex items-center justify-center w-full">
                Sign Up
              </div>
            </button>
          </span>
        </div>
        <MenuHamburgerButton
          setMenuOpen={setMenuOpen}
          isMenuOpen={isMenuOpen}
        ></MenuHamburgerButton>
      </nav>
      <MobileDropdownMenu isMenuOpen={isMenuOpen}></MobileDropdownMenu>
    </header>
  );
}

function MobileDropdownMenu(props: any) {
  const clsd = !props.isMenuOpen ? "-translate-y-full" : "";
  return (
    <div
      className={
        "bg-white w-full h-screen absolute transition transform z-0 flex-col " +
        clsd
      }
    >
      <a className="px-6 py-5 flex hover:bg-gray-100 active:bg-indigo-100 rounded-md cursor-pointer">
        <p className="text-base font-semibold text-gray-900 flex-1">Pricing</p>
      </a>
      <a className="px-6 py-5 flex hover:bg-gray-100 active:bg-indigo-100 rounded-md cursor-pointer mt-1">
        <p className="text-base font-semibold text-gray-900 flex-1">Coins</p>
      </a>
      <a className="px-6 py-5 flex hover:bg-gray-100 active:bg-indigo-100 rounded-md cursor-pointer mt-1">
        <p className="text-base font-semibold text-gray-900 flex-1">
          Developers
        </p>
      </a>
      <div className="flex-1 flex py-5 px-6  flex-col ">
        <a className="btn-indigo text-center text-base w-full mt-1 ">Sign Up</a>
        <a className="btn text-indigo-700 text-center text-base w-full mt-2">
          Sign In
        </a>
      </div>
    </div>
  );
}

interface MenuHamburgerButtonProps {
  setMenuOpen: (a: boolean) => void;
  isMenuOpen: boolean;
}
function MenuHamburgerButton({
  setMenuOpen,
  isMenuOpen,
}: MenuHamburgerButtonProps) {
  return (
    <div className="hidden">
      {/* mobile menu button, hidden for MVP
    <div
      className="lg:hidden p-2.5 my-2 ml-5 -mr-2.5"
      onClick={() => setMenuOpen(!isMenuOpen)}
      > */}
      <div className="w-4 h-4 relative">
        <div
          className={
            "bg-gray-900 w-full block rounded-md absolute h-0.5 top-2 transition transform-gpu duration-300 ease-in-out" +
            "before:block before:absolute before:rounded-md before:h-0.5 before:bg-gray-900 before:w-full before:-translate-y-2 " +
            "after:block after:absolute after:rounded-md after:h-0.5 after:bg-gray-900 after:w-full after:translate-y-2 " +
            (isMenuOpen &&
              "rotate-45 before:translate-y-0 after:translate-y-0 after:-rotate-90 bg-transparent")
          }
        ></div>
      </div>
    </div>
  );
}

export default Navigation;
