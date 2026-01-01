import { useState } from "react";

function RSVP(){
        
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [party, setParty] = useState("");
    const [status, setStatus] = useState({state:"idle", msg:""});

    async function onSubmit(e) {
        e.preventDefualt();
        setStatus({state: "loading", msg: ""});

        if(!firstName.trim() || !lastName.trim()) {
            setStatus({state: "error", msg:"Please enter a valid first and last name."});
        }

        if(!/^\S+@\S+\.\S+$/) {
            setStatus({state: "error", msg:"Please enter a valid email."});
        }

        await fetch("/api/sheets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
            }),
        });

        setStatus({state: "success", msg:"RSVP submitted successfully!"});
    }
    





    return(
        <div className="text-center text-xl py-2 text-emerald-700 font-playfair min-h-screen max-h-fit bg-gold-50">

        <div className="text-6xl font-semibold p-4">RSVP</div>
        <div>We kindly ask that you respond by January 1, 2026.</div>

        {/* FORM CONTAINER */}
        <div className="flex flex-col text-left w-[320px] mx-auto mt-8 space-y-6">
            
            <div>
            <span className="font-semibold text-2xl">Name </span>
            <span className="text-emerald-600">(required)</span>
            </div>

            <label>First Name</label>
            <input type="text" className="bg-emerald-50 border-emerald-700 border-solid border-2 rounded-md"></input>

            <label>Last Name</label>
            <input type="text" className="bg-emerald-50 border-emerald-700 border-solid border-2 rounded-md"></input>

            <div>
            <span className="font-semibold text-2xl">Email </span>
            <span className="text-emerald-600">(required)</span>
            </div>
            <input type="text" className="bg-emerald-50 border-emerald-700 border-solid border-2 rounded-md"></input>

            <div>
            <span className="font-semibold text-2xl">RSVP</span>
            <div>
                <input type="radio" name="attending"></input>
                <label>Accepts with pleasure</label>
            </div>
            <div>
                <input type="radio" name="attending"></input>
                <label>Declines with regret</label>
            </div>

            <div className="text-center">
                <button className="bg-emerald-700 text-gold-500 text-3xl rounded-lg py-2 px-6">Submit</button>
            </div>
            
            </div>
        </div>

        </div>

    );
}

export default RSVP