import weddingIcon from '.././assets/wedding_icon.png';

function Navbar_Btn({label, onClick}){
    return(
        <li className="flex-1 text-center hover:bg-[#612727] p-4">
            <button onClick={onClick} className="w-full">{label}</button>
        </li>
    );
}

function Navbar_Icon(){
    return(
        <li className="flex-1 text-center">
            <img src={weddingIcon} className="mx-auto w-32 h-32" />
        </li>
    );
}


function Navbar({onRsvpClick, onTimelineClick, onLocationClick, onTravelClick}){
    return(
        <>
            <ul className='flex items-center justify-center bg-emerald-500 text-white text-xl font-playfair'>
                <Navbar_Btn onClick={onRsvpClick} label='RSVP'/>
                <Navbar_Btn onClick={onTimelineClick} label='Timeline'/>
                <div className='hidden sm:flex'>
                  <Navbar_Icon />  
                </div>
                
                <Navbar_Btn onClick={onLocationClick} label='Location'/>
                <Navbar_Btn onClick={onTravelClick} label='Travel'/>
            </ul>
        </>
    );
}

export default Navbar