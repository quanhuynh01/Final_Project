import Header from "../Component/Header/Header";
import Home from "../Component/Home/Home";
import MonsterElectronic from "../Component/MonsterElectronic/MonsterElectronic";
import Watch from "../Component/Watch/Watch";
import Category from "../Component/Category/Category";
 
import SlideShow from "../Component/SlideShow/SlideShow";

const LayoutUser = () => {
    return ( <>
    <Header/>
    {/* <Watch /> */}
    <Home/> 
    <SlideShow/>

    <Category />
  
    {/* <MonsterElectronic /> */}
    {/* <Navbar/>
     */}
    </> );
}     
 
export default LayoutUser;