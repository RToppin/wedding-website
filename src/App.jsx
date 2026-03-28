import './index.css'
import Navbar from './components/Navbar'
import Invite from './components/Invite'
import Location from './pages/Location'
import RSVP from './pages/RSVP'
import Timeline from './pages/Timeline'
import Travel from './pages/Travel'
import FAQ from './pages/FAQ'
import { useRef } from 'react'
import Countdown from './pages/Countdown'



function App() {
  const inviteRef = useRef(null);
  const rsvpRef = useRef(null);
  const timelineRef = useRef(null);
  const locationRef = useRef(null);
  const travelRef = useRef(null);
  const faqRef = useRef(null);

  const scrollToInvite = () => {
    inviteRef.current?.scrollIntoView({ behavior: "smooth"});
  };

  const scrollToRsvp = () => {
    rsvpRef.current?.scrollIntoView({ behavior: "smooth"});
  };

  const scrollToTimeline = () => {
    timelineRef.current?.scrollIntoView({ behavior: "smooth"});
  };

  const scrollToLocation = () => {
    locationRef.current?.scrollIntoView({ behavior: "smooth"});
  };

  const scrollToTravel = () => {
    travelRef.current?.scrollIntoView({ behavior: "smooth"});
  };

  const scrollToFAQ = () => {
    faqRef.current?.scrollIntoView({ behavior: "smooth"});
  };

  return (
    <>
      <div className='min-h-screen max-h-fit flex flex-col'>
        <Navbar
          onInviteClick={scrollToInvite}
          onRsvpClick={scrollToRsvp}
          onTimelineClick={scrollToTimeline}
          onLocationClick={scrollToLocation}
          onTravelClick={scrollToTravel}
          onFAQClick={scrollToFAQ}
        />
        <div ref={inviteRef}><Invite  className="flex-1" /></div>
      </div>
      <Countdown />
      <div ref={rsvpRef}><RSVP /></div>
      <div ref={timelineRef}><Timeline /></div>
      <div ref={locationRef}><Location /></div>
      <div ref={travelRef}><Travel /></div>  
      <div ref={faqRef}><FAQ /></div>  
    </>
  );
}

export default App
