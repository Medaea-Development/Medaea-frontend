import { useNavigate } from "react-router-dom";
import BookingModal from "./components/BookingModal";

const BookingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-content">
      {/* Background content could be your calendar or a blurred dashboard */}
      <div style={{ filter: "blur(5px)" }}>{/* Dashboard Content */}</div>

      <BookingModal
        isOpen={true}
        onClose={() => navigate(-1)} // Takes user back to where they were
      />
    </div>
  );
};

export default BookingPage;
