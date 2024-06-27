import Footer from "../Component/Footer/Footer";
import Header from "../Component/Header/Header";
import Home from "../Component/Home/Home";
import Navbar from "../Component/Navbar/Navbar"; 
import SlideShow from "../Component/SlideShow/SlideShow"; 
const LayoutUser = () => {
    return ( <div style={{position:"relative"}}>
    <Header/>
    <Navbar/>
    <Home/> 

    {/* <SlideShow/>
   */}
    {/*
     */}
     <Footer/>
    </div> );
}     
 
export default LayoutUser;