
function Navbar_Btn({label, onClick}){
    return(
        <li className="flex-1 text-center bg-maroon-oak hover:bg-[#612727] p-4">
            <button onClick={onClick} className="w-full bg-transparent">{label}</button>
        </li>
    );
}

function Navbar({onRsvpClick, onTimelineClick, onLocationClick, onTravelClick, onFAQClick}){
    return(
        <>
            <ul className='flex items-center justify-center bg-maroon-oak text-white text-xl font-playfair'>
                <Navbar_Btn onClick={onRsvpClick} label='RSVP'/>
                <Navbar_Btn onClick={onTimelineClick} label='Timeline'/>
                <Navbar_Btn onClick={onLocationClick} label='Location'/>
                <Navbar_Btn onClick={onTravelClick} label='Travel'/>
                <Navbar_Btn onClick={onFAQClick} label='FAQ'/>

            </ul>
        </>
    );
}

export default Navbar