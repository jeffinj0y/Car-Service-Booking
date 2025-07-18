import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './Comonents/Users/RegisterLogin/Register';
import Login from './Comonents/Users/RegisterLogin/login';
import Adminin from './Comonents/Admin/Login/adminLogin';
import AdminHome from './Comonents/Admin/Home/adminHome';
import Home from './Comonents/Users/Home/Home';
import ServiceCenterRegistration from './Comonents/ServiceCenter/Register/registercenter';
import ServiceCenterLogin from './Comonents/ServiceCenter/Login/LoginCenter';
import ServiceCenterSelection from './Comonents/Users/Booking/SelectServiceCentre';
import BookingService from './Comonents/Users/Booking/serviceBooking';
import ServiceCenterHome from './Comonents/ServiceCenter/Home/CentreHome';
import BookingHistory from './Comonents/Users/others/BookingHistory';
import BookingDetails from './Comonents/Users/others/BookHistorySingleView';
import ForgotPassword from './Comonents/Users/RegisterLogin/forgotpass';
import ResetPassword from './Comonents/Users/RegisterLogin/ResetPass';

function App() {
  return (
    
  <BrowserRouter>
<Routes>
  {/* admin pages */}
<Route path='/adin' element={<Adminin/>}/>
<Route path='/adminhome' element={<AdminHome/>}/>

{/* user pages */}
<Route path='/up' element={<Register/>}/>
<Route path='/in' element={<Login/>}/>
<Route path='/' element={<Home/>}/>
<Route path='/selectcenter' element={<ServiceCenterSelection/>}/>
<Route path='/bookings' element={<BookingService/>}/>
<Route path='/bookinghistory' element={<BookingHistory/>}/>
<Route path="/bookings/:bookingId" element={<BookingDetails />} />
<Route path='/forgotpass' element={<ForgotPassword/>}/>
<Route path='/resetpassword/:id/:token' element={<ResetPassword/>}/>

{/* ServiceCenter pages */}
<Route path='/regserviceCentre' element={<ServiceCenterRegistration/>}/>
<Route path='/loginserviceCentre' element={<ServiceCenterLogin/>}/>
<Route path='/serviceCentreHome' element={<ServiceCenterHome/>}/>


</Routes>
  </BrowserRouter>
  );
}

export default App;
