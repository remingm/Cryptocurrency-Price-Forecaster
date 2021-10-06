function Navigation() {

    return (
        <div className="flex-1 flex flex-col">
            <nav className="px-4 flex justify-between bg-white h-16 border-b-2">


                <ul className="flex items-center">
                    <li className="h-6 w-6">
                        <a href="/">
                            <img
                                className="h-full w-full rounded-full mx-auto"
                                src="/src/assets/logo.jpg"
                                alt="stonkpix logo" />
                        </a>
                    </li>

                    <li>
                        <a href="/">
                            <h1 className="pl-5 text-gray-700">StonkPix</h1>
                        </a>
                    </li>
                </ul>



                <ul className="flex items-center">
                    <li className="mr-4"><a href="/about">Why StonkPix?</a></li>
                    <li className="pr-6">
                        <a href="">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="feather feather-bell">
                                <path
                                    d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                        </a>

                    </li>


                </ul>

            </nav>
        </div >
    )
}

export default Navigation