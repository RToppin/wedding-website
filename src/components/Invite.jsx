import invite_BG from '../assets/invite_BG.svg';

function Invite({className}){
    return(
        <>
    <div className={`${className} flex flex-col items-center text-center justify-center text-gold-500 text-6xl font-playfair bg-emerald-50`}>
                <img src={invite_BG}/>
            </div>
        </>
    );
}

export default Invite