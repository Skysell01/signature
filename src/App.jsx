import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import "./App.css";
import OrderConfirmation from "./pages/OrderConfirmation";
import Record from "./pages/Record";
import LoveSection from "./pages/LoveSection";
import NewLove from "./pages/NewLove";
import LoveCart from "./pages/LoveCart";
import LoveRecord from "./pages/LoveRecord";
import LoveOrderConfirmation from "./pages/LoveOrderConfirmation";
import Signature from "./pages/Signature";
import SignatureCart from "./pages/SignatureCart";
import SignatureRecord from "./pages/SignatureRecord";
import SignatureOrderConfirmation from "./pages/SignatureOrderConfirmation";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import About from "./pages/About";

import SignatureAbondentReport from "./pages/AbondedentReport";

import SignatureRag from "./pages/SignatureRag";
import SignatureCartRag from "./pages/SignatureCartRag";
// import SignatureRecordRag from "./pages/SignatureRecordRag";
import V2 from "./pages/V2";
import SignatureOrderConfirmationRag from "./pages/SignatureOrderConfirmationRag";
// import SignatureAbondentReportRag from "./pages/AbondedentResportRag";
import SignatureNewRedesigned from "./components/signature-new/SignatureNew";
import SignatureNewRedesignedV2 from "./components/signature-new-v2/SignatureNew";
import SignatureNewCart from "./components/signature-new-cart/SignatureNewCart";
import SignatureNew from "./pages/new/SignatureNew";
import NewCart from "./pages/new/NewCart";
import SignatureCartCashFree from "./pages/SignatureCartCashFree";
import SignatureOrderConfirmationCashfree from "./pages/SignatureOrderConfirmationCashFree";
import SignatureNewAbondentReport from "./pages/new/SignatureNewAbondentReport";
import SignatureTryAbondentReport from "./components/signature-try/SignTryAbd";

import SignatureNewAbondentReportv2 from "./pages/new/Sigv2";
import SignatureNewRecord from "./pages/new/SignatureNewRecord";
import SignatureTryRecord from "./components/signature-try/SignatureTryRecord";
import SignatureNewOrderConfirmationPage from "./pages/new/SignatureNewOrderConfirmationPage";
import SignatureNewCartCashFree from "./components/signature-new-cart/SignatureNewCartCashFree";
import SignatureTryCartCashFree from "./components/signature-try-cart/SignatureTryCartCashFree";
import SignatureNewCartCashFreeV2 from "./components/signature-new-cart-v2/SignatureNewCartCashFree";
import SignatureNewOrderConfirmationCashfree from "./pages/new/SignatureNewOrderConfirmationCashfree";
import SignatureTryOrderConfirmationCashfree from "./components/signature-try/SignatureTryOrderConfirmationCashfree";
import Signature4 from "./pages/Signature4";
import SignatureStudioLanding from "./signature4/SignatureStudioLanding";
import SignatureCartFour from "./pages/Signaturefour";
import OrderConfirmation5 from "./pages/OrderConfirmation5";
import AbondentRecord5 from "./pages/AbondentRecord5";
import Record5 from "./pages/Record5";
import SignatureTry from "./components/signature-try/SIgnatureTry";
import SignaturePremium from "./pages/SignaturePremium";
import SignatureIntelligence from "./pages/SignatureIntelligence";
import SignatureModern from "./pages/SignatureModern";
import SignatureStudio from "./pages/SignatureStudio";
import SigguLander from "./pages/SigguLander";
import LogsPage from "./pages/log";



function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* <Route path="/" element={<SignatureRag />} /> */}
    <Route path="/signature4" element={<SignatureStudioLanding />} />
      <Route path="/signature-cart-four" element={<SignatureCartFour />} />
      <Route path="/order-confirmation-five" element={<OrderConfirmation5 />} />
      <Route path="/signature4-abondent-record" element={<AbondentRecord5 />} />
      <Route path="/signature4-record" element={<Record5 />} />
          {/* <Route path="/signature4" element={<Signature4 />} />
          
          */}
          <Route path="/rag" element={<SignatureRag />} />
          <Route path="/new" element={<SignatureNew />} />
          <Route path="/new-cart" element={<NewCart />} />

          <Route path="/signature-cart-rag" element={<SignatureCartRag />} />
          <Route path="/v2" element={<V2 />} />
          {/* <Route
            path="/signature-record/rag"
            element={<SignatureRecordRag />}
          /> */}
          <Route
            path="/signature-order-confirmation/rag"
            element={<SignatureOrderConfirmationRag />}
          />
          {/* <Route
            path="/abondent-report/rag"
            element={<SignatureAbondentReportRag />}
          /> */}

          <Route path="/" element={<Signature />} />
          <Route path="/signature" element={<Signature />} />
          <Route path="/signature-premium" element={<SignaturePremium />} />
          <Route path="/signature-intelligence" element={<SignatureIntelligence />} />
          <Route path="/signature-modern" element={<SignatureModern />} />
          <Route path="/signature-studio" element={<SignatureStudio />} />
          <Route path="/siggu" element={<SigguLander />} />
          <Route path="/signature-new" element={<SignatureNewRedesigned />} />
          <Route path="/signature-try" element={<SignatureTry />} />
            <Route path="/signature-new-v2" element={<SignatureNewRedesignedV2/>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />

          {/* Old routes */}
          {/* <Route path="/signature-cart" element={<SignatureCart />} /> */}
          <Route path="/signature-cart" element={<SignatureCartCashFree />} />
          {/* New Routes */}
          <Route path="/signature-cart-cashfree" element={<SignatureCartCashFree />} />

          {/* <Route path="/signature-new-cart" element={<SignatureNewCart />} /> */}
          <Route path="/signature-new-cart" element={<SignatureNewCartCashFree />} />
            <Route path="/signature-try-cart" element={<SignatureTryCartCashFree />} />
              <Route path="/signature-new-cart-v2" element={<SignatureNewCartCashFreeV2 />} />
 
          <Route path="/signature-record" element={<SignatureRecord />} />
          <Route
            path="/signature-new-record"
            element={<SignatureNewRecord />}
          />

            <Route
            path="/signature-try-record"
            element={<SignatureTryRecord />}
          />
             <Route
            path="/signature-new-recordv2"
            element={<SignatureNewRecord />}
          />

          {/* Old Route */}
          {/* <Route
            path="/signature-order-confirmation"
            element={<SignatureOrderConfirmation />}
          /> */}
          <Route
            path="/signature-order-confirmation"
            element={<SignatureOrderConfirmationCashfree />}
          />

            {/* New Route */}
            <Route
              path="/signature-order-confirmation-cashfree"
              element={<SignatureOrderConfirmationCashfree />}
            />
          
          {/* <Route
            path="/signature-new-order-confirmation"
            element={<SignatureNewOrderConfirmationPage />}
          /> */}
          <Route
            path="/signature-new-order-confirmation"
            element={<SignatureNewOrderConfirmationCashfree />}
          />
              <Route
            path="/signature-try-order-confirmation"
            element={<SignatureTryOrderConfirmationCashfree />}
          />
              <Route
            path="/signature-new-order-confirmationV2"
            element={<SignatureNewOrderConfirmationCashfree />}
          />
          <Route path="/privacy" element={<Privacy />} />

          <Route
            path="/abondent-report"
            element={<SignatureAbondentReport />}
          />
          <Route
            path="/signature-new-abondent-report"
            element={<SignatureNewAbondentReport />}
          />
              <Route
            path="/signature-try-abondent-report"
            element={<SignatureTryAbondentReport />}
          />
           <Route
            path="/signature-new-abondent-reportv2"
            element={<SignatureNewAbondentReportv2 />}
          />
          <Route path="/logs" element={<LogsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
