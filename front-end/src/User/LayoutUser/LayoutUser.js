import Header from "../Component/Header/Header";
import Home from "../Component/Home/Home";
import MonsterElectronic from "../Component/MonsterElectronic/MonsterElectronic";
import Watch from "../Component/Watch/Watch";
import Category from "../Component/Category/Category";
import Share from "../Component/Share/Share";
import Navbar from "../Component/Navbar/Navbar";
 
import SlideShow from "../Component/SlideShow/SlideShow";

const LayoutUser = () => {
    return ( <>
    <Header/>
    <Navbar/>
    {/* <Watch /> */}
    <Home/>
    <SlideShow/>

    <Category />
    {/* <MonsterElectronic /> */}
   
    </> );
}     
 
export default LayoutUser;