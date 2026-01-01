function Location(){
    return(
        <>
        <div className="text-center text-4xl py-8 text-emerald-950 font-playfair justify-center min-h-screen max-h-fit bg-gold-50">
            <div>Location</div>
            <div className="flex space-x-0 p-12">
                <p className="flex-1 text-gold-800 text-2xl w-48">
                    Set on a private 310-acre island along River Suir, 
                    this plush golf resort centred around a 16th-century castle is 5 km from the city centre.
                    Elegant rooms include flat-screen TVs, tea and coffeemaking equipment, and claw-foot baths. 
                    Suites add living rooms and river views. An old-world upgraded suite features a fireplace and a 4-poster bed. 
                    Room service is available 24/7.
                    Parking is complimentary. There's a sleek, oak-panelled restaurant, and an airy lounge bar that serves afternoon tea, 
                    as well as an 18-hole golf course with a putting green, and a playground. 
                    Activities such as falconry, picnics and clay pigeon shooting are offered for a fee.
                </p>
                <div className="flex-1 w-96 h-96 rounded-lg overflow-hidden shadow-lg">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2442.457706923557!2d-7.059294999999999!3d52.253232999999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4867f362d6f63505%3A0x136b39eb8d42dd65!2sWaterford%20Castle%20Hotel%2C%20Self-catering%20Lodges%20%26%20Golf%20Resort!5e0!3m2!1sen!2sus!4v1764879136632!5m2!1sen!2sus"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade">
                    </iframe>
                </div>
            </div>
        </div>

        </>
        
    );
}

export default Location