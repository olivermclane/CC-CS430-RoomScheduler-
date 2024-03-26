import {LogOut, ChevronLast, ChevronFirst} from "lucide-react"
import {useContext, createContext, useState} from "react"
import axios from "axios";

/**
 * https://gist.github.com/nimone/9204ed6e9d725c0eef003011c9113698#file-sidebar-jsx
 * https://lucide.dev/icons/file-up
 * https://www.carroll.edu/about/offices-services/marketing-communications/carroll-style-guide
 * https://tailwindcss.com/docs/customizing-colors
 */
const SidebarContext = createContext()

export default function Sidebar({children}) {
    const email = localStorage.getItem('email');
    const username = localStorage.getItem('username');
    const [expanded, setExpanded] = useState(false)
    const baseurl = "https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true";
    const fieldParam = `&name=${username}`;
    const profileURL = baseurl + fieldParam;

    function handleLogout(onSuccess) {
        axios.post('http://localhost:8000/logout/')
            .then(() => {
                if (onSuccess) {
                    onSuccess(); // Call the success callback if provided
                } else {
                    window.location.href = '/login'; // Redirect to login (if not using callback)
                }
            })
            .catch(error => {
                console.error('Logout failed:', error);
                // Handle errors
            });
    }

    return (
        <div className="flex ">
            <aside className="h-screen transition-all top-0" style={{zIndex: 9999}}>
                <nav className="h-full flex flex-col bg-white border-r shadow-sm fixed">
                    <div className="p-4 pb-2 flex justify-between items-center">
                        <img
                            src="/icons/cc_logo_horiz.jpg"
                            className={`overflow-hidden transition-all ${
                                expanded ? "w-32" : "w-0"
                            }`}
                            alt=""
                        />
                        <button
                            onClick={() => setExpanded((curr) => !curr)}
                            className="p-1.5 rounded-lg bg-gray-50 hover:bg-violet-300"
                        >
                            {expanded ? <ChevronFirst/> : <ChevronLast/>}
                        </button>
                    </div>

                    <SidebarContext.Provider value={{expanded}}>
                        <ul className="flex-1 px-3">{children}</ul>
                    </SidebarContext.Provider>


                    <div className="border-t flex p-3">
                        <img

                            src={profileURL}
                            alt=""
                            className="w-10 h-10 rounded-md"
                        />
                        <div
                            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
                        >
                            <div className="leading-4">
                                <h4 className="font-semibold">{username}</h4>
                                <span className="text-xs text-gray-600">{email}</span>
                            </div>
                            <button className="p-1.5 rounded-lg bg-gray-50 hover:bg-violet-300" onClick={() => {
                                handleLogout()
                            }}
                            >
                                <LogOut size={20}/>
                            </button>
                        </div>
                    </div>
                </nav>
            </aside>
            <div className="p-10 bg-black">

            </div>
        </div>
    )
}

export function SidebarItem({icon, text, active, alert, onClick}) {
    const {expanded} = useContext(SidebarContext);

    return (
        <li
            className={`
                relative flex items-center py-2 px-3 my-1
                font-medium rounded-md cursor-pointer
                transition-colors group
                ${
                active
                    ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
                    : "hover:bg-violet-300 text-gray-600"
            }
            `}
            onClick={onClick} // Pass onClick handler
        >
            {icon}
            <span
                className={`overflow-hidden transition-all ${
                    expanded ? "w-52 ml-3" : "w-0"
                }`}
            >
                {text}
            </span>
            {alert && (
                <div
                    className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
                        expanded ? "" : "top-2"
                    }`}
                />
            )}

            {!expanded && (
                <div
                    className={`
                        absolute left-full rounded-md px-2 py-1 ml-6
                        bg-indigo-100 text-indigo-800 text-sm
                        invisible opacity-20 -translate-x-3 transition-all
                        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                    `}
                >
                    {text}
                </div>
            )}
        </li>
    );
}
