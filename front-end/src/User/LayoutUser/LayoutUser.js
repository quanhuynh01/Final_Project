import Footer from "../Component/Footer/Footer";
import Header from "../Component/Header/Header";
import Home from "../Component/Home/Home";
import Navbar from "../Component/Navbar/Navbar"; 

const LayoutUser = () => {
    return ( <div style={{position:"relative"}}>
    <Header/>
    <Navbar/>
    <Home/>  
     <Footer/>
    </div> );
}     
 
export default LayoutUser;